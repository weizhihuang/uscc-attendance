<template lang="pug">
  v-container
    v-card
      v-card-title 出席記錄
        v-spacer
        v-text-field(
          v-model="search"
          append-icon="mdi-magnify"
          label="搜尋"
          single-line
          hide-details
        )
      v-data-table.hidden-print-only(
        :headers="headers"
        :items="records"
        :items-per-page="5"
        :search="search"
      )
        template(v-slot:item.name="{ item }") {{ item.name }}
        template(v-slot:item.in="{ item }") {{ toLocaleString(item.createdAt) }}
        template(v-slot:item.out="{ item }") {{ toLocaleString(item.updatedAt) }}
        template(v-slot:item.time="{ item }") {{ toTimeString(item.updatedAt - item.createdAt) }}

    v-data-table.hidden-screen-only(
      dense
      :headers="headers"
      :items="records"
      :items-per-page="-1"
      sort-by="name"
      hide-default-header
      hide-default-footer
      group-by="name"
      show-group
    )
      template(v-slot:group="props")
        v-row.mt-2.mr-0
          v-col
            p.mb-0 {{ props.group }}
          v-col
            p.mb-0.text-right {{ toTimeString(totalTime(props.items)) }}
        v-data-table(:items="props.items" :items-per-page="-1" hide-default-footer)
          template(v-slot:body="{ items }")
            tbody
              tr(v-for="item in items" :key="item.name + item.createdAt")
                td {{ `${toLocaleString(item.createdAt)} ~ ${toLocaleString(item.updatedAt, sameDay(item.createdAt, item.updatedAt))}` }}
                td {{ toTimeString(item.updatedAt - item.createdAt) }}
</template>

<script>
import { mapState, mapActions } from "vuex";
import { dateMixin } from "../mixins/dateMixin";
import { reduce } from "lodash";

export default {
  name: "Records",
  mixins: [dateMixin],
  data: () => ({
    search: "",
    headers: [
      { text: "年級 - 姓名", value: "name" },
      { text: "進", value: "in" },
      { text: "出", value: "out" },
      { text: "時間", value: "time" }
    ]
  }),
  computed: {
    ...mapState("record", ["records"])
  },
  created() {
    this.getRecords();
  },
  methods: {
    ...mapActions("record", ["getRecords"]),
    toLocaleString(time, short) {
      const date = short
        ? {}
        : {
            weekday: "narrow",
            month: "2-digit",
            day: "2-digit"
          };
      return new Date(time).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        ...date,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    },
    sameDay(d1, d2) {
      d1 = new Date(d1);
      d2 = new Date(d2);
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },
    totalTime(records) {
      return reduce(
        records,
        (total, { createdAt, updatedAt }) => {
          return total + updatedAt - createdAt;
        },
        0
      );
    }
  }
};
</script>
