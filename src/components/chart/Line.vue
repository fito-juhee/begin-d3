<template>
  <div class="line__container">
    <h3>룰루랄라 D3로 {{ chart }} 만들어보지~</h3>
    <ul class="line__list">
      <li> 
        <button class="button__draw" @click="exampleLineChart">Line Example</button>
      </li>
      <li>
      <button class="button__draw" @click="drawLineChart">Ohcoach Speed</button>
      </li>
    </ul>
    <div id="exampleLineChart"></div>
    <div id="lineSpeedChart"></div>
    <div id="ohcoachChart">
      <img 
        width="820px"
        height="400px"
        src="../../assets/images/ohcoach_capture/speedChart.png" alt="ohcoach-speed-chart-image" />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import bar from "../../mixins/chart/bar.js";

export default {
  mixins: [bar],
  mounted() {
    this.drawLineChart();
    // this.exampleLineChart();
  },
  computed: {
  },
  data: () => ({
    chart: "Line",
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
        .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

      await this.setCsvFile(this.OhcoachSpeedChartUrl);

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
        .attr("class", "chart__grid chart__grid-xaxis");
      const yAxisGridGroup = chartRoot.append("g")
        .attr("class", "chart__grid chart__grid-yaxis");
      // y축 영역 
      const yAxisGroup = chartRoot.append("g")
        .attr("class", "chart__yAxis");
      // x축 영역 
      const xAxisGroup = chartRoot.append("g")
        .attr("class", "chart__xAxis");

      const seriesGroup = chartRoot.append("g")
        .attr("class", "chart__series-line");
        
      const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%s");

      // set the ranges
      var x = d3.scaleTime().range([0, this.width]);
      var y = d3.scaleLinear().range([this.height, 0]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.DateTime); })
          .y(function(d) { return y(d.averageSpeed); }
      );

      // gridlines in x axis function
      function make_x_gridlines() {		
          return d3.axisBottom(x)
              .ticks(5)
      }

      // gridlines in y axis function
      function make_y_gridlines() {		
          return d3.axisLeft(y)
              .ticks(4)
      }

       // format the data
      this.csvData.forEach(function(d) {
        d.DateTime = parseTime(d.DateTime);
        d.averageSpeed = +d.averageSpeed;
      });

      // Scale the range of the data
      x.domain(d3.extent(this.csvData, function(d) { return d.DateTime; }));
      y.domain([0, d3.max(this.csvData, function(d) { return d.averageSpeed; })]);
      
      // add the X gridlines
      xAxisGridGroup.attr("transform", "translate(0," + (Number(this.height) - 20)+ ")")
        .call(make_x_gridlines()
        .tickSize(-this.height)
        .tickFormat("")
      )
      // add the Y gridlines
      yAxisGridGroup.call(make_y_gridlines()
          .tickSize(-this.width)
          .tickFormat("")
      )

        // add the X Axis
      xAxisGroup.attr("transform", "translate(10," +  (Number(this.height) - 20) + ")")
        .call(d3.axisBottom(x));

      // add the Y Axis
      yAxisGroup.call(d3.axisLeft(y));

    },
    exampleLineChart: async function() {
      d3.select("svg").remove();
      await this.setCsvFile(this.lineExampleUrl);

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
          .y(function(d) { return y(d.close); }
      );


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
              .ticks(4)
      }

      // format the data
      this.csvData.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
      });

      // Scale the range of the data
      x.domain(d3.extent(this.csvData, function(d) { return d.date; }));
      y.domain([0, d3.max(this.csvData, function(d) { return d.close; })]);

      // add the X gridlines
      svg.append("g")			
          .attr("class", "chart__grid chart__grid-xaxis")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
          )

      // add the Y gridlines
      svg.append("g")			
        .attr("class", "chart__grid chart__grid-yaxis")
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
.chart__grid line {
  color: pink;
  fill: hotpink;
}

.chart__grid path {
  stroke: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}
</style>