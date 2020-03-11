import Model from "./Model";

export default class extends Model {
  constructor() {
    super("members");
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS members (
        uid         CHAR(11)  NOT NULL,
        name        TEXT      NOT NULL,
        created_at  DATETIME  NOT NULL
      )`);
    });
  }
}
