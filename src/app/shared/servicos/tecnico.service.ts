import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tecnico } from "src/app/shared/modelos/tecnico";
import { Database } from "src/app/shared/providers/database";
import { LocalStorage } from "ngx-webstorage";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TecnicoService {
  @LocalStorage("api") api: any;
  //private tecnicoAPI = environment.api_webservice + "tecnicos";
  private tecnicoAPI = environment.api_webservice + "tecnicosApp";
  constructor(private http: HttpClient, private db: Database) { }

  // tecnicos por franquia
  async getTecnicosFranquia(franquia: number) {
    //  const url = this.api + "tecnicos/franquia/" + franquia;
    const url = this.api + "tecnicosApp";

    let tecnicos = await this.db.getAll("tecnico");
    let a = await this.db.getByFranquia("tecnico", franquia);

    tecnicos = await this.getInsert(this.tecnicoAPI);

    return tecnicos;
  }

  async getTecsByFranquia(franquia: number) {
    const url = this.api + "tecnicos/franquia/" + franquia;
    let tecnicos = await this.db.getByFranquia("tecnico", franquia);
    if (tecnicos.length < 1) {
      tecnicos = await this.getInsert("./assets/tecnicos.json");
      tecnicos = tecnicos.filter(tec => {
        return tec.franquia == franquia;
      });
      if (tecnicos.length < 1) {
        tecnicos = await this.getInsert(url);
        tecnicos = tecnicos.filter(tec => {
          return tec.franquia == franquia;
        });
      }
    }
    return tecnicos;
  }

  async updateData() {
    let tec = [];
    const api = await this.db.createQuery(
      "SELECT api_franquia FROM first_entry WHERE id = 1"
    );
    this.tecnicoAPI = api[0].api_franquia + "tecnicosApp";
    console.log("API TECNICOS: " + this.tecnicoAPI)
    try {
      tec = await this.http.get<any[]>(this.tecnicoAPI).toPromise();

    } catch (e) {
      console.log(e);
    }
    tec.forEach(async fran => {
      await this.db.deleteAll("tecnico");
      await this.db.insert("tecnico", "id, nome, franquia", [
        fran.id,
        fran.tec,
        fran.franquia
      ]);
    });
    let tecs = await this.db.getAll("tecnico");
    console.log(tecs)
  }

  // tecnico por id
  async getTecnico(id: number) {
    const url = (await this.api) + "tecnicos/" + id;
    return await this.http.get<Tecnico>(url).toPromise();
  }

  // listar todos, menos um específico
  async getTecnicoMinus(id: number) {
    //const url = (await this.api) + "tecnicos/without/" + id;
    const api = await this.db.createQuery(
      "SELECT api_franquia FROM first_entry WHERE id = 1"
    );
    this.tecnicoAPI = api[0].api_franquia + "tecnicosApp";
    const url = (await api[0].api_franquia) + "tecnicosAppSemUm/" + id;
    console.log("API TECNICOS MENOS 1: " + url)
    return await this.http.get<Tecnico>(url).toPromise();
  }

  async getInsert(url) {
    let tec;
    try {
      tec = await this.http.get<any[]>(url).toPromise();
    } catch (e) {
      console.log("Erro tec: " + e);
    }
    if (tec !== undefined && tec !== null) {
      if (tec.length > 0) {
        tec.forEach(async fran => {
          await this.db.insert("tecnico", "id, nome, franquia", [
            fran.id,
            fran.tec,
            fran.franquia
          ]);
        });
        return tec;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}
