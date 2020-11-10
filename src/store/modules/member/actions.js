import { UPDATE_MEMBERS } from "./mutation-types";
import { ipcRenderer } from "electron";
import { map } from "lodash";

export const getMembers = ({ commit }) => {
  const members = ipcRenderer.sendSync("db", {
    model: "member",
    action: "index"
  });
  commit(
    UPDATE_MEMBERS,
    map(members, ({ uid, name }) => ({ uid, name }))
  );
};

export const getMember = (_, uid) =>
  ipcRenderer.sendSync("db", {
    model: "member",
    action: "find",
    data: uid
  });

export const storeMember = ({ dispatch }, data) => {
  ipcRenderer.sendSync("db", { model: "member", action: "create", data });
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
