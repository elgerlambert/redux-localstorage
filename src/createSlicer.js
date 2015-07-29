import getSubset from './getSubset.js'
import typeOf from './util/typeOf.js'

/**
 * @description
 * createSlicer inspects the typeof paths and returns an appropriate slicer function.
 *
 * @param {String|String[]} [paths] The paths argument supplied to persistState.
 *
 * @return {Function} A slicer function, which returns the subset to store when called with Redux's store state.
 */
export default function createSlicer(paths) {
  switch (typeOf(paths)) {
    case 'void':
      return (state) => state
    case 'string':
      return (state) => getSubset(state, [paths])
    case 'array':
      return (state) => getSubset(state, paths)
    default:
      return console.error('Invalid paths argument, should be of type String, Array or Void')
  }
}
