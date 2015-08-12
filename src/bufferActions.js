/**
 * Middleware for intercepting and queue'ing actions until an action.meta.BUFFER_BUSTER action
 * has been dispatched. This action will be dispatched first, followed by the queued actions in
 * the order they were originally dispatched.
 */
export default function bufferActions() {
  let buffer = true
  let queue = []

  return next => action => {
    if (!buffer) return next(action)

    if (action.meta && action.meta.BUFFER_BUSTER) {
      buffer = false
      next(action)
      queue.forEach((queuedAction) => next(queuedAction))
    } else {
      queue.push(action)
    }
  }
}
