<template>
  <div>
    <!-- TODO : Container Header -->
    <q-toolbar class="bg-primary-500 shadow-1">
      <q-toolbar-title class="col">
        <q-img src="../statics/pic/logo-vitalsign.png" width="170px"></q-img>
      </q-toolbar-title>
      <q-space />
      <div style="width:70px;">
        <div class="row bg-primary-600 q-pa-xs round" style="border-radius:15px;">
          <div class="col">
            <q-btn
              flat
              round
              size="8px"
              :class=" $i18n.locale != 'th-th' ? 'backdrop' : null"
              @click="(isChangeLanguage = 'th-th'), changeLanguage('th-th')"
            >
              <q-img src="../statics/pic/Thai.png"></q-img>
            </q-btn>
          </div>
          <div class="col" align="right">
            <q-btn
              flat
              round
              size="8px"
              :class=" $i18n.locale != 'en-us' ? 'backdrop' : null"
              @click="(isChangeLanguage = 'en'), changeLanguage('en')"
            >
              <q-img src="../statics/pic/English.png"></q-img>
            </q-btn>
          </div>
        </div>
      </div>
    </q-toolbar>

    <!-- TODO : Container Body -->
    <div>
      <div class="q-my-lg" align="center">
        <span class="font-h3">{{ $t('loginHeader') }}</span>
      </div>

      <div class="q-mt-xl q-mb-sm">
        <div align="center">
          <q-input
            type="tel"
            input-style="letter-spacing:2px;caret-color:#009688;"
            :input-class="
              username.length > 0
                ? 'q-px-sm color-primary-500'
                : 'q-px-sm color-placeholder'
            "
            class="font-h2 rounded-borders"
            color="teal"
            mask="##########"
            outlined
            autofocus
            v-model="username"
            style="max-width:350px;width:90%;"
          ></q-input>
        </div>
      </div>

      <div class="q-pt-lg q-pb-md" align="center">
        <q-btn @click="login()" class="button-action" dense>{{ $t('login') }}</q-btn>
      </div>

      <div align="center" class="q-py-lg">
        <span class="color-primary-500 font-body">
          <span>{{ $t('about') }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      username: "",
      isChangeLanguage: this.$q.localStorage.has("Language")
        ? this.$q.localStorage.getItem("Language")
        : "th"
    };
  },
  methods: {
    changeLanguage(type) {
      if (type == "en") {
        type = "en-us";
      }

      this.$q.localStorage.set("Language", type);
      this.$i18n.locale = this.$q.localStorage.getItem("Language");
    },
    login() {
      this.$router.push("schedule");
    }
  },
  mounted() {
    console.log("XXXXXXX");
    console.log(this.$q.lang.getLocale());
  }
};
</script>

<style scoped>
.backdrop {
  opacity: 0.6;
}
</style>
