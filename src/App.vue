<script lang="ts" setup>
import SignPad from "@components/SignPad.vue";
import { Button as AButton, message } from "ant-design-vue";
import { ref } from "vue";

const showSign = ref(false);

const signImg = ref("");

function getImg(result: Promise<string>) {
  result.then((img) => {
    showSign.value = false;
    signImg.value = img;
  })
    .catch((err) => {
      message.error(err);
    });
}
</script>

<template>
  <div id="app">
    <img v-if="signImg" :src="signImg" alt="" />
    <a-button @click="showSign=true">签名</a-button>
    <SignPad v-if="showSign" isRotate @buildImg="getImg"></SignPad>
  </div>
</template>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  width: 100vw;
  height: 100vh;
  background-color: red;

  img {
    max-width: 100%;
  }
}
</style>
