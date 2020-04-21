import * as d3 from "d3";

const bar = {
  data: () => ({
    margin: {top: 30, right: 30, bottom: 70, left: 60},
    
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
    
  }
};

export default bar;
