import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCryptojs from 'vue-cryptojs'
Vue.use(VueRouter);
Vue.use(VueAxios, axios)
Vue.use(VueCryptojs)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */


var firebaseConfig = {
  apiKey: "AIzaSyDkfuz9optU8t14BZJBgJ9JNYdH4Omdh6A",
  authDomain: "vitalsign-2bc48.firebaseapp.com",
  databaseURL: "https://vitalsign-2bc48.firebaseio.com",
  projectId: "vitalsign-2bc48",
  storageBucket: "vitalsign-2bc48.appspot.com",
  messagingSenderId: "67633726727",
  appId: "1:67633726727:web:b535d92a91ec80695bb1a2",
  measurementId: "G-MEX9V112SR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();


Vue.mixin({
  data() {
    return {
      panel: "step1",
      currentStep: 1,
      totalStep: 7,
      version: "0.001",
    };
  },
  methods: {
    async getDate() {
      let apiLink = "https://api.winner-english.com/data/api/gettime.php";
      const res = await axios.get(apiLink);
      let currentDate = res.data[0].date.split("/")[0];
      let currentMonth = res.data[0].date.split("/")[1];
      let currentYear = Number(res.data[0].date.split("/")[2]) + Number(543);
      let result = {
        date: currentDate,
        month: currentMonth,
        year: currentYear,
        microtime: res.data[0].microtime
      }
      return result
    },
    loadingShow() {
      this.$q.loading.show({
        delay: 400
      })
    },
    loadingHide() {
      this.$q.loading.hide()
    },
    encrypt(data, type) {
      // ฟังก์ชันการเข้ารหัส AES
      // type 1.OBJ 2.String / boolean / number
      let result
      if (type == 1) {
        // object TYPE
        result = this.CryptoJS.AES.encrypt(JSON.stringify(data), "chomart12").toString()
      } else if (type == 2) {
        // STRING TYPE
        data = data.toString()
        result = this.CryptoJS.AES.encrypt(data, "chomart12").toString()
      }
      return result
    },
    decrypt(data, type) {
      // ฟังก์ชันการถอดรหัส AES
      // type 1.OBJ 2.String 3.Number 4.boolean
      if (!data) {
        return data
      }
      let result = this.CryptoJS.AES.decrypt(data, "chomart12").toString(
        this.CryptoJS.enc.Utf8
      );
      if (type == 1) {
        // object type
        // แปลงJSON กลับ
        result = JSON.parse(result.toString(this.CryptoJS.enc.Utf8));
      } else if (type == 3) {
        // number type
        result = Number(result)
      } else if (type == 4) {
        // JSON TYPE
        result = JSON.parse(result)
      }
      return result
    },
    routeStep() {
      this.$q.localStorage.set("isBack", false);
      this.$q.localStorage.set("isForward", true);
      let currentStep = this.$q.localStorage.getItem("currentStep")
      let config = this.$q.localStorage.getItem("config").vitalSignsConfig.filter(x => x.status)
      let totalStep = config.length
      let nextStep = currentStep == totalStep ? 'otherSymptoms' : config[currentStep].sym
      if (nextStep === "อุณหภูมิร่างกาย") {
        this.$router.push("/vitalsign/temperature")
      } else if (nextStep === "ค่าออกซิเจนในเลือด") {
        this.$router.push("/vitalsign/oxygen")
      } else if (nextStep === "ค่าความดันเลือด") {
        this.$router.push("/vitalsign/bloodpressure")
      } else if (nextStep === "อัตราการเต้นของหัวใจ") {
        this.$router.push("/vitalsign/heartrate")
      } else if (nextStep === "อาการตอนนี้") {
        this.$router.push("/vitalsign/symptomscheck")
      } else {
        this.$router.push("/vitalsign/symptoms")
      }

      if (this.currentStep != totalStep + 1) {
        this.$q.localStorage.set("currentStep", currentStep + 1)
      }


    },
    showMonthName(index) {
      let m = Number(index)
      let month
      if (this.$i18n.locale != 'th-th') {
        if (m == 1) {
          month = "January";
        } else if (m == 2) {
          month = "February";
        } else if (m == 3) {
          month = "March";
        } else if (m == 4) {
          month = "April";
        } else if (m == 5) {
          month = "May";
        } else if (m == 6) {
          month = "June";
        } else if (m == 7) {
          month = "July";
        } else if (m == 8) {
          month = "August";
        } else if (m == 9) {
          month = "September";
        } else if (m == 10) {
          month = "October";
        } else if (m == 11) {
          month = "November";
        } else if (m == 12) {
          month = "December";
        }
      } else {
        if (m == 1) {
          month = "มกราคม";
        } else if (m == 2) {
          month = "กุมภาพันธ์";
        } else if (m == 3) {
          month = "มีนาคม";
        } else if (m == 4) {
          month = "เมษายน";
        } else if (m == 5) {
          month = "พฤษภาคม";
        } else if (m == 6) {
          month = "มิถุนายน";
        } else if (m == 7) {
          month = "กรกฎาคม";
        } else if (m == 8) {
          month = "สิงหาคม";
        } else if (m == 9) {
          month = "กันยายน";
        } else if (m == 10) {
          month = "ตุลาคม";
        } else if (m == 11) {
          month = "พฤศจิกายน";
        } else if (m == 12) {
          month = "ธันวาคม";
        }
      }

      return month
    }
  }
});

export default function ( /* { store, ssrContext } */ ) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  return Router;
}
