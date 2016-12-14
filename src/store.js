import { applyMiddleware, createStore } from 'redux'
import { promiseMiddleware } from './middleware';

const defaultState = {
	appName: 'GPSGuide',
	projects: []
}

const reducer = function(state = defaultState, action) {
	switch (action.type) {
		case 'MAIN_PAGE_LOADED':
			return { ...state, projects: action.payload }
	}
	return state
}

const middleware = applyMiddleware(promiseMiddleware)

const store = createStore(reducer, middleware)

export default store