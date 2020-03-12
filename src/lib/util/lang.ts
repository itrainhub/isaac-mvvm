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
 * 解析表达式内容
 * @param expression 表达式字符串
 */
export const parseExpression = (expression: string): any => {
  // 如果表达式为是以 . 分隔，还有其它符号，则直接返回
  const reg = /[^a-zA-Z_$.\d]/
  if (reg.test(expression)) return

  // 以 '.' 分隔的表达式，生成函数以解析获取表达式值
  const exps = expression.split('.')
  return (obj: object) => {
    for(let i = 0, l = exps.length; i < l; i++) {
      if (!obj) return
      obj = obj[exps[i]]
    }

    return obj
  }
}

/**
 * 生成函数，用于获取表达式的结果值，当表达式不是以 . 分割调用的对象属性时来调用该方法，比如：{{ stu['name'] }}、{{ 3 + 2 - 5 }}
 * @param vm ViewModel对象实例
 * @param exp 表达式
 */
export const createFunction = (obj: object, exp: string) => {
  console.log('exp: ', exp)
  // const data = {
  //   ...obj.$data,
  //   ...obj.$options.methods
  // }
  
  const param = `{${Object.keys(obj).join(', ')}}`
  return new Function(param, `return ${exp}`)
}

/**
 * 为对象中满足exp表达式条件的属性赋值
 * @param obj 对象
 * @param exp 表达式
 * @param value 值
 */
export const setValue = (obj: object, exp: string, value: any): void => {
  try {
    new Function('value', `return this.${exp} = value`).call(obj, value)
  } catch (error) {
    console.log('lang.js - setValue() - error: ', error)
  }
}
