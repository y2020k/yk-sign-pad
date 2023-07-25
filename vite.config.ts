import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 需要安装 @types/node
import { resolve } from 'path';
// 引入按需引入插件
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// 引入按需引入 ant-design-vue, element-plus 插件
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'unplugin-vue-components/resolvers';
// 自动引入图标库
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
// 自动生成.d.ts文件
import dts from 'vite-plugin-dts';
// 将打包的css插入js
import VitePluginStyleMove from "./plugins/VitePluginStyleMove";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
      imports: ['vue', 'vue-router', 'pinia'],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      //为true时在项目根目录自动创建
      dts: './auto-imports.d.ts',
    }),
    /*Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver(),
        AntDesignVueResolver({ importStyle: true, resolveIcons: true }),
        VantResolver(),
      ],
      //自动加载的组件目录，默认值为 ['src/components']
      dirs: ['src/components'],
      //组件名称包含目录，防止同名组件冲突
      directoryAsNamespace: true,
      //指定类型声明文件，为true时在项目根目录创建
      dts: './components.d.ts',
    }),
    Icons({
      autoInstall: true,
    }),*/
    dts({
      entryRoot: "./src",
      outputDir: ["./es/src", "./lib/src"],
    }),
    VitePluginStyleMove(),
  ],
  // 自定义路径
  resolve: {
    alias: {
      '@': resolvePath('src'),
      // 自定义 css 文件存放路径
      '@css': resolvePath('src/assets/css'),
      // 图片存放路径
      '@images': resolvePath('src/assets/images'),
      // ts 文件存放路径
      '@ts': resolvePath('src/assets/ts'),
      // 配置在路由中页面路径
      '@views': resolvePath('src/views'),
      // 自定义组件路径
      '@components': resolvePath('src/components'),
      // 按需引入外部组件的文件路径
      '@utils': resolvePath('src/utils'),
      // axios 请求路径
      '@api': resolvePath('src/api'),
      // 自定义类型文件路径
      '@types': resolvePath('src/types'),
      // 自定义全局响应式变量及方法路径(类似 vuex)
      '@store': resolvePath('src/store'),
    },
  },
  base: './', // 打包后的路径
  // 打包配置
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "src/typings/index.ts"),
      name: "dist",
      fileName: "dist",
      formats: ["es", "umd", "cjs"],
    },
    rollupOptions: {
      external: [
        "vue",
        "ant-design-vue"
      ],
      output: [
        {
          //打包格式
          format: "es",
          //打包后文件名
          entryFileNames: "[name].mjs",
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: "named",
          //配置打包根目录
          dir: "./es",
          globals: {
            vue: "Vue",
            "ant-design-vue": "AntDesignVue",
          },
        },
        {
          //打包格式
          format: "cjs",
          //打包后文件名
          entryFileNames: "[name].js",
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: "named",
          //配置打包根目录
          dir: "./lib",
          globals: {
            vue: "Vue",
            "ant-design-vue": "AntDesignVue",
          },
        },
      ]
    },
  },
  // 代理
  server: {
    cors: true,
    host: '0.0.0.0',
    // 项目运行后是否自动在浏览器启动
    open: false,
    proxy: {
      '/api': {
        // 代理的路径
        // target: "http://192.168.10.232:81/api",
        target: 'http://yqqiye.renyiso.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/weather': {
        // 代理的路径
        target: 'https://devapi.qweather.com/v7/weather',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather/, ''),
      },
    },
  },
});

/**
 * 配置路径
 * @param paths 路径
 * @returns
 */
function resolvePath(paths: string): string {
  return resolve(__dirname, paths);
}
