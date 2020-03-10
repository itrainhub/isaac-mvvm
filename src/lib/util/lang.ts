/**
 * 为目标对象添加或修改属性
 * @param target 目标对象
 * @param key 属性名
 * @param value 属性值
 */
export const def = (target: object, key: string, value: any) => {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: false
  })
}

/**
 * 获取 vm 数据中 exp 表达式所表示的值，这是一个比较取巧的方法，未测试其严谨性
 * @param vm ViewModel对象实例
 * @param exp 表达式
 */
export const parseExpression = (vm: any, exp: string) => {
  console.log('exp: ', exp)
  // const data = {
  //   ...vm.$data,
  //   ...vm.$options.methods
  // }
  
  const param = `{${Object.keys(vm).join(', ')}}`
  return new Function(param, 'return ' + exp)
}
