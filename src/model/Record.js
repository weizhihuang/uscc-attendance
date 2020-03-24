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

  index() {
    return this.db.asyncAll(`
      SELECT name, in_out, records.created_at
      FROM records
      JOIN members
      ON records.uid  = members.uid
    `);
  }

  latest(uid) {
    return this.db.asyncAll(
      uid
        ? `SELECT * FROM records WHERE uid = "${uid}" ORDER BY created_at DESC LIMIT 1`
        : "SELECT * FROM records ORDER BY created_at DESC LIMIT 1"
    );
  }
}
