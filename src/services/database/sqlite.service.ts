import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import type { Installation } from '../../types/installation';
import type { Consumption } from '../../types/consumption';

export class SQLiteService {
  private sqlite: any;
  private db: any = null;
  private initialized = false;

  constructor() {
    if (Capacitor.getPlatform() === 'web') {
      // For web platform
      this.sqlite = { 
        createConnection: () => Promise.resolve(),
        open: () => Promise.resolve(),
        execute: () => Promise.resolve(),
        executeSet: () => Promise.resolve(),
        query: () => Promise.resolve({ values: [] }),
        run: () => Promise.resolve()
      };
    } else {
      // For native platforms
      this.sqlite = CapacitorSQLite;
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Si estamos en web, simulamos la inicialización
      if (Capacitor.getPlatform() === 'web') {
        this.initialized = true;
        return;
      }

      await this.sqlite.createConnection('acueductos');
      this.db = await this.sqlite.openConnection('acueductos', false, 'no-encryption', 1, false);
      
      await this.createTables();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const queries = [
      // Vista de instalaciones
      `CREATE TABLE IF NOT EXISTS view_instalaciones (
        codigo INTEGER PRIMARY KEY,
        codigo_medidor TEXT,
        nombre TEXT,
        sector_nombre TEXT,
        direccion TEXT,
        promedio REAL,
        lectura_anterior REAL
      )`,
      // Vista de consumos
      `CREATE TABLE IF NOT EXISTS view_consumo (
        codigo INTEGER PRIMARY KEY AUTOINCREMENT,
        instalacion INTEGER,
        nombre TEXT,
        lectura REAL,
        fecha TEXT,
        mes TEXT,
        year INTEGER,
        mes_codigo INTEGER,
        consumo REAL,
        medidor TEXT,
        otros_cobros REAL,
        reconexion REAL,
        facturado BOOLEAN
      )`,
      // Consumos pendientes de sincronización
      `CREATE TABLE IF NOT EXISTS offline_consumptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        instalacion INTEGER,
        lectura REAL,
        fecha TEXT,
        consumo REAL,
        mes TEXT,
        year INTEGER,
        medidor TEXT,
        otros_cobros REAL,
        reconexion REAL,
        usuario TEXT,
        sync_status TEXT DEFAULT 'pending'
      )`
    ];

    for (const query of queries) {
      await this.db?.execute(query);
    }
  }

  async saveViewInstalaciones(installations: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Primero limpiamos la tabla
    await this.db.execute('DELETE FROM view_instalaciones');

    const query = `INSERT INTO view_instalaciones 
      (codigo, codigo_medidor, nombre, sector_nombre, direccion, promedio, lectura_anterior) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await this.db.executeSet(installations.map(inst => ({
      statement: query,
      values: [
        inst.codigo,
        inst.codigo_medidor,
        inst.nombre,
        inst.sector_nombre,
        inst.direccion,
        inst.promedio,
        inst.lectura_anterior
      ]
    })));
  }

  async getViewInstalaciones(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query('SELECT * FROM view_instalaciones');
    return result.values || [];
  }

  async saveViewConsumo(consumptions: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Limpiamos la tabla
    await this.db.execute('DELETE FROM view_consumo');

    const query = `INSERT INTO view_consumo 
      (instalacion, nombre, lectura, fecha, mes, year, mes_codigo, consumo, medidor, otros_cobros, reconexion, facturado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await this.db.executeSet(consumptions.map(cons => ({
      statement: query,
      values: [
        cons.instalacion,
        cons.nombre,
        cons.lectura,
        cons.fecha,
        cons.mes,
        cons.year,
        cons.mes_codigo,
        cons.consumo,
        cons.medidor,
        cons.otros_cobros,
        cons.reconexion,
        cons.facturado ? 1 : 0
      ]
    })));
  }

  async getViewConsumo(filters: {
    year?: number;
    mes_codigo?: number;
    nombre?: string;
    instalacion?: number;
  } = {}): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM view_consumo WHERE 1=1';
    const params: any[] = [];

    if (filters.year) {
      query += ' AND year = ?';
      params.push(filters.year);
    }
    if (filters.mes_codigo) {
      query += ' AND mes_codigo = ?';
      params.push(filters.mes_codigo);
    }
    if (filters.nombre) {
      query += ' AND nombre LIKE ?';
      params.push(`%${filters.nombre}%`);
    }
    if (filters.instalacion) {
      query += ' AND instalacion = ?';
      params.push(filters.instalacion);
    }

    const result = await this.db.query(query, params);
    return result.values || [];
  }

  async saveOfflineConsumption(consumption: Partial<Consumption>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `INSERT INTO offline_consumptions 
      (instalacion, lectura, fecha, consumo, mes, year, medidor, otros_cobros, reconexion, usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await this.db.run(query, [
      consumption.instalacion,
      consumption.lectura,
      consumption.fecha,
      consumption.consumo,
      consumption.mes,
      consumption.year,
      consumption.medidor,
      consumption.otros_cobros,
      consumption.reconexion,
      consumption.usuario
    ]);
  }

  async getPendingSyncConsumptions(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM offline_consumptions WHERE sync_status = ?',
      ['pending']
    );

    return result.values || [];
  }

  async markConsumptionAsSynced(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      'UPDATE offline_consumptions SET sync_status = ? WHERE id = ?',
      ['synced', id]
    );
  }
}

export const sqliteService = new SQLiteService();