import { UPDATE_MEMBERS, UPDATE_MEMBER } from "./mutation-types";
import { ipcRenderer } from "electron";

export const getMembers = ({ commit }) => {
  const members = ipcRenderer.sendSync("db", {
    model: "member",
    action: "index"
  });
  commit(UPDATE_MEMBERS, members);
};

export const getMember = ({ commit }, uid) => {
  const member = ipcRenderer.sendSync("db", {
    model: "member",
    action: "find",
    data: { uid }
  });
  commit(UPDATE_MEMBER, member);
};

export const storeMember = ({ dispatch }, data) => {
  ipcRenderer.sendSync("db", { model: "member", action: "store", data });
  dispatch("getMembers");
};

export const updateMember = ({ dispatch }, data) => {
  ipcRenderer.sendSync("db", { model: "member", action: "update", data });
  dispatch("getMembers");
};

export const destroyMember = ({ dispatch }, uid) => {
  ipcRenderer.sendSync("db", { model: "member", action: "destroy", data: uid });
  dispatch("getMembers");
};