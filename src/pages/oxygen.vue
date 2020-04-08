<template>
  <div>
    <app-bar @nextClicked="validateOxygenData()" :step="2"></app-bar>
    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div>
        <div align="center" class="font-h3" style="padding-top:30px;padding-bottom:60px">
          <span>{{$t('oxygenHeader')}}</span>
        </div>

        <div align="center">
          <q-input
            type="tel"
            input-style="letter-spacing:5px;line-height:normal;"
            :input-class="oxygen.length > 0 ? ' text-teal q-pl-md  text-weight-medium' : ' text-grey q-pl-md  text-weight-medium'"
            autofocus
            mask="###"
            placeholder="000"
            v-model="oxygen"
            color="teal"
            outlined
            style="max-width:350px;width:84%;font-size:40px"
            @keyup.enter="validateOxygenData()"
            :rules="[val => val >= 50 && val <= 101 || $t('tryagain')]"
            lazy-rules
          >
            <template v-slot:before>
              <img
                style="width:60px;position:relative;right:-13px"
                src="../statics/pic/sign-o2.png"
              />
            </template>
            <template v-slot:after>
              <img
                style="width:60px;position:relative;left:-13px"
                src="../statics/pic/sign-percent.png"
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
      oxygen: this.$q.localStorage.has("oxygen")
        ? this.$q.localStorage.getItem("oxygen")
        : ""
    };
  },
  methods: {
    validateOxygenData() {
      if (this.oxygen < 50 || this.oxygen > 101) {
        this.$q.dialog({
          title: this.$t("invalidDataTitle"),
          message: this.$t("invalidDataContent"),
          ok: { color: "orange-5", textColor: "black" }
        });
      } else {
        this.saveOxygenToLocal();
        this.routeStep();
      }
    },
    saveOxygenToLocal() {
      this.$q.localStorage.set("oxygen", this.oxygen);
    }
  },
  mounted() {
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
</style>