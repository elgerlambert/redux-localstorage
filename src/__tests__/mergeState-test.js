import {assert} from 'chai'
import mergeState from '../mergeState'

describe('mergeState', () => {
  it('returns "undefined" if neither initial- or persistedState is defined', () => {
    assert.equal(mergeState(undefined, null), undefined)
  })

  it('should return initialState if no persistedState is provided', () => {
    let initialState = {a: 1, b: 2}
    assert.deepEqual(mergeState(initialState, null), initialState)
  })

  it('persistedState should override same key values of initialState', () => {
    let initialState = {a: 1, b: 2}
    let persistedState = {b: 3}
    assert.equal(mergeState(initialState, persistedState).a, initialState.a)
    assert.equal(mergeState(initialState, persistedState).b, persistedState.b)
  })
})
