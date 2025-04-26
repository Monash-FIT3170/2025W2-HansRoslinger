import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "constants/application";
import { Uploads } from "types/application";

export const hardcodedUploads: Uploads = {
  '1': { name: 'graph1', type: FILE_TYPE_PNG, src:'/uploads/chart-icon.png',  thumbnailSrc: '' },
  '2': { name: 'ian.png', type: FILE_TYPE_PNG, src: '/uploads/ian.png',  thumbnailSrc: '/uploads/ian.png' },
  '3': { name: 'Simple bar chart', type: FILE_TYPE_JSON, src:'/uploads/example-vega-lite.vg.json',  thumbnailSrc: '' },
  '4': { name: 'pie_chart.png', type: FILE_TYPE_PNG, src:'/uploads/chart-icon.png',  thumbnailSrc: '/uploads/chart-icon.png' },
    
};