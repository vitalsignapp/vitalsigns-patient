import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
Vue.use(VueRouter);
import VueCryptojs from 'vue-cryptojs'
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
