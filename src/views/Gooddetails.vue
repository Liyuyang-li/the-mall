<template>
  <div class="gooddetail">
    <div class="topnav">
      <van-nav-bar title="商品详情" fixed>
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
    <div class="goodcard">
      <van-swipe @change="onChange">
        <van-swipe-item v-for="(b, i) in slider_image" :key="i">
          <img :src="b" class="auto-img" />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            {{ current + 1 }}/{{ slider_image.length }}
          </div>
        </template>
      </van-swipe>
      <div class="derection">
        <div class="title">
          {{ gooddetail.name }}
        </div>
        <div class="prices">
          <span class="newprice">￥{{ gooddetail.price }}</span>
        </div>
        <div class="number">
          <span class="oldprice">原价：￥{{ gooddetail.or_price }}</span>
          <span>库存：{{ gooddetail.kucun }}{{ gooddetail.unit }}</span>
          <span class="stopnum"
            >销量：{{ gooddetail.sales }}{{ gooddetail.unit }}</span
          >
        </div>
      </div>
    </div>
    <div class="select">
      <h3 style="line-height:22px">
        规格 <span>已选：</span><span>{{ selectSku.version }} </span
        ><span>{{ selectSku.color }} </span><span>{{ count }}</span
        ><span>{{ gooddetail.unit }} </span>
        <span style="color:#fe8365">{{ sku.price }} 元</span>
      </h3>
      <div class="specifications">
        <div class="sku">
          <div v-if="selectSku.version != ''">
            <span class="title">选择版本或尺寸</span>
            <div class="lable">
              <van-tag
                round
                type="primary"
                style="margin-right:10px"
                :class="selectSku.version == version ? 'active' : ''"
                :color="bgcolor"
                :text-color="textColor"
                size="large"
                @click="selectsku(version, 'version')"
                v-for="(version, index) in selectlables.version"
                :key="index"
                >{{ version }}</van-tag
              >
            </div>
          </div>
          <div v-if="selectSku.color != ''">
            <span class="title">选择颜色或款式</span>
            <div class="lable">
              <van-tag
                round
                type="primary"
                style="margin-right:10px"
                :class="selectSku.color == color ? 'active' : ''"
                :color="bgcolor"
                :text-color="textColor"
                size="large"
                @click="selectsku(color, 'color')"
                v-for="(color, index) in selectlables.color"
                :key="index"
                >{{ color }}</van-tag
              >
            </div>
          </div>
          <div style="display:flex">
            <span class="title" style="width:250px">购买数量</span
            ><van-stepper v-model="count" min="1" />
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="detail-title">
        产品介绍
      </div>
      <div class="detail-message" ref="description"></div>
      <div>
        <img :src="gooddetail.detail_img" alt="" />
      </div>
      <div class="detail-bottom">
        到底了~
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon icon="share" text="分享" color="#666" />
      <van-goods-action-icon
        icon="shopping-cart"
        color="#666"
        text="购物车"
        @click="goCart"
        :badge="cartCount > 0 ? cartCount : ''"
      />
      <van-goods-action-icon
        icon="like"
        :text="liked ? '已收藏' : '收藏'"
        :color="liked ? '#ff5000' : '#666'"
        @click="togglelike"
      />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="onAddCartClicked"
      />
      <van-goods-action-button
        type="danger"
        text="立即购买"
        @click="onBuyClicked"
      />
    </van-goods-action>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Gooddetails",
  data() {
    return {
      current: 0,
      gooddetail: {},
      slider_image: [],
      show: false,
      //选择的规格
      selectSku: {
        version: "",
        color: "",
      },
      //选择的规格id
      // skuId:'',
      //购买数量
      count: 1,
      //返回的sku
      skus: [{ version: "", color: "", skuId: "", price: "" }],
      //可选择的规格
      selectlables: {
        version: [],
        color: [],
      },
      //标签背景色
      bgcolor: "#e4e4e4",
      //标签文字颜色
      textColor: "#333333",
      liked: false, //收藏状态

      //购物车id
      cartId: 0,

      cartGoodList: [],
      addressCount: 0,
    };
  },
  computed: {
    goods() {
      // 默认商品 sku 缩略图
      return {
        picture: this.gooddetail.storeInfo.image_base,
      };
    },
    goodsId() {
      return this.$route.params.id; //商品id
    },
    //购物车商品数量
    ...mapState(["cartCount"]),
    //对应的价格和skuId
    sku() {
      let sku = {
        price: "",
        skuId: "",
      };
      for (let key in this.selectSku) {
        console.log(key);
        for (let i = 0; i <= this.skus.length; i++) {
          if (
            this.selectSku.version == this.skus[i].version &&
            this.selectSku.color == this.skus[i].color
          ) {
            console.log("sku==>", this.skus[i]);
            // this.skuId = this.skus[i].skuId;
            sku.price = this.skus[i].price;
            sku.skuId = this.skus[i].skuId;
            break;
          }
        }
      }

      return sku;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit("changebar", false);
      vm.getProductData();
      vm.getSkuData();
      //获取购物车数量
      if (document.cookie !== undefined) {
        vm.getCartCount(vm);
        vm.findlike(vm);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    //重置商品数据
    this.gooddetail = {};
    this.slider_image = [];
    //重置可选择的规格
    this.selectlables = {
      version: [],
      color: [],
    };
    next();
  },
  created(){
    this.getAddressList();
  },
  methods: {
    ...mapMutations(["getCartCount"]),
    onChange(index) {
      this.current = index;
    },
    //点击返回按钮
    onClickLeft() {
      this.$router.back();
      this.$store.commit("changebar", true);
    },

    //获取商品详情数据
    getProductData() {
      // console.log("goodsId==>", this.$route.params);
      document.documentElement.scrollTop = 0;
      // document.body.scrollTop = 0;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/getProductByProductId",
        params: {
          productId: this.goodsId,
        },
      })
        .then((result) => {
          if (result.data.status === 1190) {
            this.gooddetail = result.data.data[0];
            this.slider_image.push(result.data.data[0].img);
            this.$refs.description.innerHTML = this.gooddetail.desc;
            // console.log("this.gooddetail==>", this.gooddetail);

            //清除动画
            this.$toast.clear();
          } else {
            Toast(result.data.msg);
            //清除动画
            this.$toast.clear();
          }
        })
        .catch((error) => {
          this.$toast.clear();
          console.log("error ==> ", error);
        });
    },

    //获取商品规格数据
    getSkuData() {
      this.axios({
        method: "GET",
        url:  this.baseUrl+"/findskuByProductId",
        params: {
          productId: this.goodsId,
        },
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          // console.log("findskuByProductId==>", result);
          //获取商品类型
          if (result.data.status == 1190) {
            let data = result.data.data;
            this.skus = data;
            for (let key in this.selectlables) {
              data.forEach((v) => {
                this.selectlables[key].push(v[key]);
              });

              //去重
              let set = new Set(this.selectlables[key]);
              this.selectlables[key] = [...set];
            }
            this.selectsku();
            // console.log("this.selectlables==>", this.selectlables);
          }
        })
        .catch((err) => {
          console.log("err==>", err);
        });
    },

    //选择规格
    selectsku(text, type) {
      if (!text) {
        this.selectSku.version = this.selectlables.version[0];
        this.selectSku.color = this.selectlables.color[0];
      } else {
        if (type == "version") {
          this.selectSku.version = text;
        } else {
          this.selectSku.color = text;
        }
        // console.log("this.selectSku==>", this.selectSku);
      }
    },

    //查找是否收藏
    findlike(vm) {
      if (!document.cookie) return;
      vm.axios({
        method: "POST",
        url: vm.baseUrl + "/findIsLiked",
        data: {
          productId: vm.goodsId,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      }).then((result) => {
        if (result.data.status === 1041) {
          return vm.$router.push({ name: "Login" });
        }
        //收藏商品数组
        console.log("dataliked==>", result);
        let likedArr = result.data.data;
        if (likedArr.length > 0) {
          vm.liked = true;
        } else {
          vm.liked = false;
        }
      });
    },

    //切换收藏
    togglelike() {
      let token = document.cookie;
      if (token) {
        this.liked = !this.liked;
        if (this.liked) {
          this.like();
        } else {
          this.notliked();
        }
      } else {
        Toast("请先登录！");
      }
    },

    //收藏
    like() {
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addLiked",
        data: {
          productId: this.goodsId,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      }).then((result) => {
        if (result.data.status === 1041) {
          return this.$router.push({ name: "Login" });
        }
        if (result.data.status === 1320) {
          this.result = result.data;
          console.log("like", result);
          //清除动画
          this.$toast.clear();
          Toast(result.data.msg);
        } else {
          Toast(result.data.msg);
          //清除动画
          this.$toast.clear();
        }
      });
      this.liked = true;
    },

    //取消收藏
    notliked() {
      this.axios({
        method: "post",
        url: this.baseUrl + "/removeLiked",
        data: {
          productId: this.goodsId,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      }).then((result) => {
        console.log("notliked==>", result);
        if (result.data.status == 1340) {
          Toast("取消收藏");
        }
      });
      this.liked = false;
    },

    //去往购物车
    goCart() {
      this.$router.push({ name: "ShoppingCart" });
      this.$store.commit("changebar", true);
      this.selectdata = {};
    },

    //获取地址列表
    getAddressList() {
      if(!document.cookie){
        return
      }
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

    //添加购物车
    onAddCartClicked(type = "0") {
      let token = document.cookie;
      if (!token) {
        Toast("请先登录！！！");
        return;
      }
      // 获取skudata
      let sku = {
        skuId: this.sku.skuId,
        count: this.count,
      };
      // console.log('sku==>',sku);
      // return;
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addOrder",
        data: {
          ...sku,
          productId: this.goodsId,
          type: "0",
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      }).then((result) => {
        if (result.data.status == 1370) {
          if (type == "1") {
            this.getCartdata();
          }else{
           Toast("成功添加购物车！");
          }
          
        }
      });
    },

    //获取购物车商品数据
    getCartdata() {
      if(!document.cookie){
        return
      }
      this.axios({
        method: "get",
        url: this.baseUrl + "/getOrderList",
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
            this.cartGoodList = result.data.data;
            if (this.addressCount == 0) {
              Toast("请先添加收货地址");
            } else {
              this.$router.push({
                path: `/orderConfirm/${[
                  this.cartGoodList[this.cartGoodList.length - 1].orderId,
                ]}`,
              });
              Toast("成功生成订单！");
            }
          }
          // console.log(vm.cartGoodList);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //立即购买
    onBuyClicked() {
      this.onAddCartClicked("1");
    },
  },
};
</script>

<style lang="less" scoped>
.gooddetail {
  padding-bottom: 60px;
  width: 100vw;
  overflow: hidden;
}
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
  color: white;
}
.van-goods-action {
  padding: 5px 0;
}
.goodcard {
  padding-top: 46px;
}
.derection {
  padding: 10px;
  background-color: #fff;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .prices {
    padding: 5px 0;
    span {
      &.newprice {
        font-size: 16px;
        color: red;
        font-weight: bold;
      }
      &.vipprice {
      }
    }
  }
  .number {
    display: flex;
    span {
      flex: 1;
      text-align: center;
      color: #999;
      &.oldprice {
        text-align: left;
      }
      &.stopnum {
        text-align: right;
      }
    }
  }
}
.select {
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  h3 {
    font-size: 14px;
    font-weight: 700;
  }
  .specifications {
    font-size: 14px;
    // font-weight: 700;
    line-height: 30px;
    span {
      display: inline-block;
      &.title {
        width: 110px;
        font-weight: normal;
      }
    }
  }
}
.detail {
  padding: 10px;
  margin-top: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .detail-title {
    font-size: 14px;
    font-weight: 700;
  }
  .detail-message {
    flex: 1;
  }
  .detail-bottom {
    text-align: center;
    padding: 10px 0;
  }
}

.active {
  background-color: #fef3f0 !important;
  color: #fe8365 !important;
  border: 1px solid #fe8365;
}
</style>
