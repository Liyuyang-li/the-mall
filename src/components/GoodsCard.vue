<template>
  <section :class="['goodscard', isClick ? 'active' : '']" @click="click">
    <div class="pic">
      <img :src="info.img" alt="" />
    </div>
    <div class="details">
      <p>
        <span class="name">{{ info.name }}</span>
      </p>
      <p>
        <span class="preferential" v-if="info.or_price > info.price"
          >立减{{ (info.or_price - info.price) | formatPrice }}元</span
        >
      </p>
      <p>
        <span class="newprice">￥{{ info.price }}</span>
        <span class="oldprice" v-if="info.or_price">￥{{ info.or_price }}</span>
      </p>
      <p>
        <span class="sales">已售{{ info.sales }}{{info.unit}}</span>
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "GoodsCard",
  props: ["info"],
  data() {
    return {
      isClick: false,
    };
  },
  filters: {
    
    formatPrice(value) {
      if (value < 0) {
        return -parseFloat(value).toFixed(1);
      } else {
        return parseFloat(value).toFixed(1);
      }
    },
  },
 
  methods: {
    click() {
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
      }, 100);
      this.$store.commit("changebar", false);
      this.$router.push({ path: `/gooddetails/${this.info.product_id}` });
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
  float: left;
  &:nth-child(2n) {
    margin-right: 0;
    float: right;
  }
  .pic {
    width: 100%;
    img {
      display: block;
    }
  }
  .details {
    padding: 0px 15px 0px 15px;
    p {
      padding: 2px 0;
      span {
        display: inline-block;
        &.name {
          font-size: 16px;
          font-weight: 700;
          //文本不换行，超出文本用省略号代替
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.preferential {
          font-size: 14px;
          color: #d56159;
          background-color: rgba(235, 148, 142, 0.5);
          padding: 2px;
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
        &.sales {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}
.active {
  background-color: #ccc;
}
</style>
