<template lang="pug">
  v-container
    v-data-table(
      :headers="headers"
      :items="records"
      hide-default-footer
    )
      template(v-slot:item.name="{ item }") {{ item.name.replace("-", " - ") }}
      template(v-slot:item.inOut="{ item }") {{ item.inOut ? "出" : "進" }}
      template(v-slot:item.createdAt="{ item }") {{ toLocaleString(item.createdAt) }}
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Records",
  data: () => ({
    headers: [
      { text: "年級 - 姓名", value: "name" },
      { text: "進／出", value: "inOut" },
      { text: "時間", value: "createdAt" }
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
