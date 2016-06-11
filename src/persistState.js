import persistStateMiddleware from './persistStateMiddleware.js';
import bufferActions from './bufferActions.js';
import actionTypes from './actionTypes.js';
import adapter from './adapters/localStorage';

const defaultKey = 'redux-localstorage';
const getDefaultStorage = () => { adapter(window.localStorage); };

/**
 * @description
 * persistState is a Store Enhancer that persists store changes.
 *
 * @param {Object} [storage = adapter(localStorage)] Object used to interface with any type of storage back-end.
 * @param {String} [key = "redux-localstorage"] String used as storage key.
 * @param {Function} [callback] Called when persistState has finished initializing.
 *
 * @returns {Function} An enhanced create store function.
 */
export default function persistState(storage = getDefaultStorage(), key = defaultKey, callback) {
  let finalStorage = storage;
  let finalKey = key;
  let finalCallback = callback;

  // Juggle arguments if needed
  if (typeof key === 'function') {
    finalCallback = key;
    finalKey = defaultKey;
  }

  if (typeof storage === 'string') {
    finalKey = storage;
    finalStorage = getDefaultStorage();
  } else if (typeof storage === 'function') {
    finalCallback = storage;
    finalStorage = getDefaultStorage();
  }

  return createStore => (...args) => {
    // Apply middleware
    const store = createStore(...args);
    const dispatch = bufferActions()(persistStateMiddleware(store, finalStorage, finalKey)(store.dispatch));

    // Retrieve and dispatch persisted store state
    finalStorage.get(finalKey, (err, persistedState) => {
      if (err) console.error('Failed to retrieve persisted state from storage:', err); // eslint-disable-line no-console
      dispatch({
        type: actionTypes.INIT,
        payload: persistedState,
      });
      if (finalCallback) finalCallback();
    });

    return {
      ...store,
      dispatch,
    };
  };
}
