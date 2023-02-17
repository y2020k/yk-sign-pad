/*
createTime:2023/2/8 10:11
path:src/components
proName:yk-component
fileName:index
author:俞棵
remark:
*/

import SignPad from "../components/SignPad.vue";
import "@vue/runtime-core";
import { App, Plugin as Plugin_2 } from "vue";

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    YkSignPad: typeof SignPad,
  }
}

export {
  SignPad as YkSignPad
}

export default {
  install: (app: App) => app.component('YkSignPad', SignPad as unknown as Plugin_2),
};
