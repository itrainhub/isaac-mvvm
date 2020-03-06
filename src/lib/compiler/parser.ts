import DirectiveHandler from "./directive-handler"

/**
 * 根据元素内容生成文档碎片
 * @param el 元素
 */
const genFragment = (el: Element): DocumentFragment => {
  const fragment = new DocumentFragment()
  let child
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
  $el: Element | null
  $vm: ViewModel

  constructor(el: Element | string, vm: ViewModel) {
    this.$el = isElement(el) ? <Element>el : document.querySelector(<string>el)
    this.$vm = vm
    if (this.$el) {
      // 利用文档碎片处理
      const fragment = genFragment(this.$el)
      this.parseElement(fragment)
      this.$el.appendChild(fragment)
    }
  }

  /**
   * 解析元素
   * @param el 节点，主要是元素节点
   */
  parseElement(el: Node) {
    // 遍历当前el元素节点各子节点
    Array.from(el.childNodes).forEach(node => {
      if (isElement(node)) { // 子节点为元素节点
        this.parseAttrs(<Element>node)
        if (node.childNodes.length) { // 还有孩子节点
          this.parseElement(node)
        }
      } else if (isText(node)) { // 子节点为文本节点
        const txt = node.textContent
        const reg = /\{\{((?:.|\n)+?)\}\}/
        if (txt && reg.test(txt)) { // 测试文本中是否有 {{ }} 插值表达式
          this.parseText(<Text>node, RegExp.$1.trim())
        }
      }
    })
  }

  /**
   * 解析节点属性
   * @param el 节点
   */
  parseAttrs(el: Element) {
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
      }
    })
  }

  /**
   * 解析文本节点
   */
  parseText(node: Text, expression: string) {
    DirectiveHandler.dispatch(node, this.$vm, 'text', expression)
  }
}