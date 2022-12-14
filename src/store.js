import { applyMiddleware, createStore, combineReducers } from 'redux'
import { promiseMiddleware, localStorageMiddleware } from './middleware'
import auth from './reducers/auth'
import common from './reducers/common'
import home from './reducers/home'
import tours from './reducers/tours'
import devices from './reducers/devices'
import languages from './reducers/languages'

const reducer = combineReducers({
	auth,
	common,
	home,
	tours,
	devices,
	languages
});

const middleware = applyMiddleware(promiseMiddleware, localStorageMiddleware)

const store = createStore(reducer, middleware)

export default store
