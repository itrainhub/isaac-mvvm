interface Options {
  el: Element | string,
  data: object,
  methods: object
}

interface ViewModel {
  $options: Options,
  $el: Element | null,
  $data: object
}

interface Watcher {
  vm: ViewModel,
  callback: Function,
  depIds: object,
  getter: Function,
  value: any,
  get: Function,
  addDep: Function,
  update: Function
}

interface Dep {
  id: number,
  subs: Array<Watcher>,
  addSub: Function,
  removeSub: Function,
  depend: Function,
  notify: Function
}

interface Parser {
  $vm: ViewModel,
  parseElement: (el: Node) => void,
  parseAttrs: (el: Element) => void,
  parseText: (node: Text) => void
}
