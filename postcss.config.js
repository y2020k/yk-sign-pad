/*
 * @Author       : fallen_zero
 * @Date         : 2022-06-10 17:31:31
 * @LastEditors  : fallen_zero
 * @LastEditTime : 2022-06-11 15:47:06
 * @FilePath     : /demo_vite/postcss.config.js
 * @FileName     : 自动将 px 转为 rem 配置
 */

module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, //结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
      propList: ['*'], //是一个存储哪些将被转换的属性列表，这里设置为['*']全部，假设需要仅对边框进行设置，可以写['*', '!border*']
      unitPrecision: 5, //保留rem小数点多少位
      selectorBlackList: ['no-px'],  //则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法。
      replace: true, //这个真不知到干嘛用的。有知道的告诉我一下
      mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
      // minPixelValue: 12, //px小于12的不会被转换
    },
  },
}
