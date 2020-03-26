import { UPDATE_MEMBERS } from "./mutation-types";

export default {
  [UPDATE_MEMBERS](state, members) {
    state.members = members;
  }
};
