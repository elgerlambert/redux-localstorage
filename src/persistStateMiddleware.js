import actionTypes from './actionTypes.js';

export default function persistStateMiddleware(store, storage, key = 'redux-localstorage') {
  function persistState() {
    storage.put(key, store.getState(), err => {
      if (err) console.error('Unable to persist state to storage:', err); // eslint-disable-line no-console
    });
  }

  return next => action => {
    next(action);

    if (action.type !== actionTypes.INIT) {
      persistState();
    }

    return action;
  };
}
