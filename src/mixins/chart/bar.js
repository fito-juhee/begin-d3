import * as d3 from "d3";

const bar = {
  data: () => ({
    backGroundColor: "#343939",
    width: 820,
    height: 400,
    margin: {top: 30, right: 30, bottom: 70, left: 60},
    csvData: []
  }),
  computed: {
    
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
