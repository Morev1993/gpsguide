import { applyMiddleware, createStore, combineReducers } from 'redux'
import { promiseMiddleware, localStorageMiddleware } from './middleware'
import auth from './reducers/auth'
import common from './reducers/common'
import home from './reducers/home'
import tours from './reducers/tours'
import devices from './reducers/devices'

const reducer = combineReducers({
	auth,
	common,
	home,
	tours,
	devices
});

const middleware = applyMiddleware(promiseMiddleware, localStorageMiddleware)

const store = createStore(reducer, middleware)

export default store
