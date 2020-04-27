import * as d3 from "d3";

const bar = {
  data: () => ({
    backGroundColor: "#343939",
    // width: 820,
    // height: 400,
    margin: {top: 30, right: 30, bottom: 100, left: 60},
    csvData: []
  }),
  computed: {
    width() {
     let width = 820 - this.margin.left - this.margin.right;
     return width;
    },
    height() {
     let height = 400 - this.margin.top - this.margin.bottom;
     return height;
    }
  },
  methods: {
    setCsvFile: async function(url) {
      // csv파일 불러오기 위한 함수.
      let getCsvFile = function(filePath) {
        return d3.csv(filePath);
      }
      this.csvData = await getCsvFile(url);
    },
  }
};

export default bar;
