'use strict';
import agent from './agent'

const promiseMiddleware = (store) => next => action => {
	if (isPromise(action.payload)) {
		store.dispatch({ type: 'ASYNC_START', subtype: action.type });
		action.payload.then(
			res => {
				if (res.success) {
					action.payload = res
					store.dispatch({ type: 'ASYNC_END', promise: action.payload })
					store.dispatch(action)
				}
			},
			error => {
				console.log(error)
				action.error = true
				action.payload = error
				store.dispatch({ type: 'ASYNC_END', promise: action.payload })
				store.dispatch(action)
			}
		)

		return
	}

	next(action)
}

const localStorageMiddleware = () => next => action => {
  if (action.type === 'LOGIN') {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.token);
      agent.setToken(action.payload.token);
    }
  } else if (action.type === 'LOGOUT') {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }

  next(action);
};

function isPromise(v) {
	return v && typeof v.then === 'function'
}

export {
	localStorageMiddleware,
	promiseMiddleware
}
