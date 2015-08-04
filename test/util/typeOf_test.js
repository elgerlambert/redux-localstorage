import {assert} from 'chai'
import typeOf from '../../src/util/typeOf'

describe('typeOf', () => {
  it('returns "void" if false-y', () => {
    assert.equal(typeOf(false), 'void')
    assert.equal(typeOf(undefined), 'void')
    assert.equal(typeOf(null), 'void')
  })

  it('returns "void" if it is an empty array', () => {
    var emptyArray = []
    assert.equal(typeOf(emptyArray), 'void')
  })

  it('returns "array" if an array with elements', () => {
    var oneElementArray = [1]
    var manyElementArray = [2, 3, 4]
    assert.equal(typeOf(oneElementArray), 'array')
    assert.equal(typeOf(manyElementArray), 'array')
  })

  it('returns the typeof defined by js if not an array or false-y', () => {
    assert.equal(typeOf({}), 'object')
    assert.equal(typeOf('hello world'), 'string')
    assert.equal(typeOf(2), 'number')
  })
})
