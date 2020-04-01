<template>
  <div>
    <app-bar @nextClicked="validateTemerature()" :step="1"></app-bar>
    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
      style="overflow:hidden;"
    >
      <div>
        <div align="center" class="font-h3" style="padding-top:30px;padding-bottom:60px">
          <span>{{$t('tempHeader')}}</span>
        </div>

        <div align="center" style="margin:0px 10px 0px 0px">
          <q-input
            type="tel"
            input-style="letter-spacing:5px;font-size:40px;line-height:normal"
            :input-class="temperature.length > 0 ? ' text-teal q-pl-md  text-weight-medium' : ' text-grey q-pl-md  text-weight-medium'"
            autofocus
            mask="##.#"
            placeholder="00.0"
            v-model="temperature"
            color="teal"
            outlined
            style="max-width:350px;width:70%;"
            @keyup.enter="$router.push('/oxygen'),$q.localStorage.set('isForward',true),$q.localStorage.set('isBack',false)"
            :rules="[val => val <= 45 && val >= 35 || $t('tryagain')]"
          >
            <template v-slot:before>
              <img
                style="width:60px;position:relative;right:-13px"
                src="../statics/pic/sign-temperature.png"
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
      temperature: this.$q.localStorage.has("temperature")
        ? this.$q.localStorage.getItem("temperature")
        : "",
      configData: this.$q.localStorage
        .getItem("config")
        .vitalSignsConfig.filter(x => x.status)
    };
  },
  methods: {
    saveTempToLocal() {
      this.$q.localStorage.set("temperature", this.temperature);
    },
    validateTemerature() {
      if (this.temperature > 45 || this.temperature < 35) {
        this.$q.dialog({
          title: this.$t("invalidDataTitle"),
          message: this.$t("invalidDataContent"),
          ok: { color: "orange-5", textColor: "black" }
        });
      } else {
        this.saveTempToLocal();
        this.routeStep();
      }
    }
  },
  mounted() {
    if (!this.$q.localStorage.has("enableBackBtn")) {
      this.$router.push("/schedule");
    }
  }
};
</script>

<style lang="scss" scoped>
.inpHeight {
  height: 200px;
}
</style>