import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Metodologia } from "src/app/shared/modelos/os";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class DispositivosService {
  private apiUrl = "";

  constructor(private http: HttpClient, private db: Database) { }

  limparDispositivos() {
    this.db.deleteAll("dispositivos");
  }

  async listarLocalDispositivos() {
    try {
      const dispositivos = await this.db.getAll("dispositivo");
      return dispositivos;
    } catch (e) {
      return [];
    }
  }

  async listarAppDispositivos() {
    try {
      const api = await this.db.createQuery("SELECT api_franquia FROM first_entry WHERE id = 1");
      this.apiUrl = api[0].api_franquia + "dispositivosApp";

      const dispositivos = await this.http.get<any>(this.apiUrl).toPromise();
      return dispositivos;
    } catch (e) {
      return [];
    }
  }

  async updateData() {
    const dispositivos = await this.listarAppDispositivos();

    if (dispositivos && dispositivos.length > 0) {
      await this.db.deleteAll("dispositivo").then(() => {
        dispositivos.forEach((dispositivo: any) => {
          this.db.insert("dispositivo", "id, nome, deConsumo", [
            dispositivo.id,
            dispositivo.nome,
            dispositivo.deConsumo
          ]);
        });
      });
    }
  }

  async save(id: any, id_levantamento: any, id_area: any, id_dispositivo: any, quantidade: any) {
    let dispositivo: any;
    if (id) {
      dispositivo = (await this.db.getById("levDispositivo", id))[0];
    } else {
      dispositivo = (await this.getDispositivoByType(id_levantamento, id_area, id_dispositivo))[0];
    }

    if (dispositivo) {
      await this.db.update("levDispositivo", "quantidade", [quantidade], `id = ${dispositivo.id}`);
    } else {
      await this.db.insert("levDispositivo", "id_levantamento, id_area, id_dispositivo, quantidade", [id_levantamento, id_area, id_dispositivo, quantidade]);

      const dispositivos = await this.db.getAll("levDispositivo");
    }
  }

  async getDispositivoByType(id_levantamento: any, id_area: any, id_dispositivo: any) {
    const query = ` WHERE id_levantamento = ${id_levantamento} and id_area = ${id_area} and id_dispositivo = ${id_dispositivo}`;
    const dispositivos = await this.db.getBy("levDispositivo", "id, quantidade", query);
    return dispositivos;
  }
}
