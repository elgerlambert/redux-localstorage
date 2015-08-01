import createSlicer from './createSlicer.js'

/**
 * @description
 * persistState is a Store Enhancer that syncs (a subset of) store state to localStorage.
 *
 * @param {String|String[]} [paths] Specify keys to sync with localStorage, if left undefined the whole store is persisted
 * @param {Object} [config] Optional config object
 * @param {String} [config.key="redux"] String used as localStorage key
 * @param {Function} [config.slicer] (paths) => (state) => subset. A function that returns a subset
 * of store state that should be persisted to localStorage
 * @param {Function} [config.dehydrate] (data) => dehydratedData. A function that allows modification of data
 * before persisting to localStorage
 * @param {Function} [config.hydrate] (data) => hydratedData. A function that allows modification of data
 * after reading from localStorage and before setting to a store's state
 *
 * @return {Function} An enhanced store
 */
export default function persistState(paths, config) {
  const defaults = {
    key: 'redux',
    slicer: createSlicer,
    hydrate: data => data,
    dehydrate: data => data
  }

  const cfg = {...defaults, ...config}

  return next => (reducer, initialState) => {
    let persistedState
    let finalInitialState

    try {
      persistedState = cfg.hydrate(JSON.parse(localStorage.getItem(cfg.key)))
      finalInitialState = persistedState ? {...initialState, ...persistedState} : initialState
    } catch (e) {
      console.warn('Failed to retrieve initialize state from localStorage:', e)
    }

    const store = next(reducer, finalInitialState)
    const slicer = cfg.slicer(paths)

    store.subscribe(function () {
      const state = store.getState()
      const subset = slicer(state)

      try {
        localStorage.setItem(cfg.key, cfg.dehydrate(JSON.stringify(subset)))
      } catch (e) {
        console.warn('Unable to persist state to localStorage:', e)
      }
    })

    return store
  }
}
