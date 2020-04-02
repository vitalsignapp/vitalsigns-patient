const routes = [{
    path: '/:qrcode?',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/vitalsign/schedule',
    component: () => import('pages/Schedule.vue')
  },
  {
    path: '/vitalsign/thankyou',
    component: () => import('pages/Thankyou.vue')
  },
  {
    path: '/vitalsign/temperature',
    component: () => import('pages/Temperature.vue')
  },
  {
    path: '/vitalsign/oxygen',
    component: () => import('pages/Oxygen.vue')
  },
  {
    path: '/vitalsign/bloodpressure',
    component: () => import('pages/BloodPressure.vue')
  },
  {
    path: '/vitalsign/heartrate',
    component: () => import('pages/HeartRate.vue')
  },
  {
    path: '/vitalsign/symptoms',
    component: () => import('pages/Symptoms.vue')
  }, {
    path: '/vitalsign/symptomscheck',
    component: () => import('pages/Symptomscheck.vue')
  }, {
    path: '/vitalsign/validation',
    component: () => import('pages/Validation.vue'),
    name: "validation"
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
