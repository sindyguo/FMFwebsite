import Vue from 'vue'
import VueRouter from 'vue-router'
import { MessageBox } from 'element-ui'

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// 重写push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => {
    console.log('push err:', err)
  })
}

// 重写replace
VueRouter.prototype.replace = function replace (location, onResolve, onReject) {
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
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/congress',
        name: 'congress',
        component: () => import(/* webpackChunkName: 'congress' */ '../views/WorldCongress.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/privacy-notice',
        name: 'PrivacyNotice',
        component: () => import(/* webpackChunkName: 'PrivacyNotice' */ '../views/PrivacyNotice.vue'),
        meta: {
          title: 'Privacy Notice',
          requiresAuth: false
        }
      },
      
      {
        path: '/education',
        name: 'Education',
        component: () => import(/* webpackChunkName: 'Education' */ '../views/Education.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
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
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/certs',
        name: 'Certs',
        component: () => import(/* webpackChunkName: 'Certs' */ '../views/Certs.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/mine',
        name: 'Mine',
        component: () => import(/* webpackChunkName: 'Mine' */ '../views/Mine/Index.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: true
        }
      },
      {
        path: '/mineReg',
        name: 'MineReg',
        component: () => import(/* webpackChunkName: 'MineReg' */ '../views/MineReg.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: true
        }
      },
      {
        path: '/myUploadImages',
        name: 'MyUploadImages',
        component: () => import(/* webpackChunkName: 'MyUploadImages' */ '../views/Mine/MyUploadImages.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: true
        }
      },
      {
        path: '/myUploadImageDetail',
        name: 'MyUploadImageDetail',
        component: () => import(/* webpackChunkName: 'MyUploadImageDetail' */ '../views/Mine/MyUploadImageDetail.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: true
        }
      },
      {
        path: '/updateMyUploadImage',
        name: 'UpdateMyUploadImage',
        component: () => import(/* webpackChunkName: 'UpdateMyUploadImage' */ '../views/Mine/UpdateMyUploadImage.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: true
        }
      },
      {
        path: '/orderDetail',
        name: 'OrderDetail',
        component: () => import(/* webpackChunkName: 'OrderDetail' */ '../views/OrderDetail.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/personalInformation',
        name: 'PersonalInformation',
        component: () => import(/* webpackChunkName: 'OrderDetail' */ '../views/Mine/PersonalInformation.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/reviewDetail',
        name: 'ReviewDetail',
        component: () => import(/* webpackChunkName: 'ReviewDetail' */ '../views/ReviewDetail.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/speech',
        name: 'Speech',
        component: () => import(/* webpackChunkName: 'Speech' */ '../views/Speech.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: true
        }
      },
      {
        path: '/sponsor',
        name: 'Sponsor',
        component: () => import(/* webpackChunkName: 'Sponsor' */ '../views/Sponsor.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/congressSignUp',
        name: 'CongressSignUp',
        component: () => import(/* webpackChunkName: 'CongressSignUp' */ '../views/CongressSignUp.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/quickSignUp',
        name: 'QuickSignUp',
        component: () => import(/* webpackChunkName: 'QuickSignUp' */ '../views/QuickSignUp.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },

      {
        path: '/congressHistory',
        name: 'congressHistory',
        component: () => import(/* webpackChunkName: 'congressHistory' */ '../views/CongressHistory.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/imageContest',
        name: 'imageContest',
        component: () => import(/* webpackChunkName: 'imageContest' */ '../views/ImageContest.vue'),
        meta: {
          title: 'FMF Clinical Image Contest',
          requiresAuth: false
        }
      },
      {
        path: '/participate',
        name: 'participate',
        component: () => import(/* webpackChunkName: 'participate' */ '../views/Participate.vue'),
        meta: {
          title: 'FMF Clinical Image Contest - Participate',
          requiresAuth: false
        }
      },
      {
        path: '/fmf-supported-courses',
        name: 'FmfSupportedCourses',
        component: () => import(/* webpackChunkName: 'FmfSupportedCourse' */ '../views/SupportedCourses.vue'),
        meta: {
          title: 'FMF Supported Courses',
          requiresAuth: false
        }
      },
      {
        path: '/fmf-supported-course-detail',
        name: 'FmfSupportedCourses',
        component: () => import(/* webpackChunkName: 'FmfSupportedCourse' */ '../views/SupportedCourseDetail.vue'),
        meta: {
          title: 'FMF Supported Course Detail',
          requiresAuth: false
        }
      },
      {
        path: '/fmf-advances-courses',
        name: 'AdvancesCourses',
        component: () => import(/* webpackChunkName: 'FmfSupportedCourses' */ '../views/AdvancesCourses.vue'),
        meta: {
          title: 'FMF Advances Courses',
          requiresAuth: false
        }
      },
      {

        path: '/fellowships',
        name: 'Fellowships',
        component: () => import(/* webpackChunkName: 'Fellowships' */ '../views/Fellowships.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/fmf-affiliations/:country?',
        name: 'FMFAffiliations',
        component: () => import(/* webpackChunkName: 'FMFAffiliations' */ '../views/FMFAffiliations.vue'),
        meta: {
          title: 'FMF Affiliations',
          requiresAuth: false
        }
      },
      {
        path: '/calculators',
        name: 'Calculators',
        component: () => import(/* webpackChunkName: 'Calculators' */ '../views/Calculators.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/research',
        name: 'Research',
        component: () => import(/* webpackChunkName: 'Research' */ '../views/Research.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/research-publications',
        name: 'ResearchPublications',
        component: () => import(/* webpackChunkName: 'ResearchPublications' */ '../views/ResearchPublications.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/look-for-life',
        name: 'SupportDevelopingCountries',
        component: () => import(/* webpackChunkName: 'SupportDevelopingCountries' */ '../views/SupportDevelopingCountries.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/look-for-life-developed',
        name: 'SupportDevelopedCountries',
        component: () => import(/* webpackChunkName: 'SupportDevelopedCountries' */ '../views/SupportDevelopedCountries.vue'),
        meta: {
          title: 'Fetal Medicine Foundation',
          requiresAuth: false
        }
      },
      {
        path: '/fmf-software',
        name: 'FMFSoftware',
        component: () => import(/* webpackChunkName: 'FMFSoftware' */ '../views/FMFSoftware.vue'),
        meta: {
          title: 'FMF software',
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
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import(/* webpackChunkName: 'Registration' */ '../views/Registration.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '../views/login.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/resetPwd',
    name: 'ResetPwd',
    component: () => import(/* webpackChunkName: 'ResetPwd' */ '../views/ResetPwd.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/changeEamil',
    name: 'ChangeEamil',
    component: () => import(/* webpackChunkName: 'ResetPwd' */ '../views/ChangeEmail.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },

  {
    path: '/cme',
    name: 'Cme',
    component: () => import(/* webpackChunkName: 'Cme' */ '../views/Cme.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/payCom',
    name: 'payCom',
    component: () => import(/* webpackChunkName: 'payCom' */ '../views/payCom.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/payResult',
    name: 'payResult',
    component: () => import(/* webpackChunkName: 'payResult' */ '../views/PayResult.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  {
    path: '/previousWorldCongresses',
    name: 'previousWorldCongresses',
    component: () => import(/* webpackChunkName: 'payCom' */ '../views/previousWorldCongresses.vue'),
    meta: {
      title: 'Fetal Medicine Foundation',
      requiresAuth: false
    }
  },
  
  // {
  //   path: '*',
  //   redirect: '/'
  // }
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

// 不需要记录跳转来源的路由
const noRedirectPaths = ['/login', '/resetPwd', '/registration', '/changeEamil']

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 同步记录当前目标路径，供登录后回跳使用（排除登录类页面自身）
  if (!noRedirectPaths.includes(to.path)) {
    localStorage.setItem('currentUrl', to.fullPath)
  }
  // 认证检查
  if (to.meta.requiresAuth) {
    
    const isAuthenticated = localStorage.getItem('token')
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
