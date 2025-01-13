import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  CapacitorSQLitePlugin,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Database {
  private dbName = 'emops';
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;
  private db!: SQLiteDBConnection;

  constructor(private _platform: Platform) {
    this._platform.ready().then(async (readySource: string) => {
      console.log('Platform ready from', readySource);
      this.db = await this.createDatabase();
    });
  }

  async initializePlugin() {
    this.db = await this.sqlite.createConnection(
      this.dbName,
      false,
      'no-encryption',
      1,
      false
    );
    await this.db.open();
    return this.db;
  }

  // async initializePlugin(): Promise<boolean> {
  //   console.log('initializePlugin');
  //   this.platform = Capacitor.getPlatform();
  //   console.log('this.platform: ', this.platform);
  //   if (this.platform === 'ios' || this.platform === 'android')
  //     this.native = true;
  //   this.sqlitePlugin = CapacitorSQLite;
  //   this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
  //   this.isService = true;
  //   return true;
  // }

  private async createDatabase(): Promise<SQLiteDBConnection> {
    console.log('createDatabase');
    await this.initializePlugin();
    if (!this.db) {
      console.log('Connection is undefined');
      try {
        this.db = await this.sqlite.retrieveConnection(this.dbName, false);
      } catch (e) {
        console.log('ERROR retrieveConnection: ', e);
        this.initializePlugin();
      }
    }
    console.log('Connection is defined: ', this.db);
    await this.createTables(this.db);
    return this.db;

    // return this.platform.ready().then((readySource: string) => {
    // return this.sqliteConnection
    //   .retrieveConnection(this.dbName, false)
    //   .then((db) => {
    //     this.db = db;
    //     this.createTables(this.db);
    //     //this.dropTable(db).then((r) => {
    //     //})

    //     return this.db;
    //   })
    //   .catch((error: Error) => {
    //     console.log('Error on open or create database: ', error);
    //     return Promise.reject(error.message || error);
    //   });
    // });
  }

  private async createTables(db: SQLiteDBConnection): Promise<void> {
    console.log('creating tables with connection: ', db);
    this.createTableJson(db);
    this.createTablePragaOs(db);
    this.createTableProdutoOs(db);
    this.createTableOS(db);
    this.createTableArea(db);
    this.createTableFristEntry(db);
    this.createTableRotas(db);
    this.createTableFranquia(db);
    this.createTableFrase(db);
    this.createTableFraseNaoExec(db);
    this.createTablePraga(db);
    this.createTableMetodologia(db);
    this.createTableMetodo(db);
    this.createTableProduto(db);
    this.createTableProdutoMetodo(db);
    this.createTableAreaOs(db);
    this.createTableRecomendacao(db);
    this.createTableDispositivo(db);
    this.createTableLevDispositivo(db);
    this.createTableOsDispositivo(db);
    this.createTableDispositivoPraga(db);
    this.createTableTecnico(db);
    this.createTableModulo(db);
    this.createTableComplemento(db);
    this.createTableObs(db);
    this.createTableDetalhes(db);
  }

  async getDb(newOpen?: boolean): Promise<SQLiteDBConnection> {
    console.log('getDb newOpen: ', newOpen);
    if (newOpen) {
      return await this.createDatabase();
    }
    console.log('this.db: ', this.db);
    return this.db ?? (await this.createDatabase());
  }

  // INSERT

  async insert(table: string, rows: string, data: any) {
    let i = 0;
    const numParams = rows.split(',').length;
    let params = '?';
    for (i = 1; i < numParams; i++) {
      params += ', ?';
    }
    return await this.getDb().then(async (database) => {
      await database
        .query(
          'INSERT INTO ' + table + ' (' + rows + ') VALUES (' + params + ')',
          data
        )
        .then((res) => {
          console.log('Dados inseridos com sucesso! ' + table);
          return res;
        })
        .catch((err) => {
          console.log(
            'Dados Nao inseridos ' + table + ' ----- ' + 'DATA:: ' + data
          );
          console.log(err.message);
        });
    });
  }

  async update(table: string, rows: any, data: any, conditional: string = '') {
    return await this.getDb().then(async (database) => {
      await database
        .query(
          `UPDATE ${table} SET ${rows.split(',').join(' = ?, ')} = ? ${
            conditional ? ' WHERE ' + conditional : ''
          } `,
          data
        )
        .then((res) => {
          console.log('Dados atualizados com sucesso! ' + table);
          return res;
        })
        .catch((err) => {
          console.log(
            'Dados Nao atualizados ' + table + ' ----- ' + 'DATA:: ' + data
          );
          console.log(err.message);
        });
    });
  }

  insertReplace(table, rows, data) {
    let i = 0;
    const numParams = rows.split(',').length;
    let params = '?';
    for (i = 1; i < numParams; i++) {
      params += ', ?';
    }
    this.getDb().then((database) => {
      database
        .query(
          'INSERT OR REPLACE INTO ' +
            table +
            ' (' +
            rows +
            ') VALUES (' +
            params +
            ')',
          data
        )
        .then((res) => {
          //console.log("Dados inseridos com sucesso! " + table);
        })
        .catch((err) => {
          console.log(
            'Dados Nao inseridos ' + table + ' ----- ' + 'DATA:: ' + data
          );
          console.log(err.message);
        });
    });
  }

  async insertOs(data, areas) {
    await this.getDb().then((database) => {
      database
        .query(
          `INSERT INTO os 
            (
              id,
              status,
              nomeCliente,
              data,
              horario,
              horaInicio,
              duracao,
              tipoContrato,
              servico,
              qtdTec,
              nomeContato,
              endereco,
              latitude,
              longitude,
              numero,
              numServico,
              escada,
              fog,
              armadilha,
              modulo,
              renovacao
            )
              VALUES 
            (
              ${data.id},
              0, 
              '${data.nomeCliente}',
              '${data.data}',
              '${data.horario}',
              '${data.horaInicio}',
              '${data.duracao}',
              '${data.tipoContrato}',
              '${data.servico} ',
              ${data.qtdTec},
              '${data.nomeContato}',
              '${data.endereco}',
              '${data.latitude}',
              '${data.longitude}',
              '${data.numero}',
              ${data.numServico},
              ${data.escada},
              ${data.fog},
              ${data.armadilha},
              ${data.modulo},
              ${data.renovacao}
            )`
        )
        .then(async (res) => {
          //console.log("Dados da OS inseridos com sucesso!");
          if (areas && areas.length > 0) {
            for (const area of areas) {
              this.insert('areaOs', 'idArea, os, status, nova', [
                area.id,
                data.id,
                false,
                false,
              ]);
              if (area.modulo && area.modulo.length > 0) {
                for (const modulo of area.modulo) {
                  this.insert('modulo', 'idModulo, idArea, nome, qtd, os', [
                    modulo.id,
                    area.id,
                    modulo.nome,
                    modulo.qtd,
                    data.id,
                  ]);
                }
              }
            }
          }

          for (const dispositivo of data.dispositivos) {
            this.insert(
              'osDispositivo',
              'id_dispositivo, id_area, sequencia, tipo, deConsumo, os',
              [
                dispositivo.id,
                dispositivo.id_area,
                dispositivo.sequencia,
                dispositivo.dispositivoTipo,
                dispositivo.deConsumo,
                data.id,
              ]
            );

            if (dispositivo.pragas && dispositivo.pragas.length > 0) {
              for (const dispositivoPraga of dispositivo.pragas) {
                this.insert(
                  'osDispositivoPraga',
                  'id_dispositivo, id_praga, quantidade, praga, consumido, os',
                  [
                    dispositivo.id,
                    dispositivoPraga.id_praga,
                    dispositivoPraga.quantidade,
                    dispositivoPraga.praga,
                    dispositivoPraga.consumido,
                    data.id,
                  ]
                );
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  // GET

  async getAll(table) {
    const res = [];
    await this.getDb().then(async (database) => {
      await database.query('SELECT * FROM ' + table).then(async (data) => {
        for (let i = 0; i < data.values.length; i++) {
          await res.push(data.values[i]);
        }
      });
    });
    return res;
  }

  async getById(table, id) {
    const res = [];
    const sql = 'SELECT * FROM ' + table + ' WHERE id = ' + id;
    await this.getDb().then(async (database) => {
      await database.query(sql).then(async (data) => {
        for (let i = 0; i < data.values.length; i++) {
          await res.push(data.values[i]);
        }
      });
    });
    return res;
  }

  async getBy(table, fields, where) {
    const res = [];
    await this.getDb().then(async (database) => {
      await database
        .query('SELECT ' + fields + ' FROM ' + table + where)
        .then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
    });
    return res;
  }

  async getByOs(table, os) {
    const res = [];
    await this.getDb().then(async (database) => {
      await database
        .query('SELECT * FROM ' + table + ' WHERE os = ' + os)
        .then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
    });
    return res;
  }

  async getAreaByOs(os) {
    const sql =
      `SELECT A.nome, B.idArea as id, B.nova FROM area AS A JOIN areaOs AS B ON A.id = B.idArea AND B.os = ` +
      os;
    const res = [];
    await this.getDb().then(async (database) => {
      await database.query(sql).then(async (data) => {
        for (let i = 0; i < data.values.length; i++) {
          await res.push(data.values[i]);
        }
      });
    });
    return res;
  }

  async getLevDispositivos(id_levatamento: any, area_id?: any) {
    let sql = `
      SELECT 
        l.id,
        l.id_levantamento,
        l.id_dispositivo,
        l.id_area,
        l.quantidade,
        d.nome,
        d.deConsumo 
      FROM levDispositivo l
      JOIN dispositivo d on d.id = l.id_dispositivo
      WHERE l.id_levantamento = ${id_levatamento}`;

    if (area_id) {
      sql += ` and l.id_area = ${area_id}`;
    }

    const rows = [];
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            rows.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }

    return rows;
  }

  async getOsDispositivos(os: any, id_area: any = null) {
    let sql = `
    SELECT 
      id_dispositivo as id,
      id_dispositivo,
      id_area,
      os as id_os,
      sequencia,
      tipo,
      deConsumo
    FROM osDispositivo WHERE os = ${os}`;

    if (id_area) {
      sql += ` AND id_area = ${id_area}`;
    }

    const res = [];
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }

    return res;
  }

  async getDispositivoPragas(os: any, id_dispositivo: any) {
    const sql = `
    SELECT 
      id,
      id_dispositivo,
      id_praga,
      os as id_os,
      quantidade,
      praga,
      consumido
    FROM osDispositivoPraga WHERE os = ${os} AND id_dispositivo = ${id_dispositivo}`;

    const res = [];
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }

    return res;
  }

  async getDispositivosLevJson(id_levantamento: any) {
    const dispositivos = await this.getLevDispositivos(id_levantamento);
    return dispositivos.map((d) => {
      return {
        id: d.id,
        id_dispositivo: d.id_dispositivo,
        id_area: d.id_area,
        quantidade: d.quantidade,
      };
    });
  }

  async getDispositivosOsJson(os: any) {
    const dispositivos = await this.getOsDispositivos(os, false);
    for (const dispositivo of dispositivos) {
      dispositivo.pragas = await this.getDispositivoPragas(
        os,
        dispositivo.id_dispositivo
      );
    }

    return dispositivos;
  }

  async getAreaByOsAguardando(os) {
    const sql =
      `SELECT A.nome, B.id as id, B.idArea as idArea, B.nova FROM area AS A JOIN areaOs
        AS B ON A.id = B.idArea  WHERE B.status = "false" AND B.os = ` + os;
    //console.log(sql);
    const res = [];
    await this.getDb().then(async (database) => {
      await database.query(sql).then(async (data) => {
        for (let i = 0; i < data.values.length; i++) {
          await res.push(data.values[i]);
        }
      });
    });
    return res;
  }

  async getAreaByOsCompleta(os: any) {
    const sql =
      `SELECT A.nome, B.id as id, B.idArea as idArea, B.nova FROM area AS A JOIN areaOs
        AS B ON A.id = B.idArea  WHERE B.status = "true" AND B.os = ` + os;
    const res = [];
    await this.getDb().then(async (database) => {
      await database.query(sql).then(async (data) => {
        for (let i = 0; i < data.values.length; i++) {
          res.push(data.values[i]);
        }
      });
    });
    return res;
  }

  async getByFranquia(table, franquia) {
    const res = [];
    await this.getDb().then(async (database) => {
      await database
        .query('SELECT * FROM ' + table + ' WHERE franquia = ' + franquia)
        .then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
    });
    return res;
  }

  async getOsByStatus(status) {
    const sql = 'SELECT * FROM os WHERE status = ' + status;
    const res = [];
    ////console.log(sql);
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }

    return res;
  }

  async getOsExecuted() {
    const sql = 'SELECT * FROM os WHERE status = 1 or status = 2';
    const res = [];
    //console.log(sql);
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
    console.log(res);
    return res;
  }

  async getAllOsExecuted() {
    const sql = 'SELECT * FROM os WHERE status = 1 or status = 4';
    const res = [];
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
    return res;
  }

  async getAllOsNotExecuted() {
    const sql = 'SELECT * FROM os WHERE status = 2 or status = 3';
    const res = [];
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
    return res;
  }

  async createQuery(sql) {
    //console.log(sql);
    const res = [];
    try {
      await this.getDb().then(async (database) => {
        await database.query(sql).then(async (data) => {
          for (let i = 0; i < data.values.length; i++) {
            await res.push(data.values[i]);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }

    return res;
  }

  // DELETE

  deleteAll(table) {
    return this.getDb().then((database) => {
      database
        .query('DELETE FROM ' + table)
        .then((res) => {
          // console.log("Tabela " + table + " zerada com sucesso!");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deleteByOs(table, os) {
    return this.getDb().then((database) => {
      database
        .query('DELETE FROM ' + table + ' WHERE os = ' + os)
        .then((res) => {
          console.log(
            'Dados ' + table + ' com os = ' + os + 'zerada com sucesso!'
          );
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deleteAreaOsExecuted() {
    return this.getDb().then((database) => {
      database
        .query(
          'DELETE FROM areaOs WHERE os in (SELECT id FROM os WHERE status = 3 OR status = 4)'
        )
        .then((res) => {
          //console.log("Dados das areaOs deletado sucesso!");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deleteProdutoOsExecuted() {
    return this.getDb().then((database) => {
      database
        .query(
          'DELETE FROM produtoOs WHERE os in (SELECT id FROM os WHERE status = 3 OR status = 4)'
        )
        .then((res) => {
          //console.log("Dados das produtoOs deletado sucesso!");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deletePragaOsExecuted() {
    return this.getDb().then((database) => {
      database
        .query(
          'DELETE FROM pragaOs WHERE os in (SELECT id FROM os WHERE status = 3 OR status = 4)'
        )
        .then((res) => {
          //console.log("Dados das pragaOs deletado sucesso!");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deleteOsExecuted() {
    return this.getDb().then((database) => {
      database
        .query('DELETE FROM os WHERE status in (3, 4)')
        .then((res) => {
          console.log('OS executadas e enviadas deletadas!');
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async deleteDispositivoLevExecuted() {
    const database = await this.getDb();
    database
      .query(
        'DELETE FROM levDispositivo WHERE id_levantamento in (SELECT id FROM os WHERE status = 3 OR status = 4)'
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteDispositivoOsExecuted() {
    const database = await this.getDb();
    database
      .query(
        'DELETE FROM osDispositivo WHERE os in (SELECT id FROM os WHERE status = 3 OR status = 4)'
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteDispositivoPragaOsExecuted() {
    const database = await this.getDb();
    database
      .query(
        'DELETE FROM osDispositivoPraga WHERE os in (SELECT id FROM os WHERE status = 3 OR status = 4)'
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteById(table: string, id: any) {
    if (id == null) {
      return;
    }
    return await this.getDb().then(async (database) => {
      await database
        .query('DELETE FROM ' + table + ' WHERE id = ' + id)
        .then((res) => {
          console.log('Deletado com sucesso! ' + table + ' - Id: ' + id);
          return res;
        })

        .catch((err) => {
          console.log(
            'Erro ao deletar: ' + table + ' - Id: ' + id + ' - Err: ' + err
          );
        });
    });
  }

  async createTableOS(db) {
    // db.execute('DROP TABLE os');
    const sql = `CREATE TABLE IF NOT EXISTS os (
            id                     INTEGER  NOT NULL PRIMARY KEY
            ,status                INT  NOT NULL
            ,nomeCliente           VARCHAR(255) NOT NULL
            ,data                  DATE  NOT NULL
            ,horario               VARCHAR(12) NOT NULL
            ,horaInicio            VARCHAR(15) NOT NULL
            ,duracao               VARCHAR(15) NOT NULL
            ,tipoContrato          VARCHAR(18) NOT NULL
            ,servico               VARCHAR(50) NOT NULL
            ,qtdTec                INTEGER  NOT NULL
            ,nomeContato           VARCHAR(255)
            ,endereco              VARCHAR(255) NOT NULL
            ,latitude              VARCHAR(18) NOT NULL
            ,longitude             VARCHAR(18) NOT NULL
            ,numero                VARCHAR(30)
            ,numServico            INTEGER  NULL
            ,escada                BOOLEAN  NOT NULL
            ,fog                   BOOLEAN  NOT NULL
            ,armadilha             BOOLEAN  NOT NULL
            ,modulo                BOOLEAN  NOT NULL
            ,rota                  INTEGER NULL
            ,franquia              INTEGER NULL
            ,responsavel           INTEGER NULL
            ,horaInicioServico     VARCHAR(30) NULL
            ,horaFim               VARCHAR(30) NULL
            ,horaInfo              VARCHAR(30) NULL
            ,dataExecucao          VARCHAR(30) NULL
            ,nome                  VARCHAR (50) NULL
            ,rg                    VARCHAR(15) NULL
            ,assinatura            TEXT NULL
            ,obsGeral              VARCHAR(255) NULL
            ,obsProximo            VARCHAR(255) NULL
            ,codFrase              INTEGER NULL
            ,img                   VARCHAR(255) NULL
            ,renovacao             BOOLEAN NULL
        )`;

    //        //console.log(sql);

    return await db
      .execute(sql)
      .then((aguardando) => {
        //console.log("Tabela aguardando criada com sucesso");
      })
      .catch((err) => {
        console.log('Erro ao criar tabela os');
      });
  }

  async createTablePraga(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS praga (
            id INT NULL,
            nome VARCHAR(50) NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela praga criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableFraseNaoExec(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS fraseNaoExec (
            id INT  NOT NULL PRIMARY KEY,
            culpa INT NULL,
            frase VARCHAR(255) NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela fraseNaoExec criada com sucesso");
      })
      .catch((err) => {
        // console.log("Tabela fraseNaoExec nao criada");
        console.log(err);
      });
  }

  async createTableAreaOs(db) {
    //   db.execute('DROP TABLE areaOs');
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS areaOs (
            id INTEGER  NOT NULL PRIMARY KEY,
            idArea INT NOT NULL,
            os INT NOT NULL,
            status BOOLEAN DEFAULT false, 
            nova BOOLEAN NOT NULL DEFAULT FALSE)
        `
      )
      .then((franquia) => {
        // console.log("Tabela areaOs criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableMd5(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS md5 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table TEXT NOT NULL UNIQUE,
            checksum TEXT NOT NULL,
            last_update TEXT NULL)
        `
      )
      .then((franquia) => {
        // console.log("Tabela md5 criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTablePragaOs(db) {
    // await db.execute('DROP TABLE pragaOs');
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS pragaOs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
               idArea INTEGER NOT NULL,
               id_praga INTEGER NOT NULL,
               nivel INTEGER NOT NULL,
               os INTEGER NOT NULL
           )`
      )
      .then((franquia) => {
        // console.log("Tabela pragaOs criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableFrase(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS frase (
            id INTEGER  NOT NULL PRIMARY KEY,
            recomendacao VARCHAR(255) NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela frase criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableDetalhes(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS detalhe (
            id INTEGER  NOT NULL UNIQUE,
            escada INT NOT NULL,
            fog INT NOT NULL,
            obs VARCHAR(255) NOT NULL,
            inicialHora INT NOT NULL,
            inicialTecnico INT NOT NULL,
            manutencaoHora INT NOT NULL,
            manutencaoTecnico INT NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela detalhes criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableArea(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS area (
            id INTEGER  NOT NULL PRIMARY KEY,
            nome VARCHAR(50) NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela area criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableModulo(db) {
    // db.execute('DROP TABLE modulo');
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS modulo (
            id INTEGER  NOT NULL PRIMARY KEY,
            idModulo INTEGER NOT NULL,
            idArea INTEGER NOT NULL,
            nome VARCHAR(50) NOT NULL,
            qtd INTEGER NOT NULL,
            os INTEGER NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela modulo criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableMetodologia(db) {
    // db.execute('DROP table metodologia');
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS metodologia (
            id INT  NOT NULL PRIMARY KEY,
            nome VARCHAR(50) NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela metodologia criada com sucesso");
      })
      .catch((err) => {
        console.log('Erro ao criar tabela metodologia');
        console.log(err);
      });
  }

  async createTableMetodo(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS metodo (
            id INT  NOT NULL PRIMARY KEY,
            nome VARCHAR(50) NOT NULL,
            modulo INT,
            id_metodologia INT NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela metodo criada com sucesso");
      })
      .catch((err) => {
        console.log('Erro ao criar tabela metodo');
        console.log(err);
      });
  }

  async createTableProduto(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS produto (
            id INT  NOT NULL PRIMARY KEY,
            nome VARCHAR(50) NOT NULL,
            isca INT
        )`
      )
      .then((franquia) => {
        // console.log("Tabela produto criada com sucesso");
      })
      .catch((err) => {
        console.log('Erro ao criar tabela produto');
        console.log(err);
      });
  }

  async createTableProdutoMetodo(db) {
    // await db.execute('DROP TABLE produtoMetodo');
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS produtoMetodo (
            id_metodo int,
            id_produto int,
            PRIMARY KEY(id_metodo, id_produto)
        )`
      )
      .then((franquia) => {
        // console.log("Tabela produtoMetodo criada com sucesso");
      })
      .catch((err) => {
        console.log('Erro ao criar tabela produtoMetodo');
        console.log(err);
      });
  }

  async createTableTecnico(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS tecnico (
            id INTEGER  NOT NULL PRIMARY KEY,
            nome VARCHAR(50) NOT NULL,
            franquia INT NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela tecnico criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableFranquia(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS franquia (
            id          INT  NOT NULL PRIMARY KEY
            ,nome        VARCHAR(50) NOT NULL
            ,inicio  INT  NOT NULL
            ,fim     INT  NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela franquia criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableFristEntry(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS first_entry (
        id INT  NOT NULL PRIMARY KEY
        ,id_franquia INT   NULL 
        ,nome_franquia TEXT   NULL 
        ,api_franquia TEXT   NULL 
        ,assinatura_franquia BOOLEAN  NULL 
        ,status  INT   NULL
        )`
      )
      .then((FristEntry) => {
        console.log('Tabela FristEntry criada com sucesso');
      })
      .catch((err) => {
        console.log(err);
        console.log('Tabela FristEntry NAO criada com sucesso');
      });
  }

  async createTableRotas(db) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS rotas (
        id INT  NOT NULL PRIMARY KEY
        ,id_rota INT   NULL 
        ,nome TEXT   NULL 
        ,levantamento INT NULL
        )`
      )
      .then((FristEntry) => {
        console.log('Tabela rotas criada com sucesso');
      })
      .catch((err) => {
        console.log(err);
        console.log('Tabela rotas NAO criada com sucesso');
      });
  }

  async createTableJson(db: SQLiteDBConnection) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS json (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            ,os         INT  NOT NULL
            ,json       TEXT  NOT NULL
            ,status     INT  NOT NULL
        )`
      )
      .then((json) => {
        // console.log("Tabela json criada com sucesso");
      })
      .catch((err) => {
        console.log('Erro ao criar tabela json');
        console.log(err);
      });
  }

  async createTableObs(db) {
    return await db
      .execute(
        `
        CREATE TABLE IF NOT EXISTS obs (
             os INT NOT NULL
            ,osNumero  INT  NOT NULL
            ,tecConf  VARCHAR(255)
            ,obsOs VARCHAR(255)
            ,parecer VARCHAR(255)
            ,contratoTipo VARCHAR(255)
            ,contratoObs VARCHAR(255)
            ,contratoObs2 VARCHAR(255)
            ,entrega VARCHAR(255)
            ,renovacao VARCHAR(255)
            ,proxObs VARCHAR(255)
            ,anteObs VARCHAR(255)
        )`
      )
      .then((franquia) => {
        // console.log("Tabela OBS criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableComplemento(db) {
    // await db.execute('drop table complemento');
    return await db
      .execute(
        `
        CREATE TABLE IF NOT EXISTS complemento (
             id INTEGER PRIMARY KEY AUTOINCREMENT
            ,os INT NOT NULL
            ,data  date  NOT NULL
            ,conteudo  VARCHAR(255)
            ,tipo int not null
        )`
      )
      .then((franquia) => {
        // console.log("Tabela complemento criada com sucesso");
      })
      .catch((err) => {
        console.log('ANO INSERIRIIRIRIRIR CONMOCPALEMENTO err');
      });
  }

  async createTableRecomendacao(db) {
    // await db.execute("DROP TABLE recomendacao");
    return await db
      .execute(
        `
        CREATE TABLE IF NOT EXISTS recomendacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            ,id_area INTEGER NOT NULL
           ,os INTEGER NOT NULL
           ,foto  TEXT NULL
           ,id_frase INTEGER DEFAULT NULL
           ,complemento TEXT NULL
       )`
      )
      .then((franquia) => {
        // console.log("Tabela recomendacao criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableDispositivo(db: any) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS dispositivo (
          id INT  NOT NULL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          deConsumo BOOLEAN NULL
      )`
      )
      .then((_res) => {
        console.log('Tabela dispositivo criada com sucesso');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableLevDispositivo(db: any) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS levDispositivo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_levantamento INTEGER NOT NULL,
            id_area INTEGER NOT NULL,
            id_dispositivo INTEGER NOT NULL,
            quantidade INTEGER NOT NULL
          )`
      )
      .then((_res) => {
        console.log('Tabela levDispositivo criada com sucesso');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableOsDispositivo(db: any) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS osDispositivo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_dispositivo INTEGER NOT NULL,
            id_area INTEGER NOT NULL,
            sequencia INTEGER NOT NULL,
            tipo VARCHAR(500) NOT NULL,
            deConsumo BOOLEAN NULL,
            os INTEGER NOT NULL
       )`
      )
      .then((_res) => {
        console.log('Tabela osDispositivo criada com sucesso');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableDispositivoPraga(db: any) {
    return await db
      .execute(
        `CREATE TABLE IF NOT EXISTS osDispositivoPraga (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_dispositivo INTEGER NOT NULL,
            id_praga INTEGER NULL,
            quantidade INTEGER NULL,
            praga VARCHAR(500) NULL,
            consumido BOOLEAN NULL,
            os INTEGER NOT NULL
       )`
      )
      .then((res) => {
        console.log('Tabela osDispositivoPraga criada com sucesso');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createTableProdutoOs(db) {
    //  await db.execute("DROP TABLE produtoOs");
    return await db
      .execute(
        `
        CREATE TABLE IF NOT EXISTS produtoOs (
             id INTEGER PRIMARY KEY AUTOINCREMENT
            ,id_metodologia INTEGER NOT NULL
            ,id_metodo INTEGER NOT NULL
            ,id_produto INTEGER NOT NULL
            ,os INTEGER NOT NULL
            ,qtd_modulo  INTEGER NULL
            ,idArea INTEGER NOT NULL
            ,idAreaOs INTEGER NOT NULL
        )`
      )
      .then((franquia) => {
        // console.log("Tabela produtoOs criada com sucesso");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async dropTable(db) {
    const tables = [
      'recomendacao',
      'complemento',
      'obs',
      'franquia',
      'tecnico',
      'produtoMetodo',
      'produto',
      'metodo',
      'metodologia',
      'modulo',
      'area',
      'areaOs',
      'frase',
      'fraseNaoExec',
      'praga',
      'os',
      'produtoOs',
      'pragaOs',
      'json',
    ];
    return await tables.forEach((table) => {
      db.execute('DROP TABLE ' + table);
    });
  }
}
