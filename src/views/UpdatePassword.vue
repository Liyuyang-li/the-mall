<template>
  <div class="updatePassword">
    <div class="topnav">
      <van-nav-bar title="修改密码" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />
    <div class="list">
      <van-cell-group>
        <van-field
          label="用户ID"
          :placeholder="String(userInfo.userId)"
          readonly
          right-icon="lock"
        />
        <van-field
          label="账户"
          :placeholder="userInfo.email"
          readonly
          right-icon="lock"
        />
        <van-field
          label="旧密码"
          placeholder="输入旧密码"
          right-icon="edit"
          v-model="password"
        />
        <van-field
          label="新密码"
          placeholder="输入新密码"
          right-icon="edit"
          v-model="newPassword"

        />
      </van-cell-group>
    </div>
    <div class="btn-box">
      <van-button class="save" block round @click="saveEdit"
        >确认修改</van-button
      >
    </div>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import { Toast } from "vant";
export default {
  name: "UpdatePassword",
  components: {
    Bg
  },
  data() {
    return {
      result: {
        data:[]
      },
      copyUserInfo:{},
      password:'',
      newPassword:''
    };
  },
  computed: {
    userInfo(){
      if(this.result.data.length > 0){
        return {
          ...this.result.data[0],
        };
      }else{
        return {
          userId:'',
          email:'',
        }
      }
      
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
    });
  },
  methods: {
    init(vm) {
      vm.$store.commit("changebar", false);
      vm.getUserInfo(vm);
      this.password = '';
      this.newPassword = '';
    },
    back() {
      this.$router.back();
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
          token: document.cookie
        }
      })
        .then((result) => {
          if (result.data.status === 1041) {
            return this.$router.push({ name: "Login" });
          }
          if (result.data.status === 1240) {
            this.result = result.data;
            //复制用户信息数据，用作比较
            this.copyUserInfo = {...this.userInfo}
            //清除动画
            this.$toast.clear();
          } else {
            Toast(result.data.msg);
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

    //确认修改
    saveEdit() {  
      //判断values是否为空
      console.log('this.userInfo==>',this.userInfo)
      if (this.userInfo.password == '' || this.newPassword == '') {
        return this.$router.go(-1);
      }
      // return;
      //发送请求
      this.axios({
        method: "POST",
        url: this.baseUrl + '/updatePassword',
        data: {
          password:this.password,
          newPassword:this.newPassword
        },
        //请求头
        headers: {
          token: document.cookie
        }
        })
        .then((result) => {
          if (result.data.status === 1310) {
            Toast(result.data.msg);
            this.$router.push({ name: "Login" });
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
.person-info {
  height: 82px;
  padding: 10px;
  display: flex;
  align-items: center;
  border: 1px solid #ffeae8;
  margin-bottom: 20px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  /deep/.van-icon-edit {
    transform: translate(-9px, 22px);
  }
  div {
    &.img {
      width: 60px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background-color: #fff;
    }

    &.name {
      flex: 1;
      margin-left: 15px;
      .nickname {
        font-size: 14px;
        color: #999;
        font-weight: 500;
      }
      .signature {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
      }
    }
    &.setting {
      width: 10%;
    }
  }
}
.count {
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  height: 30%;
  padding: 5px;
  text-align: center;
  background-color: pink;
  border-bottom-left-radius: 10px;
}
.btn-box {
  padding: 10px;
  /deep/.van-button {
    margin-bottom: 15px;
    font-size: 16px;
  }
  .save {
    background-color: #fc4141;
    color: white;
  }
  .exit {
    border-color: #fc4141;
    color: #fc4141;
  }
}
</style>
