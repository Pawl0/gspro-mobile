import { AreasDbService } from "src/app/shared/servicos/areas-db.service";
import { Injectable } from "@angular/core";
import { NavController, AlertController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { ComplementosService } from "./complementos.service";
import { LocalStorage } from "ngx-webstorage";
import { Database } from "src/app/shared/providers/database";
import { MetodologiasService } from "./metodologias.service";
import { Network } from "@ionic-native/network/ngx";
import { environment } from "src/environments/environment";
import { Device } from "@ionic-native/device/ngx";
import { timeout } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OsService {
  @LocalStorage("todasOrdensRota") todasOrdensRota: any;
  @LocalStorage("infoiniciais") infoiniciais: any;
  @LocalStorage("api") api: string;
  @LocalStorage("levantamento") levantamento: boolean;
  @LocalStorage("detalhesTecnicos") detalhesTecnicos: any;

  version: string;

  constructor(
    private alertCtrl: AlertController,
    private device: Device,
    private http: HttpClient,
    private complementosService: ComplementosService,
    private areasDbService: AreasDbService,
    private db: Database,
    private network: Network,
    private produto: MetodologiasService
  ) {
    this.version = environment.versao;
  }

  async enviarOs() {
    return new Promise(async (resolve, reject) => {
      let appMessage = "";
      let status = 1;
      const executadas = await this.db.getOsExecuted();
      if (executadas.length > 0) {
        for (const osExec of executadas) {
          const envio: any = await this.sendToServer(osExec);
          if (envio !== undefined && envio !== null) {
            appMessage = envio.app;
            if (envio.message === "success") {
              // const alert = await this.alertCtrl.create({
              //   message: "Servicos enviados com successo!"
              // });
              // await alert.present();
              await this.updateOsEnviada(osExec.id, osExec.status);
            } else {
              status = 0;
              // const alert = await this.alertCtrl.create({
              //   message: envio.erros
              // });
              // await alert.present();
            }
          }
        }
        if (status == 1) {
          const alert = await this.alertCtrl.create({
            message: "Servicos enviados com successo!",
          });
          await alert.present();
        } else {
          const alert = await this.alertCtrl.create({
            message:
              "Erro ao enviar algum dos servicos. verifique sua conexao com a internet, caso o erro persista entre em contato com seu adminstrador.",
          });
          await alert.present();
        }
      }
      resolve(appMessage);
    });
  }

  async sendToServer(osExec) {
    let json: any;
    const api = await this.db.createQuery(
      "SELECT api_franquia FROM first_entry WHERE id = 1"
    );
    let endPoint = api[0].api_franquia + "postDataApp";
    console.log("API OS: " + endPoint);

    if (this.levantamento) {
      endPoint = api[0].api_franquia + "postLevantamentosApp";
      console.log("API OS LEV: " + endPoint);
      if (osExec.status === 1) {
        json = await this.makeJsonOsLevantamento(osExec.id);
      } else if (osExec.status === 2) {
        json = await this.makeJsonOsLevantamentoNaoExec(osExec.id);
      }
    } else if (osExec.status === 1) {
      json = await this.makeJsonOs(osExec.id);
    } else if (osExec.status === 2) {
      json = await this.makeJsonOsNaoExec(osExec.id);
    }

    await this.db.insert("json", "os, json, status", [
      osExec.id,
      JSON.stringify(json),
      0,
    ]);
    try {
      return await this.http.post(endPoint, json).toPromise();
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async atualzarOs() {
    await this.deleteOsExecutadas();

    await this.complementosService.salvarComplementos(
      this.infoiniciais.franquia.id_franquia,
      this.infoiniciais.rota.id
    );

    const ordens: any = await this.getOsAtualizadas();
    const os = await this.db.getAll("os");
    for (const item of ordens) {
      if (this.verificarOSExiste(os, item.id)) {
        this.db.insertOs(item, item.area);
      }
    }

    await this.deleteOsExecutadas();

    return await ordens;
  }

  private async deleteOsExecutadas() {
    await this.db.deleteAreaOsExecuted();
    await this.db.deletePragaOsExecuted();
    await this.db.deleteProdutoOsExecuted();
    await this.db.deleteDispositivoLevExecuted();
    await this.db.deleteDispositivoOsExecuted();
    await this.db.deleteDispositivoPragaOsExecuted();
    await this.db.deleteOsExecuted();
  }

  private async getOsAtualizadas() {
    let ordens: any;
    const api = await this.db.createQuery(
      "SELECT api_franquia FROM first_entry WHERE id = 1"
    );

    let url: string;
    if (this.levantamento) {
      url =
        api[0].api_franquia +
        "levantamentoByRotaApp/" +
        this.infoiniciais.rota.id;
    } else {
      url = api[0].api_franquia + "osByRotaApp/" + this.infoiniciais.rota.id;
    }
    console.log("API ATUALIZAR OS: " + url);
    try {
      ordens = await this.http.get(url).toPromise();
    } catch (e) {
      ordens = null;
      console.log(e);
    }
    return ordens;
  }

  verificarOSExiste(ordens, os) {
    if (ordens !== undefined && ordens !== null) {
      if (ordens.length > 0) {
        for (const o of ordens) {
          if (o.id == os) return false;
        }
      }
    }
    return true;
  }

  async updateOsEnviada(os, status) {
    console.log("STATUS DE RETORNO WEBSERVICE" + status);
    console.log(status);
    return new Promise((resolve, reject) => {
      const result = this.db.getByOs("json", os);
      if (status === 2) {
        this.db.createQuery("UPDATE os SET status = 3 WHERE id = " + os);
      } else if (status === 1) {
        this.db.createQuery("UPDATE os SET status = 4 WHERE id = " + os);
      }
      resolve(result);
    });
  }

  async makeJsonOs(os) {
    const areas = await this.areasDbService.getAreaOsJson(os);
    const produtos = await this.produto.getProdutosByOs(os);
    const orden = await this.db.getById("os", os);
    const dispositivos = await this.db.getDispositivosOsJson(os);
    // let my = "";
    // for (const d of dispositivos) {
    //   my += " -- " + JSON.stringify(d.pragas);
    // }
    // const alert = await this.alertCtrl.create({
    //   message: my,
    // });
    // await alert.present();

    return {
      os: orden[0].id,
      status: 1,
      franquia: this.infoiniciais.franquia.id_franquia,
      rota: this.infoiniciais.rota.id,
      dataExecucao: orden[0].data + " " + orden[0].horaInicio,
      responsavel: this.infoiniciais.responsavel.id,
      equipe: this.infoiniciais.equipe,
      horaInicio: +orden[0].horaInicio,
      horaFim: +orden[0].horaFim,
      nome: orden[0].nome,
      rg: orden[0].rg,
      obsGeral: orden[0].obsGeral,
      obsProximo: orden[0].obsProximo,
      assinatura: orden[0].assinatura,
      produtos: produtos,
      areas: areas,
      dispositivos: dispositivos,
      app: this.version,
      uuid: this.device.uuid,
    };
  }

  async makeJsonOsNaoExec(os) {
    const orden = await this.db.getById("os", os);
    const json = orden[0];

    return {
      os: os,
      status: 0,
      franquia: this.infoiniciais.franquia.id_franquia,
      dataExecucao: json.data + " " + json.horaInicio,
      rota: this.infoiniciais.rota.id,
      responsavel: this.infoiniciais.responsavel.id,
      img: json.img,
      codFrase: json.codFrase,
      horaInfo: json.horaInfo,
      complemento: json.obsGeral,
      app: this.version,
      uuid: this.device.uuid,
    };
  }

  async makeJsonOsLevantamento(os: any) {
    const areas = await this.areasDbService.getAreaOsJson(os);
    const produtos = await this.produto.getModulosByOs(os);
    const orden = await this.db.getById("os", os);
    const detalhesTecnicos = await this.db.getById("detalhe", os);
    const dispositivos = await this.db.getDispositivosLevJson(os);

    return {
      os: orden[0].id,
      status: 1,
      franquia: this.infoiniciais.franquia.id_franquia,
      rota: this.infoiniciais.rota.id,
      dataExecucao: orden[0].data + " " + orden[0].horaInicio,
      responsavel: this.infoiniciais.responsavel.id,
      equipe: this.infoiniciais.equipe,
      horaInicio: +orden[0].horaInicio,
      horaFim: +orden[0].horaFim,
      nome: orden[0].nome,
      rg: orden[0].rg,
      obsGeral: orden[0].obsGeral,
      obsProximo: orden[0].obsProximo,
      assinatura: orden[0].assinatura,
      produtos: produtos,
      areas: areas,
      detalhesTecnicos: detalhesTecnicos,
      dispositivos: dispositivos,
      app: this.version,
    };
  }
  async makeJsonOsLevantamentoNaoExec(os) {
    const orden = await this.db.getById("os", os);
    const json = orden[0];

    return {
      os: os,
      status: 0,
      franquia: this.infoiniciais.franquia.id_franquia,
      dataExecucao: json.data + " " + json.horaInicio,
      rota: this.infoiniciais.rota.id,
      responsavel: this.infoiniciais.responsavel.id,
      img: json.img,
      horaInfo: json.horaInfo,
      obsGeral: json.obsGeral,
      codFrase: json.codFrase,
      app: this.version,
    };
  }
}
