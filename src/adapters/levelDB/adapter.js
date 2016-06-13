export default (storage) => ({
  0: storage,

  put(key, value, callback) {
    try {
      storage.put(key, value, callback);
    } catch (e) {
      callback(e);
    }
  },

  get(key, callback) {
    storage.get(key, (err, value) => { // eslint-disable-line consistent-return
      if (err) return callback(err);
      try {
        callback(null, value);
      } catch (e) {
        callback(e);
      }
    });
  },

  del(key, callback) {
    storage.del(key, callback);
  },
});
