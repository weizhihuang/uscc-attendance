<template lang="pug">
  v-container
    v-row.text-center
      v-col
        h1.display-2.font-weight-bold ようこそ USCC Lab
    v-row.text-right
      v-col
        p.headline {{ timeString }}
    v-row(justify="center")
      v-dialog(v-model="dialog")
        v-card
          v-card-title.headline {{ {...member}.name }}
          //- v-card-text.text-center.headline
          v-card-actions
            v-btn(color="green darken-1" text @click="checkIn(member.uid); dialog = false") (1) Check in {{ latestInOut ? `(${countdown}s)` : "" }}
            v-spacer
            v-btn(color="green darken-1" text @click="checkOut(member.uid); dialog = false") (9) Check out {{ latestInOut ? "" : `(${countdown}s)` }}
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  data: () => ({
    timer: null,
    time: new Date(),
    dialog: false,
    countdown: -1
  }),
  computed: {
    ...mapState("member", ["member"]),
    ...mapGetters("record", ["latestInOut"]),
    timeString() {
      return new Date(this.time).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        dateStyle: "full",
        timeStyle: "short",
        hour12: false
      });
    }
  },
  watch: {
    member() {
      this.dialog = true;
    },
    dialog(val) {
      if (val) {
        window.addEventListener("keyup", this.handleKeyUp);
        this.countdown = 5;
      } else {
        window.removeEventListener("keyup", this.handleKeyUp);
      }
    },
    countdown(val) {
      if (val > 0) {
        setTimeout(() => this.countdown--, 1e3);
      } else {
        if (!val) {
          this.latestInOut
            ? this.checkIn(this.member.uid)
            : this.checkOut(this.member.uid);
        }
        this.dialog = false;
      }
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.time = new Date();
    }, 500);
    ipcRenderer.on("uid", (_event, uid) => {
      if (this.dialog) {
        //
      } else {
        this.getMember(uid);
        this.getLatestRecord(uid);
      }
    });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions("member", ["getMember"]),
    ...mapActions("record", ["getLatestRecord", "checkIn", "checkOut"]),
    handleKeyUp() {
      switch (event.keyCode) {
        case 49:
          this.checkIn(this.member.uid);
          break;
        case 57:
          this.checkOut(this.member.uid);
          break;
        default:
          break;
      }
      this.countdown = -1;
    }
  }
};
</script>
