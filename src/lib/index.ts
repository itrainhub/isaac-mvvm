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

// 默认 options
const defaultOptions: Options = {
  el: '',
  data: {},
  methods: {}
}

export default class ViewModel {
  $options: Options
  $data: object
  constructor(options: Options = defaultOptions) {
    this.$options = options
    const data = this.$data = options.data || {}
    // 将 data 中的数据挂载到当前 vm 对象下
    Object.keys(data).forEach(key => {
      _injectData(this, key)
    })
    // 劫持数据
    observe(data)
    // 解析
    new Parser(options.el || document.body, this)
  }
}
