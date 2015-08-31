export default (storage) => ({
  0: storage,

  put(key, value, callback) {
    storage.setItem(key, JSON.stringify(value), callback);
  },

  get(key, callback) {
    storage.getItem(key, (err, value) => {
      if (err) return callback(err);
      try {
        callback(null, JSON.parse(value));
      } catch (e) {
        callback(e);
      }
    });
  },

  del(key, callback) {
    storage.removeItem(key, callback);
  },
});
