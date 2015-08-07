function hasValue(value) {
  return !!value
    || value === 0
    || value === false
}

/**
 * @description
 * getSubset returns an object with the same structure as the original object passed in, but contains
 * only the specified paths and only if those paths have "value" (truth-y values, 0 or false).
 *
 * @param {Object} obj The object from which to create a subset.
 * @param {String[]} paths An array of paths e.g. ['deeply.nested.key'], that should be included in the subset.
 *
 * @return {Object} An object that contains only the specified paths if they hold something of value.
 */
export function getSubset(obj, paths) {
  if (!paths) return obj

  let subset = {}

  paths.forEach((path) => {
    const keys = path.split('.')
    const length = keys.length
    const lastIndex = length - 1

    let index = 0
    let value = obj
    let nested = subset

    // Retrieve value specified by path
    while (value && index < length) {
      value = value[keys[index++]]
    }

    // Add to subset if the specified path is defined and hasValue
    if (index === length && hasValue(value)) {
      keys.forEach((key, i) => {
        if (i === lastIndex) {
          nested[key] = value
        } else if (!nested[key]) {
          nested[key] = {}
        }
        nested = nested[key]
      })
    }
  })

  return subset
}

export default function filter(paths) {
  if (typeof paths === 'string') paths = [paths]

  return (storage) => ({
    ...storage,
    put: (key, state, callback) => {
      storage.put(key, getSubset(state, paths), callback)
    }
  })
}
