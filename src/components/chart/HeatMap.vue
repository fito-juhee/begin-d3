<template>
  <div class="heatmap__container">
    <svg id="upper_label"> </svg>
    <svg id="left_label"> </svg>
    <svg id="heatmap_area" class="heatmap_area" width="600" height="410">
      <!-- <rect x='0' y='0' rx='3' ry='3' width='100' height='137' style='fill: #F8002A; opacity:0.5;' />
      <text class='zone_group' text-anchor='middle' x='50' y='69' fill='#fff'> 123 </text> -->
      <g v-for = "rowIndex in 6" :key="rowIndex" >
        <g v-for = "colIndex in 3" :key="colIndex" >          
          <rect :x='100*(rowIndex -1)' :y='137*(colIndex-1)' rx='0' ry='0' width="100" height='137' :style='getStyle(rowIndex,colIndex)' />
          <text class='zone_group' text-anchor='middle' :x='-50 + 100*rowIndex' :y='-68.5 + 137 * colIndex' fill='#fff'> 123 </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  
  data() {
    return {
      
    }
  },
  mounted() {
    // heatmap_area에 svg를 생성하고 
    let svg = d3.select("#heatmap_area")
    svg.append("g")
      .attr("transform", )
  },
  methods: {
    getStyle(row, col){
      console.log(row, col)
      console.log('fill: #F8002A; opacity:' + 0.06 * (row + col) + ';')
      return 'fill: #F8002A; opacity:' + 0.05 * (row + col) + ';'
    }
  },
}
</script>

<style scoped>
.heatmap_area{
  position:relative;
  display:inline-flex;
  background:url("../../common/court.png") no-repeat center center;
  background-size: 112% 100%;
  vertical-align: top;
}


</style>