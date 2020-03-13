import { def, isEmpty } from '../util'

// 数组 Array.prototype 引用
const arrayProto = Array.prototype
// 创建以 Array.prototype 为原型的对象，
// 被劫持的数组会修改原型链且以该对象为原型
export const arrayMethods = Object.create(arrayProto)

// 变异方法（即调用这些方法会导致原始数组的修改）
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

// 重写变异方法，以劫持数组变化
methodsToPatch.forEach(method => {
  // 当前方法对应在 Array 中的原始方法
  const original = arrayProto[method]
  // 在 arrayMethods 对象上定义 method 对应的方法，重写方法
  def(arrayMethods, method, function(this: any, ...args: any[]): any {
    // 调用原始方法完成数组操作
    const value = original.call(this, ...args)
    // 如果是 push、unshift、splice 三个方法，可能会向数组中添加新元素
    // 添加的新元素需要再次被劫持，标记出添加的新元素
    let inserted: any[] = []
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
    }
    // 获取为数组对象注入的 __ob__ 属性值（即 Observer 对象）
    const ob = this.__ob__
    // 对插入的元素劫持
    if (!isEmpty(inserted)) {
      ob.observeArray(inserted)
    }
    // 通知数据更新
    ob.dep.notify()
    // 返回原始方法调用返回的结果值
    return value
  })
})
