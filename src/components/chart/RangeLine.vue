<template>
  <div class="line__container">
    <h3>룰루랄라 D3로 {{ chart }} 차트를 만들어보지~</h3>
    <!-- <ul class="line__list">
      <li>
      <button class="button__draw" @click="drawLineChart">Ohcoach Speed</button>
      </li>
    </ul> -->
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
    chart: "Range Line",
    marginNavigator: {top: 300, right: 30, bottom: 20, left: 20},
    OhcoachSpeedChartUrl: "http://image-dev.ohcoach.com/csv/speedChart.csv",
    lineExampleUrl: "http://image-dev.ohcoach.com/csv/lineChart.csv",
    matchStartTime: ""
  }),
  computed: {
    heightNavigator() {
      return 380 - this.marginNavigator.top - this.marginNavigator.bottom;
    }
  },
  methods: {
    drawLineChart: async function() {
      // 전에 있던 데이터를 삭제해주기 위해서 중복해서 그려줌.
      d3.select("svg").remove();
      /* 차트에 들어갈 Data를 불러오고 가공해주는 부분 */
      await this.setCsvFile(this.OhcoachSpeedChartUrl);
      
      //TODO: 주석 달기 ==> x축 dateTime 시 분 초 렌더링??
      const parseDateTime = d3.timeParse("%Y-%m-%d %I:%M:%S");
      const bisectDate = d3.bisector(function(d) { return d.DateTime; }).left;

      // 그래프로 그리기 전에 쓸 수 있는 데이터로 변경
      this.csvData.forEach(function(d) {
        d.DateTime = parseDateTime(d.DateTime);
        d.averageSpeed = +d.averageSpeed;
        d.speedRangeLow = +d.speedRangeLow;
        d.speedRangeHigh = +d.speedRangeHigh;
      });

      // root의 해당하는 svg 설정
      const chartRoot = d3.select("#lineSpeedChart").append("svg")
        .attr("class", "chart__root")
        .attr("width", this.width)
        .attr("height", this.height + this.margin.top + this.margin.bottom + this.heightNavigator)
      /* 
      차트의 배경을 정의해준다. 
      만약 모든 차트의 기본구성이 같다면 mixins으로 빼는게 좋을 것 같다.
      */
      chartRoot.append("rect")
        // .attr("fill", this.backGroundColor)
        .attr("class", "chart__background")
        .attr("fill", "none")
        .attr("width", this.width)
        .attr("height", this.height + this.margin.top)
        .attr("x", 0)
        .attr("y", 0)
       
      // set the ranges:: x축과 y축의 범위를 설정해준다. (차트영역)
      const x = d3.scaleTime().range([0, this.width]);
      const y = d3.scaleLinear().range([this.height, 0]);
      // navigator 영역
      const x2 = d3.scaleTime().range([0, this.width]);
      const y2 = d3.scaleLinear().range([this.heightNavigator, 0]);
      
      const xAxis = d3.axisBottom(x)

      const xAxis2 = d3.axisBottom(x2)
                       .ticks(5)

      const yAxis = d3.axisRight(y)
                      .tickSize(-this.width)
                      .tickFormat(function(d) { return d3.format(".1f")(d) + "km/h"; })
                      .ticks(4)
                      .tickValues([0, 10.8, 14.4, 19.8, 25.2]);

      let brush = d3.brushX()
        .extent([[0, 0], [this.width, this.heightNavigator]])
        .on("brush end", brushed)
      
      let zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [this.width, this.height]])
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", zoomed);

      // define the line 평균 series 그래프
      const averageLine = d3.line()
        .x(function(d) { return x(d.DateTime); })
        .y(function(d) { return y(d.averageSpeed); });

      // navigator line 그래프
      const navigatorAverageLine = d3.line()
        .x(function(d) { return x2(d.DateTime); })
        .y(function(d) { return y2(d.averageSpeed); });

      // define the average (max - min) area 그래프
      const averageArea = d3.area()
        .curve(d3.curveStep) // 삐쭉삐쭉한 그래프 곡선으로 변경해주는 함수.
        .x(function(d) { return x(d.DateTime); })
        .y0(function(d) { return y(d.speedRangeLow); })
        .y1(function(d) { return y(d.speedRangeHigh); })

      // 그래프가 그려지는 영역
      const focus = chartRoot.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(0," + (this.margin.bottom / 2)  + ")")
      // range selector 영역
      const context = chartRoot.append("g")
        .attr("class", "context")
        .attr("transform", "translate(0," + (this.height + this.margin.bottom)  + ")")
        
      // 축의 데이터 범위 설정 
      const dataXrange = d3.extent(this.csvData, function(d) { return d.DateTime; });
      const dataYrange = [0, d3.max(this.csvData, function(d) { return +d.averageSpeed; })];
      
      // 1. Scale the range of the data
      x.domain(d3.extent(this.csvData, function(d) { return d.DateTime; }));
      y.domain(dataYrange);

      // navigator 안에 그래프 축 설정
      x2.domain(d3.extent(this.csvData, function(d) { return d.DateTime; }));
      y2.domain(dataYrange);

      focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis);

      focus.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + (this.width) + ", 0)")
        .call(yAxis);

      d3.select(".axis.axis--y")
        .selectAll(".tick text")
          .attr("class", "yaxis__text")
          .attr("x", -55)
          .attr("y", -7)

      focus.append("path")
        .datum(this.csvData)
        .attr("class", "area")
        .attr("d", averageLine)
        
      focus.append("path")
        .data([this.csvData])
        .attr("class", "chart__line-averageMax")
        .attr("d", averageArea)
        .attr("fill", "none")
        .attr("stroke", "rgba(70, 130, 180, 0.42)")
        .attr("stroke-width", 1.2)

      context.append("path")
        .datum(this.csvData)
        .attr("class", "area")
        .attr("d", navigatorAverageLine);

      context.append("g")
          .attr("class", "navigation axis axis--x")
          .attr("transform", "translate(0," + this.heightNavigator + ")")
          .attr("fill", "red")
          .call(xAxis2.tickSize(-this.heightNavigator));

      context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

      chartRoot.append("rect")
        .attr("class", "zoom")
        .attr("fill", "none")
        .attr("width", this.width)
        .attr("height", this.height)
        .call(zoom);

      function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".area").attr("d", averageLine);
        focus.select(".chart__line-averageMax").attr("d", averageArea);
        focus.select(".axis--x").call(xAxis);
        chartRoot.select(".zoom").call(zoom.transform, d3.zoomIdentity
          .scale(730 / (s[1] - s[0]))
          .translate(-s[0], 0)
        );
      }
      function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".area").attr("d", averageLine);
        focus.select(".chart__line-averageMax").attr("d", averageArea);
        focus.select(".axis--x").call(xAxis);
        chartRoot.select(".brush").call(brush.move, x.range().map(t.invertX, t));
      }
      
      /* create a tooltip */
      // const tooltip = d3.select("#lineSpeedChart")
      //   .append("div")
      //   .style("opacity", 0)
      //   .attr("class", "chart__tooltip")

      // chartRoot.append("rect")
      //   .attr("class", "overlay")
      //   .attr("height", this.height)
      //   .attr("width", this.width)
      //   .on("mouseover", function() { focus.style("display", null); })
      //   // .on("mouseout", function() { focus.style("display", "none"); })
      //   .on("mousemove", mousemove);

      // function mousemove() {
      //   console.log("tooltip_mouse", x.invert(d3.mouse(this)[0]));
      //   console.log("i", bisectDate(this.csvData, x.invert(d3.mouse(this)[0]), 1));
      //       var x0 = x.invert(d3.mouse(this)[0]),
      //           i = bisectDate(this.csvData, x0, 1),
      //           d0 = this.csvData[i - 1],
      //           d1 = this.csvData[i],
      //           d = x0 - d0.DateTime > d1.DateTime - x0 ? d1 : d0;
      //       focus.attr("transform", "translate(" + x(d.DateTime) + "," + y(d.averageSpeed) + ")");
      //       focus.select(".tooltip-date").text(dateFormatter(d.DateTime));
      //       focus.select(".tooltip-likes").text(formatValue(d.averageSpeed));
      // }
    },
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

/* .brush .extent {
  fill-opacity: .07;
  shape-rendering: crispEdges;
  clip-path: url(#clip);
}

.chart__root rect.pane {
	cursor: move;
	fill: none;
	pointer-events: all;
}
.chart__root .resize .handle {
	fill: orange;
}

.chart__root .resize .handle-mini {
	fill: white;
    stroke-width: 1px;
    stroke: #555;
} */

.area {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.8px;
}
.zoom {
  cursor: move;
  fill: none;     
}

.navigation.axis.axis--x line {
  stroke: #616060;
  opacity: 0.6;
}

.axis.axis--y path {
  stroke: none;
}

.axis.axis--y .tick line {
  stroke: #979797;
  opacity: 0.6;
}

.brush .handle {
  stroke: #2c3e50;
  fill: #2c3e50;
  stroke-width: 3px;
}

.brush .selection {
  fill: #3c527c;
  stroke: whitesmoke;
  fill-opacity: 0.5;
}

.yaxis__text {
  font-size: 12px;
  font-weight: 700;
}

.chart__tooltip {
  background-color: "white";
  border: solid;
  border-width:  1px;
  border-radius: 5px;
  padding: 10px;
}

.overlay {
  fill: none;
  pointer-events: all;
}

</style>