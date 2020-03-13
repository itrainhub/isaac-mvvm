import { observe } from "./core/observer"
import { default as Parser } from "./compiler/parser"

/**
 * 将 data 中的数据挂载在obj对象实例下
 */
const _injectData = (obj: ViewModel, key: string): void => {
  Object.defineProperty(obj, key, {
    configurable: false,
    enumerable: true,
    get() {
      return obj.$data[key]
    },
    set(value) {
      obj.$data[key] = value
    }
  })
}

/**
 * 将 methods 中的方法挂载在obj对象实例下
 */
const _injectMethod = (obj: ViewModel, method: string) => {
  Object.defineProperty(obj, method, {
    value: (...args: any[]) => {
      // 引用到 methods 中的方法
      const fn = obj.$options.methods[method]
      if (typeof fn === 'function') {
        // 调用 fn 方法，修改方法体中 this 指向
        return fn.apply(obj, args)
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  })
}

// 默认 options
const defaultOptions: Options = {
  el: '',
  data: {},
  methods: {}
}

/**
 * ViewModel
 */
export default class ViewModel {
  $options: Options
  $data: object
  $el: Element | null
  constructor(options: Options) {
    options = Object.assign({}, defaultOptions, options)
    const { el, data } = options
    this.$options = options
    this.$el = typeof el === 'string' ? document.querySelector(el) : el
    this.$data = data
    // 将 data 中的数据挂载到当前 vm 对象下
    Object.keys(data).forEach(key => {
      _injectData(this, key)
    })
    // 将 methods 中的方法挂载到当前 vm 对象下
    Object.keys(options.methods).forEach(method => {
      _injectMethod(this, method)
    })
    // 劫持数据
    observe(this.$data)
    // 如果没有根元素，则不解析节点
    if (this.$el) { 
      this.init()
    }
  }

  /**
   * 初始化
   */
  init(): void {
    // 解析
    new Parser(this)
  }

  /**
   * 手动挂载元素节点
   * @param el 根元素
   */
  $mount(el: Element | string): void {
    this.$el = typeof el === 'string' ? document.querySelector(el) : el
    if (this.$el) {
      this.init()
    }
  }
}
