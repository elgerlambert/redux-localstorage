import {assert} from 'chai'
import createSlicer from '../createSlicer'

const state = {
  todos: [
    {item: 1},
    {item: 2}
  ],
  list: {
    sublist: 'hi'
  },
  value: 3
}
describe('createSlicer', () => {
  it('returns unmodified state if no paths defined', () => {
    const mySlicer = createSlicer()
    const newState = mySlicer(state)
    assert.deepEqual(newState, state)
  })

  it('returns specified key from state if string supplied', () => {
    const mySlicer = createSlicer('list')
    const newState = mySlicer(state)
    assert.deepEqual(newState, {
      list: {
        sublist: 'hi'
      }
    })
  })

  it('returns specified keys from state if array supplied', () => {
    const mySlicer = createSlicer(['value', 'list'])
    const newState = mySlicer(state)
    assert.deepEqual(newState, {
      list: {
        sublist: 'hi'
      },
      value: 3
    })
  })
})
