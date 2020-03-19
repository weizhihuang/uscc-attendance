import * as actions from "./actions";
import mutations from "./mutations";

export const record = {
  namespaced: true,
  state: {
    records: [],
    record: null
  },
  getters: {
    latestInOut: ({ record }) => (record ? !!record.in_out : true) // Check in: false
  },
  actions,
  mutations
};
