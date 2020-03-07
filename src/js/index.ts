import ViewModel from "../lib/view-model";

// import { observe } from '../lib'

// const data = {
//   msg: 'hello',
//   name: {
//     first: '二',
//     middle: '小',
//     last: '王'
//   }
// }

// observe(data)

// console.log(data)

const vm = new ViewModel({
  el: '#app',
  data: {
    msg: 'hello world'
  },
  methods: {
    handleClick() {
      (<any>this).msg = 'changed again'
    }
  }
})

console.log(vm)
