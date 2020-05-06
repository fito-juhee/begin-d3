import Vue from "vue";
import VueRouter from "vue-router";
// views 파일들
import Home from "../views/Home.vue";
import stepOne from "../views/StepOne.vue";
import stepTwo from "../views/StepTwo.vue";
import BarChart from "../views/chart/BarChart.vue";
import stockBarChart from "../views/chart/StockBar.vue";
import lineChart from "../views/chart/Line.vue";
import speedRange from "../views/chart/SpeedRange.vue";

// vue-router 를 Vue instance 에 등록
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/basic",
    name: "stepOne",
    component: stepOne
  },
  {
    path: "/dataSet",
    name: "stepTwo",
    component: stepTwo
  },
  {
    path: "/bar",
    name: "barChart",
    component: BarChart
  },
  {
    path: "/stockBar",
    name: "stockBarChart",
    component: stockBarChart
  },
  {
    path: "/line",
    name: "LineChart",
    component: lineChart
  },
  {
    path: "/speedRange",
    name: "SpeedRange",
    component: speedRange
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
