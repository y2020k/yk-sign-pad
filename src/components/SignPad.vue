<!--
createTime:2022/8/31 11:58
path:src/views
proName:test_demo
fileName:SignPad
author:俞棵
remark:签名模块
-->

<script lang="ts" setup>
import { ref, shallowRef, onMounted, nextTick } from "vue";
import { Button as AButton } from "ant-design-vue";

type btnType = 'back' | 'redo' | 'clear';

const props = withDefaults(defineProps<{
  height?: number; // PC端默认高度500
  btnHeight?: number; // 按钮工具栏高度默认54
  zIndex?: number; // 所在层级
  btns?: btnType[] | btnType | 'all'; // 使用哪些按钮
}>(), {
  height: 500,
  btnHeight: 54,
  zIndex: 101,
  btns: 'all',
});

const emit = defineEmits<{
  (_p: 'buildImg', _v: Promise<string>): void;
}>();

// canvas 外部盒子对象实例
const canvasHW = ref<any>(null);
// canvas 对象实例
const canvasF = ref<HTMLCanvasElement | null>(null);
// 历史路径图像数组
const points = ref<any[]>([]);
// canvas 的 context 对象
const canvasTxt = shallowRef<any>(null);
// canvas 与视图的上下左右的距离及自身尺寸
const stage_info = ref<any>([]);
// 每一部分的线段绘画开始位置的 x 坐标
const startX = ref(0);
// 每一部分的线段绘画开始位置的 y 坐标
const startY = ref(0);
// 每一部分的线段绘画结束位置的 x 坐标
const moveY = ref(0);
// 每一部分的线段绘画结束位置的 y 坐标
const moveX = ref(0);
// 是否按下
const isDown = ref(false);
// 画笔颜色
const strokeStyle = ref('#000');
// 画笔宽度
const lineWidth = ref(2);
// 是否旋转
const isRotate = ref(false);
// 当前步数
let step = ref(-1);
// 最大步数记录
let maxStep = ref(-1);
// 是否清空
const isClear = ref(false);

// 初始化Canvas
function initCanvas() {
  let canvas = canvasF.value;
  nextTick(() => {
    if (canvas) {
      isRotate.value = canvasHW.value.offsetWidth <= canvasHW.value.offsetHeight;
      if (isRotate.value) {
        // 获取画布的高度
        canvas.height = canvasHW.value.offsetWidth - props.btnHeight + 1;
        // 获取画布的宽度
        canvas.width = Number(canvasHW.value.offsetHeight);
      }
      else {
        // 获取画布的高度
        canvas.height = canvasHW.value.offsetHeight - props.btnHeight;
        // 获取画布的宽度
        canvas.width = canvasHW.value.offsetWidth;
      }
      // 创建 context 对象
      canvasTxt.value = canvas.getContext('2d');
      // canvas与视图的上下左右的距离及自身尺寸
      stage_info.value = canvas.getBoundingClientRect();
    }
  });
}

// 鼠标按下事件 - 准备绘画
function mouseDown(ev: MouseEvent) {
  ev.preventDefault();
  if (ev) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    };
    startX.value = obj.x;
    startY.value = obj.y;
    canvasTxt.value.beginPath();
    canvasTxt.value.moveTo(startX.value, startY.value);
    canvasTxt.value.lineTo(obj.x, obj.y);
    canvasTxt.value.stroke();
    canvasTxt.value.closePath();
    isDown.value = true;
    document.addEventListener("mouseup", mouseUp);
  }
}

// 鼠标移动事件 - 开始绘画
function mouseMove(ev: MouseEvent) {
  ev.preventDefault();
  if (isDown.value) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    };
    moveY.value = obj.y;
    moveX.value = obj.x;
    canvasTxt.value.strokeStyle = strokeStyle.value;
    canvasTxt.value.lineWidth = lineWidth.value;
    canvasTxt.value.beginPath();
    canvasTxt.value.moveTo(startX.value, startY.value);
    canvasTxt.value.lineTo(obj.x, obj.y);
    canvasTxt.value.stroke();
    canvasTxt.value.closePath();
    startY.value = obj.y;
    startX.value = obj.x;
  }
}

