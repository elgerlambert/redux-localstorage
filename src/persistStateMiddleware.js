import actionTypes from './actionTypes.js'

export default function persistStateMiddleware(store, storage, key) {
  return next => action => {
    next(action)

    if (action.type === actionTypes.INIT) return

    storage.put(key, store.getState(), function (err) {
      if (err) console.error('Unable to persist state to localStorage:', err)
    })
  }
}
