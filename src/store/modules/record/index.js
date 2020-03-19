import mutations from "./mutations";
import * as actions from "./actions";

export const record = {
  namespaced: true,
  state: {
    records: [],
    record: null
  },
  getters: {
    latestInOut: ({ record }) => (record ? !!record.in_out : true) // Check in: false
  },
  mutations,
  actions
};
