import ViewModel from "../lib"

const vm = new ViewModel({
  el: '#root',
  data: {
    msg: 'hello',
    success: 'congratulations!!!',
    stu: {
      name: {
        first: '二',
        middle: '小',
        last: '王'
      },
      age: 18
    }
  },
  methods: {
    handle() {
      this['msg'] = 'changed'
    }
  }
})

console.log(vm)
