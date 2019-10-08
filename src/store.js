import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    node: process.env.VUE_APP_NODE,
    hide: Number(process.env.VUE_APP_HIDE)
  },
  getters: {
    node(state){
      return state.node;
    },
    hide(state){
      return state.hide;
    }
  },
  mutations: {
  },
  actions: {
  }
})