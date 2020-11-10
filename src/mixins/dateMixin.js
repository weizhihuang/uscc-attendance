import { map, reduce } from "lodash";

export const dateMixin = {
  methods: {
    isSameDay: timestamps =>
      new Set(map(timestamps, t => new Date(t).toDateString())).size === 1,
    toLocaleString: (time, short) =>
      new Date(time)
        .toLocaleString("zh-TW", {
          ...(short
            ? {}
            : { weekday: "narrow", month: "2-digit", day: "2-digit" }),
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        })
        .replace("24:", "00:"),
    toTimeString: t => {
      t /= 60000;
      return `${~~(t / 60)} 時 ${~~(t % 60)} 分`;
    },
    totalTime: records =>
      reduce(
        records,
        (total, { createdAt, updatedAt }) => total + updatedAt - createdAt,
        0
      ),
    totalDays: records =>
      new Set(
        map(records, ({ createdAt }) =>
          new Date(
            createdAt - new Date().getTimezoneOffset() * 6e4
          ).toDateString()
        )
      ).size
  }
};
