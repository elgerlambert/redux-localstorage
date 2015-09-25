/** 
 * @description
 * Storage Adapter for redux-localstorage 
 * Same a standard localstorage adapter except that String gets encoded before being stored
 *
 * @param {object} storage
 * @param {function} encode [encode(String value) @returns {String} encoded value]
 * @param {function} decode [decode(String encodedValue) @returns {String} decoded encodedValue]
 *
 * You have to provide the encode and decode functions
 * if not, default = base64 encoding
 **/
export default (storage, encode = btoa, decode = atob) => ({
  0: storage,

  put(key, value, callback) {
    try {
      const encodedValue = encode(JSON.stringify(value));
      callback(null, storage.setItem(key, encodedValue));
    } catch (e) {
      callback(e);
    }
  },

  get(key, callback) {
    try {
      // btoa throws if value to decode is undefined
      const value = storage.getItem(key) ? decode(storage.getItem(key)) : null;
      callback(null, JSON.parse(value));
    } catch (e) {
      callback(e);
    }
  },

  del(key, callback) {
    try {
      callback(null, storage.removeItem(key));
    } catch (e) {
      callback(e);
    }
  }
});