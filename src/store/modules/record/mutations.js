import { UPDATE_RECORDS, UPDATE_RECORD } from "./mutation-types";

export default {
  [UPDATE_RECORDS](state, records) {
    state.records = records;
  },
  [UPDATE_RECORD](state, record) {
    state.record = record;
  }
};
