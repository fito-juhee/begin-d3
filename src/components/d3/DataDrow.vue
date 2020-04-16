<template>
    <div class="section__box">
      <div>{{ dataXY }} </div>
      <div class="first__box">
        <h2>ENTER</h2>
      </div>
      <div class="first__box">
        <h2>UPDATE</h2>
        <svg class="board__one">
          <circle></circle>
          <circle></circle>
          <circle></circle>
          <circle></circle>
          <circle></circle>
          <circle></circle>
        </svg>
      </div>
      <div class="third__box">
        <h2>DAYA KEY</h2>
        <svg class="board__two">
          <circle></circle>
          <circle></circle>
          <circle></circle>
          <circle></circle>
          <circle></circle>
          <circle></circle>
        </svg>
      </div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  mounted() {
    console.log("mounted");
    this.stepOne();
    this.stepTwo();
    this.stepThree();
  },
  data: () => ({
    dataXY: [
      {x: 3.0, y: 3.0},
      {x: 11.0, y: 11.0},
      {x: 19.0, y: 19.0},
      {x: 27.0, y: 27.0},
      {x: 35.0, y: 35.0}
    ],
    dataXY2: [
      {x: 10.0, y: 10.0},
      {x: 30.0, y: 10.0},
      {x: 50.0, y: 10.0},
      {x: 70.0, y: 10.0},
      {x: 100.0, y: 10.0}
    ],
    objData: [
      {name: "Alice", x: 10.0, y: 9.14},
      {name:   "Bob", x:  8.0, y: 8.14},
      {name: "Carol", x: 13.0, y: 8.74},
      {name:  "Dave", x:  9.0, y: 8.77},
      {name: "Edith", x: 11.0, y: 9.26}
    ]
  }),
  methods: {
    stepOne() {
      console.log("stepOne");
      let svg = d3.select(".first__box").append("svg")
        .attr("height", 50)
        .attr("width", 100);
      svg.selectAll("circle")
        .data(this.dataXY)
        .enter().append("circle")
        .attr("cx", function(d){ return d.x })
        .attr("cy", function(d){ return d.y })
        .attr("r", 2.5);
    },
    stepTwo() {
      console.log("stepTwo");
      let svg = d3.select(".board__one")
        .attr("height", 80)
        .attr("width", 200);
      var circle = svg.selectAll("circle")
        .data(this.dataXY2)
        .attr("cx", function(d){ return d.x })
        .attr("cy", function(d){ return d.y })
        .attr("r", 5);
    },
    stepThree() {
      console.log("stepThree");
      function key(d) { 
        console.log("key", d);
        return d.name; 
      }
      let svg = d3.select(".board__two")
        .attr("height", 80)
        .attr("width", 200);
      var circle = svg.selectAll("circle")
        .data(this.objData)
        .attr("cx", function(d){ return d.x })
        .attr("cy", function(d){ return d.y })
        .attr("r", 2.5);
    },
    


  }
}

</script>

<style>
.section__box {
  margin: 20px;
}
</style> 