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
    marginNavigator: {top: 300, right: 30, bottom: 30, left: 20},
    OhcoachSpeedChartUrl: "http://image-dev.ohcoach.com/csv/speedChart.csv",
    lineExampleUrl: "http://image-dev.ohcoach.com/csv/lineChart.csv",
    matchStartTime: ""
  }),
  computed: {
    heightNavigator() {
      return this.height - this.marginNavigator.top - this.marginNavigator.bottom;
    }

  },
  methods: {
    drawLineChart: async function() {
      // 전에 있던 데이터를 삭제해주기 위해서
      d3.select("svg").remove();
      
      d3.select("#lineSpeedChart").style("position", "relative");

      // root의 해당하는 svg 설정
      const chartRoot = d3.select("#lineSpeedChart").append("svg")
        .attr("class", "chart__root")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      // Data를 불러오는 부분
      await this.setCsvFile(this.OhcoachSpeedChartUrl);
      /* 
      차트의 배경을 정의해준다. 
      만약 모든 차트의 기본구성이 같다면 mixins으로 빼는게 좋을 것 같다.
      */
      chartRoot.append("rect")
        // .attr("fill", this.backGroundColor)
        .attr("class", "chart__background")
        .attr("fill", "none")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform",
          "translate(" + this.margin.right + "," + this.margin.top + ")");  
      /* x축 그리드 영역 설정 */
      const xAxisGridGroup = chartRoot.append("g")
        .attr("class", "chart__grid chart__grid-xaxis")
        .attr("transform", "translate(" + this.margin.left + "," + (this.height + this.margin.top) + ")");
      /* y축 그리드 영역 설정 */
      const yAxisGridGroup = chartRoot.append("g")
        .attr("class", "chart__grid chart__grid-yaxis")
        .attr("transform", "translate(" + (this.width + this.margin.right) + "," + this.margin.top + ")");
      /* x축 영역 설정 */
      const xAxisGroup = chartRoot.append("g")
        .attr("class", "chart__xAxis")
        .attr("transform", "translate(" + this.margin.right + "," + (this.height + this.margin.top) + ")");
       /* y축 영역 설정 */
      const yAxisGroup = chartRoot.append("g")
        .attr("class", "chart__yAxis")
        .attr("transform", "translate(" + (this.width + this.margin.right) + "," + this.margin.top + ")");
      /* 그래프 영역 */
      const seriesGroup = chartRoot.append("g")
        .attr("class", "chart__series-line")
        .attr("transform", "translate(" + this.margin.right + "," + this.margin.top + ")"); 
      
      // set the ranges:: x축과 y축의 범위를 설정해준다. (차트영역)
      const x = d3.scaleTime().range([0, this.width]);
      const y = d3.scaleLinear().range([this.height, 0]);
      // 축의 데이터 범위 설정 
      const dataXrange = d3.extent(this.csvData, function(d) { return d.DateTime; });
      const dataYrange = [0, d3.max(this.csvData, function(d) { return +d.averageSpeed; })];
      
      // maximum date range allowed to display
      const mindate = dataXrange[0],  // use the range of the data
          maxdate = dataXrange[1];

      //TODO: 주석 달기 ==> x축 dateTime 시 분 초 렌더링??
      const parseDateTime = d3.timeParse("%Y-%m-%d %I:%M:%S");
      // 그래프로 그리기 전에 쓸 수 있는 데이터로 변경
      this.csvData.forEach(function(d) {
        d.DateTime = parseDateTime(d.DateTime);
        d.averageSpeed = +d.averageSpeed;
        d.speedRangeLow = +d.speedRangeLow;
        d.speedRangeHigh = +d.speedRangeHigh;
      });

      /*
      *   :: x축, y축 그리는 영역 ::
      *   1. x축, y축 범위에 맞게 간격 조절
      *   2. x축 ticks 설정 및 그리기
      *   3. x축 그리드 그리는 함수
      *   4. y축 그리드 그리는 함수
      */

      // 1. Scale the range of the data
      x.domain(d3.extent(this.csvData, function(d) { return d.DateTime; }));
      y.domain(dataYrange);

      // 2. add the X Axis
      xAxisGroup.call(d3.axisBottom(x)
        // x축의 tick을 15분 마다 한번씩 찍도록 함.
        .ticks(d3.timeMinute.every(15))
      );

      // 3. gridlines in x axis function
      function make_x_gridlines(xaxis) {
        return d3.axisBottom(xaxis)
          .ticks(5)
          .tickFormat("")
          
      }
      // 4. gridlines in y axis function
      function make_y_gridlines() {		
        return d3.axisRight(y)
          .ticks(4)
          .tickValues([0, 10.8, 14.4, 19.8, 25.2])
      }
      // add the X gridlines
      xAxisGridGroup.call(make_x_gridlines(x))
      // add the Y gridlines
      yAxisGridGroup.call(make_y_gridlines()
        .tickSize(-this.width)
        .tickFormat(function(d) { return d3.format(".1f")(d) + "km/h"; } )
      )

      // define the line 평균 series 그래프
      const averageLine = d3.line()
        .x(function(d) { return x(d.DateTime); })
        .y(function(d) { return y(d.averageSpeed); });
      // define the average (max - min) area 그래프
      const averageArea = d3.area()
        .curve(d3.curveStep)
        .x(function(d) { return x(d.DateTime); })
        .y0(function(d) { return y(d.speedRangeLow); })
        .y1(function(d) { return y(d.speedRangeHigh); })

      // 평균 스피드 그래프 그리는 영역
      seriesGroup.append("path")
        .data([this.csvData])
        .attr("class", "chart__line-average")
        .attr("d", averageLine)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
      // // 평균 의 최대값-최소값을 그리는 영역
      seriesGroup.append("path")
        .data([this.csvData])
        .attr("class", "chart__line-averageMax")
        .attr("d", averageArea)
        .attr("fill", "none")
        .attr("stroke", "rgba(70, 130, 180, 0.42)")
        .attr("stroke-width", 1.2);// 평균 스피드 그래프 그리는 영역
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
.line__list {
  margin: 0 150px;
  display: flex;
  flex-direction: row;
}
.chart__grid line {
  color: #dddddd;
}

.chart__grid path {
  stroke: none;
}

.line {
  fill: none;
  stroke: steelblue;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}

.chart__xAxis .tick text {
  color: black;
}


</style>