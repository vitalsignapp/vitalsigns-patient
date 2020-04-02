<template>
  <div>
    <app-bar @nextClicked="validateBloodPressure()" :step="3"></app-bar>

    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div style="max-width:450px;width:100%;margin:auto;">
        <div align="center" class="font-h3" style="padding-top:30px;padding-bottom:60px">
          <span>{{$t('bloodHeader')}}</span>
        </div>
        <div class="row justify-center">
          <div class="col-4 row">
            <div class="col-12 font-body q-pb-sm" align="center">
              <span>{{$t('higher')}}</span>
            </div>
            <div class="col-12">
              <q-input
                type="tel"
                input-style="letter-spacing:5px;line-height:normal;"
                :input-class="systolic.length > 0 ? ' text-teal q-pl-sm  text-weight-medium' : ' text-grey q-pl-sm  text-weight-medium'"
                autofocus
                mask="###"
                placeholder="130"
                v-model="systolic"
                color="teal"
                outlined
                style="font-size:25px"
                @keyup.enter="$refs.diatolic.focus()"
                @keyup="systolic.length == 3 ? $refs.diatolic.focus() : null"
                :rules="[val => val >= 50 && val <= 400 || $t('tryagain')]"
              ></q-input>
            </div>
          </div>
          <div align="center" class="text-h2 row relative-position">
            <div class="col-12" style="position:relative;top:30px">
              <img style="width:60px;" src="../statics/pic/icon-separator.png" alt />
            </div>
          </div>
          <div class="col-4 row">
            <div class="col-12 font-body q-pb-sm" align="center">
              <span>{{$t('lower')}}</span>
            </div>
            <div class="col-12">
              <q-input
                ref="diatolic"
                type="tel"
                input-style="letter-spacing:5px;line-height:normal;"
                :input-class="diastolic.length > 0 ? ' text-teal q-pl-sm  text-weight-medium' : ' text-grey q-pl-sm  text-weight-medium'"
                mask="###"
                placeholder="80"
                v-model="diastolic"
                color="teal"
                outlined
                style="font-size:25px"
                @keyup.enter="validateBloodPressure()"
                :rules="[val => val >= 10 && val <= 200 || $t('tryagain')]"
              ></q-input>
            </div>
          </div>
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
      systolic: this.$q.localStorage.has("systolic")
        ? this.$q.localStorage.getItem("systolic")
        : "",
      diastolic: this.$q.localStorage.has("diastolic")
        ? this.$q.localStorage.getItem("diastolic")
        : ""
    };
  },
  methods: {
    validateBloodPressure() {
      if (
        Number(this.systolic < 50) ||
        Number(this.systolic > 400) ||
        Number(this.diastolic < 10) ||
        Number(this.diastolic > 200)
      ) {
        this.$q.dialog({
          title: this.$t("invalidDataTitle"),
          message: this.$t("invalidDataContent"),
          ok: { color: "orange-5", textColor: "black" }
        });
      } else {
        this.save();
        // this.$router.push("/heartrate");
        this.routeStep();
      }
    },
    save() {
      if (!this.diastolic) {
        this.diastolic = "0";
      }
      this.$q.localStorage.set("systolic", this.systolic);
      this.$q.localStorage.set("diastolic", this.diastolic);
    }
  },
  mounted() {
    if (!this.$q.localStorage.has("enableBackBtn")) {
      this.$router.push("/vitalsign/schedule");
    }
  }
};
</script>

<style lang="scss" scoped>
.brx {
  border: 1px solid red;
}
</style>