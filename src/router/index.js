import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Members from "../views/Members.vue";
import Records from "../views/Records.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    alias: "/home"
  },
  {
    path: "/members",
    name: "Members",
    component: Members
  },
  {
    path: "/records",
    name: "Records",
    component: Records
  }
];

const router = new VueRouter({
  routes
});

export default router;
