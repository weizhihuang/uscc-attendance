import Model from "./Model";

export default class extends Model {
  constructor() {
    super("members");
    this.primaryKey = "uid";
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS ${this.table} (
        uid         CHAR(11)  PRIMARY KEY   NOT NULL,
        name        TEXT                    NOT NULL,
        created_at  DATETIME,
        updated_at  DATETIME
      )`);
    });
  }
}
