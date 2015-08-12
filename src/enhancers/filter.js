/**
 * @description
 * getSubset returns an object with the same structure as the original object passed in,
 * but contains only the specified keys and only if that key has a truth-y value.
 *
 * @param {Object} obj The object from which to create a subset.
 * @param {String[]} paths An array of (top-level) keys that should be included in the subset.
 *
 * @return {Object} An object that contains the specified keys with truth-y values
 */
export function getSubset(obj, paths) {
  if (!paths) return obj

  let subset = {}

  paths.forEach((key) => {
    let slice = obj[key]
    if (slice) subset[key] = slice
  })

  return subset
}

export default function filter(paths) {
  if (typeof paths === 'string') paths = [paths]

  return (storage) => {
    function put(key, state, callback) {
      storage.put(key, getSubset(state, paths), callback)
    }

    return {
      ...storage,
      put
    }
  }
}
