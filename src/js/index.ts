import { observe } from '../lib'

const data = {
  msg: 'hello',
  name: {
    first: '二',
    middle: '小',
    last: '王'
  }
}

observe(data)

console.log(data)