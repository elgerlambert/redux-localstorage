redux-localstorage
==================

Store enhancer that accepts any (enhanced!) storage backend to persist store state changes.

Redux-localstorage provides adapters for `localStorage`, `sessionStorage` and `AsyncStorage` as well as storage enhancers such as `filter` so that you can get going with minimal effort. You can then create your own storage enhancers to meet any other (application specific) needs!

## Installation
```js
npm install --save redux-localstorage
```

## Usage
```js
import {compose, createStore} from 'redux';

import adapter from 'redux-localstorage/lib/adapters/localStorage';
import {filter} from 'redux-localstorage/lib/enhancers';
import persistState from 'redux-localstorage';

const storage = compose(
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
  put: function(key, value, callback) {},
  get: function(key, callback) {},
  del: function(key, callback) {}
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

const storage = adapter(AsyncStorage)
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
  debounce(1000),
  filter(['key', 'another.key']),
  serialization,
  errorHandling,
  adapter(window.localStorage)
);

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key'),
  createStore
);
```
Check out the [available enhancers](/src/enhancers) and [recipes](/recipes) to get going and create your own enhancers!

## mergePersistedState(merge)
To rehydrate the store during initialisation the application's initial state is merged (deeply) with any state previously persisted. The default merge strategy should work in most cases. If you do need/want to define your own (e.g. because you're merging Immutable collections), `mergePersistedState` provides an easy way to do so:

```js
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
