<template>
  <div>
    룰루랄라 D3로 만들어보지~
    <div id="lineSpeedChart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import bar from "../../mixins/chart/bar.js";

export default {
  mixins: [bar],
  mounted() {
    this.drawLineChart();
  },
  computed: {
  },
  data: () => ({
    url: "http://image-dev.ohcoach.com/csv/speedChart.csv",
  }),
  methods: {
    drawLineChart: async function() {
      d3.select("svg").remove();

      // root의 해당하는 svg
      const chartRoot = d3.select("#lineSpeedChart").append("svg")
        .attr("class", "chart__root")
        .attr("width", this.width)
        .attr("height", this.height)

      /* 
      차트의 배경을 정의해준다. 
      만약 모든 차트의 기본구성이 같다면 mixins으로 빼는게 좋을 것 같다.
      */
      chartRoot.append("rect")
        .attr("class", "chart__background")
        .attr("fill", "none")
        // .attr("fill", this.backGroundColor)
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)

      const xAxisGridGroup = chartRoot.append("g")
        .attr("class", "chart__xAxis-grid");
      const yAxisGridGroup = chartRoot.append("g")
        .attr("class", "chart__yAxis-grid");
      // x축 영역 
      const xAxisGroup = chartRoot.append("g")
        .attr("class", "chart__xAxis");
      const yAxisGroup = chartRoot.append("g")
        .attr("class", "chart__yAxis");

      // set the ranges
      let x = d3.scaleTime().range([0, this.width]);
      let y = d3.scaleLinear().range([this.height, 0]);

      await this.setCsvFile(this.url);

      let valueLine = d3.line()
        .x(function(d) { return x(d.DateTime); })
        .y(function(d) { return y(d.averageSpeed); });

      const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%s");
      // format the data
      this.csvData.forEach(function(d) {
        d.date = parseTime(d.DateTime);
        d.averageSpeed = +d.averageSpeed;
      });
      
      console.log(this.csvData[0])

      // Scale the range of the data
      x.domain(d3.extent(this.csvData, function(d) { return d.DateTime; }));
      y.domain([0, d3.max(this.csvData, function(d) { return d.averageSpeed; } )]);
      
      xAxisGridGroup.call(d3.axisBottom(x)
        .tickSize(10)
      )
      yAxisGridGroup.call(d3.axisLeft(y)
        .tickSize(1)
        .ticks(5)
      )
    },

   



  }


}
</script>

<style>

</style>