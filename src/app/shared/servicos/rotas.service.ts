import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class RotasService {
  private rotasUrl = environment.api_webservice + "rotasApp";

  constructor(private http: HttpClient, private db: Database) { }

  // lista de rotas
  async getRotas() {
    let rotas = await this.db.getAll("rotas");
    if (rotas.length <= 0) {
      try {
        rotas = await this.getRotasData("online");
        await rotas.forEach(rota => {
          this.db.insert("rotas", "id, nome, levantamento", [rota.id, rota.nome, rota.levantamento]);
        });
      } catch (e) {
        console.log(e);
      }
    }
    return rotas;
  }

  async getRotasData(local) {
    let rotas = [];
    try {
      const api = await this.db.createQuery(
        "SELECT api_franquia FROM first_entry WHERE id = 1"
      );
      this.rotasUrl = api[0].api_franquia + "rotasApp";
      console.log("API ROTAS: " + this.rotasUrl)
      rotas = await this.http.get<any>(this.rotasUrl).toPromise();
    } catch (e) {
      rotas = [];
    }
    return rotas;
  }

  async updateData() {
    let rotas = [];
    try {
      rotas = await this.getRotasData("online");
    } catch (e) {
      console.log(e);
    }
    if (rotas !== null && rotas !== undefined) {
      if (rotas.length > 0) {
        await this.db.deleteAll("rotas").then(() => {
          rotas.forEach(rota => {
            this.db.insert("rotas", "id, nome, levantamento", [rota.id, rota.nome, rota.levantamento]);
          });
        });
      }
    }
  }
}
