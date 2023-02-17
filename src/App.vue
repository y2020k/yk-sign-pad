<script lang="ts" setup>
import { ref } from 'vue';

const showSign = ref(false);

const signImg = ref("");

function getImg(img: string) {
  showSign.value = false;
  signImg.value = img;
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
