<template>
  <div>
    <q-toolbar class="bg-teal text-white shadow-1 font-h3">
      <q-toolbar-title>
        <q-btn dense flat class="cursor-pointer" @click="previousStep()" icon="arrow_back_ios"></q-btn>
        <span v-if="$route.name !='validation' ">
          <span class="color-white">{{ $t('step') }}</span>
          {{ step }} / {{ totalStep }}
        </span>
        <span v-else>
          <span>{{ $t('confirmation') }}</span>
        </span>
      </q-toolbar-title>
      <q-space />
      <q-btn no-caps @click="nextStep()" flat dense v-show="$route.name != 'validation'">
        <span class="color-white font-h3">{{ $t('next') }}</span>
      </q-btn>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: this.$q.localStorage.getItem("currentStep"),
      totalStep:
        this.$q.localStorage
          .getItem("config")
          .vitalSignsConfig.filter(x => x.status).length + 1,
      currentConfig: this.$q.localStorage
        .getItem("config")
        .vitalSignsConfig.filter(x => x.status)
    };
  },
  methods: {
    nextStep() {
      this.$emit("nextClicked");
    },
    previousStep() {
      this.$q.localStorage.set("isBack", true);
      this.$q.localStorage.set("isForward", false);
      if (this.step == 1) {
        this.$router.push("/vitalsign/schedule");
        return;
      }

      if (this.$route.name == "validation") {
        this.$router.push("/vitalsign/symptoms");
      } else {
        let previousStep = this.currentConfig[this.step - 2].sym;
        if (previousStep === "อุณหภูมิร่างกาย") {
          this.$router.push("/vitalsign/temperature");
        } else if (previousStep === "ค่าออกซิเจนในเลือด") {
          this.$router.push("/vitalsign/oxygen");
        } else if (previousStep === "ค่าความดันเลือด") {
          this.$router.push("/vitalsign/bloodpressure");
        } else if (previousStep === "อัตราการเต้นของหัวใจ") {
          this.$router.push("/vitalsign/heartrate");
        } else if (previousStep === "อาการตอนนี้") {
          this.$router.push("/vitalsign/symptomscheck");
        }
        this.$q.localStorage.set("currentStep", this.step - 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>