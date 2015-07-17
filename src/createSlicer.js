import getSubset from './getSubset.js'

/**
 * @description
 * createSlicer inspects the typeof paths and returns an appropriate slicer function.
 *
 * @param {String|String[]} [paths] The paths argument supplied to persistState.
 *
 * @return {Function} A slicer function, which returns the subset to store when called with Redux's store state.
 */
export default function createSlicer(paths) {
  switch (typeof paths) {
    case 'undefined':
      return (state) => state
    case 'string':
      return (state) => getSubset(state, [paths])
    default:
      return (state) => getSubset(state, paths)
  }
}
