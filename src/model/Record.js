import Model from "./Model";

export default class extends Model {
  constructor() {
    super("records");
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS records (
        uid         CHAR(11)  NOT NULL,
        in_out      BOOLEAN   NOT NULL,
        created_at  DATETIME  NOT NULL
      )`);
    });
  }
}
