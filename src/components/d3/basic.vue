<template>
    <div class="basic__container">
      <section class="section__board"></section>
      <h2 class="title"></h2>
      <button class="button__draw" @click="drawCircle('blue')">Draw</button>
      <button class="button__draw" @click="drawInit">Text</button>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  mounted(){
    this.drawCircle("orange");
  },
  methods: {
    drawInit() {
      var title = d3.select(".title")
        .text("Hello D3!")
        .style("color", "red");
    },
    drawCircle(color) {
      d3.select(".section__board").append("svg")
      .attr("width", 50)
      .attr("height", 50)
      .append("circle").attr("cx",25).attr("cy", 25).attr("r",25).style("fill", color);
    }
  }
}





</script>

<style>
.button__draw {
  background-color: white;
  border-radius: 4px;
  height: 36px;
  min-width: 64px;
  padding: 0 16px;
  margin: 0 10px;
}
</style> 