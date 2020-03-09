<template lang="pug">
  v-container
    v-row.text-center
      v-col
        h1.display-2.font-weight-bold ようこそ USCC Lab
    v-row.text-right
      v-col
        p.headline {{ now }}
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    timer: null,
    options: {
      dateStyle: "full",
      timeStyle: "short",
      hour12: false
    },
    now: ""
  }),
  created() {
    this.timer = setInterval(() => {
      this.now = new Date().toLocaleString(undefined, this.options);
    }, 500);
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
