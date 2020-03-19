import { UPDATE_RECORDS } from "./mutation-types";
import { ipcRenderer } from "electron";

export const getRecords = ({ commit }) => {
  const records = ipcRenderer.sendSync("db", {
    model: "record",
    action: "index"
  });
  commit(UPDATE_RECORDS, records);
};

export const checkIn = ({ dispatch }, uid) => {
  ipcRenderer.sendSync("db", {
    model: "record",
    action: "create",
    data: {
      uid,
      in_out: 0
    }
  });
  dispatch("getRecords");
};

export const checkOut = ({ dispatch }, uid) => {
  ipcRenderer.sendSync("db", {
    model: "record",
    action: "create",
    data: {
      uid,
      in_out: 1
    }
  });
  dispatch("getRecords");
};
