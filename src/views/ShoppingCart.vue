<template>
  <div class="shoppingCart">
    <div class="topnav">
      <van-nav-bar
        title="购物车"
        fixed
        :right-text="isedit ? '完成' : '编辑'"
        @click-right="onClickRight"
      >
        <template #left>
          <van-icon
            name="arrow-left"
            size="18"
            color="#333"
            @click="onClickLeft"
          />
        </template>
      </van-nav-bar>
    </div>
    <div class="list" v-if="cartGoodList.length > 0">
      <van-checkbox-group v-model="result">
        <van-swipe-cell v-for="item in cartGoodList" :key="item.id">
          <div class="item">
            <van-checkbox
              :name="item.orderId"
              @click="selectSingle()"
              checked-color="#fc4141"
            ></van-checkbox>
            <van-card
              :price="String(item.realPrice)"
              :desc="item.version + '/' + item.color"
              :title="item.name"
              :thumb="item.img"
              @click-thumb="godetail(item.product_id)"
            >
              <template #num>
                <van-stepper
                  v-model="item.count"
                  theme="round"
                  button-size="22"
                  disable-input
                  @change="updateNum(item.count, item.orderId)"
                />
              </template>
            </van-card>
          </div>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="removeSingle([item.orderId])"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
      <div class="bottomtip">
        到底了！
      </div>
    </div>
    <van-empty
      class="custom-image"
      :image="emptypng"
      description="购物车空空如也！"
      v-if="cartGoodList.length == 0"
    >
      <van-button class="bottom-button" @click="goShopping"
        >去逛一逛</van-button
      >
    </van-empty>
    <van-submit-bar
      :price="totalPrice * 100"
      button-text="提交订单"
      @submit="onSubmit"
      v-show="!isedit && cartGoodList.length > 0"
    >
      <van-checkbox
        v-model="allChecked"
        @click="toggleAll"
        checked-color="#fc4141"
        >全选</van-checkbox
      >
    </van-submit-bar>
    <van-submit-bar
      button-text="删除选择"
      @submit="removeSingle([...result])"
      v-show="isedit && cartGoodList.length > 0"
    >
      <van-checkbox
        class="selectAll"
        v-model="allChecked"
        @click="toggleAll"
        checked-color="#fc4141"
        >全选</van-checkbox
      >
    </van-submit-bar>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapMutations } from "vuex";
