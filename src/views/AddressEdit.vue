<template>
  <div class="addressEdit">
    <div class="topnav">
      <van-nav-bar :title="addressId?'编辑地址':'新增地址'" fixed>
        <template #left>
          <van-icon name="arrow-left" size="18" color="#333" @click="back" />
        </template>
      </van-nav-bar>
    </div>
    <Bg />
    <div class="list">
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="addressId?true:false"
        show-set-default
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="saveAddress"
        @delete="deleteAdress"
        :address-info="addressDetail"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import areaList from "../assets/js/area";
import Bg from "../components/Bg.vue";
export default {
  name: "AdressEdit",
  components: { Bg },
  data() {
    return {
      areaList: areaList,
      searchResult: [],
      addressDetail:{}
    };
  },
 
  computed:{
      addressId(){//地址id
          return this.$route.params.id
      }
  },
   beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit("changebar", false);
      vm.addressDetail={};
      if(vm.addressId){
         vm.getAddress(); 
      }
    });
  },
  methods: {
    back(){
      this.$router.back();
    },
    //保存新增地址
    saveAddress(addressData) {
       console.log('addressData==>',addressData)
        if(!this.addressId){
        let address = {
        addressDetail: addressData.addressDetail, //详细地址
        isDefault: Number(addressData.isDefault), //是否默认
        phone: addressData.tel, //手机号码
        postalCode: addressData.postalCode, //邮政编码
        name: addressData.name, //真实姓名
        city: addressData.city, //市
        areaCode: addressData.areaCode, //编码
        county: addressData.county, //区
        province: addressData.province, //省
        
      };
      // let token = this.$cookies.get("token");
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data: {
          ...address
        },
        //请求头添加token
        headers: {
          token: document.cookie
        }
      })
        .then((result) => {
          if (result.data.status === 1041) {
            return this.$router.push({ name: "Login" });
          }
          // console.log(result);
          if (result.data.status === 1260) {
              this.$router.back();
            Toast('成功添加新地址！');
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
        }else{
            //保存编辑地址
            this.saveEditAddress(addressData);
            // console.log("修改地址")
        }
      
    },

    //根据id获取地址信息
    getAddress() {
      this.axios({
        method: "GET",
        url: this.baseUrl + "/getAddressByid",
        params: {
          addressId:this.addressId
        },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
          console.log(result.data.data[0])
          if (result.data.status === 1280) {
            let obj = result.data.data[0];
            obj.tel = obj.phone;
            obj.isDefault = !!obj.is_default;
            obj.areaCode = obj.area_code;
            obj.addressDetail = obj.address_detail;
            obj.postalCode = obj.postal_code
            //复制一份
            this.addressDetail = {...obj};
            console.log('this.addressDetail==>',this.addressDetail)
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //保存修改的地址
    saveEditAddress(addressData) {
     console.log('addressData==>',addressData)
      let address = {
        detail: addressData.addressDetail, //详细地址
        isDefault: Number(addressData.isDefault), //是否默认
        phone: addressData.phone, //手机号码
        postalCode: addressData.postalCode, //邮政编码
        name: addressData.name, //真实姓名
        addressId:String(this.addressId),
        city: addressData.city, //市
        areaCode: addressData.areaCode, //编码
        county: addressData.county, //区
        province: addressData.province, //省
        
      };
      console.log('address==>',address)
      this.axios({
        method: "POST",
        url: this.baseUrl + "/saveEditAddress",
        data: {
          ...address
        },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
          if (result.data.status === 1290) {
              this.$router.back();
            Toast('修改地址成功！');
          } else {
            Toast(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //删除地址
    deleteAdress() {
      this.axios({
        method: "POST",
        url: this.baseUrl + "/removeAddress",
        data: {
            addressId:this.addressId,
        },
        //请求头添加token
        headers: {
          token:document.cookie
        },
      })
        .then((result) => {
          if (result.data.status === 1300) {
            Toast('该地址已删除！');
            this.$router.back();
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
/deep/.van-address-edit {
  padding: 0;
}
/deep/.van-button--danger {
  color: #fff;
  background-color: #fc4141;
  border: 0.02667rem solid #fc4141;
}
/deep/.van-switch--on {
  background-color: #fc4141;
}
</style>
