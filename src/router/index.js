import Vue from 'vue'
import Router from 'vue-router'
import Replayer from '@/components/Replayer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Replayer',
      component: Replayer
    }
  ]
})
