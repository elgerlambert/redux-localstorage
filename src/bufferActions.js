import actionTypes from './actionTypes.js';

/*
 * Middleware for intercepting and queueing actions until actionTypes.INIT
 * has been dispatched. This action will be dispatched first, followed by
 * any queued actions in the order they were originally dispatched.
 */
export default function bufferActions(type = actionTypes.INIT) {
  let buffer = true;
  let queue = [];

  return () => next => action => {
    if (!buffer) return next(action);

    if (action.type === type) {
      next(action);
      while (queue.length) {
        next(queue.shift());
      }
      queue = null;
      buffer = false;
    } else {
      queue.push(action);
    }

    return action;
  };
}
