import { createWidget, widget, prop } from '@zos/ui'
import { log } from '@zos/utils'
import { Time } from '@zos/sensor'
import { getText } from '@zos/i18n'
import { getLanguage } from '@zos/settings'
import { STYLE_LINE1, STYLE_LINE2, STYLE_LINE3, STYLE_LINE3_ERR, STYLE_LINE4, STYLE_LINE5, STYLE_LINE6, STYLE_SPACER } from './index.style'

const logger = log.getLogger('SimpleCalendar')
const scrollContainer = createWidget(widget.VIEW_CONTAINER, {
  ...CONTAINER_STYLE
})

Page({
  state: {
    line1: null, line2: null, line3: null, line4: null, line5: null, line6: null, spacer: null,
    timeSensor: null,
  },

  build() {
    const lang = getLanguage()
    if ( lang < 2 ) {
      this.state.timeSensor = new Time()

      this.state.line1 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE1 })
      this.state.line2 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE2 })
      this.state.line3 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE3 })
      this.state.line4 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE4 })
      this.state.line5 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE5 })
      this.state.line6 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE6 })
      this.state.spacer = scrollContainer.createWidget(widget.TEXT, { ...STYLE_SPACER })

      this.updateCalendar()

      // 每分鐘自動更新
      this.state.timeSensor.onPerMinute(() => {
        this.updateCalendar()
      })
    } else {
      // When switches language to Not Chinese
      this.state.line3 = scrollContainer.createWidget(widget.TEXT, { ...STYLE_LINE3_ERR })
      this.state.line3.setProperty(prop.MORE, { text: getText('lang_wrong') })
    }
    
  },

  // 輔助函式：處理已經是中文的農曆資訊
  formatLunar(m, d, f) {
    logger.info(`Formatting Lunar: ${m} and ${d} and ${f}`)
    
    // 處理月份：將 "一月" 轉為 "正月"，"十二月" 轉為 "臘月"
    let mStr = m.toString()
    if (mStr === '一月') {
      mStr = '正月'
    } else if (mStr === '腊月') {
      mStr = getText('lunar_12')
    }
    if (f === 'INVALID') {
      f = ''
    } else {
      f = ` / ${f}`
    }

    return `${mStr}${d}${f}`
  },

  updateCalendar() {
    logger.info('Updating Calendar...')
    const t = this.state.timeSensor
    const year = t.getFullYear()
    const month = t.getMonth()
    const date = t.getDate()
    const day = t.getDay()
    
    const rocYear = year - 1911
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const dayStr = `${weekDays[day % 7]}`

    // 取得農曆字串
    const lunarStr = this.formatLunar(t.getLunarMonth(), t.getLunarDay(), t.getShowFestival())
    const lunarYear = t.getLunarYear().replace('年','')

    this.state.line1.setProperty(prop.MORE, { text: `${getText('year_ad')}${year}年 / 民國${rocYear}年` })
    this.state.line2.setProperty(prop.MORE, { text: `${month}月` })
    this.state.line3.setProperty(prop.MORE, { text: `${date}` })
    this.state.line4.setProperty(prop.MORE, { text: `${getText('week_day')}${dayStr}` })
    this.state.line5.setProperty(prop.MORE, { text: `${getText('lunaryear_prefix')}${lunarYear}` })
    this.state.line6.setProperty(prop.MORE, { text: `${getText('lunar_prefix')}${lunarStr}` })
  }
})