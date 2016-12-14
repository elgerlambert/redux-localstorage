let _isArray = Array.isArray || (Array.isArray = function(a){ return '' + a !== a && {}.toString.call(a) === '[object Array]'})

/**
 * @description
 * typeof method that
 * 1. groups all false-y & empty values as void
 * 2. distinguishes between object and array
 *
 * @param {*} thing The thing to inspect
 *
 * @return {String} Actionable type classification
 */
export default function typeOf(thing) {
  if (!thing || thing === null || thing === undefined) return 'void'

  if (_isArray(thing)) {
    if (!thing.length) return 'void'
    return 'array'
  }

  return typeof thing
}
