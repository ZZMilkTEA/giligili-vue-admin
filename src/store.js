import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:'',
    userNickname:'',
    userId:'',
    avatar:'',
    permission:'',
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.token = token //同步存储token至localStorage
    },
    setUser(state, user) {
      state.userNickname = user.nickname;
      state.userId = user.user_id;
      state.avatar = user.avatar;
      state.permission = user.permission;
    }
  },
  getters : {
    //获取token方法
    //判断是否有token,如果没有重新赋值，返回给state的token
    getToken(state) {
      if (!state.token) {
        state.token = localStorage.getItem('token')
      }
      return state.token
    },
    getUserNickname(state) {
      return state.userNickname;
    },
    getUserId(state) {
      return state.userId;
    },
    getUserAvatar(state) {
      return state.avatar;
    },
    getUserPermission(state) {
      return state.permission;
    },
  },
  actions: {

  },
});
