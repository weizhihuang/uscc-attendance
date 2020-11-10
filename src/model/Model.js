import sqlite3 from "sqlite3";
import { keys, toArray, map } from "lodash";

export default class {
  constructor(table) {
    this.db = new sqlite3.Database("attendance.db");
    this.db.asyncAll = (query, params) =>
      new Promise((resolve, reject) =>
        this.db.serialize(() =>
          this.db.all(query, params, (error, rows) =>
            error ? reject(error) : resolve(rows)
          )
        )
      );
    this.db.asyncRun = (query, params) =>
      new Promise((resolve, reject) =>
        this.db.serialize(() =>
          this.db.run(query, params, error =>
            error ? reject(error) : resolve()
          )
        )
      );
    this.table = table;
    this.primaryKey = "id";
  }

  index() {
    return this.db.asyncAll(`SELECT * FROM ${this.table}`);
  }

  create(data) {
    data["created_at"] = data["updated_at"] = Date.now();
    return this.db.asyncRun(`
      INSERT INTO ${this.table} (${keys(data).join(",")})
      VALUES (${JSON.stringify(toArray(data)).slice(1, -1)})
    `);
  }

  async find(id) {
    return (
      await this.db.asyncAll(
        `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = "${id}" LIMIT 1`
      )
    )[0];
  }

  update({ [this.primaryKey]: id, data = {} }) {
    data["updated_at"] = Date.now();
    return this.db.asyncRun(`
      UPDATE ${this.table}
      SET ${map(data, (val, i) => `${i} = "${val}"`).join(",")}
      WHERE ${this.primaryKey} = "${id}"
    `);
  }

  destroy(id) {
    return this.db.asyncRun(
      `DELETE FROM ${this.table} WHERE ${this.primaryKey} = "${id}"`
    );
  }
}
