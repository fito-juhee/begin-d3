<template>
  <div class="heatmap__container">
    <svg id="upper_label" width="700" height="90">
      <g v-for = "colIndex in 5" :key="colIndex" >
        <line :x1='100+colIndex*100' y1='0' :x2='100+colIndex*100' y2='90' style='stroke: #000; stroke-width:1;' />
      </g>
      <text class='zone_group' text-anchor='middle' x='150' y='50' :fill='textColor'>
          <tspan x='150' dy='0' font-size='12' fill='#6c6c6c' font-weight='bolder'> 위쪽 첫번째 </tspan>
          <tspan x='150' dy='25'> 90%</tspan>
      </text>
    </svg>
    <div style='display: inline-flex'>
      <svg id="left_label" width="100" height="410"> 
        <line x1='30' y1='137' x2='100' y2='137' style='stroke: #000; stroke-width:1;' />
        <line x1='30' y1='274' x2='100' y2='274' style='stroke: #000; stroke-width:1;' />
        <text class='zone_group' text-anchor='middle' x='60' y='63.5' :fill='textColor'>
          <tspan x='60' dy='0' font-size='12' fill='#6c6c6c' font-weight='bolder'>왼쪽 첫번째</tspan>
          <tspan x='60' dy='25'>30%</tspan>
        </text>
      </svg>
      <svg id="heatmap_area" class="heatmap_area" width="600" height="410">
        <g v-for = "colIndex in 6" :key="colIndex" >
          <g v-for = "rowIndex in 3" :key="rowIndex" >          
            <rect :x='100*(colIndex -1)' :y='137*(rowIndex-1)' rx='0' ry='0' width="100" height='137' :style='getStyle(rowIndex, colIndex)' />
            <text class='zone_group' text-anchor='middle' :x='-50 + 100*colIndex' :y='-68.5 + 137 * rowIndex' fill='#fff'> {{colIndex  + rowIndex*6 -6}} </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  
  data() {
    return {
      textColor: '#648cf8',
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