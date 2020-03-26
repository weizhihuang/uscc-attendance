<template lang="pug">
  v-container
    v-data-table.hidden-print-only(
      :headers="headers"
      :items="records"
      sort-by="name"
      sort-desc
    )
      template(v-slot:item.name="{ item }") {{ item.name }}
      template(v-slot:item.inOut="{ item }") {{ `${toLocaleString(item.createdAt)} ～ ${toLocaleString(item.updatedAt)}` }}
      template(v-slot:item.time="{ item }") {{ toTimeString(item.updatedAt - item.createdAt) }}
    v-data-table.hidden-screen-only(
      dense
      :headers="headers"
      :items="records"
      sort-by="name"
      sort-desc
      hide-default-header
      hide-default-footer
      group-by="name"
      show-group
    )
      template(v-slot:group="props")
        p.mt-2.mb-0 {{ props.group }}
        v-data-table(
            :headers="props.headers"
            :items="props.items"
            hide-default-header
            hide-default-footer
        )
          template(v-slot:body="{ items }")
            tbody
              tr(v-for="item in items" :key="item.name + item.createdAt")
                td {{ `${toLocaleString(item.createdAt)} ～ ${toLocaleString(item.updatedAt)}` }}
                td {{ toTimeString(item.updatedAt - item.createdAt) }}
</template>

<script>
import { mapState, mapActions } from "vuex";
import { dateMixin } from "../mixins/dateMixin";

export default {
  name: "Records",
  mixins: [dateMixin],
  data: () => ({
    headers: [
      { text: "年級 - 姓名", value: "name" },
      { text: "進 ～ 出", value: "inOut" },
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
    toLocaleString(time) {
      return new Date(time).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        weekday: "narrow",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
  }
};
</script>
