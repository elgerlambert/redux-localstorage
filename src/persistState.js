import {compose} from 'redux'
import persistStateMiddleware from './persistStateMiddleware.js'
import mergePersistedState from './mergePersistedState.js'
import bufferActions from './bufferActions.js'
import actionTypes from './actionTypes.js'
import adapter from './adapters/localStorage'

/**
 * @description
 * persistState is a Store Enhancer that persists store changes.
 *
 * @param {Object} [storage = adapter(localStorage)] Object used to interface with any type of storage back-end.
 * @param {String} [key = "redux-localstorage"] String used as storage key.
 *
 * @return {Function} An enhanced store.
 */
export default function persistState(storage, key) {
  key = key || 'redux-localstorage'

  if (typeof storage === 'undefined') {
    storage = adapter(localStorage)
  } else if (typeof storage === 'string') {
    key = storage
    storage = adapter(localStorage)
  }

  return next => (reducer, initialState) => {
    // Check if actionTypes.INIT is already handled, "lift" reducer if not
    if (typeof reducer(undefined, { type: actionTypes.INIT }) !== 'undefined')
      reducer = mergePersistedState()(reducer)

    // Apply middleware
    const store = next(reducer, initialState)
    const dispatch = compose(
      bufferActions(),
      persistStateMiddleware(store, storage, key),
      store.dispatch
    )

    // Retrieve and dispatch persisted store state
    storage.get(key, function (err, persistedState) {
      if (err) console.error('Failed to retrieve initialize state from localStorage:', err)
      dispatch({
        type: actionTypes.INIT,
        payload: persistedState
      })
    })

    return {
      ...store,
      dispatch
    }
  }
}
