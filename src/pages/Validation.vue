<template>
  <div>
    <app-bar :step="4"></app-bar>

    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div style="max-width:450px;width:100%;margin:auto">
        <div align="center" class="font-h3 q-pa-md">{{ patientData.name }} {{ patientData.surname }}</div>

        <div
          align="center"
          class="font-body color-dark-gray"
        >{{ currentDate.date}} {{ showMonthName(currentDate.month) }} {{ currentDate.year }} รอบ {{ checkCurrentRound() }}:00 น.</div>

        <div class="q-pt-sm q-pb-md">
          <q-separator></q-separator>
        </div>

        <div class="q-pa-md" align="center">
          <div class="row q-pa-sm font-body">
            <div
              class="col-9 textoverflow q-pr-sm"
              align="left"
              v-show="$q.localStorage.has('temperature')"
            >
              <span>{{ $t('conTemp') }}</span>
            </div>
            <div
              v-show="$q.localStorage.has('temperature')"
              class="col-3"
              align="right"
            >{{ $q.localStorage.getItem("temperature") }} &#176;C</div>

            <div class="col-9 textoverflow" align="left" v-show="$q.localStorage.has('diastolic')">
              <span>{{ $t('conBlood') }}</span>
            </div>
            <div
              v-show="$q.localStorage.has('diastolic')"
              class="col-3"
              align="right"
            >{{ $q.localStorage.getItem("systolic") }} / {{ $q.localStorage.getItem("diastolic") }}</div>

            <div class="col-9 textoverflow" align="left" v-show="$q.localStorage.has('oxygen')">
              <span>{{ $t('conRes') }}</span>
            </div>
            <div
              v-show="$q.localStorage.has('oxygen')"
              class="col-3"
              align="right"
            >{{ $q.localStorage.getItem("oxygen") }}%</div>

            <div class="col-9 textoverflow" align="left" v-show="$q.localStorage.has('heartRate')">
              <span>{{ $t('conPulse') }}</span>
            </div>
            <div
              class="col-3"
              v-show="$q.localStorage.has('heartRate')"
              align="right"
            >{{ $q.localStorage.getItem("heartRate") }}/min</div>
          </div>
        </div>

        <span v-if="$q.localStorage.has('symptomsCheck') && $q.localStorage.has('symptoms')">
          <div
            align="center"
            class="font-body color-dark-gray q-pb-sm"
            v-if="$q.localStorage.getItem('symptomsCheck').filter(x => x.status).length"
          >
            <span>{{ $t('conSymHeader') }}</span>
            <q-separator></q-separator>
          </div>
          <div class="q-pb-md">
            <div class="font-body">
              <ul>
                <li
                  class="q-pa-xs"
                  v-for="(items,index) in $q.localStorage.getItem('symptomsCheck').filter(x => x.status)"
                  :key="index"
                >{{ items.sym }}</li>
                <li
                  class="q-pa-xs"
                  v-if="this.$q.localStorage.getItem('symptoms') != ''"
                >อื่นๆ: {{ this.$q.localStorage.getItem("symptoms") }}</li>
              </ul>
            </div>
          </div>
        </span>

        <span v-else>
          <ul class="font-body" v-if="$q.localStorage.has('symptomsCheck')">
            <li
              class="q-pa-xs"
              v-for="(items,index) in $q.localStorage.getItem('symptomsCheck').filter(x => x.status)"
              :key="index"
            >{{ items.sym }}</li>
          </ul>
          <span v-else>
            <ul>
              <li
                class="q-pa-xs"
                v-if="this.$q.localStorage.getItem('symptoms') != '' && this.$q.localStorage.has('symptoms')"
              >อื่นๆ: {{ this.$q.localStorage.getItem("symptoms") }}</li>
            </ul>
          </span>
        </span>

        <div align="center ">
          <div class="q-gutter-md">
            <q-btn style="min-width:80px;" class="stroked-button" dense @click="editVitalsigns()">
              <span>{{ $t('fix') }}</span>
            </q-btn>
            <q-btn dense class="button-action" @click="saveData()">
              <span>{{ $t('conSendData') }}</span>
            </q-btn>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppBar from "../components/AppBar";
