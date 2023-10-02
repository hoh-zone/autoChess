/**
 * 获取自适应尺寸, 单位是 vw (postcss 不会转换动态代码的 px，需要自己转换下)
 */
export const getVw = (px: number) => {
  // 设计稿满屏宽度，对齐 postcss.config.js
  const SCREEN_WIDTH = 1500;
  return `${px * 100 / SCREEN_WIDTH}vw`;
};

/**
 * 通过设计稿的 px 转换到实际渲染时的 px
 */
export const convert2AdaptivePx = (px: number) => {
  const vw = getVw(px);

  if (typeof window === 'undefined') {
    return 0;
  }

  return (parseFloat(vw) / 100) * window.innerWidth;
};