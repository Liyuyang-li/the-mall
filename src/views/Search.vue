<template>
  <div class="search">
    <div class="header">
      <div class="header-box">
        <div class="return" @click="onReturn">
          <van-icon name="arrow-left" size="25" />
        </div>
        <van-search
          v-model="value"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
          shape="round"
          clearable
          @clear="onClear"
          @input="onInput"
        >
          <template #action>
            <div @click="onSearch(value)">搜索</div>
          </template>
        </van-search>
        <form action="/"></form>
      </div>
    </div>

    <div class="result">
      <div class="searchresult">
        <GoodsCard v-for="b in goods" :key="b.id" :info="b" />
      </div>
      <van-empty
        v-if="goods.length == 0"
        description="没有搜到相关商品"
        :image="emptypng"
      />
      <div class="historys" v-if="goods.length ==0">
        <ul>
          <li @click="searchhistory(h)" v-for="(h, k) in historys" :key="k">
            <van-icon name="search" size="20" />{{ h
            }}<van-icon name="cross" size="18" @click.stop="clearhistory(k)" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsCard from "../components/GoodsCard";
import { Toast } from "vant";
import empty from "../assets/image/empty.png";

export default {
  name: "Name",
  components: { GoodsCard },
  data() {
    return {
      value: "",
      historys: [],
      goods: [],
      emptypng: empty,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit("changebar", false);
      if (vm.$route.query.keyword) {
        console.log('===>',vm.$route.query.keyword)
        vm.value = vm.$route.query.keyword;
        vm.onSearch(vm.$route.query.keyword);
      }
    });
  },
  methods: {
    onSearch(value) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/getAllProducts",
        params: {
          name: value,
        }
      }).then((result) => {
          console.log('onSearch==>',result);
          this.goods = result.data.data;
          //console.log(this.goods);
          Toast.clear();
        }).catch(err=>{
          console.log(err)
          Toast.clear();
        });
      if (!this.historys.includes(value)) {
          this.historys.push(value);
        }
    },
    onReturn() {
      this.$router.back();
      this.goods = [];
    },
    clearhistory(k) {
      this.historys.splice(k, 1);
    },
    onClear() {
      // console.log("zzz");
      this.goods = [];
    },
    onInput(value) {
      if (value == "") {
        this.goods = [];
      } else {
        // this.onSearch(value);
      }
    },

    //历史搜索
    searchhistory(h){
      this.value = h;
      this.onSearch(h);
    },

    //查询分类商品
    searchId() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "get",
        url: this.baseUrl1 + "/products",
        params: {
          page: 1,
          limit: 8,
          keyword: "",
          sid: this.$route.params.id,
          news: 0,
          priceOrder: "",
          salesOrder: "",
        },
      })
        .then((data) => {
          if (data.data.status === 200) {
            this.goods = data.data.data;
            this.$toast.clear();
          } else {
            Toast(data.data.msg);
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
.search {
  .header {
    position: fixed;
    top: 0;
    width: 100vw;
    .header-box {
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 0 10px;
      .van-search {
        flex: 1;
      }
    }
  }
  .searchresult {
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 74px;
  }
  .historys {
    // background-color: #fff;
    ul {
      li {
        font-size: 14px;
        color: #999;
        padding: 10px 14px;
        display: flex;
        width: 100%;
        line-height: 14px;
        position: relative;
        .van-icon-search {
          margin-right: 10px;
        }
        .van-icon-cross {
          position: absolute;
          right: 10px;
        }
      }
    }
  }
}
/deep/.van-empty__image img {
  transform: translateX(10px);
}
</style>
