const routes = [{
    path: '/',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/schedule',
    component: () => import('pages/Schedule.vue')
  },
  {
    path: '/thankyou',
    component: () => import('pages/Thankyou.vue')
  },
  {
    path: '/temperature',
    component: () => import('pages/Temperature.vue')
  },
  {
    path: '/oxygen',
    component: () => import('pages/Oxygen.vue')
  },
  {
    path: '/bloodpressure',
    component: () => import('pages/BloodPressure.vue')
  },
  {
    path: '/heartrate',
    component: () => import('pages/HeartRate.vue')
  },
  {
    path: '/symptoms',
    component: () => import('pages/Symptoms.vue')
  }, {
    path: '/symptomscheck',
    component: () => import('pages/Symptomscheck.vue')
  }, {
    path: '/validation',
    component: () => import('pages/Validation.vue')
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
