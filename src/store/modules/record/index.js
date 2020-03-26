import mutations from "./mutations";
import * as actions from "./actions";

export const record = {
  namespaced: true,
  state: {
    records: []
  },
  mutations,
  actions
};
