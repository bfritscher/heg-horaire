import Vue from 'vue'
import Router from 'vue-router'
import Horaire from '@/components/Horaire'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Horaire',
      component: Horaire
    }
  ]
})
