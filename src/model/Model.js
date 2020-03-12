import sqlite3 from "sqlite3";
import { keys, toArray } from "lodash";

export default class {
  constructor(table) {
    this.db = new sqlite3.Database("attendance.db");
    this.db.asyncAll = (query, params) => {
      return new Promise((resolve, reject) => {
        this.db.serialize(() => {
          this.db.all(query, params, (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
          });
        });
      });
    };
    this.db.asyncRun = (query, params) => {
      return new Promise((resolve, reject) => {
        this.db.serialize(() => {
          this.db.run(query, params, error => {
            if (error) reject(error);
            else resolve();
          });
        });
      });
    };
    this.table = table;
  }

  index() {
    return this.db.asyncAll(`SELECT * FROM ${this.table}`);
  }

  store(data) {
    return this.db.asyncRun(`
      INSERT INTO ${this.table} (${keys(data).join(", ")}, created_at)
      VALUES (${JSON.stringify(toArray(data)).slice(1, -1)}, ${Date.now()})
    `);
  }
}
