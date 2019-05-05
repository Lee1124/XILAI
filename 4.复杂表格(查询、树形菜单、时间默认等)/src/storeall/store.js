import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // 共同维护的一个状态，state里面可以是很多个全局状态
  state:{
    ImgType:1,
    scrollLefts:0,
    defaultTime:'2018/01/01',
  },
  // 获取数据并渲染
  getters:{

  },
  // 处理数据的唯一途径，state的改变或赋值只能在这里
  mutations: {
    increment(state,ImgType){
      state.ImgType = ImgType;
    },
    scrollLeft(state,scrollLefts){
      state.scrollLefts = scrollLefts;
    }
  },
  // 数据的异步操作
  actions:{

  }
});

