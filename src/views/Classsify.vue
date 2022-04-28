<template>
  <div class="classsification">
    <div class="search">
      <h2 >商品分类</h2>
    </div>
    <div class="container" v-if="category">
      <div class="sidebar">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            :title="v.cate_name"
            v-for="v in category"
            :key="v.id"
            @click="onChange"
          />
        </van-sidebar>
      </div>
      <div class="content">
        <div
          class="category"
          v-for="child in category"
          :key="child.id"
          ref="category"
        >
          <Categorytitle>
            <span>{{ child.cate_name }}</span>
          </Categorytitle>
          <van-grid clickable border column-num="3">
            <van-grid-item
             
              v-for="c in child.children"
              :key="c.id"
              @click="goSearch(c.cate_name)"
            >
              <van-image :src="c.pic" />
              <span>{{ c.cate_name }}</span>
            </van-grid-item>
          </van-grid>
        </div>
        <span class="bottom">
          ~我是有底线的~
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { Notify } from 'vant';
import Categorytitle from "../components/Categorytitle";
export default {
  name: "Classsify",
  components: { Categorytitle },
  data() {
    return {
      value: "",
      activeKey: 0,
      category: [],
    };
  },
  //进入路由前获取数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init(vm);
    });
  },
  methods: {
    //初始化
    init(vm) {
      vm.$store.commit("changebar", true);
      vm.axios.get("http://47.115.51.185/api/category").then((data) => {
        vm.category = data.data.data;
        console.log('vm.category==>',vm.category)
      });
    },

    //点击侧边栏改变滚动值
    onChange(index) {
      // let documentscrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollTop = 0;
      for (let i = 0; i < index; i++) {
        scrollTop += this.$refs.category[i].offsetHeight;
      }
      document.documentElement.scrollTop = scrollTop;
      document.body.scrollTop = scrollTop;
    },

    //去查询页
    goSearch(id) {
      this.$router.push({
        path:'/search',
        query:{
          keyword:id
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.classsification {
  @height: 8vh;
  .search {
    position: fixed;
    top: 0;
    width: 100vw;
    height: @height;
    z-index: 999;
    box-shadow: 0 -2px 10px #ccc;
    background-color: #fff;
    h2{
     font-size:18px;
     font-weight:700;
     text-align: center;
     height:  @height;
     line-height:  @height;
    }
  }
  .container {
    position: relative;
    text-align: center;
    .sidebar {
      position: fixed;
      top: @height;
      width: 20vw;
    }
    .content {
      position: absolute;
      top: @height;
      right: 0;
      width: 80vw;
      padding-bottom: 10vh;
      &::-webkit-scrollbar {
        // width: 0;    //用这个会莫名增加高度
        display: none; //个人建议使用这个
      }
      .category {
        //  position: absolute;
      }
      span.bottom {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
/deep/.van-sidebar {
  width: 100%;
}
/deep/.van-sidebar-item {
  line-height: 50px;
  padding: 0 0px;
}
</style>
