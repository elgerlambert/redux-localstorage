export default (storage) => ({
  0: storage,

  put(key, value, callback) {
    storage.set({ [key]: value }, callback)
  },

  get(key, callback) {
    try {
      storage.get(key, (items) => { callback(null, items[key]) })
    } catch (e) {
      callback(e)
    }
  },

  del(key, callback) {
    storage.remove(key, callback)
  },
})
