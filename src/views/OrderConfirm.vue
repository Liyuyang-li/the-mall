<template>
  <div class="oderconfirm">
    <div class="topnav">
      <van-nav-bar title="生成订单" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>

    <div class="main">
      <div class="defaultaddress" v-if="list.length > 0">
        <van-cell
          center
          value="选择地址"
          :label="selectlist[0].address"
          is-link
          icon="location-o"
          @click="listShow = true"
        >
          <template #title>
            <span class="custom-title"
              ><span class="name">{{ selectlist[0].name }}</span
              >&nbsp;{{ selectlist[0].phone }}</span
            >
            <van-tag type="danger" v-if="selectlist[0].isDefault">默认</van-tag>
          </template>
        </van-cell>
        <div class="line"></div>
      </div>
      <div class="orderList" v-if="gooddetail.length > 0">
        <div class="title">订单信息</div>
        <div class="list">
          <van-card
            :num="g.count"
            :price="g.realPrice"
            :title="g.name"
            :desc="g.version + g.color"
            :thumb="g.img"
            v-for="g in gooddetail"
            :key="g.id"
          />
        </div>
        <div class="total">
          <div class="time">{{ getcurrentTime() }}</div>
          <div class="total-num-price">
            <div class="total-num">共计{{ gooddetail.length }}件</div>
            <div class="total-price">合计&nbsp;&yen;{{ totalPrice }}</div>
          </div>
        </div>
      </div>
      <van-button type="primary" color="#fc4141" round block @click="pay"
        >立即结算</van-button
      >
      <van-action-sheet v-model="listShow" title="选择地址">
        <van-address-list
          v-model="selectId"
          :list="list"
          default-tag-text="默认"
          @add="addAdress"
          @select="select"
        />
        <van-empty
          description="你还没有收货地址哦，去添加收货地址吧！"
          v-if="list.length == 0"
        />
      </van-action-sheet>
    </div>

    <van-overlay :show="overlayShow" @click="goBack">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="block-title">
            <van-icon name="success" size="25" />{{ orderdata.msg }}
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
import { Toast } from "vant";

export default {
  data() {
    return {
      //选择的地址id
      selectId: "",
      list: [],
      listShow: false,
      gooddetail: [],
      currentTime: "",
      //生成的订单数据
      orderdata: {},
      //遮罩层
      overlayShow: false,
    };
  },

  computed: {
    selectlist() {
      if (this.selectId == "") {
        return [
          {
            address: "",
            name: "",
            phone: "",
            isDefault: false,
          },
        ];
      } else {
        return this.list.filter((val) => {
          if (val.address_id == this.selectId) {
            return true;
          } else {
            return false;
          }
        });
      }
    },
    //总金额
    totalPrice() {
      let total = 0;
      this.gooddetail.forEach((v) => {
        total += v.costPrice;
      });
      return total;
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
    });
  },
  methods: {
    init(vm) {
      vm.$store.commit("changebar", false);
      vm.getAddressList();

      // vm.getcurrentTime();
    },
    back() {
      this.$router.back();
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
            let arr = result.data.data;
            console.log("arr==>", arr);
            arr.forEach((val) => {
              val.tel = val.phone;
              val.address = `${val.province}${val.city}${val.county}${val.address_detail}`;
              val.isDefault = !!val.is_default;
              val.id = val.address_id;
              if (val.isDefault) {
                this.selectId = val.address_id;
                console.log("this.selectId==>", this.selectId);
              }
            });
            this.list = arr;
            this.getdetails();
            this.$toast.clear();
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          this.$toast.clear();
          console.log(error);
        });
    },

    //切换地址
    select(item) {
      // console.log(item,index)
      this.selectId = item.address_id;
      this.listShow = false;
    },
    addAdress() {
      this.$router.push({ name: "AddressEdit" });
    },

    //获取商品信息
    getdetails() {
      console.log("this.selectId==>", this.selectId);
      this.axios({
        method: "POST",
        url: this.baseUrl + "/updateOrder",
        data: {
          orderIds: this.$route.params.ids,
          type: 1,
          addressId: this.selectId,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((data) => {
          if (data.data.status === 1410) {
            let arr = data.data.data;
            // console.log('getdetails==>',arr);
            this.gooddetail = arr;
            this.$toast.clear();
          } else {
            Toast(data.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //获取当前时间
    getcurrentTime() {
      let currentTime = Date.now();

      let date = new Date(currentTime);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();

      let hour =
        date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
      let minute =
        date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
      let second =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },

    //立即结算
    pay() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "post",
        url: this.baseUrl + "/updateOrder",
        data: {
          orderIds: this.$route.params.ids,
          type: 2,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          if (result.data.status === 1410) {
            console.log("pay==>", result);
            let data = result.data;
            this.orderdata.totalPrice = data.totalPrice;
            this.orderdata.orderNum = data.data[0].orderNum;
            this.orderdata.updatedAt = data.data[0].updatedAt;
            this.orderdata.msg = data.msg;
            this.overlayShow = true;
            //清除动画
            this.$toast.clear();
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

    //获取订单结算的数据
    getorderData(orderId) {
      let token = this.$cookies.get("token");
      this.axios({
        method: "get",
        url: this.baseUrl1 + "/order/detail/" + orderId,
        params: {},
        //请求头添加token
        headers: {
          "Authori-zation": `Bearer ${token}`,
        },
      })
        .then((data) => {
          if (data.data.status === 200) {
            this.orderdata = data.data.data;
            // console.log("orderdata==>", this.orderdata);
          } else {
            Toast({
              message: data.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //支付后返回
    goBack() {
      this.overlayShow = false;
      this.$router.push({
        path: "/shoppingCart",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 56px 10px 0;
}
.custom-title {
  margin-right: 4px;
  vertical-align: middle;
}
.total {
  padding-top: 20px;
  // border-style: dashed;
  border-top: 2px dashed #999;
  position: relative;
  &::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    top: -12px;
    left: -20px;
    background-color: #f7f7f7;
  }
  &::after {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    top: -12px;
    right: -20px;
    background-color: #f7f7f7;
  }
  .time {
    color: #999;
    font-size: 14px;
  }
  .total-num-price {
    display: flex;
    color: #999;
    font-size: 14px;
    .total-num {
      flex: 1;
    }
    .total-price {
      flex: 1;
      text-align: right;
      color: red;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
.search-icon {
  font-size: 16px;
  line-height: inherit;
}
/deep/.van-icon-edit {
  display: none;
}
/deep/.van-cell__title {
  flex: 3;
  margin-left: 15px;
  .name {
    margin-right: 10px;
  }
}
/deep/.van-cell__value {
  flex: 1;
}
/deep/.van-tag--danger {
  border-radius: 10px;
}
/deep/.van-cell {
  padding: 10px;
}
.line {
  height: 2px;
  width: 100%;
  background-image: url(http://47.115.51.185/h5/img/line.05bf1c84.jpg);
}
.orderList {
  padding: 10px;
  background-color: #fff;
  margin-bottom: 20px;
  .title {
    color: #999;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .list {
    margin-bottom: 20px;
  }
}
/deep/.van-card {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
}

/deep/.van-card__title {
  margin-top: 10px;
}
/deep/.van-card__bottom {
  // margin-bottom: 20px;
}
/deep/.van-card__price {
  color: red;
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