// 鼠标移出边界事件 - 中止绘画
function mouseOut(ev: MouseEvent) {
  ev.preventDefault();
  if (isDown.value) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    };
    moveY.value = obj.y;
    moveX.value = obj.x;
    canvasTxt.value.strokeStyle = strokeStyle.value;
    canvasTxt.value.lineWidth = lineWidth.value;
    canvasTxt.value.beginPath();
    canvasTxt.value.moveTo(startX.value, startY.value);
    canvasTxt.value.lineTo(obj.x, obj.y);
    canvasTxt.value.stroke();
    canvasTxt.value.closePath();
    startY.value = obj.y;
    startX.value = obj.x;
  }
}

// 鼠标移入边界事件 - 继续绘画
function mouseEnter(ev: MouseEvent) {
  ev.preventDefault();
  if (isDown.value) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    };
    startY.value = obj.y;
    startX.value = obj.x;
  }
}

// 松开鼠标事件 - 停止绘画
function mouseUp(ev: MouseEvent) {
  ev.preventDefault();
  if (!isClear.value) {
    step.value++;
    maxStep.value = step.value;
  }
  else
    isClear.value = false;
  if (ev) {
    const element: HTMLElement = ev.target as HTMLElement;
    if (element) {
      const id = element.id;
      let obj = {
        x: id === 'SignPad' ? ev.offsetX : startX.value,
        y: id === 'SignPad' ? ev.offsetY : startY.value,
      };
      canvasTxt.value.beginPath();
      canvasTxt.value.moveTo(startX.value, startY.value);
      canvasTxt.value.lineTo(obj.x, obj.y);
      canvasTxt.value.stroke();
      canvasTxt.value.closePath();
      points.value[step.value] = canvasF.value?.toDataURL();
      isDown.value = false;
      document.removeEventListener('mouseup', mouseUp);
    }
  }
}

// 移动端按下事件 - 准备绘画
function touchStart(ev: TouchEvent) {
  ev.preventDefault();
  if (ev && ev.changedTouches[0]) {
    let obj = {
      y: stage_info.value.width - ev.changedTouches[0].clientX + stage_info.value.left,
      x: ev.changedTouches[0].clientY - stage_info.value.top
    };
    startX.value = obj.x;
    startY.value = obj.y;
    canvasTxt.value.beginPath();
    canvasTxt.value.moveTo(startX.value, startY.value);
    canvasTxt.value.lineTo(obj.x, obj.y);
    canvasTxt.value.stroke();
    canvasTxt.value.closePath();
    isDown.value = true;
  }
}

// 移动端移动事件 - 开始绘画
function touchMove(ev: TouchEvent) {
  ev.preventDefault();
  if (isDown.value && ev.changedTouches[0]) {
    let obj = {
      y: stage_info.value.width - ev.changedTouches[0].clientX + stage_info.value.left,
      x: ev.changedTouches[0].clientY - stage_info.value.top
    };
    moveY.value = obj.y;
    moveX.value = obj.x;
    canvasTxt.value.strokeStyle = strokeStyle.value;
    canvasTxt.value.lineWidth = lineWidth.value;
    canvasTxt.value.beginPath();
    canvasTxt.value.moveTo(startX.value, startY.value);
    canvasTxt.value.lineTo(obj.x, obj.y);
    canvasTxt.value.stroke();
    canvasTxt.value.closePath();
    startY.value = obj.y;
    startX.value = obj.x;
  }
}

// 移动端松开事件 - 停止绘画
function touchEnd(ev: TouchEvent) {
  ev.preventDefault();
  if (!isClear.value) {
    step.value++;
    maxStep.value = step.value;
  }
  else
    isClear.value = false;
  if (ev && ev.changedTouches[0]) {
    let obj = {
      y: stage_info.value.width - ev.changedTouches[0].clientX + stage_info.value.left,
      x: ev.changedTouches[0].clientY - stage_info.value.top
    };
    canvasTxt.value.beginPath();
    canvasTxt.value.moveTo(startX.value, startY.value);
    canvasTxt.value.lineTo(obj.x, obj.y);
    canvasTxt.value.stroke();
    canvasTxt.value.closePath();
    points.value[step.value] = canvasF.value?.toDataURL();
    isDown.value = false;
  }
}

