import { UPDATE_RECORDS } from "./mutation-types";
import { ipcRenderer } from "electron";
import { map } from "lodash";

export const getRecords = ({ commit }) => {
  const records = ipcRenderer.sendSync("db", {
    model: "record",
    action: "index"
  });
  commit(
    UPDATE_RECORDS,
    map(records, ({ name, created_at: createdAt, updated_at: updatedAt }) => ({
      name,
      createdAt,
      updatedAt
    }))
  );
};

export const getLatestRecord = (_, uid) => {
  const record = ipcRenderer.sendSync("db", {
    model: "record",
    action: "latest",
    data: uid
  })[0];
  return record
    ? {
        ...record,
        createdAt: record.created_at,
        updatedAt: record.updated_at
      }
    : null;
};

export const checkIn = ({ dispatch }, uid) => {
  ipcRenderer.sendSync("db", {
    model: "record",
    action: "checkIn",
    data: uid
  });
  dispatch("getRecords");
};

export const checkOut = ({ dispatch }, uid) => {
  ipcRenderer.sendSync("db", {
    model: "record",
    action: "checkOut",
    data: uid
  });
  dispatch("getRecords");
};
