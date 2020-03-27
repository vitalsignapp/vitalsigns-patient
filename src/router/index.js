import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";

Vue.use(VueRouter);

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
      en: {
        step: "Step",
        next: "Next",
        skip: "Skip",
        confirmation: "Confirmation",
        // LOGIN
        login: "Login",
        about: "About VitalSign",
        loginHeader: "Enter Hospital Number ()",
        loginPlaceholder: "1234ddmmyy",
        // schedule
        signout: "Log Out",
        schHeader: "Daily Self-Check Routine",
        schChecked: "Checked",
        schHavenotCheck: "Have not checked",
        schWaitForCheck: "Wait for checking",
        schBtn: "Start self-check",
        dateOfBirth: "Date of birth",
        // temperature
        tempHeader: "Enter Body Temperature",
        // oxygen
        oxygenHeader: "Enter Respiration Rate",
        // bloodPresure
        bloodHeader: "Enter Blood Pressure",
        higher: "Higher (Systolic)",
        lower: "Lower (Diastolic)",
        // heart rate
        heartHeader: "Enter Pulse Rate",
        // symptomcheck
        symHeader: "How are you feeling?",
        emergency: "In case off emergency, please contact a staff.",
        // symptoms
        symOtherHeader: "Do you have other symptoms?",
        // confirmation
        conTemp: "Body temperature",
        conBlood: "Blood pressure",
        conRes: "Respiration rate",
        conPulse: "Pulse rate",
        conSymHeader: "Current Conditions",
        fever: "Fever",
        normal: "Normal",
        conSendData: "Send Details",
        //Thankyou
        thankHeader: "Thank you for corporation!",
        thankBody: "Your details have been sent to our staff. Get well soon!",
        backToHome: "back to home",
        feedback: "Send your feedback to us"




      },
      th: {
        step: "ขั้นที่",
        next: "ถัดไป",
        skip: "ข้าม",
        confirmation: "ตรวจสอบข้อมูล",
        // LOGIN
        login: "เข้าใช้งาน",
        about: "เกี่ยวกับ VitalSign",
        loginHeader: "ใส่รหัสผู้ป่วยที่ได้รับจากพบาบาล",
        loginPlaceholder: "1234 วัน/เดือน/ปี",
        // schedule
        signout: "ออกจากระบบ",
        schHeader: "ตารางตรวจประจำวัน",
        schChecked: "ตรวจแล้ว",
        schHavenotCheck: "ยังไม่ได้ตรวจ",
        schWaitForCheck: "รอตรวจ",
        schBtn: "เริ่มตรวจตัวเอง",
        dateOfBirth: "วันเกิด",
        // temperature
        tempHeader: "กรอกอุณภูมิร่างกาย",
        // oxygen
        oxygenHeader: "กรอกค่าออกซิเจนในเลือด",
        // bloodPresure
        bloodHeader: "กรอกค่าความดันเลือด",
        higher: "ค่าบน (Systolic)",
        lower: "ค่าล่าง (Diastolic)",
        // heart rate
        heartHeader: "กรอกค่าอัตราการเต้นของหัวใจ",
        // symptomcheck
        symHeader: "ตอนนี้คุณมีอาการอะไรบ้าง",
        emergency: "กรณีฉุกเฉิน สามารถติดต่อพยาบาลได้",
        // symptoms
        symOtherHeader: "อาการอื่นๆ ที่อยากให้พยาบาลรู้",
        // confirmation
        conTemp: "อุณหภูมิ",
        conBlood: "ความดันโลหิต",
        conRes: "ออกซิเจนในเลือด",
        conPulse: "การเต้นของหัวใจ",
        conSymHeader: "อาการตอนนี้",
        fever: "มีไข้",
        normal: "ปกติ",
        conSendData: "ส่งข้อมูล",
        //Thankyou
        thankHeader: "ขอบคุณที่ให้ความร่วมมือ",
        thankBody: "ข้อมูลได้ส่งถึงมือพยาบาลแล้วขอให้ คุณหายไวๆ นะคะ ",
        backToHome: "กลับหน้าหลัก",
        feedback: "ส่งความคิดเห็นถึงทีมพัฒนา"



      },
    };
  },
  methods: {
    nextPage() {
      this.currentStep++;
      this.panel = "step" + this.currentStep;
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
