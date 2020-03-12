import Dep from "./dep"
import { parseExpression, noop } from '../util'

/**
 * 订阅者，订阅数据的更新，数据更新后完成更新视图
 */
export default class Watcher {
  vm: ViewModel
  callback: Function
  depIds: object
  value: any
  getter: Function

  constructor(vm: ViewModel, expOrFn: string | Function, callback: Function) {
    this.vm = vm // ViewModel 对象，挂载有数据
    this.callback = callback // 绑定的视图更新函数
    this.depIds = {} // 保存已被哪些 Dep 收集过
    // 如果表达式中仅有 . 分隔，则解析获取属性值比较方便，但如果表达式中还有其它符号分隔，
    // 比如 {{ arr[2].num * arr[2].price }} 之类的表达式，则需要通过传递函数的方式来
    // 计算表达式的值，所以 expOrFn 是类似 'stu.name' 字符串类型的表达式或是函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parseExpression(expOrFn)
      if (!this.getter) {
        this.getter = noop
      }
    }
    this.value = this.get() // 获取订阅数据的初始值
  }

  /**
   * 获取订阅数据当前值，需要收集订阅者，所以设置 Dep.target，使用完毕后置空
   */
  get(): any {
    const { vm } = this
    Dep.target = this
    const value = this.getter.call(vm, vm)
    Dep.target = null
    return value
  }

  /**
   * 处理更新视图的方法
   */
  update(): void {
    // 更新后的数据
    const newValue = this.get()
    // 更新前的数据
    const oldValue = this.value
    // 如果更新前后数据一致，说明未更新数据，不需要更新视图
    if (newValue === oldValue)
      return
    // 调用回调函数更新视图
    this.callback.call(this.vm, newValue)
    // 保存更新后数据
    this.value = newValue
  }

  /**
   * 添加到 Dep 的队列中，订阅数据更新
   * @param dep Dep 对象实例
   */
  addDep(dep: Dep): void {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }
}
