redux-localstorage
==================

Store enhancer that persists store state changes when and where you want.

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
  filter('todos'),
  adapter(localStorage)
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
type storage = Object
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
A number of [adapters](#adapters) are provided to wrap existing storage API's so that they conform to these requirements. But like I said, you can create your own storage object and point these methods to any endpoint you like!

### adapters
Redux-localstorage currently provides adapters for localStorage, sessionStorage and AsyncStorage. These adapters are very thin wrappers that transform these storage API's so that they meet the necessary requirements.

```js
import {compose, createStore} from 'redux';
import {AsyncStorage} from 'react-native';

import adapter from 'redux-localstorage/lib/adapters/AsyncStorage';
import persistState from 'redux-localstorage';

const createPersistentStore = compose(
  persistState(adapter(AsyncStorage), 'my-storage-key'),
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
  filter('todos'),
  serialization,
  errorHandling,
  adapter(localStorage)
);

const createPersistentStore = compose(
  persistState(storage, 'my-storage-key'),
  createStore
);
```
Check out the [available enhancers](/src/enhancers) and [recipes](/recipes) to get going and create your own enhancers!

## License
MIT
