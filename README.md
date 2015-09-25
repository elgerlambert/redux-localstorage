redux-localstorage
==================

Unopinionated store enhancer that persists state changes (locally).

Similarly to redux, redux-localstorage has a small API footprint yet provides great flexibility by embracing functional composition. Through functional composition you can [enhance](#enhancers) your [persistence layer of choice](#storage-1) to meet your specific needs!

[![license](https://img.shields.io/npm/l/redux-localstorage.svg?style=flat-square)](https://www.npmjs.com/package/redux-localstorage)
[![npm version](https://img.shields.io/npm/v/redux-localstorage.svg?style=flat-square)](https://www.npmjs.com/package/redux-localstorage)
[![npm downloads](https://img.shields.io/npm/dm/redux-localstorage.svg?style=flat-square)](https://www.npmjs.com/package/redux-localstorage)

## Installation
```js
npm install --save redux-localstorage
```

## The Gist
```js
import {compose, createStore} from 'redux';
import rootReducer from './reducers';

import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';

const reducer = compose(
  mergePersistedState()
)(rootReducer);

const storage = compose(
  filter('nested.key')
)(adapter(window.localStorage));

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key')
)(createStore);

const store = createPersistentStore(reducer);
```
## API
### persistState([storage][, key][, callback])
#### storage
```js
type storage = Storage (Object)
```
An object that provides ([enhanced](#enhancers)) methods for data persistence, retrieval and removal as put, get & del. Defaults to adapter(localStorage).

#### key
```js
type key = String
```
The key used to store (and retrieve) persisted state. Defaults to 'redux-localstorage'.

#### callback
```js
type callback = Function
```
Called when persistState has finished initializing (after rehydration).

### mergePersistedState([merge])
mergePersistedState is a higher order reducer that can be used to rehydrate the store. It takes a function (optional) that defines how the application's initial state should be merged with any persisted state.

#### merge
```js
type merge = (initialState, persistedState) => mergedState
```
Function that defines how the persisted state should be merged with the initial state. By default `mergePersistedState` performs a shallow merge. The following shows how you can easily define a deep merge using e.g. `lodash.merge`:  

```js
const reducer = compose(
  mergePersistedState((initialState, persistedState) => {
    return _.merge({}, initialState, persistedState)
  }),
)(rootReducer);
``` 

**Note:** The `initialState` includes the default values specified by your reducers.

## Rehydration
The use of `mergePersistedState` is optional. If you prefer to handle rehydration in your own reducer(s), you can. Listen for redux-localstorage's `INIT` action; it includes the persisted state as it's `payload`. For example:

```js
import {actionTypes} from 'redux-localstorage'

export default function reducer(state = {}, action) {
  if (action.type === actionTypes.INIT) {
    const persistedState = action.payload['reducer']
    return {...state, ...persistedState}
  }
//...
```
**Note:** The `INIT` action is passed on to your reducers by `mergePersistedState` in case you would like to set an `initialised` flag for example.

## Storage
Redux-localstorage can be made to work with any storage implementation - *it doesn't even have to be local!* All that is required is that the storage that is passed in exposes the following methods. 
```js
storage = {
  put(key, value, callback) {},
  get(key, callback) {},
  del(key, callback) {}
};
```
A number of [adapters](#adapters) are provided to wrap existing storage API's so that they conform to these requirements. But you could create your own storage object and point these methods to any endpoint you like!

### adapters
Redux-localstorage currently provides adapters for `localStorage`, `sessionStorage`, `AsyncStorage` and `EncodedLocalStorage` (same as `localStorage` or `sessionStorage` except you can use an encoder/decoder to avoid storing your state in plain text). An adapter creates a thin wrapper that transforms a storage API so that it conforms to the stated requirements. The original storage object passed to an adapter can be accessed through `adapted[0]`; this provides you access to all the original storage methods when creating a storage enhancer.

```js
import {AsyncStorage} from 'react-native';
import adapter from 'redux-localstorage/lib/adapters/AsyncStorage';

const storage = adapter(AsyncStorage);
// storage[0] === AsyncStorage
```

### enhancers
```js
type enhancer = (Storage) => Storage
```
Through functional composition it's really easy to enhance a storage object. This provides a lot of flexibility, allowing for fun stuff like:
```js
const storage = compose(
  debounce(100),
  filter(['key', 'another.key']),
  errorHandling,
  yourOwnCustom(enhancer)
)(adapter(window.localStorage));

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key')
)(createStore);
```
Check out the wiki for a [list of available storage enhancers](https://github.com/elgerlambert/redux-localstorage/wiki) and don't forget to add your own if you publish any!

## License
MIT
