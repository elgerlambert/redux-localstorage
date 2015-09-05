import {assert} from 'chai';
import actionTypes from '../actionTypes.js';
import mergePersistedState from '../mergePersistedState.js';

describe('mergePersistedState', () => {
  const reducer = mergePersistedState()(state => state);
  const initialState = {
    a: 1,
    b: 2,
  };

  let action;

  beforeEach(() => {
    action = { type: actionTypes.INIT };
  });

  it('returns "undefined" if neither initial- or persistedState is defined', () => {
    assert.equal(reducer(undefined, action), undefined);
  });

  it('should return initialState if no persistedState is provided', () => {
    assert.deepEqual(reducer(initialState, action), initialState);
  });

  it('persistedState should override same key values of initialState', () => {
    action.payload = {b: 3};

    assert.equal(reducer(initialState, action).a, initialState.a);
    assert.equal(reducer(initialState, action).b, action.payload.b);
  });
});
