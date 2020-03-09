<template lang="pug">
  v-app
    v-navigation-drawer(v-model="drawer" app)
      v-list(dense)
        v-list-item(link)
          v-list-item-action
            v-icon mdi-home
          v-list-item-content
            v-list-item-title 首頁
    
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click.stop="drawer = !darwer")
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
