<template lang="pug">
v-app
  v-navigation-drawer(v-model="drawer", app)
    v-list(dense)
      v-list-item(to="home")
        v-list-item-action
          v-icon mdi-home
        v-list-item-content
          v-list-item-title 首頁
      v-list-item(to="members")
        v-list-item-action
          v-icon mdi-account
        v-list-item-content
          v-list-item-title 實驗室成員
      v-list-item(to="records")
        v-list-item-action
          v-icon mdi-calendar-clock
        v-list-item-content
          v-list-item-title 出席記錄
      v-list-item(to="statistics")
        v-list-item-action
          v-icon mdi-chart-bar
        v-list-item-content
          v-list-item-title 時數統計

  v-app-bar.hidden-print-only(app, color="primary", dark)
    v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    v-toolbar-title
      | USCC打卡系統
      span.subtitle-1.blue-grey--text.text--lighten-4 v{{ version }}

  v-content
    v-container.fill-height(fluid)
      router-view(:closeDrawer="() => (drawer = false)")

  v-footer(
    absolute,
    padless,
    v-show="['Home', 'Members'].includes($route.name)"
  )
    v-col.text-center
      p.headline 讀卡機：
        span.green--text(v-if="readers.length") {{ readers.join(', ') }}
        span(v-else)
          span.red--text 未連接
          v-btn.mb-1.ml-2(outlined, small, color="warning", @click="reinitNFC") 重啟服務
</template>

<script>
import { remote, ipcRenderer } from "electron";
export default {
  name: "App",
  data: () => ({
    version: remote.app.getVersion(),
    drawer: false,
    readers: ipcRenderer.sendSync("readers"),
    timer: null
  }),
  created() {
    this.timer = setInterval(() => {
      this.readers = ipcRenderer.sendSync("readers");
    }, 3e3);
  },
  mounted() {
    ipcRenderer.on("uid", this.listener);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    ipcRenderer.removeListener("uid", this.listener);
  },
  methods: {
    listener(_, uid) {
      this.drawer = false;
      if (!["Home", "Members"].includes(this.$route.name))
        this.$router.push({ path: "/", query: { uid } });
    },
    reinitNFC: () => ipcRenderer.send("reinitNFC")
  }
};
</script>

<style lang="sass">
::-webkit-scrollbar
  display: none

@media print
  .v-content
    padding: 0 !important
    .container
      height: auto !important
      padding: 0 !important
</style>
