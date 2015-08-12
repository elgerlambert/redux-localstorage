import {compose} from 'redux'
import adapter from './adapters/localStorage'
import mergeState from './mergeState.js'
import bufferActions from './bufferActions.js'

const ActionTypes = {
  INIT: 'redux-localstorage/INIT'
}

function liftReducer(reducer) {
  return function liftedReducer(state, action) {
    return action.type === ActionTypes.INIT
      ? mergeState(state, action.payload)
      : reducer(state, action)
  }
}

function persistStateMiddleware(store, storage, key) {
  return (next) => (action) => {
    next(action)

    if (action.type === ActionTypes.INIT) return

    storage.put(key, store.getState(), function (err) {
      if (err) console.error('Unable to persist state to localStorage:', err)
    })
  }
}

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
    // Check if ActionTypes.INIT is already handled, "lift" reducer if not
    if (typeof reducer(undefined, { type: ActionTypes.INIT }) !== 'undefined')
      reducer = liftReducer(reducer)

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
        type: ActionTypes.INIT,
        meta: { BUFFER_BUSTER: true },
        payload: persistedState
      })
    })

    return {
      ...store,
      dispatch
    }
  }
}
