import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Metodologia } from "src/app/shared/modelos/os";
import { Database } from "src/app/shared/providers/database";

@Injectable({
  providedIn: "root"
})
export class MetodologiasService {
  private metodolgiasUrl = environment.api_webservice + "produtosApp";
  //private metodolgiasUrl = environment.api_webservice + "produto/getWEBNames";

  constructor(private http: HttpClient, private db: Database) { }

  async getMetodologias() {
    let metodologias = await this.db.getAll("metodologia");
    if (metodologias.length <= 0) {
      try {
        metodologias = await this.getProdutoData("local");
        if (metodologias.length < 1)
          metodologias = await this.getProdutoData("online");
        await metodologias.forEach(async met => {
          if (met.id > 0) {
            await this.db.insert("metodologia", "id, nome", [met.id, met.nome]);
            await met.metodos.forEach(async metodo => {
              await this.db.insert(
                "metodo",
                "id, nome, modulo, id_metodologia",
                [metodo.id, metodo.nome, metodo.modulo, met.id]
              );
              await metodo.produtos.forEach(async produto => {
                await this.db.insert("produto", "id, nome, isca", [
                  produto.id,
                  produto.nome,
                  produto.isca
                ]);
                await this.db.insert("produtoMetodo", "id_produto, id_metodo", [
                  produto.id,
                  metodo.id
                ]);
              });
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
    return metodologias;
  }

  limparMetodologias() {
    this.db.deleteAll("metodologia");
  }

  async getProdutosByOs(os) {
    const json = [];
    const produtos = await this.db.createQuery(
      "SELECT P.* FROM produtoOs AS P JOIN metodo AS M ON P.id_metodo = M.id WHERE M.modulo = 0 AND os = " +
      os
    );
    const Allprodutos = await this.db.createQuery(
      "SELECT P.* FROM produtoOs AS P WHERE os = " +
      os
    );
    console.log("produtos")
    console.log(produtos)
    console.log("AALLLprodutos")
    console.log(Allprodutos)
    const modulos = await this.db.createQuery(
      "SELECT P.* FROM produtoOs AS P JOIN metodo AS M ON P.id_metodo = M.id WHERE M.modulo = 1 AND os = " +
      os
    );
    await produtos.forEach(async produto => {
      await json.push({
        id_produto: produto.id_produto,
        id_metodo: produto.id_metodo,
        id_metodologia: produto.id_metodologia,
        id_area: produto.idAreaOs,
        qtd: produto.qtd_modulo,
        modulo: 0
      });
    });
    await modulos.forEach(async mod => {
      await json.push({
        id_produto: mod.id_produto,
        id_metodo: mod.id_metodo,
        id_metodologia: mod.id_metodologia,
        id_area: mod.idAreaOs,
        qtd: mod.qtd_modulo,
        modulo: 1
      });
    });
    return await json;
  }

  async getModulosByOs(os) {
    const json = [];
    const modulos = await this.db.createQuery(
      "SELECT P.* FROM produtoOs AS P JOIN metodo AS M ON P.id_metodo = M.id WHERE M.modulo = 1 AND os = " +
      os
    );
    await modulos.forEach(async mod => {
      await json.push({
        id_produto: mod.id_produto,
        id_metodo: mod.id_metodo,
        id_metodologia: mod.id_metodologia,
        id_area: mod.idAreaOs,
        qtd: mod.qtd_modulo,
        modulo: 1
      });
    });
    return await json;
  }

  async getProdutoData(local) {
    let produto = [];
    switch (local) {
      case "local":
        try {
          produto = await this.http
            .get<any>("../assets/produtos.json")
            .toPromise();
        } catch (e) {
          produto = [];
        }

        break;
      case "online":
        try {
          try {
            const api = await this.db.createQuery(
              "SELECT api_franquia FROM first_entry WHERE id = 1"
            );
            this.metodolgiasUrl = api[0].api_franquia + "produtosApp";
            console.log("API METODOLOGIAS: " + this.metodolgiasUrl)
            produto = await this.http.get<any>(this.metodolgiasUrl).toPromise();
          } catch (e) {
            console.log(e);
            produto = [];
          }
        } catch (e) {
          produto = [];
        }

        break;
      default:
        produto = [];
        break;
    }
    return produto;
  }

  async updateData() {
    const metodologias = await this.getProdutoData("online");
    if (metodologias !== null && metodologias !== undefined) {
      if (metodologias.length > 0) {
        await this.db.deleteAll("metodo");
        await this.db.deleteAll("produto");
        await this.db.deleteAll("produtoMetodo");
        await this.db.deleteAll("metodologia").then(async () => {
          metodologias.forEach(async met => {
            if (met.id > 0) {
              await this.db.insert("metodologia", "id, nome", [
                met.id,
                met.nome
              ]);
              await met.metodos.forEach(async metodo => {
                await this.db.insert(
                  "metodo",
                  "id, nome, modulo, id_metodologia",
                  [metodo.id, metodo.nome, metodo.modulo, met.id]
                );
                await metodo.produtos.forEach(async produto => {
                  await this.db.insert("produto", "id, nome, isca", [
                    produto.id,
                    produto.nome,
                    produto.isca
                  ]);
                  await this.db.insert(
                    "produtoMetodo",
                    "id_produto, id_metodo",
                    [produto.id, metodo.id]
                  );
                });
              });
            }
          });
        });
      }
    }
  }
}
