<template>
  <div class="header">
        <div class="title">
          <slot></slot>
        </div>
        <div class="more">
          <!-- <span >更多<van-icon name="arrow" size="20"/></span> -->
        </div>
    </div>
</template>

<script>
export default {
   methods:{
     //去查询页
    goSearch(id) {
      this.$router.push({ path: `/search/${id}` });
    },
   }
}
</script>

<style lang="less" scoped>
   .header {
      padding:10px;
      display: flex;
      align-items: center;
      
      .title {
        flex: 1;
        h2 {
          font-size: 16px;
          // font-weight: bold;
          color: #fff;
          padding: 5px;
          margin-bottom: 3px;
          width: 20vw;
          background-color: #fc4141;
          border-top-right-radius: 10px;
        }
      }
      .more {
        // width: 15vw;
        span {
          display: inline-block;
          /deep/.van-icon::before {
            display: inline-block;
            margin-top: -2px;
            vertical-align: middle;
          }
        }
      }
    }
</style>