module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportHeight: 1000,  // 设计稿的宽度
      unitPrecision: 3,    // 转换后的小数点位数
      viewportUnit: 'vh',  // 转换的单位
      selectorBlackList: ['.ignore'],  // 需要忽略的选择器
      mediaQuery: false,   // 是否允许在媒体查询中转换
      exclude: [], // 设置忽略文件，用正则做目录名匹配
    },
  },
}
