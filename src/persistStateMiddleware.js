import actionTypes from './actionTypes.js'

export default function persistStateMiddleware(store, storage, key) {
  key = key || 'redux-localstorage'

  function persistState() {
    storage.put(key, store.getState(), function (err) {
      if (err) console.error('Unable to persist state to localStorage:', err)
    })
  }

  return next => action => {
    next(action)

    if (action.type !== actionTypes.INIT)
      persistState()

    return action
  }
}
