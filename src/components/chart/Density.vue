<template>
  <div class="density__container">
    <div id="my_dataviz"></div>
  </div>
</template>

<script src="https://d3js.org/d3-contour.v1.min.js"></script>

<script>
// https://www.d3-graph-gallery.com/graph/density2d_shading.html
// https://github.com/d3/d3-contour 
// https://devdocs.io/d3~5/d3-contour
import * as d3 from "d3";

export default {

  data() {
    return {
      
    }
  },

  mounted() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")

      svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "black");
      svg.append("image")
        // .attr("xlink:href", "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/11/2/0/DV1510H_fried-chicken-recipe-10_s4x3.jpg.rend.hgtvcom.826.620.suffix/1568222255998.jpeg")
        .attr("xlink:href", "https://ohcoach.com/common/images/court.png")
        .attr("x",0)
        .attr("y",0)
        .attr("width", 400)
        .attr("height", 400)

    // D3 Read Data
    // http://learnjsdata.com/read_data.html

    // "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_for_density2d.csv"
    // "https://raw.githubusercontent.com/fito-cheol/SampleFileStorage/master/hitmap.csv"
    d3.csv("https://raw.githubusercontent.com/fito-cheol/SampleFileStorage/master/hitmapData.csv").then(function(data) {
      let processed_data = []
      for (let i in data){
        let datum = data[i]
        for (let j =0; j< datum.recode_level_total ;j++){
          processed_data.push(datum)
        }
      }
      
      // Add X axis
      var x = d3.scaleLinear()
        .domain([0, 120])
        .range([ margin.left, width - margin.right ]);

      // // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height - margin.bottom, margin.top ]);

      // Prepare a color palette
      var color = d3.scaleLinear()
          .domain([0, 1, 2, 4]) // Points per square pixel.
          .range(["#8080ff", "#7FE562", "#fbe50b", "#ff3729" ])

      // compute the density data
      console.log(data)
      var densityData = d3.contourDensity()
        .x(function(d) { return x(125-d.x); }) // 앞에 x()는 d3.scaleLinear(), 뒤에 d.x는 .csv column name
        .y(function(d) { return y(d.y); })
        .size([width, height])
        .bandwidth(4) // smaller = more precision in lines = more lines
        (processed_data)

      console.log(densityData)

      // show the shape!
      svg.insert("g", "g")
        .selectAll("path")
        .data(densityData)
        .enter().append("path")
          .attr("d", d3.geoPath())
          .attr("fill", function(d) { console.log(d, d.value); return color(d.value); }) // value에 뭐가 찍히는걸까
      
    })
  },

  methods: {
    
  },


}


</script>