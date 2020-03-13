import { isObject, def } from '../util'
import Dep from './dep'
import { arrayMethods } from './array'

/**
 * 劫持数据的方法
 * TODO: 劫持数组处理
 * @param data 待劫持的数据，类型为对象或数组
 */
export const observe = (data: object | Array<any>): Observer | void => {
  if (!isObject(data)) return
  return new Observer(data)
}

/**
 * 将对象属性生成 getter/setter
 * @param obj 待定义 getter/setter 的对象
 * @param key 待定义 getter/setter 的对象属性
 * @param value 属性值
 */
const observeProperty = (obj: object, key: string, value: any): void => {
  // 获取对象 obj 属性 key 的描述信息
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 不允许配置，则结束
  if (property && property.configurable === false)
    return

  // 对象属性上预定义的 getter/setter
  const getter = property && property.get
  const setter = property && property.set
  // 创建 Dep 对象
  const dep = new Dep()
  // 属性值也可能为对象或数组，继续劫持
  let childOb = observe(value)
  // 定义属性，重写 getter/setter
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      // 有预定义的 getter，则调用 getter 方法获得返回值，否则使用已有属性值
      const val = getter ? getter.call(obj) : value
      // 收集订阅者
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          // if (Array.isArray(val)) {
          //   dependArray(val)
          // }
        }
      }
      return val
    },
    set(newValue: any) {
      const val = getter ? getter.call(obj) : value
      // 考虑到 NaN === NaN 为 false 的情况
      if (val === newValue || (val !== val && newValue !== newValue)) return
      // 考虑到只读属性
      if (getter && !setter) return
      if (setter)
        setter.call(obj, newValue)
      else
        value = newValue
      // 对更新的值继续 observe
      childOb = observe(newValue)
      // setter，通知订阅者更新
      dep.notify()
    }
  })
}

const dependArray = (value: any[]): void => {
  for (let e: any, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e))
      dependArray(e)
  }
}

/**
 * 数据的观察者，监听数据的变化
 */
class Observer {
  // 观察的数据，对象或数组
  data: object | Array<any>
  // Dep 对象：订阅者收集器
  dep: Dep

  constructor(data: object | Array<any>) {
    this.data = data
    // Dep对象，用于收集订阅者和通知更新
    this.dep = new Dep()
    // 为 data 数据添加 '__ob__' 属性指向当前对象
    def(data, '__ob__', this)
    // 判断数据的类型
    if (Array.isArray(data)) { // 劫持数组
      // 修改 data 数组的原型链，即 data.__proto__ = arrayMethods
      Object.setPrototypeOf(data, arrayMethods)
      // 数组各元素可能也是对象或数组，继续劫持
      this.observeArray(data)
    } else { // 劫持普通对象
      this.walk(data)
    }
  }

  /**
   * 遍历对象各属性，生成各属性的 getter/setter
   */
  walk(obj: object): void {
    Object.keys(obj).forEach(key => observeProperty(obj, key, obj[key]))
  }

  /**
   * 劫持数组中每个元素
   * @param arr 数组对象
   */
  observeArray(arr: any[]): void {
    for (let i = 0, l = arr.length; i < l; i++) {
      observe(arr[i])
    }
  }
}
