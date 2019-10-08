import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Permalink from './views/Permalink.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/:postid',
      name: 'postid',
      component: Permalink
    }
  ]
})
