import DirectiveHandler from "./directive-handler"

/**
 * 根据元素内容生成文档碎片
 * @param el 元素
 */
const genFragment = (el: Element): DocumentFragment => {
  const fragment = new DocumentFragment()
  let child: Node | null = null
  while(child = el.firstChild) {
    fragment.appendChild(child)
  }
  return fragment
}

/**
 * 判断是否为 DOM 元素节点
 */
const isElement = (el: any): boolean => {
  return (el && el.nodeType) ? el.nodeType === 1 : false
}

/**
 * 判断是否为 DOM 文本节点
 */
const isText = (el: any): boolean => {
  return (el && el.nodeType) ? el.nodeType === 3 : false
}

/**
 * 判断是否为指令
 */
const isDirective = (param: string): boolean => {
  return param.startsWith('x-')
}

/**
 * 简单的指令及'{{ }}'插值表达式解析
 */
export default class Parser {
  $vm: ViewModel

  constructor(vm: ViewModel) {
    this.$vm = vm
    if (vm.$el) {
      // 利用文档碎片处理
      const fragment = genFragment(vm.$el)
      this.parseElement(fragment)
      vm.$el.appendChild(fragment)
    }
  }

  /**
   * 解析元素
   * @param el 节点，主要是元素节点
   */
  parseElement(el: Node) {
    // 解析 el 节点的属性
    this.parseAttrs(<Element>el)
    // 解析 el 节点的所有孩子节点
    Array.from(el.childNodes).forEach(node => {
      // 判断是元素节点还是文本节点
      if (isElement(node)) { // 元素节点，继续递归解析
        this.parseElement(node)
      } else if (isText(node)) { // 文本节点
        this.parseText(<Text>node)
      }
    })
  }

  /**
   * 解析节点属性
   * @param el 节点
   */
  parseAttrs(el: Element) {
    if (!el.attributes) return
    // 遍历节点的所有属性
    Array.from(el.attributes).forEach(attr => {
      // 属性名
      const name = attr.name
      if (isDirective(name)) { // 当前遍历到的属性是指令
        // 指令名
        const directive = name.slice(2)
        // 指令表达式
        const expression = attr.value
        if (directive.startsWith('on')) { // 事件指令
          DirectiveHandler.processEvent(el, this.$vm, directive, expression)
        } else { // 普通指令
          DirectiveHandler.dispatch(el, this.$vm, directive, expression)
        }
        // 删除指令属性
        el.removeAttribute(name)
      }
    })
  }

  /**
   * 解析文本节点
   */
  parseText(node: Text) {
    // 获取文本值
    const text = node.textContent || ''
    // 插值表达式的正则
    const reg = /\{\{((?:.|\n)*?)\}\}/g

    // 将文本按插值语法分割
    const plainTexts = text.split(/\{\{(?:.|\n)*?\}\}/)
    const mustaches = []
    const original = {plainTexts, mustaches}
    let index: number = 0
    let match: Array<string> | null
    // 循环处理每个插值表达式
    while (match = reg.exec(text)) {
      DirectiveHandler.processMustache(node, original, this.$vm, match[1].trim(), index++)
    }
  }
}