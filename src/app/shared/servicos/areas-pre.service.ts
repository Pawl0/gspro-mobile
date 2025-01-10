import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Area } from "src/app/shared/modelos/os";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class AreasPreService {
  //private areasUrl = environment.api_webservice + "areas";
  private areasUrl = environment.api_webservice + "areasApp";

  constructor(private http: HttpClient, private db: Database) { }

  // lista de areas
  async listarAreasPre() {
    let areas = await this.db.getAll("area");
    if (areas.length == 0) {
      try {
        areas = await this.getAreaData("local");
        if (areas.length == 1){
          areas = await this.getAreaData("online");
        } 
        areas.forEach(area => {
          this.db.insert("area", "id, nome", [area.id, area.nome]);
        });
      } catch (e) {
        console.log("catch areas  " + e);
      }
    }

    return areas;
  }

  // area por id
  getArea(id: number): Observable<Area> {
    const url = `${this.areasUrl}/${id}`;
    return this.http.get<any>(url);
  }

  limparAreas() {
    this.db.deleteAll("area");
  }

  async getAreaData(local) {
    let area = [];
    switch (local) {
      case "local":
        try {
          area = await this.http.get<any>("../assets/areas.json").toPromise();
        } catch (e) {
          area = [];
        }

        break;
      case "online":
        try {
          const api = await this.db.createQuery(
            "SELECT api_franquia FROM first_entry WHERE id = 1"
          );
          this.areasUrl = api[0].api_franquia + "areasApp";
          console.log("API AREAS: " + this.areasUrl)
          area = await this.http.get<Area[]>(this.areasUrl).toPromise();
        } catch (e) {
          console.log(e);
          area = [];
        }

        break;
      default:
        area = [];
        break;
    }
    return area;
  }

  async updateData() {
    const areas = await this.getAreaData("online");
    if (areas !== null && areas !== undefined) {
      if (areas.length > 0) {
        await this.db.deleteAll("area").then(res => {
          areas.forEach(area => {
            this.db.insert("area", "id, nome", [area.id, area.nome]);
          });
        });
      }
    }
  }
}
