import Model from "./Model";

export default class extends Model {
  constructor() {
    super("records");
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS ${this.table} (
        id          INTEGER   PRIMARY KEY   AUTOINCREMENT,
        uid         CHAR(11)                NOT NULL,
        created_at  DATETIME,
        updated_at  DATETIME
      )`);
    });
  }

  index(dates) {
    const timezoneOffset = new Date().getTimezoneOffset() * 6e4;
    dates = dates.sort();
    dates = [
      +new Date(dates[0]) + timezoneOffset,
      +new Date(dates[1] || dates[0]) + timezoneOffset + 86399999
    ];

    return this.db.asyncAll(`
      SELECT name, records.created_at, records.updated_at
      FROM records
      JOIN members
      ON records.uid  = members.uid
      WHERE records.created_at BETWEEN ${dates[0]} AND ${dates[1]}
    `);
  }

  async checkOut({ uid, force }) {
    const latest = await this.getLatest(uid);
    if (latest && !force) {
      const { id, created_at: createdAt, updated_at: updatedAt } = latest;
      if (createdAt === updatedAt) return this.update({ id });
    }

    await this.create({ uid });
    const { id } = await this.getLatest(uid);
    return this.update({ id });
  }

  async getLatest(uid) {
    return (
      await this.db.asyncAll(
        `SELECT * FROM records WHERE uid = "${uid}" ORDER BY updated_at DESC LIMIT 1`
      )
    )[0];
  }
}
