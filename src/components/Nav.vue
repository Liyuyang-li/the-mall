<template>
  <div class="nav">
    <van-nav-bar>
      <template #left>
        <div class="nav-left">
            <span class="nav-pic">
                <van-icon name="shop-collect" color="#fc4141" size="30" />
            </span>
            <span class="nav-title">杂货铺商城</span>
        </div>
      </template>
      <template #right>
       <div class="nav-right">
         <router-link to="/" tag="span">先逛一逛</router-link>
            <!-- <span>先逛一逛</span> -->
       </div>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: "Nav",
};
</script>

<style lang="less" scoped>
    .nav{
        .nav-left{
            display: flex;
            align-items: center;
            span{
                &.nav-pic{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 10px;
                    .auto-image{
                        width: 100%;
                        display: block;
                    }
                }
                &.nav-title{
                   font-size: 16px;
                   color: #666;
                   font-weight: bolder; 
                }
            }
        } 
        .nav-right{
            span{
                font-size: 14px;
                color: #fc4141;
                font-weight: bolder; 

            }
        }
    }
</style>
