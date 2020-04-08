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
        <span class="font-h2">{{ patientData.name }} {{ patientData.surname }}</span>
        <br />
        <span class="font-body">
          <span class="font-body color-white">{{ $t('dateOfBirth') }}</span>
        </span>
        {{ patientData.dateOfBirth }}
      </div>
    </q-toolbar>

    <!-- TODO : Container Body -->
    <div class="q-py-md" align="center">
      <!-- TODO : Schedule Content -->
      <div class="q-mb-lg">
        <div class="q-mt-md">
          <span
            class="font-h3"
          >{{ currentDate.date }} {{ showMonthName(currentDate.month) }} {{ currentDate.year }}</span>
        </div>
        <div class="q-my-sm">
          <span class="font-body">{{$t('schHeader')}}</span>
        </div>
      </div>

      <div class="q-mt-lg" align="left" style="max-width:350px;width:90%;">
        <q-btn
          no-caps
          dense
          class="font-body full-width q-pa-xs no-pointer-events"
          v-for="(items,index) in scheduleList"
          :key="index"
          :outline="items.range.includes(currentTime) && !patientLogData.includes(items.round) ? true : false"
          :color="items.range.includes(currentTime) && !patientLogData.includes(items.round) ? 'teal' : null"
          :flat="!items.range.includes(currentTime) || patientLogData.includes(items.round)   ? true : false"
        >
          <div class="col-1 q-px-sm" style="width:70px;" align="left">
            <span class="color-black">{{ items.time }}</span>
          </div>
          <div class="col q-px-sm" align="left">
            <q-icon
              v-if="items.range.includes(currentTime) && !patientLogData.includes(items.round)"
              name="query_builder"
              style="margin-right:3px;margin-left:-3px"
            ></q-icon>

            <span v-if="currentTime < 2">ยังไม่ถึงรอบตรวจ</span>
            <span v-else>
              <span
                v-if="items.range.includes(currentTime) && !patientLogData.includes(items.round)"
              >{{ $t('schWaitForCheck') }}</span>
              <span v-else-if="patientLogData.includes(items.round)">{{ $t('schChecked') }}</span>
              <span
                class="color-light-gray"
                v-else-if="currentTime > items.round"
              >{{ $t('schHavenotCheck') }}</span>
              <span class="color-light-gray" v-else>{{ $t('schWaitForCheck') }}</span>
            </span>
          </div>
        </q-btn>
      </div>
      <div class="q-mt-md">
        <q-btn
          :disable="isDisableButton"
          :class="isDisableButton ? 'disabledBtn' : 'button-action'"
          dense
          @click=" $q.localStorage.set('enableBackBtn',true),startSelfChecking()"
          :label="$t('schBtn')"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../router";
export default {
  data() {
    return {
      isDisableButton: true,
      scheduleList: [
        {
          time: "02:00",
          range: [2, 3, 4, 5],
          round: 2
        },
        {
          time: "06:00",
          range: [6, 7, 8, 9],
          round: 6
        },
        {
          time: "10:00",
          range: [10, 11, 12, 13],
          round: 10
        },
        {
          time: "14:00",
          range: [14, 15, 16, 17],
          round: 14
        },
        {
          time: "18:00",
          range: [18, 19, 20, 21],
          round: 18
        },
        {
          time: "22:00",
          range: [22, 23, 24],
          round: 22
        }
      ],
      patientData: this.decrypt(this.$q.localStorage.getItem("data"), 1),
      currentDate: "",
      patientLogData: "",
      config: this.$q.localStorage
        .getItem("config")
        .vitalSignsConfig.filter(x => x.status)
    };
  },
  methods: {
    startSelfChecking() {
      this.routeStep();
    },
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
    },
    async getCurrentDate() {
      this.loadingShow();
      let date = await this.getDate();
      this.currentDate = date;
      this.loadPatientLogData();
    },
    loadPatientLogData() {
      let currentHours = new Date().getHours();

      let date =
        this.currentDate.date +
        "/" +
        this.currentDate.month +
        "/" +
        this.currentDate.year;

      db.collection("patientLog")
        .where("inputDate", "==", date)
        .where("patientKey", "==", this.patientData.key)
        .get()
        .then(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push(Number(element.data().inputRound));
          });
          dataTemp = dataTemp.sort((a, b) => a - b);
          this.patientLogData = dataTemp;

          let currentRound;
          if (currentHours >= 2 && currentHours < 6) {
            currentRound = 2;
          } else if (currentHours >= 6 && currentHours < 10) {
            currentRound = 6;
          } else if (currentHours >= 10 && currentHours < 14) {
            currentRound = 10;
          } else if (currentHours >= 14 && currentHours < 18) {
            currentRound = 14;
          } else if (currentHours >= 18 && currentHours < 22) {
            currentRound = 18;
          } else {
            currentRound = 22;
          }

          if (dataTemp.includes(currentRound)) {
            this.isDisableButton = true;
          } else {
            this.isDisableButton = false;
          }
          if (currentHours < 2) {
            // เกิน เที่ยงคืน ไม่ให้กรอก ให้รอ รอบตี 2 เลย
            this.isDisableButton = true;
            this.loadingHide();
          }

          this.loadingHide();
        });
    }
  },
  computed: {
    currentTime() {
      return new Date().getHours();
    }
  },
  mounted() {
    if (!this.$q.localStorage.has("hospitalKey")) {
      this.$router.push("/");
      return;
    }
    this.$q.localStorage.set("currentStep", 0);
    this.getCurrentDate();
    this.$q.localStorage.set("isForward", true);
    this.$q.localStorage.set("isBack", false);
    let _this = this;
    let logoutTitle = this.$t("logoutTitle");
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

<style lang="scss" scoped>
.disabledBtn {
  padding: 2px 16px;
  font-family: Sarabun-Medium;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  background-color: #e0e0e0;
  color: #9e9e9e;
}
</style>
