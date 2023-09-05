## 签名组件

1. 适配了PC端和移动端，PC端高度为500， 移动端默认层级为101，
   按钮组高度默认为54
2. 除直接生成签名图片外，还包含撤回、重做和清空的功能

## 参数说明

|    参数     |   说明   |                               类型                               | 是否必填 |     默认值     |
|:---------:|:------:|:--------------------------------------------------------------:|:----:|:-----------:|
|  height   |  盒子高度  |                             number                             |  否   |  pc时有效：500  |
|  zIndex   |  盒子层级  |                             number                             |  否   |     101     |
|    bgc    |  背景色   |                             string                             |  否   | `'#f5f5f5'` |
| btnHeight | 按钮组的高度 |                             number                             |  否   |     54      |
|   btns    |  按钮组   | Array<`'back'丨'redo'丨'clear'`>丨`'back'丨'redo'丨'clear'`丨`'all'` |  否   |   `'all'`   |

## 方法

| 函数名       | 参数类型              | 说明                 |
|-----------|-------------------|--------------------|
| @buildImg | Promise\<string\> | 成功返回图片字符串，失败返回错误提示 |

### 使用方式
#### 在`main.ts`中引入
```ts
import YkSignPad from "@yuke_2022/yk-sign-pad";

createApp(App)
  .use(YkSignPad)
  .mount('#app');
```

#### 在`*.vue`中单独引入
```ts
import { YkSignPad } from "@yuke_2022/yk-sign-pad";
```

#### 在*.vue文件使用
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { message } from "ant-design-vue";
import 'ant-design-vue/es/message/style/index.css'

const signImg = ref("");

function getImg(result: Promise<string>) {
  result.then((img)=>{
    signImg.value = img;
  })
    .catch((err)=>{
      message.error(err);
    });
}
</script>

<template>
  <img v-if="signImg" :src="signImg" alt="" />
  <YkSignPad @buildImg="getImg"></YkSignPad>
</template>
```

## 相关地址
### [Github](https://github.com/y2020k/yk-sign-pad)
### [npm](https://www.npmjs.com/package/@yuke_2022/yk-sign-pad)
