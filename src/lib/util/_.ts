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
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 判断是否为空：null、undefined、'', [], {}
 * @param param 待判断是否为空的参数
 */
export const isEmpty = (param: any): boolean => {
  return (
    param === null
    || typeof param === 'undefined'
    || (typeof param === 'string' && param.trim().length === 0)
    || (Array.isArray(param) && param.length === 0)
    || (typeof param === 'object' && Object.getOwnPropertyNames(param).length === 0)
  )
}

/**
 * 对象深克隆
 * @param data 待克隆对象
 */
export const cloneDeep = (data: any): any => {
  if (!isObject(data))
    return data
  
  let result: object = Array.isArray(data) ? [] : {}
  
  for (let key in data) {
    const curr = data[key]
    result[key] = isObject(curr) ? cloneDeep(curr) : curr
  }

  return result
}
