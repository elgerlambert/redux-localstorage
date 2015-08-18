function isObject(obj) {
  return Object.prototype.toString.call( obj ) === '[object Object]'
}

function mergeDeepWithoutMutating(target, source) {
  for (let key in source) {
    const value = target[key]
    if (isObject(value)) {
      target[key] = {...value}
      mergeDeepWithoutMutating(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
}

export default function mergeState(initialState, persistedState) {
  let finalInitialState = {...initialState}
  mergeDeepWithoutMutating(finalInitialState, persistedState)
  return finalInitialState
}
