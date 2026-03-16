import { align, text_style } from '@zos/ui'
import { getDeviceInfo } from '@zos/device'
import { px } from '@zos/utils'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

// 統一小字的大小與顏色
const COLOR = 0xffffff
const ALIGN = { align_h: align.CENTER_H, align_v: align.CENTER_V }

// index.style.js 修改重點
export const CONTAINER_STYLE = {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: DEVICE_HEIGHT, // 容器的可視高度為螢幕高度
  }
  
  const LINE_SPACING = px(10) // 每行文字之間的間距
  
  // 重新定義座標，從 y: 0 開始循序往下排
  export const STYLE_LINE1 = { x: 0, y: px(70), w: DEVICE_WIDTH, h: px(30), text_size: px(24), color: COLOR, ...ALIGN }
  export const STYLE_LINE2 = { x: 0, y: STYLE_LINE1.y + STYLE_LINE1.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(46), text_size: px(40), color: COLOR, ...ALIGN }
  export const STYLE_LINE3 = { x: 0, y: STYLE_LINE2.y + STYLE_LINE2.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(126), text_size: px(120), color: COLOR, ...ALIGN }
  export const STYLE_LINE3_ERR = { x: 0, y: STYLE_LINE2.y + STYLE_LINE2.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(72), text_size: px(24), color: COLOR, ...ALIGN }
  export const STYLE_LINE4 = { x: 0, y: STYLE_LINE3.y + STYLE_LINE3.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(46), text_size: px(40), color: COLOR, ...ALIGN }
  export const STYLE_LINE5 = { x: 0, y: STYLE_LINE4.y + STYLE_LINE4.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(30), text_size: px(24), color: COLOR, ...ALIGN }
  export const STYLE_LINE6 = { x: 0, y: STYLE_LINE5.y + STYLE_LINE5.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(30), text_size: px(24), color: COLOR, ...ALIGN }
  export const STYLE_SPACER = { x: 0, y: STYLE_LINE6.y + STYLE_LINE6.h + LINE_SPACING, w: DEVICE_WIDTH, h: px(60), ...ALIGN }