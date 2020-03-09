import { capitalize, isEmpty } from "../util"
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
    // 获取处理函数名
    const fn = this[`process${capitalize(directive)}`]
    // 调用处理函数
    fn && fn(node, this.getVmValue(vm, expression))
    // 创建 Watcher 订阅者对象，绑定数据更新后更新视图函数
    new Watcher(vm, expression, (value: any, oldValue: any) => {
      fn && fn(node, value, oldValue)
    })
    // 文本框双向绑定处理
    if (directive === 'model') {
      this.handleModel(<HTMLInputElement>node, vm, expression)
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
   * 处理文本节点显示
   * @param node 文本节点
   * @param value 节点文本值
   */
  processText(node: Text, value: string): void {
    node.textContent = isEmpty(value) ? '' : value
  },

  /**
   * 处理 html 文本
   * @param node 元素节点
   * @param value html文本值
   */
  processHtml(node: Element, value: string): void {
    node.innerHTML = isEmpty(value) ? '' : value
  },

  /**
   * 处理 {{ exp }} 插值语法
   * @param {*} node 节点
   * @param {*} vm ViewModel 实例
   * @param {*} mustache {{ msg }} 插值语法字符串
   * @param {*} expression 表达式
   */
  processMustache(
    node: Text,
    original: {plainTexts: string[], mustaches: any[]},
    vm: ViewModel,
    expression: string,
    index: number
  ): void {
    // 获取插值表达式的值，保存在数组中，便于组装数据
    let value = this.getVmValue(vm, expression)
    const { mustaches } = original
    mustaches[index] = isEmpty(value) ? '' : value
    // 组装文本，设置节点值
    this.handleMustachText(node, original)
    // 创建 Watcher 订阅者对象，绑定数据更新后更新视图函数
    new Watcher(vm, expression, (value: any, oldValue: any) => {
      mustaches[index] = isEmpty(value) ? '' : value
      this.handleMustachText(node, original)
    })
  },

  /**
   * 处理插值表达式内容
   * @param {*} node 文本节点
   * @param {*} original 原始节点值内容
   */
  handleMustachText(node: Node, original: ({plainTexts: string[], mustaches: any[]})): void {
    const { plainTexts, mustaches } = original
    let text: string = ''
    plainTexts.forEach((txt, i) => {
      const mustach = isEmpty(mustaches[i]) ? '' : mustaches[i]
      text += txt + mustach
    })
    node.textContent = text
  },

  /**
   * 处理 model 绑定
   * @param node 节点
   * @param value 值
   */
  processModel(node: HTMLInputElement, value: string): void {
    node.value = isEmpty(value) ? '' : value
  },

  /**
   * x-model双向绑定，需要为元素注册 input 事件监听
   * @param node 节点
   * @param vm ViewModel
   * @param expression 表达式
   */
  handleModel(node: HTMLInputElement, vm: ViewModel, expression: string) {
    let val: any = this.getVmValue(vm, expression)
    node.addEventListener('input', e => {
      const value = (<HTMLInputElement>(e.target)).value
      if (val === value) return
      this.setVmValue(vm, expression, value)
      val = value
    }, false)
  },

  /**
   * 处理事件指令
   * @param node 待添加事件监听的元素节点
   * @param vm View-Model 对象
   * @param directive 指令名称
   * @param callbackExp 回调函数名
   */
  processEvent(node: Element, vm: ViewModel, directive: string, callbackExp: string) {
    const eventType = directive.slice(3)
    const callback = vm.$options.methods[callbackExp]
    if (eventType && callback) {
      node.addEventListener(eventType, callback.bind(vm), false)
    }
  },
}
