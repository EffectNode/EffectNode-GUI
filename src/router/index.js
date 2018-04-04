import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Test from '@/components/pages/Test/Test.vue'
import HeartSpace from '@/components/pages/HeartSpace/HeartSpace.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/heart-space',
      name: 'HeartSpace',
      component: HeartSpace
    }
  ]
})

// form follow conciousness
