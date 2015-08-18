import mockery from 'mockery'
import {assert} from 'chai'
import mergeState from '../mergeState.js'

describe('mergePersistedState', () => {
  let reducer, action
  let initialState = {
    a: 1,
    b: 2,
    nested: {
      x: 3,
      deeply: {
        y: 4,
        z: 5
      }
    },
    c: 0,
    d: false
  }

  before(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })

    mockery.registerMock('redux', {})

    let {mergePersistedState} = require('../persistState.js')

    reducer = mergePersistedState(mergeState)()
  })

  after(function () {
    mockery.disable()
  })

  beforeEach(function () {
    action = { type: '@@redux-localstorage/INIT' }
  })

  it('returns "undefined" if neither initial- or persistedState is defined', () => {
    assert.equal(reducer(undefined, action), undefined)
  })

  it('should return initialState if no persistedState is provided', () => {
    assert.deepEqual(reducer(initialState, action), initialState)
  })

  it('persistedState should override same key values of initialState', () => {
    action.payload = {b: 3}

    assert.equal(reducer(initialState, action).a, initialState.a)
    assert.equal(reducer(initialState, action).b, action.payload.b)
  })

  it('should merge deep without mutating', () => {
    action.payload = {nested: {deeply: {y: 14}}}

    const newState = reducer(initialState, action)

    assert.deepEqual(newState.nested, {x: 3, deeply: {y: 14, z: 5}})
    assert.equal(initialState.nested === newState.nested, false)
    assert.equal(initialState.nested.deeply === newState.nested.deeply, false)
  })
})
