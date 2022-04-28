<template>
  <van-card
  :price="like.price"
  :origin-price="like.orPrice"
  :desc="like.desc"
  :title="like.name"
  :thumb="like.img"
  color="#fff"
  @click="godetail(like.productId)"

>
  <template #tags>
    <van-tag plain type="danger">立减{{like.orPrice-like.price}}</van-tag>
  </template>
  <template #num>
    <slot></slot>
  </template>
</van-card>

</template>

<script>
export default {
  name: "LikedCard",
  props: ["like"],
  data() {
    return {
      isClick: false,
    };
  },
  filters: {
    formatName(value) {
      if (value.length > 10) {
        return value.substr(0, 9)+"...";
      } else {
        return value;
      }
    },
    formatPrice(value){
      return parseFloat(value).toFixed(1)
    }
  },
  methods: {

    //去详情页
    godetail(id) {
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
      }, 100);
    //   this.$store.commit('changebar',false);
      this.$router.push({path:`/gooddetails/${id}`});
    },

    

  },
};
</script>

<style lang="less" scoped>
.likedcard {
  display: flex;
  flex-direction: column;
  width:calc(50% - 5px);
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  margin-right: 10px;
  &:nth-child(2n){
    margin-right: 0;
  }
  .pic {
    width: 100%;
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

/deep/.van-card__title{
  font-size: 14px;
  font-weight: 600;
  line-height: 28px;

}
</style>
