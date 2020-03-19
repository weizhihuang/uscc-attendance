import Model from "./Model";

export default class extends Model {
  constructor() {
    super("members");
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS members (
        uid         CHAR(11)  PRIMARY KEY   NOT NULL,
        name        TEXT                    NOT NULL,
        created_at  DATETIME  NOT NULL
      )`);
    });
  }

  find(uid) {
    return this.db.asyncAll(
      `SELECT * FROM members WHERE uid = "${uid}" LIMIT 1`
    );
  }

  update({ uid, data }) {
    return this.db.asyncRun(
      `UPDATE members SET uid = "${data.uid}", name = "${data.name}" WHERE uid = "${uid}"`
    );
  }

  destroy(uid) {
    return this.db.asyncRun(`DELETE FROM members WHERE uid = "${uid}"`);
  }
}
