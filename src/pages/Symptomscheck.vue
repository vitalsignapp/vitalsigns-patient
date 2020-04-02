<template>
  <div>
    <app-bar @nextClicked="saveSymptomsToLocal()" :step="2"></app-bar>
    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div style="max-width:350px;width:100%;margin:auto">
        <div align="center" class="font-h3" style="padding-top:30px;padding-bottom:20px">
          <span>{{$t('symHeader')}}</span>
        </div>

        <div class="q-pa-sm">
          <q-toolbar
            v-for="(items,index) in symptomsArr"
            :key="index"
            @click="items.status = !items.status"
            class="q-pa-xs"
          >
            <div class="fit border-light-gray rounded-borders">
              <q-checkbox keep-color v-model="items.status" color="teal">
                <span>{{ items.sym }}</span>
              </q-checkbox>
            </div>
          </q-toolbar>
        </div>

        <div align="center" class="color-light-gray font-body q-pt-md">
          <span>{{$t('emergency')}}</span>
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
      symptomsArr: this.$q.localStorage.has("symptomsCheck")
        ? this.$q.localStorage.getItem("symptomsCheck")
        : [
            {
              sym: this.$t("haveAFever"),
              status: false
            },
            {
              sym: this.$t("haveACough"),
              status: false
            },
            {
              sym: this.$t("runyNose"),
              status: false
            },
            {
              sym: this.$t("difficultyInBreathing"),
              status: false
            },
            {
              sym: this.$t("fatigue"),
              status: false
            },
            {
              sym: this.$t("vomit"),
              status: false
            },
            {
              sym: this.$t("diarrhea"),
              status: false
            }
          ]
    };
  },
  methods: {
    saveSymptomsToLocal() {
      this.$q.localStorage.set("symptomsCheck", this.symptomsArr);
      this.routeStep();
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
</style>