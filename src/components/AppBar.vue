<template>
  <div>
    <q-toolbar class="bg-teal text-white shadow-1 font-h3">
      <q-toolbar-title>
        <q-btn dense flat class="cursor-pointer" @click="previousStep()" icon="arrow_back_ios"></q-btn>
        <span v-if="step != 7">
          <span class="color-white">{{ $t('step') }}</span>
          {{ step }} / 7
        </span>
        <span v-else>
          <span>{{ $t('confirmation') }}</span>
        </span>
      </q-toolbar-title>
      <q-space />
      <q-btn no-caps v-show="step != 7 && step != 6" @click="nextStep()" flat dense>
        <span class="color-white font-h3">{{ $t('next') }}</span>
      </q-btn>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  methods: {
    nextStep() {
      this.$q.localStorage.set("isBack", false);
      this.$q.localStorage.set("isForward", true);
      this.$emit("nextClicked");
    },
    previousStep() {
      this.$q.localStorage.set("isBack", true);
      this.$q.localStorage.set("isForward", false);
      if (this.step == 1) {
        this.$router.push("/schedule");
      } else if (this.step == 2) {
        this.$router.push("/temperature");
      } else if (this.step == 3) {
        this.$router.push("/oxygen");
      } else if (this.step == 4) {
        this.$router.push("/bloodpressure");
      } else if (this.step == 5) {
        this.$router.push("/heartrate");
      } else if (this.step == 6) {
        this.$router.push("/symptomscheck");
      } else if (this.step == 7) {
        this.$router.push("/symptoms");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>