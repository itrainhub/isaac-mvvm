import Dep from "./dep"

/**
 * 订阅者，订阅数据的更新，数据更新后完成更新视图
 */
export default class Watcher {
  vm: ViewModel
  callback: Function
  expression: string
  depIds: object
  value: any

  constructor(vm: ViewModel, expression: string, callback: Function) {
    this.vm = vm // ViewModel 对象，挂载有数据
    this.expression = expression // 指令表达式或插值表达式
    this.callback = callback // 绑定的视图更新函数
    this.depIds = {} // 保存已被哪些 Dep 收集过
    this.value = this.getValue() // 获取订阅数据的初始值
  }
  
  /**
   * 获取订阅数据当前值，每次需要收集订阅者
   */
  getValue(): any {
    Dep.target = this
    const value = this.get()
    Dep.target = null
    return value
  }

  /**
   * 处理更新视图的方法
   */
  update(): void {
    // 更新后的数据
    const newValue = this.getValue()
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

  /**
   * 获取表达式表示的属性值
   */
  get(): any {
    let vm = this.vm
    const exps = this.expression.split('.')
    for (let i = 0, l = exps.length; i < l; i++) {
      if (!vm) return
      vm = vm[exps[i]]
    }

    return vm
  }
}
