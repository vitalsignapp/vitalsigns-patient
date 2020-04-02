<template>
  <div>
    <app-bar @nextClicked="saveSymptoms()" :step="3"></app-bar>

    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div style="max-width:350px;width:100%;margin:auto">
        <div align="center" class="font-h3" style="padding-top:30px;padding-bottom:20px">
          <span>{{$t('symOtherHeader')}}</span>
        </div>

        <div class="q-pa-md">
          <q-input
            input-style="font-size:16px"
            autofocus
            color="teal"
            rows="4"
            type="textarea"
            v-model="symptoms"
            outlined
          ></q-input>
        </div>

        <div class="q-pt-md q-gutter-md" align="center">
          <q-btn
            style="border:1px solid #9e9e9e;min-width:80px"
            dense
            class="stroked-button"
            to="/validation"
            flat
            @click="$q.localStorage.set('isForward',true),$q.localStorage.set('isBack',false)"
          >
            <span>{{$t('skip')}}</span>
          </q-btn>
          <q-btn
            style="border:1px solid #9e9e9e;min-width:80px"
            dense
            class="button-action"
            flat
            @click="$q.localStorage.set('isForward',true),$q.localStorage.set('isBack',false),saveSymptoms()"
          >
            <span>{{$t('next')}}</span>
          </q-btn>
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
      symptoms: this.$q.localStorage.has("symptoms")
        ? this.$q.localStorage.getItem("symptoms")
        : ""
    };
  },
  methods: {
    saveSymptoms() {
      this.$q.localStorage.set("symptoms", this.symptoms);
      this.$router.push("/vitalsign/validation");
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