import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";



// component 를 전역으로 등록해서 사용
import "./components/index";

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
