import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
// import Test from '@/components/pages/Test/Test.vue'
// import Studio from '@/components/pages/Studio/Studio.vue'
// import PrivacyPolicy from '@/components/pages/PrivacyPolicy/PrivacyPolicy.vue'
// import HeartSpace from '@/components/pages/HeartSpace/HeartSpace.vue'
// import Login from '@/components/pages/Login/Login.vue'
import enOS from '@/components/pages/enOS/enOS.vue'
import { LoginStatus } from '@/enOS/data/API.js'
import MenuPage from '@/enOS/menu.vue'

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
      path: '/menu',
      component: MenuPage
    },
    {
      path: '/enOS/:projectID',
      beforeEnter: async (from, to, next) => {
        if (await LoginStatus.check()) {
          next()
        } else {
          next('/menu')
        }
      },
      component: enOS
    },
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
    {
      path: '*',
      redirect: '/'
    }
  ]
})

// form follow conciousness
