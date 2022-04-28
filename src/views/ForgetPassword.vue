<template>
  <!-- 忘记密码 -->
  <div class="updatePassword">
    <div class="topnav">
      <van-nav-bar title="忘记密码" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />
    <div class="list">
      <van-cell-group>
        <van-field
          label="用户邮箱"
          placeholder="输入用户邮箱"
          right-icon="edit"
          v-model="email"
          @blur="valid"

        />
        <van-field
          label="新密码"
          placeholder="输入新密码"
          v-model="newPassword"
          :type="isText ? 'text' : 'password'"
          :right-icon="isText ? 'eye-o' : 'closed-eye'"
          @click-right-icon="toggleText"
          @blur="valid"

        />
        <van-field
          label="再次输入密码"
          placeholder="再次输入新密码"
          :type="isText ? 'text' : 'password'"
          :right-icon="isText ? 'eye-o' : 'closed-eye'"
          @click-right-icon="toggleText"
          v-model="newPasswordCopy"
          @blur="valid"
        />
        <van-field
          v-model="validCode"
          center
          clearable
          label="验证码"
          placeholder="请输入验证码"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              color="#fc4141"
              @click="sendValidCode"
              :disabled="isSend"
              >{{ text }}</van-button
            >
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <div class="btn-box">
      <van-button class="save" block round @click="saveEdit"
        >找回密码</van-button
      >
    </div>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import { Toast } from "vant";
import { utils } from "../assets/js/utils.js";

export default {
  name: "ForgetPassword",
  components: {
    Bg,
  },
  data() {
    return {
      result: {
        data: [],
      },
      copyUserInfo: {},
      email: "",
      newPassword: "",
      newPasswordCopy: "",
      validCode: "",
      text: "发送验证码",
      codeId: "",
      isSend: false,
      isText: false,
      isShow: false,
    };
  },
  computed: {
    userInfo() {
      if (this.result.data.length > 0) {
        return {
          ...this.result.data[0],
        };
      } else {
        return {
          userId: "",
          email: "",
        };
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init(vm);
    });
  },
  methods: {
    toggleText() {
      this.isText = !this.isText;
    },
    password(){},
    init(vm) {
      vm.$store.commit("changebar", false);
     
    },
    back() {
      this.$router.back();
    },

    //验证输入内容
    valid(){
      let obj = {
        email: {
          value: this.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱格式不正确",
        },

        newPassword: {
          value: this.newPassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },

        newPasswordCopy: {
          value: this.newPasswordCopy,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },
      };
      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(obj)) {
        return;
      }
    },

    //发送验证码
    sendValidCode() {
      let emailregex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!emailregex.test(this.email)) {
        this.$message({
          message: "邮箱格式错误",
          center: true,
          type: "error",
        });
        return;
      }
      // 表单验证通过，发起验证码请求
      this.axios({
        method: "POST",
        url: this.baseUrl+"/memberSendValidCode",
        data: {
          email: this.email,
        },
      })
        .then((result) => {
          // console.log("result==>", result);
          if (result.data.status == 1220) {
            //把codeId存起来
            this.codeId = result.data.data.codeId;
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
          } else {
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          console.log("err==>", err);
        });

      let time = 60;
      this.text = `${time}s后重新发送`;
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = "发送验证码";
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}s后重新发送`;
          this.isSend = true;
        }
      }, 1000);
    },

    //确认修改
    saveEdit() {
      if(this.newPassword != this.newPasswordCopy){
         Toast('两次输入的密码不一样');
        return;
      }
      
      // return;
      //发送请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/forgetPassword",
        data: {
          email: this.email,
          newPassword: this.newPassword,
          validCode: this.validCode,
        },
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
