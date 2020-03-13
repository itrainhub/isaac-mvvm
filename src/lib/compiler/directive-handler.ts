import { capitalize, isEmpty, parseExpression, createFunction, setValue } from "../util"
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
    // 获取表达式的值，如果是复杂表达式，创建能够获取复杂表达式值的函数
    const { value, expOrFn } = this.genValueAndExpOrFn(vm, expression)
    // 调用处理函数
    fn && fn(node, value)
    // 创建 Watcher 订阅者对象，绑定数据更新后更新视图函数
    new Watcher(vm, expOrFn, (value: any, oldValue: any) => {
      fn && fn(node, value, oldValue)
    })
    // 文本框双向绑定处理
    if (directive === 'model') {
      this.handleModel(<HTMLInputElement>node, vm, expression)
    }
  },

  /**
   * 根据表达式获取对应数据值，如果表达式不是简单的.分隔开的字符串，
   * 则将表达式字符串转换为获取表达式运算结果的函数
   * @param vm ViewModel对象实例
   * @param expression 表达式字符串内容
   */
  genValueAndExpOrFn(vm: ViewModel, expression: string): {value: any, expOrFn: string | Function} {
    const getter = parseExpression(expression)
    let value: any
    let expOrFn: string | Function
    if (typeof getter === 'function') { // 简单表达式
      expOrFn = expression
      value = getter.call(vm, vm)
    } else { // 复杂表达式
      expOrFn = createFunction(vm, expression)
      value = expOrFn.call(vm, vm)
    }
    return {
      value,
      expOrFn
    }
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
    const { value, expOrFn } = this.genValueAndExpOrFn(vm, expression)
    // 将插值表达式的值，保存在数组中，便于组装数据
    const { mustaches } = original
    mustaches[index] = isEmpty(value) ? '' : value
    // 组装文本，设置节点值
    this.handleMustachText(node, original)
    // 创建 Watcher 订阅者对象，绑定数据更新后更新视图函数
    new Watcher(vm, expOrFn, (value: any, oldValue: any) => {
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
    let { value } = this.genValueAndExpOrFn(vm, expression)
    node.addEventListener('input', e => {
      const val = (<HTMLInputElement>(e.target)).value
      if (val === value) return
      setValue(vm, expression, val)
      value = val
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
    const callback = this.genValueAndExpOrFn(vm, callbackExp).value
    if (eventType && callback) {
      node.addEventListener(eventType, callback.bind(vm), false)
    }
  },
}
