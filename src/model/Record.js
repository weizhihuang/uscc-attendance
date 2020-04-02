import Model from "./Model";

export default class extends Model {
  constructor() {
    super("records");
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS records (
        uid         CHAR(11)  NOT NULL,
        created_at  DATETIME  NOT NULL,
        updated_at  DATETIME  NOT NULL
      )`);
    });
  }

  index(dates) {
    const timezoneOffset = new Date().getTimezoneOffset() * 6e4;
    dates = [
      Date.parse(`${dates[0]}`) + timezoneOffset,
      Date.parse(`${dates[1] || dates[0]}`) + timezoneOffset + 86399999
    ];

    return this.db.asyncAll(`
      SELECT name, records.created_at, records.updated_at
      FROM records
      JOIN members
      ON records.uid  = members.uid
      WHERE records.created_at BETWEEN ${dates[0]} AND ${dates[1]}
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
    const latestRecord = (await this.latest(uid))[0];
    const now = Date.now();

    if (latestRecord) {
      const { created_at: createdAt, updated_at: updatedAt } = latestRecord;
      if (createdAt === updatedAt) {
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
  }

  latest(uid) {
    return this.db.asyncAll(
      uid
        ? `SELECT * FROM records WHERE uid = "${uid}" ORDER BY updated_at DESC LIMIT 1`
        : "SELECT * FROM records ORDER BY updated_at DESC LIMIT 1"
    );
  }
}
