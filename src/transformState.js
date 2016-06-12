export default function transformState(down, up) {
  const finalDown = typeof down === 'function'
    ? [down]
    : down;

  const finalUp = typeof up === 'function'
    ? [up]
    : up;

  return storage => ({
    ...storage,

    put(key, state, callback) {
      const transformedState = finalDown
        ? finalDown.reduce((s, t) => t(s), state)
        : state;

      storage.put(key, transformedState, callback);
    },

    get(key, callback) {
      storage.get(key, (err, state) => {
        if (err || !state) return callback(err, state);

        const transformedState = finalUp
          ? finalUp.reduce((s, t) => t(s), state)
          : state;

        callback(null, transformedState);
      });
    },
  });
}
