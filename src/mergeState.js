/**
 * @description
 * mergeState is used during initialisation and simply extends/assigns the
 * initialState with the persistedState. If this doesn't work for you (because
 * you're using immutable collections for example), you can define your own
 * top-level reducer that handles action.type 'redux-localstorage/INIT' and
 * implement your own merge strategy.
 */
export default function mergeState(initialState, persistedState) {
  return persistedState
    ? {...initialState, ...persistedState}
    : initialState
}
