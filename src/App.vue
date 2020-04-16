<template>
  <div id="app">
    <router-link to="/">
      <img alt="Vue logo" src="./assets/d3_logo.jpg" />
    </router-link>
    <layout-view></layout-view>
  </div>
</template>

<!-- <script src="https://d3js.org/d3.v5.js"></script> -->


<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
