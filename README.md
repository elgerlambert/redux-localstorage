redux-localstorage
==================

Store enhancer that syncs (a subset) of your Redux store state to localstorage.

## Installation
```js
npm install --save redux-localstorage
```

## Usage
```js
import {compose, createStore} from 'redux';
import persistState from 'redux-localstorage'

const createPersistentStore = compose(
  persistState(),
  createStore
)

const store = createPersistentStore(/*reducer, initialState*/)
```

### persistState(paths, config)
#### paths
```js
type paths = Void | String | Array<String> 
```
If left `undefined` persistState will sync Redux's complete store state with localStorage. Alternatively you may specify which part(s) of your state should be persisted.

**Note:** Currently no support for nested paths. Only "top-level" paths are supported, i.e. state[path]. If your needs are more complex and you require more control over
which parts of your store's state should be persisted you can define your own strategy through [config.slicer](#configslicer)

#### config
##### config.key
```js
type config.key = String
```
The localStorage key used to store state. The default value is `redux`.

##### config.slicer
```js
type config.slicer<P> = (paths: P) => (state: Object) => subset: Object
```
Config.slicer allows you to define your own function which will be used to determine which parts should be synced with localStorage.
Config.slicer is called with the paths argument supplied to persistState. It should return a function that will be called with the store's state.
The return value of that function should be an object that matches the original structure of the store - it's this subset that'll be persisted.

Example:
```js
function myCustomSlicer (paths) {
  return (state) => {
    let subset = {}
    /*Custom logic goes here*/
    return subset
  }
}
```

## Immutable Data
If you're using immutable collections or some other custom collection, redux-localstorage allows you to define
your own serialization/deserialization functions in order to transform your state into a storable format (i.e. String) and back again.

##### config.serialize
The default serialization strategy is JSON.stringify. Specifying a serialize function as part of your config will override this.
This function receives a single argument (the subset of your store's state about to be persisted) and should return a serialized (i.e. stringified) representation thereof. 

##### config.deserialize
The default deserialization strategy is JSON.parse. Specifying a deserialize function as part of your config will override this.
This function receives a single argument (a serialized representation of your persisted state) and should return the data in a format that's expected by your application.

##### config.merge
During initialization any persisted state is merged with the initialState passed in as an argument to `createStore`.
The default strategy `extends` the initialState with the persistedState. Override this function if that doesn't work for you.
