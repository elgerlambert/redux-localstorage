import actionTypes from './actionTypes.js';

/**
 * @description
 * mergePersistedState is a higher order reducer used to initialise
 * redux-localstorage to rehydrate the store by merging the application's initial
 * state with any persisted state.
 *
 * @param {Function} [merge = (i, p) => ({...i, ...p})] Function that merges the
 * initial state and persisted state and returns the result.
 *
 * @returns {Object} The new store state after passing through all reducers.
 */
export default function mergePersistedState(merge = (i, p) => ({...i, ...p})) {
  return next => (state, action) => {
    const finalState = action.type === actionTypes.INIT && action.payload
      ? merge(state, action.payload)
      : state;

    return next(finalState, action);
  };
}
