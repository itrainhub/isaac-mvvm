type Watcher = {
  vm: ViewModel,
  cb: Function,
  depIds: object,
  getter: Function | void,
  value: any,
  get: Function,
  addDep: Function,
  update: Function,
  parseGetter: Function,
}

type Dep = {
  id: number,
  subs: Array<Watcher>,
  addSub: Function,
  removeSub: Function,
  depend: Function,
  notify: Function
}

interface Options {
  el: Element | string,
  data?: object,
  methods?: object
}

type ViewModel = {
  $options: Options,
  $data: object
}