import empty from "../assets/image/empty.png";
export default {
  name: "ShoppingCart",
  components: {},
  data() {
    return {
      emptypng: empty,
      count: 0,
      isLoading: false,
      //选中的商品id数组
      result: [],
      allChecked: false,
      isedit: false,

      //购物车商品列表
      cartGoodList: [],

      //商品总价
      totalPrice: 0,

      //地址数量
      addressCount: 0,
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
    });
  },
  computed: {
    //复制一份选中的商品id数组
    selectArr() {
      return [...this.result];
    },
  },
  methods: {
    ...mapMutations(["getCartCount"]),

    //进入页面初始化数据
    init(vm) {
      vm.$store.commit("changebar", true);
      if (document.cookie != undefined) {
        //获取购物车数据
        vm.getCartdata(vm);
        //获取购物车数量
        vm.getCartCount(vm);
      
      }

      vm.result = [];
      vm.allChecked = false;
      vm.isedit = false;
      //商品总价
      vm.totalPrice = 0;
      vm.cartGoodList = [];
    },

    //点击返回按钮
    onClickLeft() {
      this.$router.go(-1);
    },

    //点击编辑
    onClickRight() {
      this.isedit = !this.isedit;
    },

    //选择单个商品
    selectSingle() {
      if (this.result.length == this.cartGoodList.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
      //计算总价
      this.sumTotal();
      // console.log(this.result);
    },

    //切换全选状态
    toggleAll() {
      if (this.allChecked) {
        this.cartGoodList.forEach((val) => {
          this.result.push(val.orderId);
        });
      } else {
        this.cartGoodList.forEach(() => {
          this.result = [];
        });
      }
      //计算总价
      this.sumTotal();
    },

    //获取购物车商品数据
    getCartdata(vm) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      vm.axios({
        method: "get",
        url: vm.baseUrl + "/getOrderList",
        params: {
          type: "0",
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          console.log("getCartdata==>", result);
          if (result.data.status === 1380) {
            vm.cartGoodList = result.data.data;
          }
          // console.log(vm.cartGoodList);
        })
        .catch((error) => {
          console.log(error);
        });
      Toast.clear();
    },

    //删除购物车商品
    removeSingle(ids) {
      console.log("ids==>", ids);
      let orderIds = ids;
      // return;
      this.axios({
        method: "POST",
        url: this.baseUrl + "/removeOrder",
        data: {
          orderIds,
          type: 0,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((data) => {
          if (data.data.status === 1400) {
            this.getCartdata(this);
            this.result = [];

            Toast("删除商品成功！");
          }
        })
        .catch((error) => {
          console.log(error);
        });

      //获取购物车数量
      this.getCartCount(this);
    },

    //修改商品数量
    updateNum(count, orderId) {
      let requestData = {
        orderId: orderId,
        count: count,
      };
      this.axios({
        method: "POST",
        url: this.baseUrl + "/saveOrderCount",
        data: requestData,
      })
        .then((data) => {
          if (data.data.status === 1390) {
            // this.getCartdata(this);
            Toast("修改商品数量成功！");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //获取地址列表
    getAddressList() {
      this.axios({
        method: "GET",
        url: this.baseUrl + "/getAddressList",
        params: {
          page: 1,
          limit: 20,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          if (result.data.status === 1041) {
            return this.$router.push({ name: "Login" });
          }
          if (result.data.status === 1270) {
            this.addressCount = result.data.data.length;
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          this.$toast.clear();
          console.log(error);
        });
    },

    //提交订单
    onSubmit() {
      if (this.result.length == 0) return;
      if (this.addressCount == 0) {
        Toast("请先添加收货地址");
      } else {
        this.$router.push({ path: `/orderConfirm/${[...this.result]}` });
      }
    },

    //去逛一逛
    goShopping() {
      this.$router.push({ name: "Home" });
    },

    //计算总金额
    sumTotal() {
      //商品总价
      let total = 0;
      this.cartGoodList.forEach((val) => {
        if (this.selectArr.includes(val.orderId)) {
          //移除已经计算过的id
          this.selectArr.splice(this.selectArr.indexOf(val.orderId), 1);
          total += val.realPrice * val.count;
        }
      });
      this.totalPrice = total;
    },

    //去详情页
    godetail(id) {
      this.$router.push({ path: `/gooddetails/${id}` });
    },
  },

  created() {
    this.getAddressList();
  },
};
</script>
<style lang="less" scoped>
/deep/.van-nav-bar__text {
  color: #333;
}
.list {
  margin-top: 60px;
  padding-bottom: 150px;
  /deep/.van-swipe-cell {
    background-color: #fff;
    border-radius: 10px;
    margin: 10px;
  }

  /deep/.van-button {
    height: 100%;
  }
  .item {
    display: flex;
    background-color: #fff;
    /deep/.van-checkbox {
      margin-right: 5px;
      width: 10vw;
      padding: 0 15px;
    }
    /deep/.van-card {
      background-color: #fff;
      padding-left: 0;
      margin-top: 0px;
      width: 90vw;
    }
  }
}

/deep/.van-submit-bar {
  bottom: 60px;
}
.selectAll {
  flex: 1;
}
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}
/deep/.van-stepper__plus {
  background-color: #fc4141;
}
/deep/.van-stepper__minus {
  border-color: #fc4141;
}
.bottomtip {
  text-align: center;
  color: #999;
}
/deep/.van-empty {
  padding-top: 46px;
}
/deep/.van-empty__image img {
  transform: translateX(10px);
}
/deep/.van-card__title {
  font-size: 14px;
  line-height: 34px;
}
</style>
