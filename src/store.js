import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(window.localStorage.getItem('userInfo'))
  },
  mutations: {
    changeUser (state, user) {
      // 获取修改的数据
      state.userInfo.name = user.name
      state.userInfo.email = user.email
      state.userInfo.intro = user.intro
      // 更新存入到localstorage中
      window.localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    // 获取修改的图片
    changeImg (state, imgurl) {
      state.userInfo.photo = imgurl
      // 更新localstorage
      window.localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    // 同步用户信息
    setUser (state, user) {
      // 当用户登录的时候,调用Vuex该方法
      // 将用户的信息保存到Vuex的userInfo
      // 同时更新localstorage,实现登录就显示头部的用户信息
      state.userInfo = user
      // 更新localstorage
      window.localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    }
  },
  actions: {

  }
})
