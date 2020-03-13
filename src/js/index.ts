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
      age: 18,
      hobbies: ['吃饭', '睡觉', '打豆豆']
    },
    cart: [
      {
        id: 1,
        title: 'prod-1',
        price: {
          original: 99,
          cost: 9.9
        },
        discount: 0.8,
        amount: 1
      },
      {
        id: 2,
        title: 'prod-2',
        price: {
          original: 9.9,
          cost: 6.5
        },
        discount: 1,
        amount: 10
      }
    ]
  },
  methods: {
    handleChangeMsg() {
      this['msg'] = 'changed'
    },
    handleAddData() {
      this['stu']['hobbies'].unshift(Math.random())
    },
    calcPayment() {
      return this['cart'].reduce((sum: number, prod: any) => (sum += prod.price.original * prod.discount * prod.amount), 0)
    },
    handleModify(index: number) {
      this['cart'][index].price.original = 9.9
    }
  }
})

console.log(vm)
