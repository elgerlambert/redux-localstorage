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
 *
 * @return {Function} An enhanced store
 */
export default function persistState(paths, config) {
  const defaults = {
    key: 'redux',
    slicer: createSlicer
  }

  const cfg = {...defaults, ...config}

  return next => (reducer, initialState) => {
    let persistedState

    try {
      persistedState = JSON.parse(localStorage.getItem(cfg.key))
    } catch (e) {
      console.warn('Failed to retrieve initialize state from localStorage:', e)
    }

    const store = next(reducer, {...initialState, ...persistedState})
    const slicer = cfg.slicer(paths)

    store.subscribe(function () {
      const state = store.getState()
      const subset = slicer(state)

      try {
        localStorage.setItem(cfg.key, JSON.stringify(subset))
      } catch (e) {
        console.warn('Unable to persist state to localStorage:', e)
      }
    })

    return store
  }
}
