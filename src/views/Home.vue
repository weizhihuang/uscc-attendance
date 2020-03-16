<template lang="pug">
  v-container
    v-row.text-center
      v-col
        h1.display-2.font-weight-bold ようこそ USCC Lab
    v-row.text-right
      v-col
        p.headline {{ time }}
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    timer: null,
    time: ""
  }),
  created() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 500);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    updateTime() {
      this.time = new Date().toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        dateStyle: "full",
        timeStyle: "short",
        hour12: false
      });
    }
  }
};
</script>
