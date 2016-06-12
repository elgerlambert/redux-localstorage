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
      buffer = false;
      next(action);
      queue.forEach(queuedAction => {
        next(queuedAction);
      });
      queue = null;
    } else {
      queue.push(action);
    }

    return action;
  };
}
