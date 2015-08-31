import actionTypes from './actionTypes.js';

/*
 * Middleware for intercepting and queueing actions until actionTypes.INIT
 * has been dispatched. This action will be dispatched first, followed by
 * any queued actions in the order they were originally dispatched.
 */
export default function bufferActions() {
  const queue = [];
  let buffer = true;

  return next => action => {
    if (!buffer) return next(action);

    if (actionTypes.INIT) {
      buffer = false;
      next(action);
      queue.forEach(queuedAction => {
        next(queuedAction);
      });
    } else {
      queue.push(action);
    }

    return action;
  };
}
