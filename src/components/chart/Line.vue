<template>
  <div>
    룰루랄라 D3로 만들어보지~
    <div id="lineSpeedChart"></div>
    <div id="exampleLineChart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import bar from "../../mixins/chart/bar.js";

export default {
  mixins: [bar],
  mounted() {
    // this.drawLineChart();
    this.exampleLineChart();
  },
  computed: {
  },
  data: () => ({
    OhcoachSpeedChartUrl: "http://image-dev.ohcoach.com/csv/speedChart.csv",
    lineExampleUrl: "http://image-dev.ohcoach.com/csv/lineChart.csv",
  }),
  methods: {
    drawLineChart: async function() {
      d3.select("svg").remove();

      // root의 해당하는 svg
      const chartRoot = d3.select("#lineSpeedChart").append("svg")
        .attr("class", "chart__root")
        .attr("width", this.width)
        .attr("height", this.height)

      // await this.setCsvFile(this.url);

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

      const seriesGroup = chartRoot.append("g")
        .attr("class", "chart__series-line");

      // parse the date / time
      var parseTime = d3.timeParse("%H:%M:%SZ");

      // set the ranges
      var x = d3.scaleTime().range([0, this.width]);
      var y = d3.scaleLinear().range([this.height, 0]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.dateTime); })
          .y(function(d) { return y(d.averageSpeed); });

      console.log(valueline);

      // gridlines in x axis function
      function make_x_gridlines() {		
          return d3.axisBottom(x)
              .ticks(5)
      }

      // gridlines in y axis function
      function make_y_gridlines() {		
          return d3.axisLeft(y)
              .ticks(5)
      }


      // format the data
      this.csvData.forEach(function(d) {
          d.averageSpeed = +d.averageSpeed;
      });
      console.log(this.csvData);

      // Scale the range of the data
      x.domain(d3.extent(this.csvData, function(d) { return d.dateTime; }));
      y.domain([0, d3.max(this.csvData, function(d) { return d.averageSpeed; })]);

      // add the X gridlines
      xAxisGridGroup.attr("class", "grid")
          .call(make_x_gridlines()
              .tickSize(-this.height)
              .tickFormat("")
          )

      // add the Y gridlines
      yAxisGridGroup.attr("class", "grid")
          .call(make_y_gridlines()
              .tickSize(-this.width)
              .tickFormat("")
          )

      // add the valueline path.
      seriesGroup.append("path")
          .data([this.csvData])
          .attr("class", "line")
          .attr("d", valueline);

      // add the X Axis
      xAxisGroup.attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(x));

      // add the Y Axis
      yAxisGroup.call(d3.axisLeft(y));

    },
    exampleLineChart: async function() {
      console.log("1");
      await this.setCsvFile(this.lineExampleUrl);
      console.log("2");

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // parse the date / time
      var parseTime = d3.timeParse("%d-%b-%y");

      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);


      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      // gridlines in x axis function
      function make_x_gridlines() {		
          return d3.axisBottom(x)
              .ticks(5)
      }

      // gridlines in y axis function
      function make_y_gridlines() {		
          return d3.axisLeft(y)
              .ticks(5)
      }

      // Get the data

        // format the data
        this.csvData.forEach(function(d) {
          console.log(d);
          d.date = parseTime(d.date);
          d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(this.csvData, function(d) { return d.date; }));
        y.domain([0, d3.max(this.csvData, function(d) { return d.close; })]);

        // add the X gridlines
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )

        // add the valueline path.
        svg.append("path")
            .data([this.csvData])
            .attr("class", "line")
            .attr("d", valueline);

        // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

    }
  }
}
</script>

<style>

</style>