<template>
  <div class="home">
    <div class="search">
      <span>杂货铺</span>
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        shape="round"
        @click="onSearch"
      />
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="banner">
        <van-swipe :autoplay="10000" :height="250" indicator-color="#FC4141">
          <van-swipe-item v-for="(item_, index) in swipeProducts" :key="index">
            <img
              class="auto-img"
              :src="item_.detailImg"
              @click="godetail(item_.productId)"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
      <van-notice-bar left-icon="volume-o" :scrollable="false">
        <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :show-indicators="false"
        >
          <van-swipe-item v-for="acItem in acData" :key="acItem.id">公告：{{acItem.text}}</van-swipe-item>
        </van-swipe>
      </van-notice-bar>
      <div class="fastselect">
        <Moretitle>
          <h2>快速选择</h2>
        </Moretitle>
        <div
          class="classsifylist"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
          ref="classsifylist"
        >
          <van-grid ref="classsifygrid">
            <van-grid-item
              v-for="q in quickProduct"
              :key="q.id"
              @click="goSearch(q)"
            >
              <van-image :src="q.img" />
              <span>{{ q.name }}</span>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <div class="goodsrecommend">
        <Moretitle>
          <h2>猜你喜欢</h2>
        </Moretitle>
        <div class="card">
          <div class="goodslist">
            <GoodsCard
              v-for="item in recommendProduct"
              :key="item.id"
              :info="item"
            />
          </div>
        </div>
      </div>
    </van-pull-refresh>

    <div class="topButton" @click="topButton" v-show="topButtonshow">
      <van-icon name="arrow-up" size="30" color="#ccc" />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import Moretitle from "../components/Moretitle";
import GoodsCard from "../components/GoodsCard";
import { mapMutations } from "vuex";

