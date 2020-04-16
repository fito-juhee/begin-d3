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
    console.log("mounted");
    this.drawChart();
    //console.log(this.csvFile);
  },
  data: () => ({
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
    
    //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
    d3.csv("http://image-dev.ohcoach.com/csv/category_two.csv", function(data) {
      console.log(data);
     
      // X axis: scale and draw:
      var x = d3.scaleLinear()
          .domain([0, 20])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
          .range([0, width]);
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // set the parameters for the histogram
      var histogram = d3.histogram()
          .value(function(d) { return d.toal_distance; })   // I need to give the vector of value
          .domain(x.domain())  // then the domain of the graphic
          .thresholds(x.ticks(70)); // then the numbers of bins
    
      });
    }
  }
}

</script>

<style>
</style> 