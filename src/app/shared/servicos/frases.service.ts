import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { FraseNaoExec } from "src/app/shared/modelos/frase";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class FrasesService {
  private frasesUrl = environment.api_webservice + "frasesExecApp";
  //private frasesUrl = environment.api_webservice + "frases";
  private frasesNaoExecUrl = environment.api_webservice + "frasesNaoExecApp";
  //private frasesNaoExecUrl = environment.api_webservice + "/frasesnaoexecutado";

  constructor(private http: HttpClient, private db: Database) { }

  async getFrasesRec() {
    let frases = await this.db.getAll("frase");

    if (frases.length <= 0) {
      try {
        frases = await this.getFrase("local");
        if (frases.length < 1) frases = await this.getFrase("online");
        await frases.forEach(frase => {
          this.db.insert("frase", "id, recomendacao", [
            frase.id,
            frase.recomendacao
          ]);
        });
      } catch (e) {
        console.log(e);
      }
    }
    return frases;
  }

  async getFrasesNaoExecutado() {
    let frases = await this.db.getAll("fraseNaoExec");

    if (frases.length <= 0) {
      try {
        frases = await this.getFraseNaoExec("local");
        if (frases.length < 1) await this.getFraseNaoExec("online");
        await frases.forEach(frase => {
          this.db.insert("fraseNaoExec", "id, frase, culpa", [
            frase.id,
            frase.frase,
            1
          ]);
        });
      } catch (e) {
        console.log(e);
      }
    }
    return frases;
  }

  async limparFrases() {
    await this.db.deleteAll("frase");
    await this.db.deleteAll("frasesNaoExec");
  }

  async getFrase(local) {
    let frase = [];
    switch (local) {
      case "local":
        try {
          frase = await this.http.get<any>("../assets/frases.json").toPromise();
        } catch (e) {
          frase = [];
        }

        break;
      case "online":
        try {
          const api = await this.db.createQuery(
            "SELECT api_franquia FROM first_entry WHERE id = 1"
          );
          this.frasesUrl = api[0].api_franquia + "frasesExecApp";
          console.log("API FRASES EXEC: " + this.frasesUrl)
          frase = await this.http.get<any>(this.frasesUrl).toPromise();
        } catch (e) {
          console.log(e);
          frase = [];
        }

        break;
      default:
        frase = [];
        break;
    }
    return frase;
  }

  async getFraseNaoExec(local) {
    let frase = [];
    switch (local) {
      case "local":
        try {
          frase = await this.http
            .get<any>("../assets/frasesnaoexecutado.json")
            .toPromise();
        } catch (e) {
          frase = [];
        }

        break;
      case "online":
        try {
          const api = await this.db.createQuery(
            "SELECT api_franquia FROM first_entry WHERE id = 1"
          );
          this.frasesNaoExecUrl = api[0].api_franquia + "frasesNaoExecApp";
          console.log("API FRASES NAO EXEC: " + this.frasesNaoExecUrl)
          frase = await this.http
            .get<FraseNaoExec[]>(this.frasesNaoExecUrl)
            .toPromise();
        } catch (e) {
          frase = [];
        }

        break;
      default:
        frase = [];
        break;
    }
    return frase;
  }

  async updateData() {
    let frases = await this.getFrase("online");

    if (frases !== null && frases !== undefined) {
      if (frases.length > 0) {
        await this.db.deleteAll("frase").then(() => {
          frases.forEach(frase => {
            this.db.insert("frase", "id, recomendacao", [
              frase.id,
              frase.recomendacao
            ]);
          });
        });
      }
    }

    frases = await this.getFraseNaoExec("online");

    if (frases !== null && frases !== undefined) {
      if (frases.length > 0) {
        await this.db.deleteAll("fraseNaoExec").then(() => {
          frases.forEach(frase => {
            this.db.insert("fraseNaoExec", "id, frase, culpa", [
              frase.id,
              frase.frase,
              1
            ]);
          });
        });
      }
    }
  }
}
