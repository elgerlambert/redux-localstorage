import createSlicer from './createSlicer.js'
import mergeState from './util/mergeState.js'

/**
 * @description
 * persistState is a Store Enhancer that syncs (a subset of) store state to localStorage.
 *
 * @param {String|String[]} [paths] Specify keys to sync with localStorage, if left undefined the whole store is persisted
 * @param {Object} [config] Optional config object
 * @param {String} [config.key="redux"] String used as localStorage key
 * @param {Function} [config.slicer] (paths) => (state) => subset. A function that returns a subset
 * of store state that should be persisted to localStorage
 * @param {Function} [config.serialize=JSON.stringify] (subset) => serializedData. Called just before persisting to
 * localStorage. Should transform the subset into a format that can be stored.
 * @param {Function} [config.deserialize=JSON.parse] (persistedData) => subset. Called directly after retrieving
 * persistedState from localStorage. Should transform the data into the format expected by your application
 *
 * @return {Function} An enhanced store
 */
export default function persistState(paths, config) {
  const cfg = {
    key: 'redux',
    merge: mergeState,
    slicer: createSlicer,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    storageProvider: {},
    ...config
  }

  const {
    key,
    merge,
    slicer,
    storageProvider,
    serialize,
    deserialize
  } = cfg

  return next => (reducer, initialState, enhancer) => {
    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState
      initialState = undefined
    }

    let persistedState
    let finalInitialState
    const store = next(reducer, finalInitialState, enhancer)
return store;

    storageProvider.getItem(key).then( persisted => {

        persistedState = deserialize(persisted);
        console.log('persistedState😚');
        console.log(persistedState);
        finalInitialState = merge(initialState, persistedState)

        const store = next(reducer, finalInitialState, enhancer)
        console.log('finalInitialState');
        console.log(finalInitialState);
        const slicerFn = slicer(paths)

        store.subscribe(function () {
          const state = store.getState();
          const subset = slicerFn(state);
            try {
              storageProvider.setItem(key, serialize(subset))
              console.log("redux-localstorage 😚");
              console.log(state);
            } catch (e) {
              console.warn('Unable to persist state to localStorage:', e)
            }
        })
        console.log("store");
        console.log(store);
        return store
    });
  }
}
