import { remove } from '../util'

// 全局编号
let uid: number = 0

/**
 * 数据更新的发布者
 * get 数据的时候，收集订阅者（订阅该数据的 Watcher）
 * set 数据的时候，通知订阅者
 */
export default class Dep {
  static target: Watcher | null
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  /**
   * 添加订阅者
   * @param sub 订阅者对象
   */
  addSub = (sub: Watcher): void => {
    this.subs.push(sub)
  }

  /**
   * 删除订阅者
   * @param sub 订阅者对象
   */
  removeSub = (sub: Watcher): void => {
    remove(this.subs, sub)
  }

  /**
   * 收集订阅者
   */
  depend = (): void => {
    Dep.target && Dep.target.addDep(this)
  }

  /**
   * 通知订阅者
   */
  notify = (): void => {
    this.subs.forEach(sub => sub.update())
  }
}
