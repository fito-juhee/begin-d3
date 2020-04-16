<template>
    <div>
      <h5>barChart</h5>
      <div id="barChart"></div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  mounted() {
    console.log("mounted!!!");
    this.drawChart();
    //console.log(this.csvFile);
  },
  data: () => ({
    dataset : [9, 19, 29, 39, 29, 19, 9]
  }),
  methods: {
    drawChart() {
      var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#barChart")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll("bar") 
        .data(this.dataset) 
        .enter().append("rect") 
        .attr("class", "chart__bar")
        .attr("height", function(d, i) {return d * 5}) 
        .attr("width", 40) 
        .attr("x", function(d, i) {return (50 * i)}) 
        .attr("y", function(d, i) {return (250 - d * 5)});

      svg.selectAll("text")
        .data(this.dataset)
        .enter().append("text")
        .text(function(d) {return d})
          .attr("class", "chart__dataLabel")
          .attr("x", function(d, i) {return 50 * i + 11})
          .attr("y", function(d, i) {return 250 - d*5 + 15});

    }
  }
}

</script>

<style>
.chart__bar {
  /* 차트 막대 색 */
  fill: #569fc9;
  fill-opacity: 0.3;
  stroke: #569fc9;
}
.chart__bar:hover {
  fill-opacity: 1;
}

.chart__dataLabel {
  fill: white;
  font-weight:bold;
}
</style> 