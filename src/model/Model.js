import sqlite3 from "sqlite3";
import { keys, toArray } from "lodash";

export default class {
  constructor(table) {
    this.db = new sqlite3.Database("attendance.db");
    this.table = table;
  }

  create(data) {
    this.db.serialize(() => {
      this.db.run(`INSERT INTO ${this.table} (${keys(data).join(
        ", "
      )}, created_at)
        VALUES (${JSON.stringify(toArray(data)).slice(1, -1)}, ${Date.now()})`);
    });
  }
}
