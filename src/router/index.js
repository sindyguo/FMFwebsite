import Vue from 'vue'
import VueRouter from 'vue-router'
import { MessageBox } from 'element-ui'

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// 重写push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => {
    console.log('push err:', err)
  })
}

// 重写replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch(err => {
    console.log('replace err:', err)
  })
}

Vue.use(VueRouter)

// 路由配置
const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: () => import(/* webpackChunkName: 'MainPage' */ '../views/MainPage.vue'),
    meta: {
      title: 'MainPage',
      requiresAuth: false
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '../views/Home.vue'),
        meta: {
          title: 'Home',
          requiresAuth: false
        }
      },
      {
        path: '/congress',
        name: 'congress',
        component: () => import(/* webpackChunkName: 'congress' */ '../views/WorldCongress.vue'),
        meta: {
          title: 'World Congress',
          requiresAuth: false
        }
      },
      {
        path: '/education',
        name: 'Education',
        component: () => import(/* webpackChunkName: 'Education' */ '../views/Education.vue'),
        meta: {
          title: 'Education',
          requiresAuth: false
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '../views/Course.vue'),
        meta: {
          title: 'Course',
          requiresAuth: false
        }
      },
      {
        path: '/courseDetail',
        name: 'courseDetail',
        component: () => import(/* webpackChunkName: 'courseDetail' */ '../views/CourseDetail.vue'),
        meta: {
          title: 'CourseDetail',
          requiresAuth: false
        }
      },
      {
        path: '/certs',
        name: 'Certs',
        component: () => import(/* webpackChunkName: 'Certs' */ '../views/Certs.vue'),
        meta: {
          title: 'Certs',
          requiresAuth: false
        }
      },
      {
        path: '/mine',
        name: 'Mine',
        component: () => import(/* webpackChunkName: 'Mine' */ '../views/Mine.vue'),
        meta: {
          title: 'Mine',
          requiresAuth: true
        }
      },
      {
        path: '/mineReg',
        name: 'MineReg',
        component: () => import(/* webpackChunkName: 'MineReg' */ '../views/MineReg.vue'),
        meta: {
          title: 'MineReg',
          requiresAuth: true
        }
      },
      {
        path: '/orderDetail',
        name: 'OrderDetail',
        component: () => import(/* webpackChunkName: 'OrderDetail' */ '../views/OrderDetail.vue'),
        meta: {
          title: 'OrderDetail',
          requiresAuth: false
        }
      },
      {
        path: '/reviewDetail',
        name: 'ReviewDetail',
        component: () => import(/* webpackChunkName: 'ReviewDetail' */ '../views/ReviewDetail.vue'),
        meta: {
          title: 'ReviewDetail',
          requiresAuth: false
        }
      },
      {
        path: '/speech',
        name: 'Speech',
        component: () => import(/* webpackChunkName: 'Speech' */ '../views/Speech.vue'),
        meta: {
          title: 'Speech',
          requiresAuth: true
        }
      },
      {
        path: '/sponsor',
        name: 'Sponsor',
        component: () => import(/* webpackChunkName: 'Sponsor' */ '../views/Sponsor.vue'),
        meta: {
          title: 'Sponsor',
          requiresAuth: false
        }
      },
      {
        path: '/look-for-life',
        name: 'SupportDevelopingCountries',
        component: () => import(/* webpackChunkName: 'SupportDevelopingCountries' */ '../views/SupportDevelopingCountries.vue'),
        meta: {
          title: 'Look for Life',
          requiresAuth: false
        }
      },
      {
        path: '/look-for-life-developed',
        redirect: '/look-for-life'
      },
      {
        path: '/congressSignUp',
        name: 'CongressSignUp',
        component: () => import(/* webpackChunkName: 'CongressSignUp' */ '../views/CongressSignUp.vue'),
        meta: {
          title: 'CongressSignUp',
          requiresAuth: true
        }
      },
      {
        path: '/fmf-supported-course',
        name: 'FmfSupportedCourse',
        component: () => import(/* webpackChunkName: 'FmfSupportedCourse' */ '../views/BalticSymposium.vue'),
        meta: {
          title: 'Baltic Symposium',
          requiresAuth: false
        }
      },
      {
        path: '/fmf-supported-courses',
        name: 'FmfSupportedCourses',
        component: () => import(/* webpackChunkName: 'FmfSupportedCourses' */ '../views/SupportedCourses.vue'),
        meta: {
          title: 'FMF Supported Courses',
          requiresAuth: false
        }
      },
      {
        path: '/fellowships',
        name: 'Fellowships',
        component: () => import(/* webpackChunkName: 'Fellowships' */ '../views/Fellowships.vue'),
        meta: {
          title: 'FMF fellowships',
          requiresAuth: false
        }
      },
      {
        path: '/research',
        name: 'Research',
        component: () => import(/* webpackChunkName: 'Research' */ '../views/Research.vue'),
        meta: {
          title: 'Research',
          requiresAuth: false
        }
      },
      {
        path: '/calculators',
        name: 'Calculators',
        component: () => import(/* webpackChunkName: 'Calculators' */ '../views/Calculators.vue'),
        meta: {
          title: 'Calculators',
          requiresAuth: false
        }
      },
      {
        path: '/research-publications',
        name: 'ResearchPublications',
        component: () => import(/* webpackChunkName: 'ResearchPublications' */ '../views/ResearchPublications.vue'),
        meta: {
          title: 'Research publications',
          requiresAuth: false
        }
      },
    ]
  },
  {
    path: '/exam',
    name: 'Exam',
    component: () => import(/* webpackChunkName: 'Exam' */ '../views/Exam.vue'),
    meta: {
      title: 'Exam',
      requiresAuth: false
    }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import(/* webpackChunkName: 'Registration' */ '../views/Registration.vue'),
    meta: {
      title: 'Registration',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '../views/login.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/resetPwd',
    name: 'ResetPwd',
    component: () => import(/* webpackChunkName: 'ResetPwd' */ '../views/ResetPwd.vue'),
    meta: {
      title: 'ResetPwd',
      requiresAuth: false
    }
  },

  {
    path: '/cme',
    name: 'Cme',
    component: () => import(/* webpackChunkName: 'Cme' */ '../views/Cme.vue'),
    meta: {
      title: 'Certs',
      requiresAuth: false
    }
  },
  {
    path: '/template-preview',
    name: 'TemplatePreview',
    component: () => import(/* webpackChunkName: 'TemplatePreview' */ '../views/TemplatePreview.vue'),
    meta: {
      title: 'Template Preview',
      requiresAuth: false
    }
  },
  {
    path: '/payCom',
    name: 'payCom',
    component: () => import(/* webpackChunkName: 'payCom' */ '../views/payCom.vue'),
    meta: {
      title: 'payCom',
      requiresAuth: false
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

// 创建路由实例
const router = new VueRouter({
  mode: 'hash', // 或 'hash'
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回滚动位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.onError(error => {
  console.error('router error:', error)
  if (error.message && error.message.includes('Navigation aborted')) {
    console.log('Navigation aborted', {
      from: error.from?.fullPath,
      to: error.to?.fullPath
    })
    return false
  }

  if (error.message && error.message.includes('Loading chunk')) {
    console.warn('Loading chunk error, and reload page')
    window.location.reload()
    return
  }
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 认证检查
  if (to.meta.requiresAuth) {
    const isAuthenticated = sessionStorage.getItem('token')
    if (!isAuthenticated) {
      try {
        const result = await MessageBox.confirm('Not currently logged in, do you want to log in now?', 'Tip', {
          confirmButtonText: 'Log in',
          cancelButtonText: 'Cancel',
          type: 'none'
        })
        if (result) {
          next('/login')
        } else {
          next(false)
        }
      } catch (error) {
        console.log('beforeeach error:', error)
        next(false)
        return
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
