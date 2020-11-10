import { UPDATE_RECORDS } from "./mutation-types";
import { ipcRenderer } from "electron";
import { map } from "lodash";

export const getRecords = ({ commit }, dates) => {
  const records = ipcRenderer.sendSync("db", {
    model: "record",
    action: "index",
    data: dates
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
    action: "getLatest",
    data: uid
  });

  if (record) {
    const { created_at: createdAt, updated_at: updatedAt } = record;
    return { uid, createdAt, updatedAt };
  }
  return null;
};

export const checkIn = (_, uid) => {
  ipcRenderer.sendSync("db", {
    model: "record",
    action: "create",
    data: { uid }
  });
};

export const checkOut = (_, uid, force = false) => {
  ipcRenderer.sendSync("db", {
    model: "record",
    action: "checkOut",
    data: { uid, force }
  });
};
