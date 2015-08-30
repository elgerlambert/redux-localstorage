import actionTypes from './actionTypes.js'

function isObject(obj) {
  return Object.prototype.toString.call( obj ) === '[object Object]'
}

function mergeDeepWithoutMutating(target, source) {
  for (let key in source) {
    const value = target[key]
    if (isObject(value)) {
      target[key] = {...value}
      mergeDeepWithoutMutating(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
}

function mergeState(initialState, persistedState) {
  let finalInitialState = {...initialState}
  mergeDeepWithoutMutating(finalInitialState, persistedState)
  return finalInitialState
}

/**
 * @description
 * mergePersistedState is a higher order reducer used to initialise
 * redux-localstorage to rehydrate the store by merging the application's initial
 * state with any persisted state.
 *
 * @param {Function} merge function that merges the initial state and
 * persisted state and returns the result.
 */
export default function mergePersistedState(merge = mergeState) {
  return next => (state, action) => {
    if (action.type === actionTypes.INIT && action.payload)
      state = merge(state, action.payload)

    return next(state, action)
  }
}
