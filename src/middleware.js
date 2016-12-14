const promiseMiddleware = store => next => action => {
	if (isPromise(action.payload)) {
		action.payload.then(
			res => {
				action.payload = res
				store.dispatch(action)
			},
			error => {
				console.log(error)
				action.error = true
				action.payload = error
				store.dispatch(action)
			}
		)

		return
	}

	next(action)
}

function isPromise(v) {
	return v && typeof v.then === 'function'
}

export {
	promiseMiddleware
}