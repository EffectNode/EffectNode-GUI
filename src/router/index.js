import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
// import Test from '@/components/pages/Test/Test.vue'
// import Studio from '@/components/pages/Studio/Studio.vue'
// import PrivacyPolicy from '@/components/pages/PrivacyPolicy/PrivacyPolicy.vue'
// import HeartSpace from '@/components/pages/HeartSpace/HeartSpace.vue'
// import Login from '@/components/pages/Login/Login.vue'
import enOS from '@/enOS/enOS.vue'
import * as API from '@/enOS/data/API.js'
import MenuPage from '@/enOS/Misc/Menu.vue'
import LandingPage from '@/enOS/Misc/Landing.vue'
import MyHome from '@/enOS/Misc/MyHome.vue'
import OOBE from '@/enOS/Misc/OOBE.vue'

import BlogHome from '@/enOS/blog/pages/BlogHome.vue'
import BlogDetail from '@/enOS/blog/pages/BlogDetail.vue'

// import Mindfulness from '@/components/pages/MindScene/Mindfulness.vue'
// import MindScene from '@/components/pages/MindScene/MindScene.vue'
// import UglyLightHouse from '@/components/pages/MindScene/UglyLightHouse.vue'
// // import ENScene from '@/components/pages/MindScene/ENScene.vue'
// import WelcomeScene from '@/components/pages/MindScene/WelcomeScene.vue'
// import CustomAnimation from '@/components/pages/CustomAnimation/CustomAnimation.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LandingPage
    },
    {
      path: '/blog',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      component: BlogDetail
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    // {
    //   path: '/privacy',
    //   component: PrivacyPolicy
    // },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // },
    {
      path: '/auth',
      component: OOBE
    },
    {
      path: '/profile',
      beforeEnter: async (from, to, next) => {
        if (await API.checkLogin()) {
          next()
        } else {
          next({
            path: '/auth',
            query: {
              redirect: from.fullPath
            }
          })
        }
      },
      component: MyHome
    },
    {
      path: '/menu',
      component: MenuPage
    },
    {
      path: '/enOS',
      redirect: '/menu'
    },
    {
      path: '/enOS/:projectID',
      beforeEnter: async (from, to, next) => {
        if (await API.checkLogin()) {
          next()
        } else {
          next({
            path: '/menu',
            query: {
              redirect: from.fullPath
            }
          })
        }
      },
      component: enOS
    }// ,
    // {
    //   path: '/tca',
    //   name: 'tca',
    //   component: CustomAnimation
    // },
    // {
    //   path: '/test',
    //   name: 'Test',
    //   component: Test
    // },
    // {
    //   path: '/studio',
    //   component: Studio
    // },
    // {
    //   path: '/heart-space',
    //   name: 'HeartSpace',
    //   component: HeartSpace
    // },
    // {
    //   path: '/mindfulness',
    //   name: 'Mindfulness',
    //   component: Mindfulness,
    //   children: [
    //     {
    //       path: '',
    //       redirect: 'welcome'
    //     },
    //     {
    //       path: 'scene',
    //       redirect: 'welcome'
    //     },
    //     {
    //       path: 'heart',
    //       redirect: 'welcome'
    //     },
    //     {
    //       path: 'welcome',
    //       component: WelcomeScene
    //     },
    //     {
    //       path: 'scene/:msid',
    //       name: 'MindScene',
    //       component: MindScene
    //     },
    //     {
    //       path: 'lighthouse/:lid',
    //       name: 'UglyLightHouse',
    //       component: UglyLightHouse
    //     }
    //   ]
    // },
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})

// form follow conciousness
