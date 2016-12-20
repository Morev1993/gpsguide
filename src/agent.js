import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = 'http://localhost:8080/api/admin'

const responseBody = res => res.body;

const requests = {
    get: url =>
        superagent.get(`${API_ROOT}${url}`).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
}

const Projects = {
    all: () =>
        requests.get(`/server/projects.json`)
}

const Auth = {
    current: () =>
        requests.get('/user'),
    login: (email, password) =>
        requests.post('/signin', { email, password })
};

export default {
    Projects,
    Auth
}
