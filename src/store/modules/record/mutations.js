import { UPDATE_RECORDS } from "./mutation-types";

export default {
  [UPDATE_RECORDS](state, records) {
    state.records = records;
  }
};
