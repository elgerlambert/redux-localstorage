import persistStateMiddleware from './persistStateMiddleware.js';
import mergePersistedState from './mergePersistedState.js';
import bufferActions from './bufferActions.js';
import actionTypes from './actionTypes.js';
import adapter from './adapters/localStorage';

/**
 * @description
 * persistState is a Store Enhancer that persists store changes.
 *
 * @param {Object} [storage = adapter(localStorage)] Object used to interface with any type of storage back-end.
 * @param {String} [key = "redux-localstorage"] String used as storage key.
 *
 * @returns {Function} An enhanced create store function.
 */
export default function persistState(storage = adapter(localStorage), key = 'redux-localstorage') {
  // Juggle arguments if needed
  const keyAsOnlyArgument = typeof storage === 'string';
  const finalKey = keyAsOnlyArgument
    ? storage
    : key;
  const finalStorage = keyAsOnlyArgument
    ? adapter(localStorage)
    : storage;

  return next => (reducer, initialState) => {
    // Check if actionTypes.INIT is already handled, "lift" reducer if not
    const finalReducer = typeof reducer(undefined, { type: actionTypes.INIT }) !== 'undefined'
      ? mergePersistedState()(reducer)
      : reducer;

    // Apply middleware
    const store = next(finalReducer, initialState);
    const dispatch = bufferActions()(persistStateMiddleware(store, finalStorage, finalKey)(store.dispatch));

    // Retrieve and dispatch persisted store state
    finalStorage.get(finalKey, (err, persistedState) => {
      if (err) console.error('Failed to retrieve persisted state from storage:', err); // eslint-disable-line no-console
      dispatch({
        type: actionTypes.INIT,
        payload: persistedState,
      });
    });

    return {
      ...store,
      dispatch,
    };
  };
}
