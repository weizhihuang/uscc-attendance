export const dateMixin = {
  methods: {
    toTimeString(t) {
      t /= 60000;
      const d = ~~(t / 1440);
      t %= 1440;
      const h = ~~(t / 60);
      const m = ~~(t % 60);
      return `${d ? d + " 天" : ""} ${h} 時 ${m} 分`;
    }
  }
};
