/*
createTime:2023/2/8 10:11
path:src/components
proName:yk-component
fileName:index
author:俞棵
remark:
*/

import YkSignPad from "../components/SignPad.vue";
import { App, Plugin as Plugin_2 } from "vue";

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    YkSignPad: typeof YkSignPad,
  }
}

export { YkSignPad };

const installer = {
  install: (app: App) => app.component('YkSignPad', YkSignPad as unknown as Plugin_2),
};

export default installer;
