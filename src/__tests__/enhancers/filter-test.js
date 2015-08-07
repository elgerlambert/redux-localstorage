import {assert} from 'chai'
import {getSubset} from '../../enhancers/filter.js'

describe('filter', () => {
  const obj = {
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

  it('should return the original object if no paths are defined', () => {
    const subset = getSubset(obj)
    assert.deepEqual(subset, obj)
  })

  it('should return only the keys defined by paths', () => {
    const paths = ['a', 'b']
    const subset = getSubset(obj, paths)
    assert.deepEqual(subset, {a: 1, b: 2})
  })

  it('should ignore paths with no value', () => {
    const paths = ['a', 'undefinedKey']
    const subset = getSubset(obj, paths)
    assert.deepEqual(subset, {a: 1})
  })

  it('should not ignore values false or 0', () => {
    const paths = ['c', 'd']
    const subset = getSubset(obj, paths)
    assert.deepEqual(subset, {c: 0, d: false})
  })

  describe('works with nested objects', () => {
    it('should return only the nested keys defined by paths', () => {
      const paths = ['nested.deeply.y']
      const subset = getSubset(obj, paths)
      assert.deepEqual(subset, {nested: {deeply: {y: 4}}})
    })

    it('should ignore deeply nested paths with no value', () => {
      const paths = ['nested.x', 'nested.deeply.undefinedKey']
      const subset = getSubset(obj, paths)
      assert.deepEqual(subset, {nested: {x: 3}})
    })

    it('should merge paths that share a parent', () => {
      const paths = ['nested.x', 'nested.deeply.y', 'b']
      const subset = getSubset(obj, paths)
      assert.deepEqual(subset, {nested: {x: 3, deeply: {y: 4}}, b: 2})
    })
  })
})
