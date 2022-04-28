import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isbottombar:true,
    //购物车总数量
    cartCount:0,
  },
  mutations: {
    changebar(state,payload){
       state.isbottombar = payload;
    },
    getCartCount(state,this_) {
      if (!document.cookie) {
        state.cartCount=0;
        return;
      }
      this_.axios({
        method: "get",
        url: this_.baseUrl + "/getOrderList",
        params: {
          type:'0'
        },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
          if (result.data.status === 1380) {
            state.cartCount=result.data.data.length;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  actions: {
  },
  modules: {
  }
})
