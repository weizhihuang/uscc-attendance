<template lang="pug">
v-container
  v-simple-table.elevation-1(fixed-header, height="48vh")
    template(v-slot:top)
      v-toolbar(flat)
        v-toolbar-title 實驗室成員
        v-divider.mx-4(inset, vertical)
        v-spacer
        v-dialog(v-model="dialog", max-width="500px")
          template(v-slot:activator="{ on }")
            v-btn.mb-2(color="primary", dark, v-on="on") 新增成員
          v-card
            v-card-title
              span.headline {{ formTitle }}

            v-card-text
              v-form(v-model="valid", ref="form")
                v-container
                  v-row
                    v-col(cols="6")
                      v-text-field(
                        v-model.trim="editedItem.name",
                        autofocus,
                        label="年級 - 姓名",
                        hint="格式：年級-姓名",
                        :rules="[rules.required, rules.name]",
                        @keyup.enter="save"
                      )
                    v-col(cols="6")
                      v-text-field(
                        v-model="editedItem.uid",
                        label="UID",
                        hint="格式：HH HH HH HH",
                        :rules="[rules.required, rules.uid.format, rules.uid.unique]",
                        @keyup.enter="save"
                      )

            v-card-actions
              v-spacer
              v-btn(color="blue darken-1", text, @click="close") 取消
              v-btn(color="blue darken-1", text, @click="save") 儲存
    template(v-slot:default)
      thead
        tr
          th 年級 - 姓名
          th UID
          th 操作
      tbody
        tr(v-for="item in sortedMembers", :key="item.uid")
          td {{ item.name }}
          td {{ item.uid }}
          td
            v-icon.mr-2(small, @click="editItem(item)") mdi-pencil
            v-icon(small, @click="deleteItem(item.uid)") mdi-delete
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";
import { sortMixin } from "../mixins/sortMixin";
import { find } from "lodash";

export default {
  name: "Members",
  mixins: [sortMixin],
  data: () => ({
    dialog: false,
    valid: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      uid: ""
    },
    defaultItem: {
      name: "",
      uid: ""
    },
    rules: {
      required: value => !!value || "這是必填欄",
      name: value => /\S-\S/.test(value) || "格式：年級-姓名",
      uid: {
        format: value =>
          /^([0-9A-F]{2} {1}){3}[0-9A-F]{2}$/i.test(value) ||
          "格式：HH HH HH HH"
      }
    }
  }),
  computed: {
    ...mapState("member", ["members"]),
    sortedMembers() {
      return this.customOrderBy(this.members, "name", "desc");
    },
    formTitle: ({ editedIndex }) =>
      editedIndex === -1 ? "新增成員" : "編輯成員"
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    "editedItem.uid"(val) {
      this.editedItem.uid = val.toUpperCase();
    },
    "editedItem.name"(val) {
      this.editedItem.name = val.replace(" - ", "-");
    }
  },
  created() {
    this.rules.uid.unique = uid =>
      !find(this.members, { uid }) ||
      { ...this.members[this.editedIndex] }.uid === uid ||
      "該UID已被登錄";

    this.getMembers();
  },
  mounted() {
    ipcRenderer.on("uid", (_, uid) => {
      if (this.dialog) {
        this.editedItem.uid = uid;
      } else {
        if (find(this.members, { uid }))
          this.$router.push({ path: "/", query: { uid } });
        else {
          this.editedItem.uid = uid;
          this.dialog = true;
        }
      }
    });

    const { uid } = this.$route.query;
    if (uid) {
      this.editedItem.uid = uid;
      this.dialog = true;
    }
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners("uid");
  },
  methods: {
    ...mapActions("member", [
      "getMembers",
      "storeMember",
      "updateMember",
      "destroyMember"
    ]),
    editItem(item) {
      this.editedIndex = this.members.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
    deleteItem(uid) {
      confirm("你確定要刪除這個項目嗎？") && this.destroyMember(uid);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = { ...this.defaultItem };
        this.$refs.form.resetValidation();
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.valid) {
        this.editedItem.name = this.editedItem.name.replace("-", " - ");
        if (this.editedIndex > -1) {
          this.updateMember({
            uid: this.members[this.editedIndex].uid,
            data: this.editedItem
          });
        } else {
          this.storeMember(this.editedItem);
        }
        this.close();
      }
    }
  }
};
</script>
