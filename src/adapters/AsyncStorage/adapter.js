export default function adapter(storage) {
  function put(key, value, callback) {
    storage.setItem(key, JSON.stringify(value), callback)
  }

  function get(key, callback) {
    JSON.parse(storage.getItem(key, callback))
  }

  function del(key, callback) {
    storage.removeItem(key, callback)
  }

  return {
    put,
    get,
    del
  }
}
