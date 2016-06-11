import actionTypes from './actionTypes.js';

export default function persistStateMiddleware(storage, key = 'redux-localstorage') {
  return store => {
    function persistState() {
      storage.put(key, store.getState(), err => {
        if (err) console.error('Unable to persist state to storage:', err); // eslint-disable-line no-console
      });
    }

    return next => action => {
      const result = next(action);

      if (action.type !== actionTypes.INIT) {
        persistState();
      }

      return result;
    };
  };
}
