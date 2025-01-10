import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Praga } from "src/app/shared/modelos/os";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class PragasService {
  //private pragasUrl = environment.api_webservice + "pragas";
  private pragasUrl = environment.api_webservice + "pragasApp";

  constructor(private http: HttpClient, private db: Database) { }

  // lista de pragas
  async getPragas() {
    let pragas = await this.db.getAll("praga");

    if (pragas.length <= 0) {
      try {
        pragas = await this.getPragasData("local");
        if (pragas.length < 1) pragas = await this.getPragasData("online");
        await pragas.forEach(praga => {
          this.db.insert("praga", "id, nome", [praga.id, praga.nome]);
        });
      } catch (e) {
        console.log(e);
      }
    }
    return pragas;
  }

  // praga por id
  getPraga(id: number): Observable<Praga> {
    const url = `${this.pragasUrl}/${id}`;
    return this.http.get<any>(url);
  }

  limparPragas() {
    this.db.deleteAll("praga");
  }

  async getPragaByOsAndArea(os, area) {
    const json = [];
    const pragas = await this.db.createQuery(
      "SELECT * FROM pragaOs WHERE os = " +
      os +
      " AND idArea = " +
      area +
      " GROUP BY pragaOs.id_praga"
    );
    await pragas.forEach(praga => {
      json.push({
        id: praga.id_praga,
        ninfestacao: praga.nivel
      });
    });
    return await json;
  }

  async getPragasData(local) {
    let pragas = [];
    switch (local) {
      case "local":
        try {
          pragas = await this.http
            .get<any>("../assets/pragas.json")
            .toPromise();
        } catch (e) {
          pragas = [];
        }

        break;
      case "online":
        try {
          const api = await this.db.createQuery(
            "SELECT api_franquia FROM first_entry WHERE id = 1"
          );
          this.pragasUrl = api[0].api_franquia + "pragasApp";
          console.log("API PRAGAS: " + this.pragasUrl)
          pragas = await this.http.get<any>(this.pragasUrl).toPromise();
        } catch (e) {
          pragas = [];
        }

        break;
      default:
        pragas = [];
        break;
    }
    return pragas;
  }

  async updateData() {
    let pragas = [];
    try {
      pragas = await this.getPragasData("online");
    } catch (e) {
      console.log(e);
    }
    if (pragas !== null && pragas !== undefined) {
      if (pragas.length > 0) {
        await this.db.deleteAll("praga").then(() => {
          pragas.forEach(praga => {
            this.db.insert("praga", "id, nome", [praga.id, praga.nome]);
          });
        });
      }
    }
  }
}
