<template>
  <div id="app">
    <van-tabbar
      route
      active-color="#FC4141"
      inactive-color="#8a8a8a"
      v-show="$store.state.isbottombar"
    >
      <van-tabbar-item replace to="/">
        <span>首页</span>
        <template #icon="props">
          <van-icon
            name="wap-home"
            size="30"
            :src="props.active ? icon.active : icon.inactive"
          />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/classsify" icon="search"
        ><span>分类</span>
        <template #icon="props" size="30">
          <img :src="props.active ? icon.active : icon.inactive" /> </template
      ></van-tabbar-item>
      <van-tabbar-item replace to="/shoppingCart" icon="friends-o"
        ><span>购物车</span>
        <template #icon="props">
          <van-icon
            name="shopping-cart"
            size="30"
            :src="props.active ? icon.active : icon.inactive"
            :badge="cartCount>0?cartCount:''"
          /> </template
      ></van-tabbar-item>
      <van-tabbar-item replace to="/personCenter" icon="setting-o"
        ><span>我的</span>
        <template #icon="props">
          <van-icon
            name="manager"
            size="30"
            :src="props.active ? icon.active : icon.inactive"
          /> </template
      ></van-tabbar-item>
    </van-tabbar>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import classsify_active from "./assets/image/classsify_active.svg";
import classsify from "./assets/image/classsify.svg";
import {mapMutations,mapState} from 'vuex';
export default {
  data() {
    return {
      // active: 0,
      icon: {
        active: classsify_active,
        inactive: classsify,
      },
    };
  },
 
  computed:{
    ...mapState(['cartCount'])
  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      vm.getCartCount(vm);
    })
  },
  methods: {
     ...mapMutations(['getCartCount']),
    
  },
};
</script>

<style lang="less">
@tabbar-height: 60px;
body {
  background-color: #f7f7f7;
  font-size: 14px;
}
.auto-img {
  width: 100%;
  display: block;
}
.van-tabbar {
  height: @tabbar-height !important;
  box-shadow: 0 -2px 10px #ccc;
}
[class*="van-hairline"]::after {
  border: none !important;
}
.van-tabbar-item__icon img {
  height: 28px !important;
}
</style>
