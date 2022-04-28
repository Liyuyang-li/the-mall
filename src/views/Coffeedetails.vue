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
          <div class="custom-indicator">{{ current + 1 }}/4</div>
        </template>
      </van-swipe>
      <div class="derection">
        <div class="title">
          {{ gooddetail.storeInfo.store_name }}
        </div>
        <div class="prices">
          <span class="newprice">￥{{ gooddetail.storeInfo.price }}</span>
          <span class="vipprice">￥{{ gooddetail.storeInfo.vip_price }}</span>
        </div>
        <div class="number">
          <span class="oldprice"
            >原价：￥{{ gooddetail.storeInfo.ot_price }}</span
          >
          <span>库存：{{ gooddetail.storeInfo.stock }}件</span>
          <span class="stopnum">销量：{{ gooddetail.storeInfo.ficti }}件</span>
        </div>
      </div>
    </div>
    <div class="select" @click="select">
      <h3>规格</h3>
      <div class="specifications">
        <span class="title"
          >选择规格:{{ selectdata.rules }}-{{ selectdata.num }}件</span
        ><span class="arrow"><van-icon name="arrow" size="18"/></span>
      </div>
    </div>
    <div class="detail">
      <div class="detail-title">
        产品介绍
      </div>
      <div class="detail-message" ref="description"></div>
      <div class="detail-bottom">
        到底了~
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon icon="share" text="分享" color="#666" />
      <van-goods-action-icon icon="shopping-cart" color="#666" text="购物车" />
      <van-goods-action-icon
        icon="like"
        :text="liked?'已收藏':'收藏'"
        :color="liked?'#ff5000':'#666'"
        @click="togglelike"
      />
      <van-goods-action-button type="warning" text="加入购物车" @click="select"/>
      <van-goods-action-button type="danger" text="立即购买" @click="select"/>
    </van-goods-action>
    <van-sku
      v-model="show"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :quota="quota"
      :quota-used="quotaUsed"
      :hide-stock="sku.hide_stock"
      :message-config="messageConfig"
      :initial-sku="initialSku"
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "Gooddetails",
  data() {
    return {
      goodsId: 0, //商品id
      quotaUsed: 0, //已经购买过的数量
      quota: 0, //限购数，0表示不限购
      messageConfig: {
        // 数据结构见下方文档
      },
      initialSku: {
        //默认选中的 sku
        // 键：skuKeyStr（sku 组合列表中当前类目对应的 key 值）
        // 值：skuValueId（规格值 id）
        s1: "1",
        s2: "1",
        // 初始选中数量
        selectedNum: 1,
        // 初始选中的商品属性
        // 键：属性id
        // 值：属性值id列表
        selectedProp: {
          123: [1222],
        },
      },

      current: 0,
      gooddetail: {
        storeInfo: {
          store_name: "",
          price: 0,
        },
      },
      slider_image: [],
      show: false,
      selectdata: {},
      liked: false, //收藏状态
    };
  },
  computed: {
    sku() {
      let sku = {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
          // {
          //   k: "颜色", // skuKeyName：规格类目名称
          //   k_s: "s1", // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          //   v: [
          //     {
          //       id: "1", // skuValueId：规格值 id
          //       name: "红色", // skuValueName：规格值名称
          //       imgUrl: this.gooddetail.storeInfo.image_base, // 规格类目图片，只有第一个规格类目可以定义图片
          // previewImgUrl: this.gooddetail.storeInfo.image_base, // 用于预览显示的规格类目图片
          //     },
          //     {
          //       id: "2",
          //       name: "蓝色",
          //       imgUrl: this.gooddetail.storeInfo.image_base,
          //       previewImgUrl: this.gooddetail.storeInfo.image_base,
          //     },
          //   ],
          //   largeImageMode: false, //  是否展示大图模式
          // },
          // {
          //   k: "尺寸", // skuKeyName：规格类目名称
          //   k_s: "s2", // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          //   v: [
          //     {
          //       id: "1", // skuValueId：规格值 id
          //       name: "S", // sskuValueName：规格值名称
          //     },
          //     {
          //       id: "2",
          //       name: "M",
          //     },
          //     {
          //       id: "3",
          //       name: "L",
          //     },
          //   ],
          //   largeImageMode: false, //  是否展示大图模式
          // },
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          // {
          //   id: 2259, // skuId
          //   s1: "1", // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: "1", // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110, // 当前 sku 组合对应的库存
          // },
          // {
          //   id: 2259, // skuId
          //   s1: "1", // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: "2", // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110, // 当前 sku 组合对应的库存
          // },
          // {
          //   id: 2259, // skuId
          //   s1: "1", // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: "3", // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110, // 当前 sku 组合对应的库存
          // },
          // {
          //   id: 2260, // skuId
          //   s1: "2", // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: "1", // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110, // 当前 sku 组合对应的库存
          // },
          // {
          //   id: 2260, // skuId
          //   s1: "2", // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: "2", // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110, // 当前 sku 组合对应的库存
          // },
          // {
          //   id: 2260, // skuId
          //   s1: "2", // 规格类目 k_s 为 s1 的对应规格值 id
          //   s2: "3", // 规格类目 k_s 为 s2 的对应规格值 id
          //   price: 100, // 价格（单位分）
          //   stock_num: 110, // 当前 sku 组合对应的库存
          // },
        ],
        price: this.gooddetail.storeInfo.price, // 默认价格（单位元）
        // stock_num: this.gooddetail.storeInfo.productValue[key].stock, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        messages: [
          {
            // 商品留言
            datetime: "0", // 留言类型为 time 时，是否含日期。'1' 表示包含
            multiple: "0", // 留言类型为 text 时，是否多行文本。'1' 表示多行
            name: "留言", // 留言名称
            type: "text", // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
            required: "0", // 是否必填 '1' 表示必填
            placeholder: "", // 可选值，占位文本
          },
        ],
        hide_stock: false, // 是否隐藏剩余库存
      };
      let productAttr = this.gooddetail.productAttr;
      let productValue = this.gooddetail.productValue;
      if (productAttr) {
        //tree
        for (let i = 0; i < productAttr.length; i++) {
          sku.tree.push({
            k: productAttr[i].attr_name, // skuKeyName：规格类目名称
            k_s: `s${i + 1}`, // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [],
            largeImageMode: false, //  是否展示大图模式
          });
          for (let j = 0; j < productAttr[i].attr_values.length; j++) {
            let v = {
              id: `${j + 1}`, // skuValueId：规格值 id
              name: productAttr[i].attr_values[j], // skuValueName：规格值名称
              // imgUrl: this.gooddetail.storeInfo.image_base, // 规格类目图片，只有第一个规格类目可以定义图片
              previewImgUrl: this.gooddetail.storeInfo.image_base, // 用于预览显示的规格类目图片
            };

            sku.tree[i].v.push(v);
            //list
            for (let key in productValue) {
              sku.list.push({
                id: 2260 + j, // skuId
                s1: j + 1, // 规格类目 k_s 为 s1 的对应规格值 id
                s2: i + 1, // 规格类目 k_s 为 s2 的对应规格值 id
                price: productValue[key].price * 100, // 价格（单位分）
                stock_num: productValue[key].stock, // 当前 sku 组合对应的库存
              });
              // sku.tree[i].v.previewImgUrl = productValue[key].image;
              // sku.tree[i].v.previewImgUrl = productValue[key].image;
            }
          }
        }
      }
      return sku;
    },
    goods() {
      // 默认商品 sku 缩略图
      return {
        picture: this.gooddetail.storeInfo.image_base,
      };
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.liked = false;
      vm.getbannerdata(); 
      vm.findlike(vm);
    });
  },
 
  methods: {
    onChange(index) {
      this.current = index;
    },
    //点击返回按钮
    onClickLeft() {
      this.$router.back();
      this.$store.commit("changebar", true);
      this.selectdata = {};
    },
    //获取商品详情数据
    getbannerdata() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "get",
        url: this.baseUrl2 + '/productDetail',
        params:{
          appkey: this.appkey,
          pid: this.$route.params.id,
        }
      }).then((data) => {
        console.log(data);
        // this.gooddetail = data.data.data;
        // this.slider_image = this.gooddetail.storeInfo.slider_image;
        // this.$refs.description.innerHTML = this.gooddetail.storeInfo.description;
        //清除动画
        this.$toast.clear();
      }).catch(error => {
        this.$toast.clear();
        console.log('error ==> ', error);
      })
    },
    //选择规格
    select() {
      this.show = true;
    },
    //立即购买
    onBuyClicked() {
      let element = document.querySelectorAll(".van-sku-header-item")[1];
      let inputnum = document.querySelector(".van-stepper__input");
      this.selectdata = {
        pid: this.$route.params.id,
        rules: element.innerText,
        num: inputnum.getAttribute("aria-valuenow"),
      };
      console.log(this.selectdata);
    },
    //添加购物车
    onAddCartClicked() {
      this.onBuyClicked();
    },
    //查找是否收藏
    findlike(vm){
      let appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
      let token = vm.$cookies.get("token");
      vm.axios({
        method: "get",
        url: this.baseUrl2+`/findlike`,
        params: {
          appkey: appkey,
          pid: vm.$route.params.id,
          tokenString: token,
        },
      }).then((data) => {
        // console.log(data)
        if(data.data.result.length>0){
            this.liked = true;
        }else{
           this.liked = false;
        }
      });
    },
    //切换收藏
    togglelike() {
       let token = this.$cookies.get("token");
       if(token){
         this.liked=!this.liked;
         if(this.liked){
           this.like();
         }else{
           this.notliked();
         }
       }else{
         Toast('请先登录！')
       }
    },
    //收藏
    like() {
     
      let token = this.$cookies.get("token");
      this.axios({
        method: "post",
        url: this.baseUrl2+"/like",
        data:{
          appkey: this.appkey,
          pid: this.$route.params.id,
          tokenString: token,
        },
      }).then((data) => {
        if(data.data.code==800){
           Toast("已收藏");
        }
      });
       this.liked = true;
    },
    //取消收藏
    notliked() {
     
       let appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
      let token = this.$cookies.get("token");
      this.axios({
        method: "post",
        url: this.baseUrl2+"/notlike",
        data: {
          appkey: appkey,
          pid: this.$route.params.id,
          tokenString: token,
        },
      }).then((data) => {
        if(data.data.code==900){
           Toast("取消收藏");
        }
      });
       this.liked = false;
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
    font-weight: 700;
    display: flex;
    line-height: 30px;
    span {
      display: inline-block;
      &.title {
        width: 200px;
        font-weight: normal;
      }
      &.arrow {
        flex: 1;
        text-align: right;
      }
    }
  }
}
.detail {
  padding: 10px;
  margin-top: 10px;
  background-color: #fff;
  .detail-title {
    font-size: 14px;
    font-weight: 700;
  }
  .detail-bottom {
    text-align: center;
    padding: 10px 0;
  }
}
</style>
