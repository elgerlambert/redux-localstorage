export default function adapter(storage) {
  function put(key, value, callback) {
    try {
      callback(null, storage.setItem(key, JSON.stringify(value)))
    } catch (e) {
      callback(e)
    }
  }

  function get(key, callback) {
    try {
      callback(null, JSON.parse(storage.getItem(key)))
    } catch (e) {
      callback(e)
    }
  }

  function del(key, callback) {
    try {
      callback(null, storage.removeItem(key))
    } catch (e) {
      callback(e)
    }
  }

  return {
    put,
    get,
    del
  }
}
