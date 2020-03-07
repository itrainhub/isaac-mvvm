import { capitalize } from "../util"
import Watcher from "../core/watcher"

export default {
  /**
   * 分发指令
   * @param node 节点
   * @param vm View-Model 对象
   * @param directive 指令名称
   * @param expression 指令表达式
   */
  dispatch(node: Node, vm: ViewModel, directive: string, expression: string): void {
    const fn = this[`process${capitalize(directive)}`]
    const value = this.getVmValue(vm, expression)
    fn && fn(node, value)

    new Watcher(vm, expression, (value, oldValue) => {
      fn && fn(node, value, oldValue)
    })

    if (directive === 'model') {
      this.handleInput(node, vm, expression)
    }
  },

  /**
   * 获取挂载在 vm 上的属性值
   * @param vm View-Model 对象实例
   * @param props 待获取值的属性，如：'stu.name.middle'
   */
  getVmValue(vm: ViewModel, props: string): any {
    props.split('.').forEach(key => {
      vm = vm[key.trim()]
    })
    return vm
  },

  /**
   * 设置挂载在 vm 上的属性值
   * @param vm vm
   * @param props 属性名
   * @param value 属性值
   */
  setVmValue(vm: ViewModel, props: string, value: any): void {
    const exps = props.split('.')
    const maxIndex = exps.length - 1
    exps.forEach((key, index) => {
      if (index < maxIndex) {
        vm = vm[key]
        return
      }
      vm[key] = value
    })
  },

  /**
   * 处理文本
   */
  processText(node: Node, value: string | undefined): void {
    node.textContent = typeof value === 'undefined' ? '' : value
  },

  /**
   * 处理 model 绑定
   * @param node 节点
   * @param value 值
   */
  processModel(node: Node, value: string | undefined): void {
    (<HTMLInputElement>node).value = typeof value === 'undefined' ? '' : value
  },

  /**
   * 文本框 x-model 处理 input 事件
   * @param node 节点
   * @param vm ViewModel
   * @param expression 表达式
   */
  handleInput(node: Node, vm: ViewModel, expression: string) {
    let val = this.getVmValue(vm, expression)
    node.addEventListener('input', () => {
      const value = (<HTMLInputElement>node).value
      if (val === value) return
      this.setVmValue(vm, expression, value)
      val = value
    }, false)
  },

  /**
   * 处理事件
   */
  processEvent(node: Node, vm: ViewModel, directive: string, cb: string) {
    const eventType = directive.slice(3)
    const callback = vm.$options && vm.$options.methods && vm.$options.methods[cb]
    if (eventType && callback) {
      node.addEventListener(eventType, callback.bind(vm), false)
    }
  },
}
