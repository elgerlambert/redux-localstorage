redux-localstorage
==================

Unopinionated store enhancer that persists state changes (locally).

Similarly to redux, redux-localstorage has a small API footprint yet provides great flexibility by embracing functional composition. Through functional composition you can [enhance](#enhancers) your persistence layer of [choice](#storage-1) to meet your specific needs!

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

import adapter from 'redux-localstorage/lib/adapters/localStorage';
import persistState from 'redux-localstorage';
// import your storage enhancers of choice
import debounce from 'redux-localstorage-debounce';
import filter from 'redux-localstorage-filter';

const storage = compose(
  debounce(100),
  filter('nested.key'),
  adapter(window.localStorage)
);

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key'),
  createStore
);

const store = createPersistentStore(/*reducer, initialState*/);
```

## persistState(storage, key)
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
Redux-localstorage currently provides adapters for `localStorage`, `sessionStorage` and `AsyncStorage`. An adapter creates a thin wrapper that transforms a storage API so that it conforms to the stated requirements. The original storage object passed to an adapter can be accessed through `adapted[0]`; this provides you access to all the original storage methods when creating a storage enhancer.

```js
import {compose, createStore} from 'redux';
import {AsyncStorage} from 'react-native';

import adapter from 'redux-localstorage/lib/adapters/AsyncStorage';
import persistState from 'redux-localstorage';

const storage = adapter(AsyncStorage);
// storage[0] === AsyncStorage

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key'),
  createStore
);
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
  serialization,
  errorHandling,
  yourCustom(enhancer),
  adapter(window.localStorage)
);

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key'),
  createStore
);
```
Check out the [wiki](https://github.com/elgerlambert/redux-localstorage/wiki) for a list of available storage enhancers and don't forget to add your own if you publish any!

## mergePersistedState(merge)
To rehydrate the store during initialisation the application's initial state is merged (deeply) with any state previously persisted. The default merge strategy should work in most cases. If you do need/want to define your own (e.g. because you're merging Immutable collections), `mergePersistedState` provides an easy way to do so:

```js
import persistState, {mergePersistedState} from 'redux-localstorage';

const reducer = compose(
  mergePersistedState(yourCustomMergeFunction),
  combineReducers(reducers)
);
``` 

### merge
```js
type merge = (initialState, persistedState) => mergedState
```
Function that defines how the persisted state should be merged with the initial state. The `initialState` includes the default values specified by the reducers. 

## License
MIT
