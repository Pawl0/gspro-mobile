import { Injectable } from '@angular/core';
import { Database } from '../providers/database';
import { PragasService } from './pragas.service'
import { ComplementosService } from './complementos.service';

@Injectable({
  providedIn: 'root'
})
export class AreasDbService {

  constructor(private db: Database, 
    private praga: PragasService, 
    private recomendacao: ComplementosService) {
  }

  addAreaOs(data, os) {
    if (data !== undefined && data !== null) {
      data.forEach(element => {
        this.db.insert('areaOs', 'idArea, os, status', [element.id, os, false]);
        if (element.modulo !== null && element.modulo !== undefined) {
          element.modulo.forEach(m => {
            this.db.insert(
              'modulo',
              'idModulo, idArea, nome, qtd, os', 
              [m.id, element.id, m.nome, m.qtd, os]
            );
          });
        }
      });
    }
  }

  removerAreaAguardando(id: number) {
    this.db.deleteById('area', id);
  }

  async getAreaOsJson(os) {
    const json = []
    const areas = await this.db.getAreaByOsCompleta(os);
    await areas.forEach(async (area) => {
      let pragas = await this.praga.getPragaByOsAndArea(os, area.id);
      let recomendacoes = await this.recomendacao.getRecomendacoesByOsAndArea(os, area.id);
      await json.push({
        id: area.idArea,
        pragas: pragas,
        recomendacoes: recomendacoes
      })
    })
    return await json;
  }

}
