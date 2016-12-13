import { createStore } from 'redux'

const defaultState = {
	appName: 'prototype',
	projects: null
}

const reducer = function(state = defaultState, action) {
	switch (action.type) {
		case 'HOME_PAGE_LOADED':
			console.log(state);
			return { ...state, projects: action.payload.projects }
	}
	return state
}

const store = createStore(reducer)

export default store