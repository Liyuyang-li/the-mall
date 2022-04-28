<template>
  <section :class="['goodscard', isClick ? 'active' : '']" @click="click">
    <div class="pic">
      <span class="hot" v-show="c.isHot">hot</span>
      <img :src="c.smallImg" alt="" />
    </div>
    <div class="details">
      <p>
        <span class="name">{{ c.name | formatName }}</span>
      </p>
      <!-- <p v-if="b.vip_price"><span class="preferential">立减{{c.price-c.vip_price|formatPrice}}元</span></p> -->
      <p>
        <!-- <span v-if="c.vip_price" class="newprice">￥{{ c.vip_price }}</span> -->
        <span class="newprice">￥{{ c.price }}</span>
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "GoodsCard",
  props: ["c"],
  data() {
    return {
      isClick: false,
    };
  },
  filters: {
    formatName(value) {
      if (value.length > 10) {
        return value.substr(0, 9) + "...";
      } else {
        return value;
      }
    },
    formatPrice(value) {
      return parseFloat(value).toFixed(1);
    },
  },
  methods: {
    click() {
      this.isClick = true;
      //点击效果
      setTimeout(() => {
        this.isClick = false;
      }, 100);
       this.$store.commit('changebar',false);
       this.$router.push({path:`/coffeedetails/${this.c.pid}`});
      //  this.$toast.loading({
      //   message: '加载中...',
      //   forbidClick: true,
      //   duration: 0
      // });

      return;
      // //获取商品详情数据
      // this.axios({
      //   //请求方式
      //   method: 'GET',
      //   url: this.baseUrl2 + '/productDetail',
      //   params: {
      //     appkey: this.appkey,
      //     pid:this.$route.params.id
      //   }
      // }).then(res => {
      //   console.log('res getBannerData ==> ', res);
      //   this.$toast.clear();

      //   if (res.data.code === 300) {
      //     this.bannerData = res.data.result;
      //   } else {
      //     this.$toast({
      //       message: res.data.msg,
      //       forbidClick: true,
      //       duration: 3000
      //     })
      //   }
        
      // }).catch(err => {
      //   this.$toast.clear();
      //   console.log('err ==> ', err);
      // })
    },
  },
};
</script>

<style lang="less" scoped>
.goodscard {
  display: flex;
  flex-direction: column;
  width: calc(50% - 5px);
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  margin-right: 10px;

  &:nth-child(2n) {
    margin-right: 0;
  }
  .pic {
    width: 100%;
    position: relative;
    .hot {
      display: inline-block;
      color: white;
      position: absolute;
      // top: 5px;
      left: 5px;
      background-color: red;
      padding: 3px;
      border-radius: 3px;
    }
    img {
      // width: 90%;
    }
  }
  .details {
    padding: 0px 15px 15px 15px;
    p {
      padding: 2px 0;
      span {
        display: inline-block;
        &.name {
          font-size: 16px;
          font-weight: 700;
        }
        &.preferential {
          font-size: 14px;
          color: #d56159;
          border: 1px solid #eb948e;
          padding: 2px;
          border-radius: 2px;
        }
        &.newprice {
          font-size: 16px;
          color: #d44d44;
          font-weight: 700;
          margin-right: 5px;
        }
        &.oldprice {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.3);
          font-weight: 700;
          text-decoration: line-through;
        }
      }
    }
  }
}
.active {
  background-color: #ccc;
}
</style>
