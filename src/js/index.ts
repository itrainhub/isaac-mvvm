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
    },
    hobbies: ['吃饭', '睡觉', '打豆豆']
  },
  methods: {
    handle() {
      this['msg'] = 'changed'
    },
    handleAddData() {
      this['hobbies'].unshift(Math.random())
    }
  }
})

console.log(vm)
