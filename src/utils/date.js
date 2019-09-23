/**
 * 专门处理时间的功能模块
 * */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 相对时间包
import 'dayjs/locale/zh-cn' // 中文语言包
// 配置使用中文
dayjs.locale('zh-cn')

// 注册使用相对插件
dayjs.extend(relativeTime)

export const relativetime = dateTime => {
  return dayjs().from(dayjs(dateTime))
}

// dayjs().format('YYYY/MM/DD')
// dayjs().from(dayjs('1990')) // 2 年以前
// dayjs().from(dayjs(), true) // 2 年
