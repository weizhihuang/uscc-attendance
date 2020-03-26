<template lang="pug">
  v-container
    v-data-table.elevation-1(
      :headers="headers"
      hide-default-footer
      :items="members"
      sort-by="name"
      sort-desc
    )
      template(v-slot:top)
        v-toolbar(flat)
          v-toolbar-title 實驗室成員
          v-divider.mx-4(inset vertical)
          v-spacer
          v-dialog(v-model="dialog" max-width="500px")
            template(v-slot:activator="{ on }")
              v-btn.mb-2(color="primary" dark v-on="on") 新增成員
            v-card
              v-card-title
                span.headline {{ formTitle }}

              v-card-text
                v-form(v-model="valid" ref="form")
                  v-container
                    v-row
                      v-col(cols="6")
                        v-text-field(
                          v-model.trim="editedItem.name"
                          autofocus
                          label="年級 - 姓名"
                          hint="格式：年級-姓名"
                          :rules="[rules.required, rules.name]"
                          @keyup.enter="save"
                        )
                      v-col(cols="6")
                        v-text-field(
                          v-model="editedItem.uid"
                          label="UID"
                          hint="格式：HH HH HH HH"
                          :rules="[\
                            rules.required,\
                            rules.uid,\
                            !_find(members, ['uid', editedItem.uid]) ||\
                            { ...members[editedIndex] }.uid ===\
                            editedItem.uid ||\
                            '該UID已被登錄'\
                          ]"
                          @keyup.enter="save"
                        )

              v-card-actions
                v-spacer
                v-btn(color="blue darken-1" text @click="close") 取消
                v-btn(color="blue darken-1" text @click="save") 儲存
      template(v-slot:item.name="{ item }") {{ item.name.replace("-", " - ") }}
      template(v-slot:item.action="{ item }")
        v-icon.mr-2(small @click="editItem(item)") mdi-pencil
        v-icon(small @click="deleteItem(item)") mdi-delete
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";
import { find } from "lodash";

export default {
  name: "Members",
  data: () => ({
    dialog: false,
    valid: false,
    headers: [
      { text: "年級 - 姓名", value: "name" },
      { text: "UID", value: "uid" },
      { text: "操作", value: "action", sortable: false }
    ],
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
      uid: value =>
        /^([0-9A-F]{2} {1}){3}[0-9A-F]{2}$/i.test(value) || "格式：HH HH HH HH"
    }
  }),
  computed: {
    ...mapState("member", ["members"]),
    formTitle() {
      return this.editedIndex === -1 ? "新增成員" : "編輯成員";
    },
    _find() {
      return find;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    "editedItem.uid"(val) {
      this.editedItem.uid = val.toUpperCase();
    }
  },
  created() {
    this.getMembers();
  },
  mounted() {
    ipcRenderer.on("uid", (_event, uid) => {
      if (this.dialog) {
        this.editedItem.uid = uid;
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
    deleteItem(item) {
      confirm("你確定要刪除這個項目嗎？") && this.destroyMember(item.uid);
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
