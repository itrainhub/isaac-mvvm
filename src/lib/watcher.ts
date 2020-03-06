import Dep from "./dep"

/**
 * 数据更新的订阅者
 */
export default class Watcher {
  vm: ViewModel
  cb: Function
  depIds: object
  getter: Function | void
  value: any

  constructor(vm: ViewModel, expOrFn: Function | string, cb: Function) {
    this.vm = vm
    this.cb = cb
    this.depIds = {}
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }
    this.value = this.get()
  }
  
  get = (): any => {
    Dep.target = this
    const value = this.getter && this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  update() {
    this.run()
  }

  run() {
    const newValue = this.get()
    const oldValue = this.value

    if (newValue === oldValue) return
    this.value = newValue
    this.cb.call(this.vm, newValue, oldValue)
  }

  addDep(dep: Dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }

  parseGetter = (exp: string): Function | void => {
    if (/[^\w.$]/.test(exp)) return

    const exps = exp.split('.')
    return (data: object) => {
      if (!data) return
      for (let i = 0, l = exps.length; i < l; i++) {
        if (!data) return
        data = data[exps[i]]
      }
      return data
    }
  }
}
