import { UPDATE_MEMBERS, UPDATE_MEMBER } from "./mutation-types";

export default {
  [UPDATE_MEMBERS](state, members) {
    state.members = members;
  },
  [UPDATE_MEMBER](state, member) {
    state.member = member;
  }
};
