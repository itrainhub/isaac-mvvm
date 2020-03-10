import { def } from '../util'

// 创建新对象，以 Array.prototype 作为原型
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

// 变异方法名
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
  // 在 arrayMethods 对象上定义 method 对应的方法
  def(arrayMethods, method, function(this: any, ...args: any[]): any {
    // 调用原始方法完成数组操作
    const value = original.call(this, ...args)
    const ob = this.__ob__
    // 获取 push/unshift/splice 方法向数组中插入元素时的元素值
    let inserted
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(3)
    }
    // 对插入的元素劫持
    if (inserted) {
      ob.observeArray(inserted)
    }
    // 通知数据更新
    ob.dep.notify()
    return value
  })
})
