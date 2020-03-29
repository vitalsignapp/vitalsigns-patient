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
        <!-- <q-btn
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
        </q-btn>-->
        <!-- :outline="items.status == 'waiting' ? true : null"
          :flat="items.status != 'waiting' ? true : false"
        :color="items.status == 'waiting' ? 'teal' : null"-->
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
            <span
              v-if="items.range.includes(currentTime) && !patientLogData.includes(items.round)"
            >รอตรวจ</span>
            <span v-else-if="patientLogData.includes(items.round)">ตรวจแล้ว</span>
            <span class="color-light-gray" v-else-if="currentTime > items.round">ไม่ได้ตรวจ</span>
            <span class="color-light-gray" v-else>ยังไม่ถึงรอบตรวจ</span>
          </div>
        </q-btn>
      </div>
      <div class="q-mt-xl">
        <q-btn
          :disable="isDisableButton"
          :class="isDisableButton ? 'disabledBtn' : 'button-action'"
          dense
          @click=" $q.localStorage.set('enableBackBtn',true);"
          to="/temperature"
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
          range: [22, 23, 0, 1],
          round: 22
        }
      ],
      patientData: this.decrypt(this.$q.localStorage.getItem("data"), 1),
      currentDate: "",
      patientLogData: ""
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
    },
    async getCurrentDate() {
      this.loadingShow();
      let date = await this.getDate();
      this.currentDate = date;
      this.loadPatientLogData();
    },
    loadPatientLogData() {
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
          this.patientLogData = dataTemp;

          if (dataTemp.includes(this.currentTime)) {
            this.isDisableButton = true;
          } else {
            this.isDisableButton = false;
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
