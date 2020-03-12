<template>
  <v-container>
    <v-data-table
      :headers="headers"
      hide-default-footer
      :items="members"
      sort-by="name"
      sort-desc
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>實驗室成員</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >新增成員</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="年級 - 姓名"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedItem.uid"
                        label="UID"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn color="blue darken-1" text @click="save">儲存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Members",
  data: () => ({
    dialog: false,
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
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "  新增成員" : "編輯成員";
    },
    ...mapState("member", ["members"])
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.getMembers();
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
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      confirm("你確定要刪除這個項目嗎？") && this.destroyMember(item.uid);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
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
};
</script>
