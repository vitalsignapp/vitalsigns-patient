<template>
  <div>
    <app-bar :step="7"></app-bar>

    <transition
      appear
      :enter-active-class="isBack ? 'animated slideInLeft' : 'animated slideInRight' "
      leave-active-class="animated fadeOut"
    >
      <div style="max-width:450px;width:100%;margin:auto">
        <div align="center" class="font-h3 q-pa-md">นาย สมชาย มากบุตร</div>

        <div align="center" class="font-body color-dark-gray">12 มีนาคม 2563 ณ 15.00 น.</div>

        <div class="q-pt-sm q-pb-md">
          <q-separator></q-separator>
        </div>

        <div class="q-pa-md" align="center">
          <div class="row q-pa-sm font-body">
            <div class="col-9 textoverflow q-pr-sm" align="left">
              <span>{{ $t('conTemp') }}</span>
            </div>
            <div class="col-3" align="right">{{ $q.localStorage.getItem("temperature") }} &#176;C</div>

            <div class="col-9 textoverflow" align="left">
              <span>{{ $t('conBlood') }}</span>
            </div>
            <div
              class="col-3"
              align="right"
            >{{ $q.localStorage.getItem("systolic") }} / {{ $q.localStorage.getItem("diastolic") }}</div>

            <div class="col-9 textoverflow" align="left">
              <span>{{ $t('conRes') }}</span>
            </div>
            <div class="col-3" align="right">{{ $q.localStorage.getItem("oxygen") }}%</div>

            <div class="col-9 textoverflow" align="left">
              <span>{{ $t('conPulse') }}</span>
            </div>
            <div class="col-3" align="right">{{ $q.localStorage.getItem("heartRate") }}/min</div>
          </div>
        </div>

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
            </ul>
          </div>
        </div>

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
export default {
  components: {
    AppBar
  },
  data() {
    return {
      isForward: this.$q.localStorage.getItem("isForward"),
      isBack: this.$q.localStorage.getItem("isBack")
    };
  },
  methods: {
    saveData() {
      this.$q.localStorage.remove("temperature");
      this.$q.localStorage.remove("oxygen");
      this.$q.localStorage.remove("symptoms");
      this.$q.localStorage.remove("heartRate");
      this.$q.localStorage.remove("diastolic");
      this.$q.localStorage.remove("systolic");
      this.$q.localStorage.remove("symptomsCheck");
      this.$router.push("/thankyou");
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