import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/classsify",
    name: "Classsify",
    component: () => import("../views/Classsify.vue"),
  },
  {
    path: "/shoppingCart",
    name: "ShoppingCart",
    component: () => import("../views/ShoppingCart.vue"),
  },
  {
    path: "/personCenter",
    name: "PersonCenter",
    component: () => import("../views/PersonCenter.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/forgetPassword",
    name: "ForgetPassword",
    component: () => import("../views/ForgetPassword.vue"),
  },
  {
    path: "/search/:id?",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
  {
    path: "/gooddetails/:id",
    name: "Gooddetails",
    component: () => import("../views/Gooddetails.vue"),
  },
  {
    path: "/coffeedetails/:id",
    name: "Coffeedetails",
    component: () => import("../views/Coffeedetails.vue"),
  },
  {
    path: "/personCenter/addressList",
    name: "AddressList",
    component: () => import("../views/AddressList.vue"),
  },
  {
    path: "/personCenter/addressList/addressEdit/:id?",
    name: "AddressEdit",
    component: () => import("../views/AddressEdit.vue"),
  },
  {
    path: "/personCenter/myinfo",
    name: "MyInfo",
    component: () => import("../views/MyInfo.vue"),
  },
  {
    path: "/personCenter/updatePassword",
    name: "UpdatePassword",
    component: () => import("../views/UpdatePassword.vue"),
  },
  {
    path: "/personCenter/myLiked",
    name: "MyLiked",
    component: () => import("../views/MyLiked.vue"),
  },
  {
    path: "/orderConfirm/:ids",
    name: "OrderConfirm",
    component: () => import("../views/OrderConfirm.vue"),
  },
  {
    path: "/personCenter/myorders/:index?",
    name: "MyOrders",
    component: () => import("../views/MyOrders.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name != "PersonCenter") {
    next();
  } else {
    if (document.cookie) {
      next();
    } else {
      setTimeout(()=>{
        next("/login");
      },100)
      
    }
  }
});
export default router;
