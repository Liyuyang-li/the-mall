<template>
  <div class="likedlist">
    <div class="topnav">
      <van-nav-bar title="我的收藏" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />

    <div class="list">
      <LikedCard v-for="(like,index) in likedList" :key="like.id" :like="like">
        <van-icon name="delete" size="22" @click.stop="notliked(like.productId,index)" />
      </LikedCard>
      <van-empty
        class="custom-image"
        :image="emptypng"
        description="你的收藏列表空空如也！"
        v-if="likedList.length == 0"
      >
        <van-button class="bottom-button" @click="goShopping"
        >去逛一逛</van-button>
      </van-empty>
    </div>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import { Toast } from "vant";
import LikedCard from "../components/LikedCard.vue";
import empty from '../assets/image/empty.png'
export default {
  name: "MyLiked",
  components: {
    Bg,
    LikedCard,
  },
  data() {
    return {
      likedList: [],
      emptypng:empty
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
    });
  },

  created(){
    
  },
  methods: {
    init(vm) {
      vm.$store.commit("changebar", false);
      vm.getLikedList(vm);
    },
    back() {
      this.$router.back();
    },

    //获取收藏列表
    getLikedList(vm) {
      vm.likedList = [];
      vm.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      vm.axios({
        method: "get",
        url: vm.baseUrl + "/getLikedList",
        params: { },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
            console.log("getLikedList==>", result);
          if (result.data.status === 1350) {
            vm.likedList = result.data.data;
            console.log("getLikedList==>", vm.likedList);
            //清除动画
            vm.$toast.clear();
          } else {
            Toast(result.data.msg);
            //清除动画
            vm.$toast.clear();
          }
        })
        .catch((error) => {
          console.log(error);
          //清除动画
          vm.$toast.clear();
        });
    },

    change(value) {
      this.nickname = value;
    },

    //取消收藏
    notliked(id,index) {
      this.axios({
        method: "post",
        url: this.baseUrl + "/removeLiked",
        data: {
          productId: id,
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      }).then((result) => {
        console.log('notliked==>',result)
        if (result.data.status == 1340) {
          this.likedList.splice(index,1);
          // this.getLikedList();
          Toast("取消收藏成功");
          
        }
      });
    },

     //去逛一逛
    goShopping() {
      this.$router.push({ name: "Home" });
    },

  },
};
</script>

<style lang="less" scoped>
.list {
  margin: 10px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
  top: -30px;
  padding: 10px;
}
/deep/.van-card{
  padding: 0px;
  background-color: #fff;
}
/deep/.van-card__price{
  color: red;
}
/deep/.van-empty__image img{
  transform: translateX(10px);
}
</style>
