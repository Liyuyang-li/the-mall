<template>
  <div class="myorders">
    <div class="topnav">
      <van-nav-bar title="我的订单" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />
    <div class="list">
      <van-tabs
        v-model="active"
        swipeable
        color="#fc4141"
        @change="getOrdersList(active)"
      >
        <van-tab title="待付款">
          <template #title>
            <span class="title">待付款</span>
            <span class="count">{{ ordersListCount[1] }}</span>
          </template>
          <Order
            v-for="(item,index) in ordersList"
            :key="item.orderNum"
            :gooddetail="item"
          >
            <template #order-title>
              <div class="order-title">
                <div class="order_id">订单编号：{{ item.orderNum }}</div>
                <div class="status">未支付</div>
              </div>
            </template>
            <template #btns>
              <div class="btns">
                <van-button
                  size="small"
                  round
                  @click="cancelOrder(item.orderNum,index)"
                  >取消订单</van-button
                >
                <van-button
                  color="#fc4141"
                  size="small"
                  round
                  @click="pay(item.orderNum,index)"
                  >立即付款</van-button
                >
              </div>
            </template>
          </Order>
          <van-empty
            description="暂无订单信息！"
            v-if="ordersList.length == 0"
            :image="emptypng"
          />
        </van-tab>
        <van-tab title="待发货">
          <template #title>
            <span class="title">待发货</span>
            <span class="count">{{ ordersListCount[2] }}</span>
          </template>
          <Order
            v-for="item in ordersList"
            :key="item.orderNum"
            :gooddetail="item"
          >
            <template #order-title>
              <div class="order-title">
                <div class="order_id">订单编号：{{ item.orderNum }}</div>
                <!-- <div class="status">未支付</div> -->
              </div>
            </template>
          </Order>
          <van-empty
            description="暂无订单信息！"
            v-if="ordersList.length == 0"
            :image="emptypng"
          />
        </van-tab>
        <van-tab title="待收货">
          <template #title>
            <span class="title">待收货</span>
            <span class="count">{{ ordersListCount[3] }}</span>
          </template>
          <Order
            v-for="(item,index) in ordersList"
            :key="item.orderNum"
            :gooddetail="item"
          >
            <template #order-title>
              <div class="order-title">
                <div class="order_id">订单编号：{{ item.orderNum }}</div>
                <!-- <div class="status">未支付</div> -->
              </div>
            </template>
            <template #btns>
              <div class="btns">
                <van-button color="#fc4141" size="small" round  @click="confirm(item.orderNum,index)"
                  >确认收货</van-button
                >
              </div>
            </template>
          </Order>
          <van-empty
            description="暂无订单信息！"
            v-if="ordersList.length == 0"
            :image="emptypng"
          />
        </van-tab>
        <!-- <van-tab title="待评价">
          <template #title>
            <span class="title">待评价</span>
            <span class="count">{{ ordersListCount[4] }}</span>
          </template>
          <Order
            v-for="item in ordersList"
            :key="item.orderNum"
            :gooddetail="item"
          >
            <template #order-title>
              <div class="order-title">
                <div class="order_id">订单编号：{{ item.orderNum }}</div>
              </div>
            </template>
            <template #btns>
              <div class="btns">
                <van-button color="#fc4141" size="small" round
                  >去评价</van-button
                >
              </div>
            </template>
          </Order>
          <van-empty
            description="暂无订单信息！"
            v-if="ordersList.length == 0"
            :image="emptypng"
          />
        </van-tab> -->
        <van-tab title="已完成">
          <template #title>
            <span class="title">已完成</span>
            <span class="count">{{ ordersListCount[4] }}</span>
          </template>
          <Order
            v-for="(item,index) in ordersList"
            :key="item.orderNum"
            :gooddetail="item"
          >
            <template #order-title>
              <div class="order-title">
                <div class="order_id">订单编号：{{ item.orderNum }}</div>
                <!-- <div class="status">未支付</div> -->
              </div>
            </template>
            <template #btns>
              <div class="btns">
                <van-button size="small" round @click="removeOrdered(item.orderNum,index)">删除订单</van-button>
              </div>
            </template>
          </Order>
          <van-empty
            description="暂无订单信息！"
            v-if="ordersList.length == 0"
            :image="emptypng"
          />
        </van-tab>
      </van-tabs>
    </div>

    <van-overlay :show="overlayShow" @click="close">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="block-title">
            <van-icon name="success" size="25" />{{orderdata.msg}}
          </div>
          <van-cell title="订单编号" :value="orderdata.orderNum" />
          <van-cell title="下单时间" :value="orderdata.updatedAt" />
          <van-cell title="支付金额" :value="orderdata.totalPrice" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import { Toast } from "vant";