import { db } from "../router";
export default {
  components: {
    AppBar
  },
  data() {
    return {
      isForward: this.$q.localStorage.getItem("isForward"),
      isBack: this.$q.localStorage.getItem("isBack"),
      patientData: this.decrypt(this.$q.localStorage.getItem("data"), 1),
      currentDate: ""
    };
  },
  methods: {
    editVitalsigns() {
      // FIND FIRST STEP AND GO BACK TO IT
      let config = this.$q.localStorage
        .getItem("config")
        .vitalSignsConfig.filter(x => x.status);

      let firstStep = config[0].sym;

      if (firstStep === "อุณหภูมิร่างกาย") {
        this.$router.push("/vitalsign/temperature");
      } else if (firstStep === "ค่าออกซิเจนในเลือด") {
        this.$router.push("/vitalsign/oxygen");
      } else if (firstStep === "ค่าความดันเลือด") {
        this.$router.push("/vitalsign/bloodpressure");
      } else if (firstStep === "อัตราการเต้นของหัวใจ") {
        this.$router.push("/vitalsign/heartrate");
      } else if (firstStep === "อาการตอนนี้") {
        this.$router.push("/vitalsign/symptomscheck");
      } else {
        this.$router.push("/vitalsign/symptoms");
      }
      this.$q.localStorage.set("currentStep", 1);
    },
    async saveData() {
      this.loadingShow();

      let currentHours = new Date().getHours();
      let currentRound = this.checkCurrentRound();

      let date = await this.getDate();
      let inputDate = date.date + "/" + date.month + "/" + date.year;

      let finalData = {
        temperature: this.$q.localStorage.getItem("temperature"),
        bloodPressure:
          this.$q.localStorage.getItem("systolic") +
          "/" +
          this.$q.localStorage.getItem("diastolic"),
        oxygen: this.$q.localStorage.getItem("oxygen"),
        heartRate: this.$q.localStorage.getItem("heartRate"),
        symptomsCheck: this.$q.localStorage.getItem("symptomsCheck"),
        otherSymptoms: this.$q.localStorage.getItem("symptoms"),
        inputRound: currentRound,
        inputDate: inputDate,
        patientKey: this.patientData.key,
        patientRoomKey: this.patientData.patientRoomKey,
        hospitalKey: this.patientData.hospitalKey,
        microtime: date.microtime
      };

      db.collection("patientData")
        .doc(this.patientData.key)
        .update({
          isRead: false
        });

      db.collection("patientLog")
        .where("inputDate", "==", inputDate)
        .where("inputRound", "==", currentRound)
        .where("patientKey", "==", this.patientData.key)
        .get()
        .then(doc => {
          if (!doc.size) {
            db.collection("patientLog")
              .add(finalData)
              .then(() => {
                db.collection("patientData")
                  .doc(this.patientData.key)
                  .update({
                    isRead: false
                  })
                  .then(() => {
                    this.$q.localStorage.remove("temperature");
                    this.$q.localStorage.remove("oxygen");
                    this.$q.localStorage.remove("symptoms");
                    this.$q.localStorage.remove("heartRate");
                    this.$q.localStorage.remove("diastolic");
                    this.$q.localStorage.remove("systolic");
                    this.$q.localStorage.remove("symptomsCheck");
                    this.$q.localStorage.remove("enableBackBtn");
                    this.loadingHide();
                    this.$router.push("/vitalsign/thankyou");
                  });
              });
          }
        });
    },
    async getCurrentDate() {
      this.currentDate = await this.getDate();
    },
    checkCurrentRound() {
      let currentHours = new Date().getHours();
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
      return currentRound;
    }
  },
  mounted() {
    this.getCurrentDate();
    if (!this.$q.localStorage.has("hospitalKey")) {
      this.$router.push("/");
      return;
    }
    if (!this.$q.localStorage.has("enableBackBtn")) {
      this.$router.push("/vitalsign/schedule");
    }
  }
};
</script>

<style lang="scss" scoped>
.textoverflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>