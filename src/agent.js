import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = 'http://localhost:8090/api/admin'

const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `${token}`);
  }
}

const requests = {
    get: url =>
        superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
    del: url =>
        superagent.del(`${API_ROOT}${url}`).then(responseBody)
}

const Tours = {
    create: tour =>
        requests.post(`/tours`, { tour }),
    all: () =>
        requests.get(`/tours`),
    get: id =>
        requests.get(`/tours/${id}`),
    update: id =>
        requests.put(`/tours/${id}`),
    delete: id =>
        requests.del(`/tours/${id}`)
}

const Devices = {
    create: device =>
        requests.post(`/devices`, { device }),
    all: () =>
        requests.get(`/devices`),
    get: id =>
        requests.get(`/devices/${id}`),
    update: id =>
        requests.put(`/devices/${id}`),
    delete: id =>
        requests.del(`/devices/${id}`)
}

const Languages = {
    all: () =>
        requests.get(`/languages`),
    get: id =>
        requests.get(`/languages/${id}`),
    update: id =>
        requests.put(`/languages/${id}`),
    delete: id =>
        requests.del(`/languages/${id}`)
}

const Waypoints = {
    create: waypoint =>
        requests.post(`/waypoints`, { waypoint }),
    all: () =>
        requests.get(`/waypoints`),
    get: id =>
        requests.get(`/waypoints/${id}`),
    update: id =>
        requests.put(`/waypoints/${id}`),
    delete: id =>
        requests.del(`/waypoints/${id}`)
}

const Auth = {
    current: () =>
        requests.get('/user'),
    login: (email, password) =>
        requests.post('/signin', { email, password })
};

export default {
    Auth,
    Tours,
    Devices,
    Languages,
    Waypoints,
    setToken: _token => { token = _token; }
}
