<template lang="pug">
v-container
  v-row(dense)
    v-col(cols="2")
      h2 時數統計
    v-col(cols="3")
      v-menu(
        v-model="menu",
        :close-on-content-click="false",
        :nudge-right="40",
        transition="scale-transition",
        offset-x,
        min-width="290px"
      )
        template(v-slot:activator="{ on, attrs }")
          v-text-field(
            v-model="date",
            prefix="從：",
            readonly,
            dense,
            v-bind="attrs",
            v-on="on"
          )
        v-date-picker(v-model="date", locale="zh-TW", @input="menu = false")
  .chart(ref="chart")
</template>

<script>
import { mapState, mapActions } from "vuex";
import { dateMixin } from "../mixins/dateMixin";
import { newPlot } from "plotly.js-dist";
import { groupBy, keys, map, mean } from "lodash";

export default {
  name: "Statistics",
  mixins: [dateMixin],
  data: () => ({
    menu: false,
    date: null
  }),
  computed: {
    ...mapState("record", ["records"]),
    groupedRecords: ({ records }) => groupBy(records, "name"),
    groupedTotalTime: ({ groupedRecords, totalTime }) =>
      map(groupedRecords, records => ~~(totalTime(records) / 36e5)),
    barTexts: ({ groupedTotalTime }) =>
      map(groupedTotalTime, time => {
        const diff = Math.round(time - mean(map(groupedTotalTime)));
        return diff
          ? diff > 0
            ? `${diff} hour(s) above the mean`
            : `${-diff} hour(s) below the mean`
          : "close to the mean";
      })
  },
  watch: {
    date(date) {
      this.getRecords([date, new Date().toISOString().substr(0, 10)]);
      localStorage.date = date;
    },
    groupedRecords() {
      newPlot(
        this.$refs.chart,
        [
          {
            x: map(keys(this.groupedRecords), key => key.split("- ")[1]),
            y: this.groupedTotalTime,
            type: "bar",
            text: this.barTexts
          }
        ],
        null,
        { displayModeBar: false }
      );
    }
  },
  mounted() {
    this.date =
      localStorage.date ||
      new Date(Date.now() - 6048e5).toISOString().substr(0, 10);
  },
  methods: {
    ...mapActions("record", ["getRecords"])
  }
};
</script>

<style lang="sass" scoped>
.chart
  margin-top: -10px
</style>