// 撤回
function handleGoBack() {
  step.value--;
  if (isClear.value) {
    isClear.value = false;
    maxStep.value = step.value;
  }
  canvasTxt.value?.clearRect(0, 0, canvasF.value?.width, canvasF.value?.height);
  let canvasPic = new Image();
  canvasPic.src = points.value[step.value];
  canvasPic.addEventListener('load', () => {
    canvasTxt.value?.drawImage(canvasPic, 0, 0);
  });
  // emit('on-back');
}

// 重做
function handleRedo() {
  step.value++;
  canvasTxt.value?.clearRect(0, 0, canvasF.value?.width, canvasF.value?.height);
  let canvasPic = new Image();
  canvasPic.src = points.value[step.value];
  canvasPic.addEventListener('load', () => {
    canvasTxt.value?.drawImage(canvasPic, 0, 0);
  });
  // emit('on-back');
}

// 清空
function handleOverwrite() {
  if (!isClear.value) {
    isClear.value = true;
    step.value++;
  }
  canvasTxt.value.clearRect(0, 0, canvasF.value?.width, canvasF.value?.height);
}

const img = ref("");

// 是否包含撤回按钮
const checkType = (type: btnType | 'all' = 'all') => {
  if (type === 'all') return true;
  else if (typeof props.btns === 'string')
    return props.btns === 'all' || props.btns === type;
  else if (Array.isArray(props.btns))
    return props.btns.includes(type);
  else return true;
};

// 生成图片
function generatePicture() {
  emit('buildImg', new Promise((resolve, reject) => {
    if (step.value === -1 || isClear.value) reject('请先签名！');
    if (canvasF.value) {
      img.value = canvasF.value.toDataURL();
      resolve(img.value);
    }
    reject('获取canvas对象失败！')
  }));
}

onMounted(() => {
  initCanvas();
});
</script>

<template>
  <div class="SignPad">
    <div ref="canvasHW" class="canvasBox">
      <canvas
        id="SignPad"
        ref="canvasF"
        @mousedown.prevent="mouseDown"
        @mousemove.prevent="mouseMove"
        @mouseout.prevent="mouseOut"
        @mouseenter.prevent="mouseEnter"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend.prevent="touchEnd"></canvas>
    </div>
    <div class="btn-group">
      <a-button
        v-show="checkType('back')"
        :disabled="step<0"
        class="back"
        @click="handleGoBack">撤回
      </a-button>
      <a-button
        v-show="checkType('redo')"
        :disabled="step>=maxStep"
        class="redo"
        @click="handleRedo">
        重做
      </a-button>
      <a-button
        v-show="checkType('clear')"
        :disabled="step===-1||isClear"
        class="rewrite"
        @click="handleOverwrite">清空
      </a-button>
      <a-button v-show="checkType" class="submit" @click="generatePicture">
        确认
      </a-button>
    </div>
    <!--    <img
          :src="img"
          alt=""
          style="position:relative;z-index: 10;pointer-events: none">-->
  </div>
</template>

<style lang="scss" scoped>
.SignPad {
  position: relative;
  width: 100%;
  height: calc(v-bind(height) * 1px);
  z-index: v-bind(zIndex);

  .btn-group {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: calc(v-bind(btnHeight) * 1px);
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 10;
  }

  .back, .redo, .rewrite, .submit {
    margin: 6px 12px 6px 0;
  }
}


.canvasBox {
  width: 100%;
  height: 100%;
  background-color: red;

  canvas {
    width: 100%;
    height: calc(100% - v-bind(btnHeight) * 1px + 1px);
    background-color: #f5f5f5;
  }
}

@media screen and (max-width: 1024px) {
  .SignPad {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;

    .btn-group {
      left: 0;
      top: 0;
      width: 100vh;
      transform-origin: 0 0;
      transform: rotateZ(90deg) translateY(-100%);
    }
  }

  .canvasBox {
    transform: rotateZ(90deg);

    canvas {
      position: absolute;
      left: 50%;
      top: 50%;
      width: auto;
      height: auto;
      transform: translate(-50%, calc(-50% - v-bind(btnHeight) * 0.5px));
    }
  }
}
</style>
