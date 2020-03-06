/**
 * 判断参数值是否为对象
 * @param param 待判断参数
 */
export const isObject = (param: any): boolean => {
  return param !== null && typeof param === 'object'
}

/**
 * 从数组中删除指定项
 * @param arr 数组
 * @param item 待删除项
 */
export const remove = (arr: Array<any>, item: any): Array<any> | void => {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index !== -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 转换字符串首字母为大写，剩下为小写
 * @param str 待转换字符串
 */
export const capitalize = (str: string): string => {
  if (str.length === 0) return ''
  const result = str.toLowerCase().split('')
  result[0] = result[0].toUpperCase()
  return result.join('')
}
