export default (storage) => ({
  0: storage,

  put(key, value, callback) {
    storage.setItem(key, JSON.stringify(value), callback)
  },

  get(key, callback) {
    JSON.parse(storage.getItem(key, callback))
  },

  del(key, callback) {
    storage.removeItem(key, callback)
  }
})