export default {
  name: "Home",
  components: { Moretitle, GoodsCard },
  data() {
    return {
      value: "",
      images: [
        "https://img.yzcdn.cn/vant/apple-1.jpg",
        "https://img.yzcdn.cn/vant/apple-2.jpg",
      ],
      moves: { element: "", startX: 0, moveX: 0, translateX: 0, currentX: 0 },
      //轮播图商品
      swipeProducts: [],
      //快速选择商品
      quickProduct: [],
      //推荐商品
      recommendProduct: [],

      topButtonshow: false,
      count: 0,
      isLoading: false,
      requestStatus: 0,
      acData: [],
    };
  },
  //进入路由前获取数据
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
    });
  },
  computed: {},
  watch: {
    requestStatus(val) {
      //  console.log(val);
      if (val === 200) {
        Toast("刷新成功");
        this.isLoading = false;
      }
    },
  },
  methods: {
    ...mapMutations(["getCartCount"]),

    //初始化
    init(vm) {
      vm.$store.commit("changebar", true);
      vm.refresh(vm);
      //获取购物车数量
      vm.getCartCount(vm);
    },

    onSearch() {
      this.$router.push("/search");
      this.$store.commit("changebar", false);
    },
    touchstart(e) {
      //获取触摸开始X坐标
      this.moves.startX = e.targetTouches[0].pageX;

      // console.log(this.startX);
    },
    touchmove(e) {
      this.moves.element = this.$refs.classsifygrid.$el;
      //获取可以触摸移动最大距离
      this.maxmove =
        this.moves.element.offsetWidth - this.$refs.classsifylist.offsetWidth;
      //  console.log(this.$refs.classsifylist.$el)
      // 获取触摸移动X坐标
      this.moves.moveX = e.targetTouches[0].pageX;
      this.moves.translateX =
        this.moves.moveX - this.moves.startX + this.moves.currentX;
      // 边界判断
      if (this.moves.translateX >= 0) {
        this.moves.translateX = 100;
      } else if (this.moves.translateX <= -this.maxmove) {
        this.moves.translateX = -this.maxmove - 100;
      }
      this.moves.element.style = `transform: translateX(${this.moves.translateX}px);`;
    },
    touchend() {
      this.moves.element = this.$refs.classsifygrid.$el;
      this.moves.currentX = this.moves.translateX;
      if (this.moves.translateX >= 0) {
        this.moves.element.style = `transition: .3s linear;transform: translateX(${0}px);`;
      } else if (this.moves.translateX <= -this.maxmove) {
        this.moves.element.style = `transition: .3s linear;transform: translateX(${this
          .moves.translateX + 100}px);`;
      }
    },
    topButton() {
      document.documentElement.scrollTop = 0;
    },
    onRefresh() {
      this.requestStatus = 0;
      this.refresh(this);
    },
    refresh(vm) {
      vm.quickProduct = [];
      //推荐商品
      vm.recommendProduct = [];
      //请求轮播商品
      vm.axios({
        method: "GET",
        url: vm.baseUrl + "/getBannerProduct",
      })
        .then((result) => {
          // console.log("getBannerProduct==>", result);
          if (result.data.status == 1360) {
            vm.swipeProducts = result.data.data;
            // console.log("this.swipeProducts==>", this.swipeProducts);
          }
        })
        .catch((err) => {
          console.log("err==>", err);
        });

        vm.findannouncement(vm);
      //请求产品数据
      vm.axios({
        method: "GET",
        url: this.baseUrl + "/getAllProducts",
      }).then((result) => {
        // console.log("result==>", result);
        vm.requestStatus = result.status;
        let arr = result.data.data;
        arr = arr.reverse()
        arr.forEach((v) => {
          if (v.isrecommend == 1) {
            vm.recommendProduct.push(v);
            // console.log("vm.recommendProduct==>", vm.recommendProduct);
          }
          if (v.isquickselect == 1) {
            vm.quickProduct.push(v);
            // console.log("vm.quickProduct==>", vm.quickProduct);
          }
        });
      });
    },

    //获取公告数据
    findannouncement(vm) {
      vm.axios({
        method: "GET",
        url: vm.baseUrl + "/findAcList",
      })
        .then((result) => {
          console.log("findannouncement==>", result);
          //获取商品类型
          if (result.data.status == 1380) {
            let data = result.data.data;
            vm.acData = data;
          }
        })
        .catch((err) => {
          console.log("err==>", err);
        });
    },

    godetail(id) {
      this.$store.commit("changebar", false);
      this.$router.push({ path: `/gooddetails/${id}` });
    },

    //去查询页
    goSearch(q) {
      console.log(q);
      this.$router.push({ path: `/search`, query: { keyword: q.name } });
    },
  },

  created(){
   
  },

  mounted() {
    let that = this;
    document.body.onscroll = function() {
      let documentscrollTop = document.documentElement.scrollTop;
      if (documentscrollTop > 0) {
        that.topButtonshow = true;
      } else {
        that.topButtonshow = false;
      }
    };
  },
  updated(){
    //  console.log(this.quickProduct);
    this.$refs.classsifygrid.$el.style.width =
      this.quickProduct.length * 25 + "%";
    
  }
};
</script>
<style lang="less" scoped>
.home {
  padding-bottom: 20vh;
  .search {
    display: flex;
    align-items: center;
    background-color: white;
    // margin-bottom: 10px;
    span {
      width: 15vw;
      font-size: 16px;
      color: #fc4141;
      text-align: right;
      font-weight: bold;
    }
    .van-search {
      flex: 1 !important;
      padding: 20px 30px;
    }
  }
  .banner {
    margin-bottom: 10px;
    /deep/.van-swipe__indicator {
      width: 10px !important;
      height: 5px;
      background-color: black;
      border-radius: 5px;
      -webkit-transition: opacity 0.2s, background-color 0.2s;
      transition: opacity 0.2s, background-color 0.2s;
    }
    /deep/.van-swipe__indicator--active {
      width: 20px !important;
    }
    /deep/.van-swipe-item {
      img {
        height: 100%;
      }
    }
  }
  .morelist {
    margin-bottom: 10px;
    /deep/.van-grid-item {
      position: relative;
      box-sizing: border-box;
      border-right: 0.5px solid #ebedf0;
      border-bottom: 0.5px solid #ebedf0;
    }
  }
  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
  .fastselect {
    .classsifylist {
      overflow: hidden;
      background-color: #fff;
      /deep/.van-grid {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        flex-wrap: nowrap;
        // width: 200%;
        .van-grid-item {
          width: 25%;
        }
      }
    }
  }
  .goodsrecommend {
    .goodslist {
      padding: 0 10px;
      // display: flex;
      // justify-content: space-around;
      // flex-wrap: wrap;
      clear: both;
    }
  }
  .topButton {
    width: 45px;
    height: 45px;
    background-color: #fff;
    position: fixed;
    right: 3vw;
    bottom: 10vh;
    border-radius: 5px;
    text-align: center;
    padding: 5px;
    border: 1px solid #ccc;
  }
}
/deep/.van-grid-item {
  color: #999;
}

/deep/.van-grid-item__content {
  width: 104.3px;
  .van-image {
    width: 100%;
    height: 100%;
  }
}
</style>
