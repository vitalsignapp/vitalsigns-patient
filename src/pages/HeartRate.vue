<template>
  <div>
    <app-bar @nextClicked="validateHeartRate()" :step="4"></app-bar>
    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div>
        <div align="center" class="font-h3" style="padding-top:30px;padding-bottom:60px">
          <span>{{$t('heartHeader')}}</span>
        </div>

        <div align="center">
          <q-input
            type="tel"
            input-style="letter-spacing:5px;line-height:normal;"
            :input-class="heartRate.length > 0 ? ' text-teal q-pl-md  text-weight-medium' : ' text-grey q-pl-md  text-weight-medium'"
            autofocus
            mask="###"
            placeholder="000"
            v-model="heartRate"
            color="teal"
            outlined
            style="max-width:350px;width:65%;font-size:40px"
            @keyup.enter="$router.push('/symptomscheck'),$q.localStorage.set('isForward',true),$q.localStorage.set('isBack',false)"
            :rules="[val => val <= 200 && val >= 10 || $t('tryagain')]"
          >
            <template v-slot:after>
              <img
                style="width:60px;position:relative;left:-13px"
                src="../statics/pic/sign-pulsemin.png"
              />
            </template>
          </q-input>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppBar from "../components/AppBar";
export default {
  components: {
    AppBar
  },
  data() {
    return {
      isForward: this.$q.localStorage.getItem("isForward"),
      isBack: this.$q.localStorage.getItem("isBack"),
      heartRate: this.$q.localStorage.has("heartRate")
        ? this.$q.localStorage.getItem("heartRate")
        : ""
    };
  },
  methods: {
    validateHeartRate() {
      if (this.heartRate < 10 || this.heartRate > 200) {
        this.$q.dialog({
          title: this.$t("invalidDataTitle"),
          message: this.$t("invalidDataContent"),
          ok: { color: "orange-5", textColor: "black" }
        });
      } else {
        this.saveHeartRate();

        this.$router.push("/symptomscheck");
      }
    },
    saveHeartRate() {
      if (!this.heartRate) {
        this.heartRate = "0";
      }
      this.$q.localStorage.set("heartRate", this.heartRate);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>