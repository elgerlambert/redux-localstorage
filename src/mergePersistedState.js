import actionTypes from './actionTypes.js';

function isObject(obj) {
  return Object.prototype.toString.call( obj ) === '[object Object]';
}

function mergeDeepWithoutMutating(target, source) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  for (const key in source) {
    if (hasOwnProperty.call(source, key)) {
      const value = target[key];
      if (isObject(value)) {
        target[key] = {...value};
        mergeDeepWithoutMutating(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}

function mergeState(initialState, persistedState) {
  const finalInitialState = {...initialState};
  mergeDeepWithoutMutating(finalInitialState, persistedState);
  return finalInitialState;
}

/**
 * @description
 * mergePersistedState is a higher order reducer used to initialise
 * redux-localstorage to rehydrate the store by merging the application's initial
 * state with any persisted state.
 *
 * @param {Function} [merge = mergeState] Function that merges the initial state and
 * persisted state and returns the result.
 *
 * @returns {Object} The new store state after passing through all reducers.
 */
export default function mergePersistedState(merge = mergeState) {
  return next => (state, action) => {
    const finalState = action.type === actionTypes.INIT && action.payload
      ? merge(state, action.payload)
      : state;

    return next(finalState, action);
  };
}
