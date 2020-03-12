import * as actions from "./actions";
import mutations from "./mutations";

export const member = {
  namespaced: true,
  state: {
    members: [],
    member: null
  },
  actions,
  mutations
};
