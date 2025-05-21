import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import { Uploads } from "types/application";

export const hardcodedUploads: Uploads = {
  "1": {
    name: "ian.png",
    type: FILE_TYPE_PNG,
    src: "/uploads/ian.png",
    thumbnailSrc: "/uploads/ian.png",
  },
  "2": {
    name: "Simple line chart",
    type: FILE_TYPE_JSON,
    src: "/uploads/line-chart.json",
    thumbnailSrc: "",
  },
  "3": {
    name: "Simple bar chart",
    type: FILE_TYPE_JSON,
    src: "/uploads/bar-chart.json",
    thumbnailSrc: "",
  },
  "4": {
    name: "Simple pie chart",
    type: FILE_TYPE_JSON,
    src: "/uploads/pie-chart.json",
    thumbnailSrc: "",
  },
};