import { Dialog } from "vant";
import Order from "../components/Order.vue";
import empty from "../assets/image/empty.png";
import { tool } from "../assets/js/tool";

export default {
  name: "MyOrders",
  components: {
    Bg,
    Order,
  },
  data() {
    return {
      count: {},
      ordersList: [],
      active: "",
      overlayShow: false,
      orderId: "",
      emptypng: empty,
      //生成的账单数据
      orderdata: {},
    };
  },
  computed: {
    ordersListCount() {
      return this.count;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
       // 获取各种订单类型的数量
    let indexs = [1, 2, 3, 4];
    indexs.forEach((val) => {
      vm.getOrdersCount(val,vm);
     });
    });
  },
  created() {
   
  },
  methods: {
    init(vm) {
      vm.$store.commit("changebar", false);
      // vm.getOrdersdata();
      if (vm.$route.params.index) {
        vm.active = Number(vm.$route.params.index) - 1;
        vm.getOrdersList(vm.active);
      }
    },
    back() {
      this.$router.back();
    },

    //获取用户订单的数量
    getOrdersCount(active,vm) {
      
      let remove = `remove${active}`
      vm.axios({
        method: "get",
        url: vm.baseUrl + "/getOrderList",
        params: {
          type: active,
          [remove]:0
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          if (result.data.status === 1380) {
            let data = result.data.data;
            let ordersList = [];
            data.forEach((v) => {
              ordersList.push(v.orderNum);
            });
            ordersList = [...new Set(ordersList)];

            // console.log("ordersList", ordersList);
            vm.count[active] = ordersList.length;
            // console.log("this.ordersListCount==>", this.ordersListCount);
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          //清除动画
          this.$toast.clear();
        });
    },

    //获取用户订单
    getOrdersList(active) {
      let indexs = [1, 2, 3, 4];
      indexs.forEach((val) => {
      this.getOrdersCount(val,this);
     });
      this.ordersList = [];
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      let remove = `remove${active + 1}`
      this.axios({
        method: "get",
        url: this.baseUrl + "/getOrderList",
        params: {
          type: active + 1,
          [remove]:0
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          if (result.data.status === 1380) {
            // console.log("result==>",result);
            let data = result.data.data;
            // let arr = [...data];
            data.forEach((v) => {
              let obj = {
                orderNum: v.orderNum,
                products: [v],
                updatedAt: v.updatedAt,
              };
              this.ordersList.push(obj);
            });

            for (let i = 0; i < this.ordersList.length; i++) {
              if (
                i > 0 && this.ordersList[i].orderNum &&
                this.ordersList[i].orderNum == this.ordersList[i - 1].orderNum
              ) {
                this.ordersList[i - 1].products.push(
                  this.ordersList[i].products[0]
                );
                this.ordersList.splice(i, 1);
                // break;
              }
            }
            // console.log("ordersList==>",this.ordersList);
            
            //清除动画
            this.$toast.clear();
          } else {
            Toast(result.data.msg);
            //清除动画
            this.$toast.clear();
          }
        })
        .catch((error) => {
          console.log(error);
          //清除动画
          this.$toast.clear();
        });
    },

    //取消未付款订单
    cancelOrder(orderNum,index) {
      Dialog.confirm({
        title: "提示",
        message: "确认取消该订单？",
      })
        .then(() => {
          this.axios({
            method: "POST",
            url: this.baseUrl + "/removeOrder",
            data: {
              orderNum,
              type: 1,
            },
            //请求头添加token
            headers: {
              token: document.cookie,
            },
          })
            .then((data) => {
              if (data.data.status === 1400) {
                this.ordersList.splice(index,1);
                let indexs = [1, 2, 3, 4];
                  indexs.forEach((val) => {
                  this.getOrdersCount(val,this);
                });
                //清除动画
                this.$toast.clear();
              } else {
                Toast(data.data.msg);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          Dialog.cancel();
        });
    },

    //立即付款
    pay(orderNum,index) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: "post",
        url: this.baseUrl + "/updateOrder",
        data: {
          orderNum,
          type:2
        },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
          if (result.data.status === 1410) {
            console.log('pay==>',result);
            let data = result.data;
            this.orderdata.totalPrice = data.totalPrice;
            this.orderdata.orderNum = data.data[0].orderNum;
            this.orderdata.updatedAt = tool.formatDate(data.data[0].updatedAt, "yyyy-MM-dd hh:mm:ss");
            this.orderdata.msg = data.msg;
            this.overlayShow = true;
            //清除动画
            this.$toast.clear();
            this.ordersList.splice(index,1);
           let indexs = [1, 2, 3, 4];
              indexs.forEach((val) => {
              this.getOrdersCount(val,this);
            });
          } else {
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          //清除动画
          this.$toast.clear();
        });
    },

    close(){
      this.overlayShow = false;
    },

    //确认收货
    confirm(orderNum,index) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: "post",
        url: this.baseUrl + "/updateOrder",
        data: {
          orderNum,
          type:4
        },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
          if (result.data.status === 1410) {
            //清除动画
            this.$toast.clear();
            this.ordersList.splice(index,1);
           let indexs = [1, 2, 3, 4];
              indexs.forEach((val) => {
              this.getOrdersCount(val,this);
            });
          } else {
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          //清除动画
          this.$toast.clear();
        });
    },

    //删除已完成订单
    removeOrdered(orderNum,index) {
      Dialog.confirm({
        title: "提示",
        message: "确认永久删除该订单？",
      })
        .then(() => {
          this.axios({
            method: "POST",
            url: this.baseUrl + "/removeOrder",
            data: {
              orderNum,
              type: 4,
            },
            //请求头添加token
            headers: {
              token: document.cookie,
            },
          })
            .then((data) => {
              if (data.data.status === 1400) {
                this.ordersList.splice(index,1);
                let indexs = [1, 2, 3, 4];
                  indexs.forEach((val) => {
                  this.getOrdersCount(val,this);
                });
                //清除动画
                this.$toast.clear();
              } else {
                Toast(data.data.msg);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          Dialog.cancel();
        });
    },

  },
};
</script>

<style lang="less" scoped>
.list {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
  top: -30px;
  margin: 10px;
  .order-title {
    color: #666;
    font-size: 16px;
    background-color: #fff;
    padding: 10px 10px 0 10px;
    display: flex;
    align-items: center;
    .order_id {
    }
    .status {
      flex: 1;
      text-align: right;
      color: red;
    }
  }
  .btns {
    margin-top: 10px;
    text-align: right;
    /deep/.van-button {
      margin-right: 10px;
      &:first-child {
        color: #888;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
/deep/.van-tab__text {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 5px 0;
  .title {
    flex: 1;
    margin-bottom: 5px;
  }
  .count {
    flex: 1;
    margin-bottom: 5px;
  }
}
/deep/.van-tabs__nav {
  background-color: #fff;
}
/deep/.van-tabs__wrap {
  height: auto;
}
/deep/.van-tabs__nav--line {
  padding-bottom: 10px;
}
/deep/.van-empty__image img {
  transform: translateX(10px);
}

.block {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  width: 80%;
  // position: relative;
  margin: 50% auto;
  .block-title {
    font-size: 16px;
    text-align: center;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/.van-cell__title {
    flex: 1;
  }
  /deep/.van-cell__value {
    flex: 3;
  }
}
</style>
