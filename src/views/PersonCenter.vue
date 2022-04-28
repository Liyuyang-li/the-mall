<template>
  <div class="personCenter">
    <div class="bgpic">
      <div class="person-info">
        <div class="img">
          <van-uploader v-model="fileList" class="auto-img" />
        </div>
        <div class="name">
          <div class="nickname">昵称：{{ userinfo.data[0].nickName }}</div>
          <div class="signature">ID:{{ userinfo.data[0].userId }}</div>
          <div class="signature">
            个性签名：
            {{ userinfo.data[0].signature }}
          </div>
        </div>
        <div class="setting"></div>
      </div>
    </div>
    <div class="main">
      <div class="myorder">
        <van-cell
          title="我的订单"
          is-link
          size="large"
          title-style="color:#888"
          to="/personCenter/myorders/1"
          value="全部订单"
        />
        <van-grid>
          <van-grid-item
            icon="pending-payment"
            text="待付款"
            :badge="counts[1] == 0 ? '' : counts[1]"
            to="/personCenter/myorders/1"
          />
          <van-grid-item
            icon="sign"
            text="待发货"
            :badge="counts[2] == 0 ? '' : counts[2]"
            to="/personCenter/myorders/2"
          />
          <van-grid-item
            icon="logistics"
            text="待收货"
            :badge="counts[3] == 0 ? '' : counts[3]"
            to="/personCenter/myorders/3"
          />
          <van-grid-item
            icon="comment-o"
            text="已完成"
            :badge="counts[4] == 0 ? '' : counts[4]"
            to="/personCenter/myorders/4"
          />
        </van-grid>
      </div>
      <van-cell
        title="个人资料"
        is-link
        size="large"
        title-style="color:#888"
        to="/personCenter/myinfo"
      />
      <van-cell
        title="我的收藏"
        is-link
        size="large"
        title-style="color:#888"
        to="/personCenter/myLiked"
      />
      <van-cell
        title="地址管理"
        is-link
        size="large"
        title-style="color:#888"
        to="/personCenter/addressList"
      />
    </div>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  name: "PersonCenter",
  components: {},
  data() {
    return {
      signature: "这个家伙很懒，什么也没有留下...",
      userinfo: {
        data: [
          {
            nickName: "",
            avatar: "",
            userId: "",
            email: "",
            signature: "这个家伙很懒，什么也没有留下...",
          },
        ],
      },
      //上传图片数据
      fileList: [
        {
          url: "",
        },
      ],
      //订单列表数量
      ordersListCount: {},
    };
  },
  computed: {
    counts() {
      return this.ordersListCount;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
      // vm.ordersListCount={};
     // 获取各种订单类型的数量
      let indexs = [1, 2, 3, 4];
      indexs.forEach((val) => {
        vm.getOrdersList(val,vm);
      });
    });
  },
  created(){
    
  },
  methods: {
    //初始化
    init(vm) {
      vm.$store.commit("changebar", true);
      vm.getUserInfo(vm);
    },

    //获取用户信息
    getUserInfo() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/memberGetUserInfo",
        params: {},
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          if (result.data.status == 1041) {
            return this.$router.push({ name: "Login" });
          }
          if (result.data.status === 1240) {
            this.userinfo = result.data;
            this.fileList[0].url =
              this.userinfo.staticBaseUrl + this.userinfo.data[0].avatar;
            // console.log('userinfo==>',this.userinfo);

            //清除动画
            this.$toast.clear();
          } else {
            // this.$router.push({ name: "Login" });
            //清除动画
            this.$toast.clear();
          }
        })
        .catch((error) => {
          console.log(error);
          //清除动画
          this.$toast.clear();
        });
    },

    //获取用户订单
    getOrdersList(active,vm) {
      vm.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      let remove = `remove${active}`
      vm.axios({
        method: "get",
        url: vm.baseUrl + "/getOrderList",
        params: {
          type: active,
          [remove]:0
        },
        //请求头添加token
        headers: {
          token: document.cookie,
        },
      })
        .then((result) => {
          if (result.data.status === 1380) {
            // console.log("ordersList==>",result);
            let data = result.data.data;
            let ordersList = [];
           data.forEach((v) => {
              ordersList.push(v.orderNum);
            });
           ordersList = [...new Set(ordersList)]
            vm.ordersListCount[active] = ordersList.length;
            // console.log("ordersListCount==>", this.ordersListCount);
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
  },
};
</script>
<style lang="less" scoped>
.personCenter {
  .bgpic {
    height: 20vh;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: #f84c4c;
    .person-info {
      padding: 20px;
      display: flex;
      align-items: center;
      div {
        &.img {
          width: 18%;
          height: 9vh;
          background-color: #ccc;
          border-radius: 50%;
          overflow: hidden;
          /deep/.van-uploader,
          /deep/.van-uploader__wrapper,
          /deep/.van-uploader__preview,
          /deep/.van-image {
            height: 100%;
            width: 100%;
          }
          /deep/.van-image__img {
            width: 100%;
          }
        }
        &.name {
          flex: 1;
          margin-left: 15px;
          .nickname {
            font-size: 14px;
            color: #fff;
            font-weight: 500;
          }
          .signature {
            margin-top: 5px;
            font-size: 12px;
            color: rgb(243, 236, 236);
          }
        }
        &.setting {
          width: 10%;
        }
      }
    }
  }
  .main {
    margin: 0 10px;
    padding-top: 60px;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.3) 0px,
      rgba(255, 255, 255, 0.3) 30px,
      #fff 30px
    );
    margin-top: -30px;
    border-radius: 10px;
  }
  /deep/.van-uploader__preview {
    margin: 0;
  }
  /deep/.van-grid-item__content {
    color: #888;
    .van-grid-item__text {
      color: #888;
    }
  }
}
</style>
