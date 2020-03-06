import { isObject } from './util'
import Dep from './dep'

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
  const dep = new Dep()
  // 获取对象 obj 属性 key 的描述信息
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 不允许配置，则结束
  if (property && property.configurable === false)
    return

  // 对象属性上预定义的 getter/setter
  const getter = property && property.get
  const setter = property && property.set

  // 属性值也可能为对象或数组，继续 observe
  let childOb = observe(value)

  // 定义属性
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      const val = getter ? getter.call(obj) : value

      // get，收集订阅者
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
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

      // set，通知订阅者
      dep.notify()
    }
  })
}

/**
 * 解决
 *  Element implicitly has an 'any' type because expression 
 *  of type 'string' can't be used to index type '{}'
 * 问题
 */
interface IParams {
  [propName: string]: any
}

/**
 * 数据的观察者，监听数据的变化
 */
class Observer {
  // 观察的数据，对象或数组
  value: object | Array<any>
  dep: Dep

  constructor(value: object | Array<any>) {
    this.value = value
    this.dep = new Dep()

    this.walk(value)
  }

  /**
   * 遍历对象各属性，生成各属性的 getter/setter
   */
  walk = (obj: object): void => {
    Object.keys(obj).forEach(key => observeProperty(obj, key, (<IParams>obj)[key]))
  }
}
