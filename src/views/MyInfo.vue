<template>
  <div class="myinfo">
    <div class="topnav">
      <van-nav-bar title="管理个人资料" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />
    <div class="list">
      <van-cell-group>
        <div class="person-info">
          <div class="img">
            <!-- <van-uploader :after-read="uploadImg">
              <img
                class="auto-img"
                :src="userInfo.avatar !== ''?result.staticBaseUrl+userInfo.avatar : userInfo.avatarUrl"
                ref="avatar"
                alt=""
              />
            </van-uploader> -->
            <Upload
              @uploadFile="uploadImg"
              :img-url="result.staticBaseUrl + userInfo.avatar"
            ></Upload>
          </div>
          <van-icon name="edit" size="14" />
          <div class="name">
            <div class="nickname">昵称：{{ copyUserInfo.nickName }}</div>
            <div class="signature">ID：{{ userInfo.userId }}</div>
          </div>
          <div class="count">
            当前账号
          </div>
        </div>
        <van-field
          label="昵称"
          v-model="userInfo.nickName"
          placeholder="请输入昵称"
          right-icon="edit"
        />
        <van-field
          label="个性签名"
          v-model="userInfo.signature"
          placeholder="请输入个性签名"
          right-icon="edit"
        />
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
          label="密码"
          placeholder="点击修改密码"
          readonly
          right-icon="arrow"
          @click="updatePw"
        />
      </van-cell-group>
    </div>
    <div class="btn-box">
      <van-button class="save" block round @click="saveEdit"
        >保存修改</van-button
      >
      <van-button class="exit" block round @click="exitLogin">
        退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import Upload from "../components/Upload.vue"
import { Toast } from "vant";
import { Dialog } from "vant";
export default {
  name: "MyInfo",
  components: {
    Bg,Upload
  },
  data() {
    return {
      result: {
        data:[]
      },
      nickName: "",
      copyUserInfo:{}
    };
  },
  computed: {
    userInfo(){
      if(this.result.data.length > 0){
        return this.result.data[0];
      }else{
        return {
          nickName:'',
          avatar:'',
          userId:'',
          email:''
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
    },
    back() {
      this.$router.back();
    },
    //修改密码
    updatePw() {
      this.$router.push({ name: "UpdatePassword",query:this.userInfo.userId })
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

    //上传头像
    uploadImg(file) {
      // console.log('file==>',file);
      //图片数据
      this.userInfo.img = file.base64.replace(/^data:image\/[A-Za-z]+;base64,/,'');
      // 因为ajax在传输过程中加号会变成空格而base64里是有加号的，所以在ajax传输前先要对base64进行编码，把加号替换成%2B的url编码
      this.userInfo.img = this.userInfo.img.replace(/\+/g,"%2B");
      //图片类型
      this.userInfo.imgType = file.type;
      // console.log('this.userInfo==>',this.userInfo);
    },

    //保存修改
    saveEdit() {
      //修改过的数据
      let values = {};
      for (let key in this.userInfo) {
        if (this.copyUserInfo[key] != this.userInfo[key]) {
          values[key] = this.userInfo[key];
        }
      }
      delete values.avatarUrl;
      console.log("values==>", values);
      //判断values是否为空
      if (JSON.stringify(values) == "{}") {
        return this.$router.go(-1);
      }
      // return;
      //发送请求
      this.axios({
        method: "POST",
        url: this.baseUrl + '/saveEditMember',
        data: {
          ...values
        },
        //请求头
        headers: {
          token: document.cookie
        }
        })
        .then((result) => {
          if (result.data.status === 1250) {
            Toast(result.data.msg);
            this.$router.push({ name: "PersonCenter" });
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

     clearAllCookie() {
        //获取所有Cookie，并把它变成数组
        var cookies = document.cookie.split(";");
        //循环每一个数组项，把expires设置为过去时间，这样很容易地消除了所有Cookie
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            name = name.replace(/^\s*|\s*$/, "");//清除Cookie里的空格
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
        }

    },


    //退出登录
    exitLogin() {
      Dialog.confirm({
        title: "提示",
        message: "确定退出当前账号？",
      })
        .then(() => {
          //清除token
          // this.$cookies.remove("token");
          // this.$cookies.set("token",'',-1, '/');
          this.clearAllCookie();
          console.log('清除token')
          Toast("已退出当前帐号！");
          this.$router.push({ name: "Login" });
          // Dialog.cancel();
        })
        .catch(() => {
          // Dialog.cancel();
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
    font--size: 16px;
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
