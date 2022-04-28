import Vue from "vue";
import './assets/css/animate.min.css'
import './assets/css/minireset.min.css'
// import  './plugins/axios'
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入px转rem文件
import "lib-flexible/flexible";
import Vant from "vant";
import "vant/lib/index.css";
import { Lazyload, PullRefresh } from "vant";
Vue.use(Vant)
  .use(Lazyload)
  .use(PullRefresh);

//引入axios、VueAxios
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
//引入cookie
import VueCookies from "vue-cookies";
// import { prototype } from 'vue/types/umd'
Vue.use(VueCookies);
// 请求拦截器，请求之前执行
axios.interceptors.request.use((config) => {
  // console.log("config==>",config);
  if (config.method === "post") {
    let paramStr = "";
    // console.log(config);
    if (config.url === "http://47.115.51.185/api/address/edit" 
       || config.url === "http://47.115.51.185/api/address/del"
       || config.url === "http://47.115.51.185/api/user/edit"
       || config.url === "http://47.115.51.185/api/upload/image"
       || config.url === "http://47.115.51.185/api/order/cancel"
       || config.url === "http://47.115.51.185/api/order/pay"
       || config.url === "http://47.115.51.185/api/order/create") {
      return config
    } else {
      for (let key in config.data) {
        paramStr += `${key}=${config.data[key]}&`;
      }
      config.data = paramStr.slice(0, -1);
      return config;
    }
  }
  return config;
});

//将请求路径和appkey存放在原型属性里
// Vue.prototype.baseUrl = "http://182.61.34.149:9001";
Vue.prototype.baseUrl = "http://127.0.0.1:9000";
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
