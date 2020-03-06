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