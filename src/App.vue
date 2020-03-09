<template lang="pug">
  v-app
    v-navigation-drawer(v-model="drawer" app)
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
        v-list-item(to="record")
          v-list-item-action
            v-icon mdi-calendar-clock
          v-list-item-content
            v-list-item-title 出席記錄
    
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
      v-toolbar-title USCC打卡系統

    v-content
      v-container.fill-height(fluid)
        router-view
</template>

<script>
export default {
  name: "App",
  data: () => ({ drawer: false })
};
</script>
