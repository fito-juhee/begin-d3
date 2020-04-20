<template>
    <div>
      <h3>barChart</h3>
      <ul>
        <li>1. 막대 그래프 기본<button class="button__draw" @click="drawBar">DRAW</button></li>
        <li>2. 오코치 막대 그래프<button class="button__draw" @click="drawTotalDistance">DRAW</button></li>
      </ul>
      <div id="barChart"></div>
      <div id="totalDistanceChart"></div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  mounted() {
    this.drawTotalDistance();
  },
  created(){
  },
  data: () => ({
    url: "",
    margin: {top: 10, right: 30, bottom: 30, left: 40},
    arrayData: [9, 19, 29, 39, 29, 19, 9],
    objData : [{x:'A', y:9}, {x:'B', y:19}, {x:'C', y:29}, {x:'D', y:39}, {x:'E', y:29}, {x:'F', y:19}, {x:'G', y:9}],
    csvData: [],
    margin: {top: 30, right: 30, bottom: 70, left: 60},
    maxValueOfYaxis: 0
  }),
  computed: {
    width() {
      return  820 - this.margin.left - this.margin.right;
    },
    height() {
      return 400 - this.margin.top - this.margin.bottom;
    },
  },
  methods: {
    drawBar: function() {
      // 여러개 생기는 것 방지 하기 위해서.
      d3.select("svg").remove();

      var svg = d3.select("#barChart")
        .append("svg")
          .attr("width", "500")
          .attr("height", "300")

      var svg = d3.select("svg");
      var width  = parseInt(svg.style("width"), 10) - 30;
      var height = parseInt(svg.style("height"), 10) - 20;

      var xScale = d3.scaleBand()
        .domain(this.objData.map(function(d) { return d.x;} ))
        .range([0, width]).padding(0.2);

      var svgG = svg.append("g")
        .attr("transform", "translate(30, 0)");

      var yScale = d3.scaleLinear()
        .domain([0, d3.max(this.objData, function(d){ return d.y; })])
        .range([height, 0]);  

      svgG.selectAll("rect")
        .data(this.objData)
        .enter().append("rect")
            .attr("class", "chart__bar")
            .attr("height", function(d, i) {return height-yScale(d.y)})
            .attr("width", xScale.bandwidth())
            .attr("x", function(d, i) {return xScale(d.x)})
            .attr("y", function(d, i) {return yScale(d.y)})
        
      svgG.selectAll("text")
        .data(this.objData)
        .enter().append("text")
        .text(function(d) {return d.y})
            .attr("class", "chart__dataLabel")
            .attr("x", function(d, i) {return xScale(d.x)+xScale.bandwidth()/2})
            .style("text-anchor", "middle")
            .attr("y", function(d, i) {return yScale(d.y) + 15});
        
      svgG.append("g")
        .attr("class", "chart__xAxis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(xScale));

      svgG.append("g")
        .call(d3.axisLeft(yScale).ticks(10));
    },

    drawTotalDistance: async function() {
      d3.select("svg").remove(); // 두번씩 생기는 걸 방지하기 위해
      
      await this.setCsvFile("http://image-dev.ohcoach.com/csv/category_two.csv");
      // append the svg object to the body of the page
      const svg = d3.select("#totalDistanceChart").append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
      
      // X축 범위 지정 
      const xScale = d3.scaleBand()
        .domain(this.csvData.map(function(d) { return d.Category;} ))
        .range([0, this.width]).padding(0.2)
      // y축 값의 최대값을 구하기 위해서
      this.maxValueOfYaxis = Math.max(...this.csvData.map(data => data.total_distance), 0);
      // Y축 범위 지정
      const yScale = d3.scaleLinear()
        .domain([0, this.maxValueOfYaxis])
        .range([this.height, 0]);

      // plotLine group
      const svgGXaxis = svg.append("g");
      const svgGYaxis = svg.append("g");
      const svgGYaxisLabel = svg.append("g");
      const svgGPlotLine = svg.append("g");
      // chart series group
      const svgG = svg.append("g")
      
      this.drawXaxis(svgGXaxis, xScale);
      this.drawYaxis(svgGYaxis, yScale, svgGYaxisLabel);
      this.drawPlotLine(svgGPlotLine, xScale, yScale);
      this.drawSeriesBar(svgG, xScale, yScale);
    },
    drawXaxis(svgGXaxis, xScale) {
      let height = this.height;
        svgGXaxis.attr("class", "chart__xaxis")
          .attr("transform", "translate(0," + (height) + ")")
          .call(d3.axisBottom(xScale)
            // .tickSize(-height)
          )
          // text style
          .selectAll("text")
            .attr("transform", "translate(0,0)rotate(-45)")
            .style("text-anchor", "end");
    },
    drawYaxis(svgGYaxis, yScale, svgGYaxisLabel) {
      let width = this.width;
      
      svgGYaxis.attr("class", "chart__yAxis")
      .call(d3.axisLeft(yScale).ticks(4)
        // .tickSize(-width)
      );
      svgGYaxisLabel.append("text")
        .attr("class", "chart__yAxis-label")
        // y축 라벨 style
        .attr("class", "chart__yAxis-label")
        .attr("x", -25)
        .attr("y", yScale(this.maxValueOfYaxis) - 10)
        .append("tspan")
          .text("m")
          .style("font-size", "12px");
    },
    drawSeriesBar(svgG, xScale, yScale) {
      let height = this.height;
      // Bars
      svgG.selectAll("rect")
        .data(this.csvData)
        .enter().append("rect")
          .attr("class", "chart__bar")
          .attr("width", xScale.bandwidth())
          .attr("height", function(d) { return height - yScale(d.total_distance); })
          .attr("x", function(d) { return xScale(d.Category); })
          .attr("y", function(d) { return yScale(d.total_distance); })

      // Data label
      svgG.selectAll("text")
        .data(this.csvData)
        .enter().append("text")
        .text(function(d) {return d.total_distance})
          .attr("class", "chart__dataLabel")
          .attr("x", function(d, i) {return xScale(d.Category)+ xScale.bandwidth()/2})
          .style("text-anchor", "middle")
          .attr("y", function(d, i) {return yScale(d.total_distance) + 15});
    },
    drawPlotLine(svgGPlotLine, xScale, yScale) {
      // 데이터의 평균을 구하기 위해서
      const averageData = this.setAverageTotaldistance(this.csvData);
      // svg 안에서는 this를 쓸 수 없기 떄문에 미리 정해준다.
      let width = this.width;
      let height = this.height;

      // 평균값 PlotLine
      svgGPlotLine.attr("class", "chart__plotLine-avg")
        .append("line")
        .attr("x1", xScale(0))
        .attr("x2", width)
        .attr("y1", yScale(averageData))
        .attr("y2", yScale(averageData))
        .attr("stroke", "#00EBB2") 
        .attr("stroke-width", "2")

      // 평균 값 텍스트
      svgGPlotLine.append("text")
        .attr("class", "chart__plotLine-label")
        .attr("x", width - 80)
        .attr("y", yScale(averageData + 300))
        .append("tspan")
          .text(`평균 값: ${averageData}`)
          .style("font-size", "15px")
    },
    setCsvFile: async function(url) {
      // csv파일 불러오기 위한 함수.
      let getCsvFile = function(filePath) {
        return d3.csv(filePath);
      }
      this.csvData = await getCsvFile(url);
    },
    setAverageTotaldistance(arr) {
      let averageData = arr.reduce((sum, el) => sum + Number(el.total_distance), 0) / arr.length;
      return averageData;
    }
  }
}

</script>

<style>
li {
  list-style: none;
  padding: 10px 0;
}
.chart__bar {
  /* 차트 막대 색 */
  fill: #7bb0cf;
  stroke: #7bb0cf;
}
.chart__bar:hover {
  fill: #569fc9;
  stroke: #569fc9;
}

.chart__dataLabel {
  font-size: 10px;
  fill: black;
  font-weight:bold;
}

.chart__xaxis line {
  stroke: #ddd;
  shape-rendering: crispEdges;
}
.chart__yAxis line {
  stroke: #ddd;
  shape-rendering: crispEdges;
}

.chart__plotLine-label {
  color: #08131f;
  font-size: 10px;
  font-weight: 800;
  fill: #08131f;
}

</style> 