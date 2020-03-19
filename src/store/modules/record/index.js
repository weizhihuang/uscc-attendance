import * as actions from "./actions";
import mutations from "./mutations";

export const record = {
  namespaced: true,
  state: {
    records: []
  },
  actions,
  mutations
};
