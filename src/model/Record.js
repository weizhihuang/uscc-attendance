import Model from "./Model";

export default class extends Model {
  constructor() {
    super("records");
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS records (
        uid         CHAR(11)  NOT NULL,
        created_at  DATETIME  NOT NULL,
        updated_at DATETIME  NOT NULL
      )`);
    });
  }

  index() {
    return this.db.asyncAll(`
      SELECT name, records.created_at, records.updated_at
      FROM records
      JOIN members
      ON records.uid  = members.uid
    `);
  }

  checkIn(uid) {
    const now = Date.now();
    return this.db.asyncRun(`
      INSERT INTO records
      VALUES ("${uid}", ${now}, ${now})
    `);
  }

  async checkOut(uid) {
    try {
      const latestRecord = (await this.latest(uid))[0];
      const now = Date.now();

      if (latestRecord) {
        const { created_at: createdAt, updated_at: updatedAt } = latestRecord;
        if (createdAt === updatedAt) {
          console.log(`
          UPDATE records
          SET updated_at = ${now}
          WHERE uid = "${uid}" AND created_at = ${createdAt}`);
          return this.db.asyncRun(`
            UPDATE records
            SET updated_at = ${now}
            WHERE uid = "${uid}" AND created_at = ${createdAt}`);
        }
      }

      return this.db.asyncRun(`
        INSERT INTO records
        VALUES ("${uid}", ${now}, ${now + 1})
      `);
    } catch (error) {
      console.error(error);
    }
  }

  latest(uid) {
    return this.db.asyncAll(
      uid
        ? `SELECT * FROM records WHERE uid = "${uid}" ORDER BY updated_at DESC LIMIT 1`
        : "SELECT * FROM records ORDER BY updated_at DESC LIMIT 1"
    );
  }
}
