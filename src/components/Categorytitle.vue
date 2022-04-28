<template>
  <div class="categorytitle">
    <!-- <span>家电电器</span> -->
    <slot></slot>
  </div>
</template>

<script>
export default {
    name:'Categorytitle'
};
</script>

<style lang="less" scoped>
.categorytitle{
    height: 8vh;
    text-align: center;
    line-height: 8vh;
    span{
        color: #666;
        &::before,&::after{
            content: '';
            display: inline-block;
            width: 30px;
            height: 1px;
            background-color: #ccc;
            vertical-align: middle;
            margin-right: 10px;
        }
        &::after{
            margin-left: 10px;
        }
    }
}
</style>
