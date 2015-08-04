import {assert} from 'chai'
import getSubset from '../getSubset'

describe('getSubset', () => {
  it('should return an empty object if no paths defined', () => {
    const obj = {a: 2, b: 3}
    const paths = []
    const subset = getSubset(obj, paths)
    assert.deepEqual(subset, {})
  })

  it('should return only the keys defined by the paths', () => {
    const obj = {a: 2, b: 3, c: 5}
    const paths = ['b', 'c']
    const subset = getSubset(obj, paths)
    assert.deepEqual(subset, {b: 3, c: 5})
  })

  it('works with nested objects', () => {
    const obj = {
      a: 10,
      nested: {
        x: 4,
        y: 3
      },
      b: 3,
      c: 5
    }
    const paths = ['nested', 'c']
    const subset = getSubset(obj, paths)
    assert.deepEqual(subset, {nested: {x: 4, y: 3}, c: 5})
  })
})
