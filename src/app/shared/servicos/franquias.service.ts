import { Database } from "./../providers/database";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Franquia } from "src/app/shared/modelos/franquia";
import { LocalStorage } from "ngx-webstorage";

@Injectable({
  providedIn: "root"
})
export class FranquiasService {
  private franquiasUrl = "https://emops.com.br/world/webservice-cod/" + "franquias";
  @LocalStorage("franquias") franquiasData: any;

  constructor(private http: HttpClient, private db: Database) { }

  async getFranquias() {
    let franquias = await this.db.getAll("franquia");
    if (franquias === undefined || franquias === null) {
      try {
        franquias = await this.getFranquia("local");
        if (franquias.length < 1) franquias = await this.getFranquia("online");
        this.franquiasData = franquias;
        await franquias.forEach(fran => {
          this.insertRowDB(fran);
        });
      } catch (e) {
        console.log(e);
      }
    } else if (franquias.length <= 0) {
      franquias = await this.getFranquia("local");
      if (franquias.length < 1) franquias = await this.getFranquia("online");
      this.franquiasData = franquias;
      await franquias.forEach(fran => {
        this.insertRowDB(fran);
      });
    }

    return await franquias;
  }

  insertRowDB(fran) {
    this.db.insert("franquia", "id, nome", [
      fran.id,
      fran.nome
    ]);
  }

  async getFranquia(local) {
    let franquia = [];
    switch (local) {
      case "local":
        try {
          franquia = await this.http
            .get<any>("../assets/franquias.json")
            .toPromise();
        } catch (e) {
          franquia = [];
        }

        break;
      case "online":
        try {
          franquia = await this.http
            .get<any>("../assets/franquias.json")
            .toPromise();
        } catch (e) {
          franquia = [];
        }

        break;
      default:
        franquia = [];
        break;
    }
    return franquia;
  }

  async updateData() {
    const franquias = await this.getFranquia("online");
    this.franquiasData = franquias;
    if (franquias !== null && franquias !== undefined) {
      if (franquias.length > 0) {
        this.db.deleteAll("franquia").then(() => {
          franquias.forEach(fran => {
            this.insertRowDB(fran);
          });
        });
      }
    }
  }
}
