import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { LoadingController, AlertController, ToastController } from "@ionic/angular";
import { LocalStorage } from "ngx-webstorage";
import { Database } from "../providers/database";
import { Base64 } from "@ionic-native/base64/ngx";
import { File } from "@ionic-native/file/ngx";

@Injectable({
  providedIn: "root"
})
export class ComplementosService {
  private complementosUrl = environment.api_webservice + "obsByRota";

  @LocalStorage("infoIniciais") infoIniciais: any;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private db: Database,
    private base64: Base64,
    private file: File,
  ) { }

  async salvarComplementos(franquia: number, rota: number) {
    const complementos = await this.getComplementos(franquia, rota);
    if (complementos !== null && complementos !== undefined) {
      if (complementos.length > 0) {
        for (const complemento of complementos) {
          const obs = await complemento.observacoes;
          const r = await complemento.reclamacoes;
          const s = await complemento.solicitacoes;

          await this.db.deleteByOs("obs", complemento.id);
          await this.db.deleteByOs("complemento", complemento.id);

          if (obs !== null && obs !== undefined) {
            if (obs.length > 0) {
              for (const o of obs) {
                if (o != null) {
                  await this.db.insert(
                    "obs",
                    `os, osNumero, tecConf, obsOs,
                    parecer, contratoTipo,
                    contratoObs, contratoObs2, entrega,
                    renovacao, proxObs, anteObs`,
                    [
                      complemento.id,
                      o.osNumero,
                      o.tecConf,
                      o.obs,
                      o.parecer,
                      o.contratoTipo,
                      o.contratoObs,
                      o.contratoObs2,
                      o.entrega,
                      o.renovacao,
                      o.proxObs,
                      o.anteObs
                    ]
                  );
                }
              }
            }
          }

          if (r !== null && r !== undefined) {
            if (r.length > 0) {
              for (const rec of r) {
                if (rec !== null) {
                  await this.db.insert(
                    "complemento",
                    `os, data, conteudo, tipo`,
                    [complemento.id, rec.data, rec.conteudo, 1]
                  );
                }
              }
            }
          }

          if (s !== null && s !== undefined) {
            if (s.length > 0) {
              for (const sol of s) {
                if (sol !== null) {
                  await this.db.insert(
                    "complemento",
                    `os, data, conteudo, tipo`,
                    [complemento.id, sol.data, sol.conteudo, 2]
                  );
                }
              }
            }
          }
        }
      }
      this.loadingController.dismiss();
    } else {
      this.loadingController.dismiss();
      const alert = await this.alertCtrl.create({
        message:
          "Ocorreu um erro, verifique sua conexão com a internet e novamente mais tarde.",
        buttons: [
          {
            text: "OK",
            handler: () => { }
          },
          {
            text: "Tentar novamente",
            handler: () => {
              this.salvarComplementos(franquia, rota);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  // lista de complemeentos
  async getComplementos(franquia: number, rota: number) {
    const api = await this.db.createQuery(
      "SELECT api_franquia FROM first_entry WHERE id = 1"
    );
    this.complementosUrl = api[0].api_franquia + "obsByRota";
    const url = `${this.complementosUrl}/${rota}`;
    let res;
    try {
      res = await this.http.get(url).toPromise();
    } catch (e) {
      console.log(e);
    }
    return await res;
  }

  limparComplementos() {
    this.db.deleteAll("obs");
    this.db.deleteAll("complemento");
  }

  async getRecomendacoesByOsAndArea(os: any, area: any) {
    const json = [];
    const recomendacoes = await this.db.createQuery(
      "SELECT * FROM recomendacao WHERE id_area = " + area + " AND os = " + os
    );

    recomendacoes.forEach(async rec => {
      const foto = await this.getBase64(rec.foto);
      json.push({
        codFraseReco: rec.id_frase,
        recoComplemento: rec.complemento,
        recoImg: foto
      });
    });
    return json;
  }

  async getBase64(filePath: string) {
    const fileName = filePath.split('/').pop();
    const path = filePath.substring(0, filePath.lastIndexOf("/") + 1);
    
    let base64FileResult = "";
    await this.file.readAsDataURL(path, fileName)
      .then((base64File: string)=> {
        base64FileResult = "data:.image/jpg;base64," +
          base64File
            .replace("data:image/*;charset=utf-8;base64,", "")
            .replace("data:image/jpeg;base64,", "")
      })

    return base64FileResult;
  }
}
