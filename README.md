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

**Note:** Currently no support for nested paths. Only "top-level" paths are supported, i.e. state[path]. If your needs are more complex and you require more control over which parts of your store's state should be persisted you can define your own strategy through [config.slicer](#configslicer)

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
Config.slicer allows you to define your own function which will be used to determine which parts should be synced with localStorage. Config.slicer is called with the paths argument supplied to persistState. It should return a function that will be called with the store's state. The return value of that function should be an object that matches the original structure of the store - it's this subset that'll be persisted.

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

##### config.dehydrate
```js
type config.slicer<P> = (paths: P) => (state: Object) => subset: Object
```
Config.slicer allows you to define your own function which will be used to determine which parts should be synced with localStorage. Config.slicer is called with the paths argument supplied to persistState. It should return a function that will be called with the store's state. The return value of that function should be an object that matches the original structure of the store - it's this subset that'll be persisted.

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
