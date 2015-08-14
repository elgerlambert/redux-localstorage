export default (storage) => ({
  0: storage,

  put(key, value, callback) {
    try {
      callback(null, storage.setItem(key, JSON.stringify(value)))
    } catch (e) {
      callback(e)
    }
  },

  get(key, callback) {
    try {
      callback(null, JSON.parse(storage.getItem(key)))
    } catch (e) {
      callback(e)
    }
  },

  del(key, callback) {
    try {
      callback(null, storage.removeItem(key))
    } catch (e) {
      callback(e)
    }
  }
})
