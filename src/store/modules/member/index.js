import mutations from "./mutations";
import * as actions from "./actions";
import { orderBy } from "lodash";

export const member = {
  namespaced: true,
  state: {
    members: []
  },
  mutations,
  actions,
  getters: {
    sortedMembers: ({ members }) => orderBy(members, ["name"], ["desc"])
  }
};
