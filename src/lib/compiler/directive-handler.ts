import { capitalize } from "../util"
import Watcher from "../watcher"

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
   * 处理文本
   */
  processText(node: Node, value: string | undefined): void {
    node.textContent = typeof value === 'undefined' ? '' : value
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
