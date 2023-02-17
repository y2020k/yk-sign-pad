import { createApp } from 'vue';
import App from './App.vue';
// 引入自适应 rem
import 'amfe-flexible';
import { Button } from "ant-design-vue";
import "ant-design-vue/es/button/style/index.css";
import SignPad from "@/typings";

createApp(App)
  .use(Button)
  .use(SignPad)
  .mount('#app');
