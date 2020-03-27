<template>
  <div>
    <!-- TODO : Container Header -->
    <q-toolbar class="column bg-primary-500 shadow-1">
      <div class="q-pt-md full-width q-pa-xs" align="right">
        <q-btn @click="logout()" flat>
          <span class="font-body color-white">{{ $t('signout') }}</span>
        </q-btn>
      </div>
      <div class="q-mb-sm full-width color-white">
        <span class="font-h2">สมชาย มากบุตร</span>
        <br />
        <span class="font-body">
          <span class="font-body color-white">{{ $t('dateOfBirth') }}</span>
        </span>
        xx/xx/xx
      </div>
    </q-toolbar>

    <!-- TODO : Container Body -->
    <div class="q-py-md" align="center">
      <!-- TODO : Schedule Content -->
      <div class="q-mb-lg">
        <div class="q-mt-md">
          <span class="font-h3">12 มีนาคม 2562</span>
        </div>
        <div class="q-my-sm">
          <span class="font-body">{{$t('schHeader')}}</span>
        </div>
      </div>

      <div class="q-mt-lg" align="left" style="max-width:350px;width:90%;">
        <q-btn
          no-caps
          :outline="item.start && !item.success ? true : null"
          :color="item.start && !item.success ? 'teal' : null"
          :flat="!item.start ? true : null"
          dense
          :class="item.start && !item.success ? 'bg-white' : null"
          class="font-body full-width q-pa-xs no-pointer-events"
          v-for="(item, index) in scheduleList"
          :key="index"
          style="padding-bottom:8px"
        >
          <div class="col-1 q-px-sm" style="width:70px;" align="left">
            <span class="color-black">{{ item.time }}</span>
          </div>
          <div class="col q-px-sm" align="left">
            <q-icon
              name="query_builder"
              v-if="item.start"
              style="margin-right:3px;margin-left:-3px"
            ></q-icon>
            <span
              :class="
                item.success
                  ? 'color-black'
                  : item.start && !item.success
                  ? ''
                  : 'color-light-gray'
              "
            >
              <span>
                <span>{{ !item.success ? $t('schWaitForCheck') : $t('schChecked') }}</span>
              </span>
            </span>
          </div>
        </q-btn>
      </div>

      <div class="q-mt-xl">
        <q-btn class="button-action" dense to="/temperature" :label="$t('schBtn')"></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: "",
      scheduleList: [
        {
          time: "02:00",
          start: false,
          success: true
        },
        {
          time: "06:00",
          start: true,
          success: false
        },
        {
          time: "10:00",
          start: false,
          success: false
        },
        {
          time: "14:00",
          start: false,
          success: false
        },
        {
          time: "18:00",
          start: false,
          success: false
        },
        {
          time: "22:00",
          start: false,
          success: false
        }
      ]
    };
  },
  methods: {
    logout() {
      this.$q
        .dialog({
          title: this.$t("logoutTitle"),
          message: "",
          ok: { color: "orange-5", textColor: "black" },
          cancel: { textColor: "black", flat: true }
        })
        .onOk(() => {
          this.$q.localStorage.clear();
          this.$router.push("/");
        });
    }
  },
  computed: {
    checkTime() {
      let getTime = new Date().getTime();
    }
  },
  mounted() {
    setInterval(() => {
      let hours = new Date().getHours();
      let minutes = new Date().getMinutes();
      let seconds = new Date().getSeconds();

      hours = hours > 9 ? hours : "0" + hours;
      minutes = minutes > 9 ? minutes : "0" + minutes;

      this.currentTime = hours + ":" + minutes;
    }, 1000);

    this.$q.localStorage.set("isForward", true);
    this.$q.localStorage.set("isBack", false);
    window.onpopstate = function(event) {
      console.log(
        "location: " +
          document.location +
          ", state: " +
          JSON.stringify(event.state)
      );

      console.log("ต้องการออกจากระบบใช่หรือไม่ ?");
    };
    this.$q.localStorage.remove("temperature");
    this.$q.localStorage.remove("oxygen");
    this.$q.localStorage.remove("symptoms");
    this.$q.localStorage.remove("heartRate");
    this.$q.localStorage.remove("diastolic");
    this.$q.localStorage.remove("systolic");
    this.$q.localStorage.remove("symptomsCheck");
  }
};
</script>

<style lang="scss" scoped></style>
