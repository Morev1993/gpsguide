import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = location.origin

const responseBody = res => res.body;

const requests = {
	get: url =>
		superagent.get(`${API_ROOT}${url}`).then(responseBody)
}

const Projects = {
	all: () =>
		requests.get(`/api/projects.json`)
}

export default {
	Projects
}
