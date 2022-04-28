<template>
  <div class="orderList" v-if="gooddetail.products.length > 0">
    <slot name="order-title"></slot>
    <div class="list">
      <van-card
        :num="g.count"
        :price="g.realPrice"
        :title="g.name"
        :desc="g.version+'/'+g.color"
        :thumb="g.img"
        v-for="g in gooddetail.products"
        :key="g.id"
      />
    </div>
    <div class="total">
      <div class="time">{{gooddetail.updatedAt | formatTime  }}</div>
      <div class="total-num-price">
        <div class="total-num">共计{{ gooddetail.products.length }}件</div>
        <div class="total-price">合计&nbsp;&yen;{{ totalPrice  }}</div>
      </div>
      <slot name="btns"></slot>
    </div>
  </div>
</template>

<script>
import { tool } from "../assets/js/tool";
export default {
  name: "Order",
  props: ["gooddetail"],
  filters:{
    //格式化时间            
      formatTime(time) {
      
      return tool.formatDate(time, "yyyy-MM-dd hh:mm:ss");
    },
  },
  computed:{
    totalPrice(){
      let totalPrice=0;
      this.gooddetail.products.forEach(v=>{
          totalPrice +=v.costPrice;
      })
       return totalPrice;
    }
  },
  methods: {
    
  },
  created(){
    // console.log('gooddetail==>',this.gooddetail)
  }
};
</script>

<style lang="less" scoped>
.orderList {
  margin-top: 10px;
}
.total {
  padding: 20px 10px 10px;
  border-top: 2px dashed #999;
  position: relative;
  background-color: #fff;

  &::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    top: -12px;
    left: -12px;
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
    right: -12px;
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
/deep/.van-card {
  padding: 10px;
  background-color: #fff;
  margin-top: 0;
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
</style>
