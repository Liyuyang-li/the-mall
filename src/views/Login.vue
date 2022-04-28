<template>
  <div class="login">
    <Nav />
    <div class="login-box">
      <div class="login-title">
        <h2>欢迎回来</h2>
        <p>Please login to your account</p>
      </div>
      <div class="login-center">
        <van-form>
          <van-field
            v-model="userLoginInfo.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          />
          <van-field
            v-model="userLoginInfo.password"
            :type="isText ? 'text' : 'password'"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            :right-icon="isText ? 'eye-o' : 'closed-eye'"
            @click-right-icon="toggleText"
          />
        </van-form>
        <div class="remember">
          <van-checkbox
            v-model="remembered"
            @change="remember"
            shape="square"
            checked-color="#fc4141"
            icon-size="18px"
            >是否记住账号密码</van-checkbox
          >
        </div>
        <div class="forgot" @click="goForgetPage">
          <span>忘记密码？</span>
        </div>
        <div class="login-btn">
          <van-button
            class="login-btn"
            type="primary"
            block
            color="#fc4141"
            round
            @click="login"
            >登&nbsp;录</van-button
          >
        </div>
        <van-button block round @click="isShow = true">注&nbsp;册</van-button>
      </div>
      <div class="popdiv">
        <van-popup v-model="isShow" position="bottom" round closeable>
          <div class="register-center">
            <div class="register-title">
              注册
            </div>
            <van-form>
              <van-field
                v-model="userRegisterInfo.email"
                name="邮箱"
                label="邮箱"
                placeholder="邮箱"
                :rules="[{ required: true, message: '请填写正确的邮箱' }]"
              />
              <van-field
                v-model="userRegisterInfo.password"
                :type="isText ? 'text' : 'password'"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
                :right-icon="isText ? 'eye-o' : 'closed-eye'"
                @click-right-icon="toggleText"
              />
              <van-field
                v-model="userRegisterInfo.nickName"
                type="text"
                name="昵称"
                label="昵称"
                placeholder="昵称"
                :rules="[{ required: true, message: '请填写昵称' }]"
              />
              <van-field
                v-model="userRegisterInfo.validCode"
                center
                clearable
                label="邮箱验证码"
                placeholder="请输入验证码"
              >
                <template #button>
                  <van-button size="small" type="primary" color="#fc4141" @click="sendValidCode" :disabled="isSend">{{text}}</van-button>
                </template>
              </van-field>
            </van-form>
            <div class="register-btn">
              <van-button block round @click="register" color="#fc4141"
                >注册</van-button
              >
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav";
import { Toast } from "vant";
import { utils } from "../assets/js/utils.js";
export default {
  name: "Login",
  components: {
    Nav,
  },
  data() {
    return {
      userLoginInfo: {
        email: "",
        password: "",
      },
      userRegisterInfo: {
        email: "",
        password: "",
        nickName: "",
        validCode:""
      },
      isText: false,
      isShow: false,
      remembered: false,
      text:"发送验证码",
      codeId:'',
      isSend:false
    };
  },
  methods: {
    toggleText() {
      this.isText = !this.isText;
    },

    //发送验证码
    sendValidCode() {
      let emailregex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!emailregex.test(this.userRegisterInfo.email)) {
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
        url:  this.baseUrl+"/memberSendValidCode",
        data: {
          email: this.userRegisterInfo.email,
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

    //注册
    register() {
      let obj = {
        //手机号 /^1[3-9]\d{9}$/
        phone: {
          value: this.userRegisterInfo.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱格式不正确",
        },

        password: {
          value: this.userRegisterInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },

        nickName: {
          value: this.userRegisterInfo.nickName,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
      };
      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(obj)) {
        return;
      }
      Toast.loading({
        message: "注册中...",
        forbidClick: true,
        duration: 0,
      });
      //发起注册请求
      this.axios({
        method: "POST",
        url: this.baseUrl+"/memberRegister",
        data: {
          email: this.userRegisterInfo.email,
          nickName: this.userRegisterInfo.nickName,
          password: this.userRegisterInfo.password,
          validCode: this.userRegisterInfo.validCode,
          codeId:this.codeId,
        },
      })
        .then((result) => {
          // console.log(result);
          if (result.data.status === 1210) {
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
            this.isShow = false;
          } else {
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          Toast("注册失败");
        });
    },

    //登录
    login() {
      let obj = {
        phone: {
          value: this.userLoginInfo.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱格式不正确",
        },

        password: {
          value: this.userLoginInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },
      };
      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(obj)) {
        return;
      }
      Toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });
      //发起登录请求
      //phone 13046264144
      //password admin123456
      this.axios({
        method: "POST",
        url:  this.baseUrl+"/memberLogin",
        data: {
          email: this.userLoginInfo.email,
          password: this.userLoginInfo.password,
        },
      })
        .then((result) => {
          // console.log(result);
          if (result.data.status === 1230) {
            //把token存在cookie里
            for (let key in result.data.data) {
              this.$cookies.set(key, result.data.data[key], "7d");
            }
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
            this.$router.push("/personCenter");
          } else {
            Toast({
              message: result.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          Toast("登录失败");
        });
    },

    //是否记住密码
    remember() {
      if (this.remembered) {
        localStorage.setItem("account", this.userLoginInfo.email);
        localStorage.setItem("password", this.userLoginInfo.password);
      } else {
        localStorage.removeItem("account");
        localStorage.removeItem("password");
      }
    },

    //忘记密码
    goForgetPage(){
      this.$router.push(
        {path:'/forgetPassword'}
      )
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit("changebar", false);
      vm.userLoginInfo.email = localStorage.getItem("account");
      vm.userLoginInfo.password = localStorage.getItem("password");
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("changebar", true);
    next();
  },
};
</script>

<style lang="less" scoped>
.login {
  // position: fixed;
  // top: 0;
  .login-box {
    position: fixed;
    top: 46px;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #fff;
    padding: 15px;

    .login-title {
      margin-top: 50px;
      h2 {
        font-size: 24px;
        color: #666;
        font-weight: bold;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        color: #999;
      }
    }
    .login-center {
      margin-top: 45px;
      .remember {
        padding: 10px 16px 0;
        /deep/.van-checkbox__label {
          color: #999;
          font-size: 12px;
        }
      }
      .forgot {
        text-align: right;
        padding: 20px 0;
        color: #999;
        font-size: 14px;
      }
      .login-btn {
        margin: 50px 0 60px 0;
      }
    }
    .register-center {
      padding: 15px;
      .register-title {
        padding: 15px;
        font-size: 20px;
        color: #666;
      }
      .register-btn {
        padding: 20px 0;
      }
    }
  }
}
</style>
