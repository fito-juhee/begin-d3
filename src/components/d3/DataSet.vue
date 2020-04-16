<template>
    <div class="basic__container">
      <div>{{ dataSet }} </div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  created() {
    console.log("created");
    console.log(this.dataSet);

  },
  mounted() {
    console.log("mounted");
    console.log(this.dataSet);
    this.setInit();
  },
  data: () => ({
    dataSet: [ 15, 5, 32, 20, 21 ],
  }),
  methods: {
    setInit() {
      d3.select(".basic__container")          // 1
        .selectAll("p")          // 2
        .data(this.dataSet)           // 3
        .enter()                 // 4
        .append("p")             // 5
        .text(function(d){ return d });   // 6
    },
  }
}

</script>

<style>
</style> 