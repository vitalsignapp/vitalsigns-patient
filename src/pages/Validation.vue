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
        >{{ currentDate.date}} {{ showMonthName(currentDate.month) }} {{ currentDate.year }}</div>

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

        <span v-if="$q.localStorage.has('symptomsCheck')">
          <div v-if="$q.localStorage.getItem('enableBackBtn')">
            <div v-if="$q.localStorage.getItem('symptomsCheck').filter(x => x.status).length">
              <div align="center" class="font-body color-dark-gray q-pb-sm">
                <span>{{ $t('conSymHeader') }}</span>
              </div>
              <div class="q-pb-md">
                <q-separator></q-separator>
              </div>

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
          </div>
        </span>

        <!-- กรณีโรงพยาบาลไม่เปิด ระบบ Check แต่มีการกรอกอาการอื่นๆ -->
        <span
          v-if="$q.localStorage.has('symptoms') && $q.localStorage.has('symptomsCheck') == false"
        >
          <ul>
            <li
              class="q-pa-xs"
              v-if="this.$q.localStorage.getItem('symptoms') != ''"
            >อื่นๆ: {{ this.$q.localStorage.getItem("symptoms") }}</li>
          </ul>
        </span>

        <div align="center">
          <q-btn dense class="button-action" @click="saveData()">
            <span>{{ $t('conSendData') }}</span>
          </q-btn>
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
    async saveData() {
      this.loadingShow();

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
      let date = await this.getDate();
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
        inputDate: date.date + "/" + date.month + "/" + date.year,
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
        .where(
          "inputDate",
          "==",
          date.date + "/" + date.month + "/" + date.year
        )
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
                    this.$router.push("/vitalsign/schedule");
                  });
              });
          }
        });
    },
    async getCurrentDate() {
      this.currentDate = await this.getDate();
    }
  },
  mounted() {
    this.getCurrentDate();
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