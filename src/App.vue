<script lang="ts" setup>
import { ref } from 'vue';
import { message } from "ant-design-vue";
import 'ant-design-vue/es/message/style/index.css'

const showSign = ref(false);

const signImg = ref("");

function getImg(result: Promise<string>) {
  result.then((img)=>{
    showSign.value = false;
    signImg.value = img;
  })
    .catch((err)=>{
      message.error(err);
    });
}
</script>

<template>
  <img v-if="signImg" :src="signImg" alt="" />
  <a-button @click="showSign=true">签名</a-button>
  <YkSignPad v-if="showSign" @buildImg="getImg"></YkSignPad>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  margin-top: 60px;

  img {
    max-width: 100%;
  }
}
</style>
