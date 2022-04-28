<template>
  <div class="addresslist">
    <div class="topnav">
      <van-nav-bar title="地址列表" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />
    <div class="list">
      <van-address-list
        :list="list"
        default-tag-text="默认"
        @add="addAdress"
        @edit="editAddress"
        :switchable="false"
        add-button-text="添加新地址"
      />
      <van-empty
        description="你还没有收货地址哦，去添加收货地址吧！"
        v-if="list.length == 0"
      />
    </div>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import { Toast } from "vant";
export default {
  name: "AddressList",
  components: {
    Bg,
  },
  data() {
    return {
      list: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getAddressList();
    });
  },
  methods: {
    addAdress() {
      this.$router.push({ name: "AddressEdit" });
    },
    editAddress(item) {
      // console.log(item);
      this.$router.push({ path: `/personCenter/addressList/addressEdit/${item.address_id}`});
    },
    back() {
      // this.$router.back();
      this.$router.push({ name: "PersonCenter" });
    },

    //获取地址列表
    getAddressList() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/getAddressList",
        params: {
          page: 1,
          limit: 20,
        },
        //请求头添加token
        headers: {
         token: document.cookie
        },
      })
        .then((result) => {
          // console.log('resulte==>',result)
          if (result.data.status === 1041) {
            return this.$router.push({ name: "Login" });
          }
          if (result.data.status === 1270) {
            let arr = result.data.data;
            arr.forEach((val) => {
              val.tel = val.phone;
              val.address = `${val.province}${val.city}${val.county}${val.address_detail}`;
              val.isDefault = !!val.is_default;
            });
            //   console.log(arr)
            this.list = arr;
            this.$toast.clear();
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          this.$toast.clear();
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
/deep/.van-address-list {
  padding: 0;
  .van-address-item {
    padding: 10px;
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: 0;
    }
  }
}
/deep/.van-tag--danger {
  background-color: #fc4141;
}
/deep/.van-button--danger {
  color: #fff;
  background-color: #fc4141;
  border: 0.02667rem solid #fc4141;
}
/deep/.van-address-list__bottom {
  height: 60px;
}
/deep/.van-address-list__add {
  margin: 10px 0;
}

</style>
