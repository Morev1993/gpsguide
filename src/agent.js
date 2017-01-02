import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = checkOrigin(location.origin)

function checkOrigin(url) {
    if (url && url.indexOf('45.55.163.154') != -1) {
        return 'http://45.55.163.154:8078/api/admin'
    } else {
        return 'http://localhost:8090/api/admin'
    }
}

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
        superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
    del: url =>
        superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody)
}

const Auth = {
    current: () =>
        requests.get('/user'),
    login: (email, password) =>
        requests.post('/signin', { email, password })
};

const Tours = {
    create: tour =>
        requests.post(`/tours`, tour),
    all: () =>
        requests.get(`/tours`),
    get: id =>
        requests.get(`/tours/${id}`),
    update: (tour) => {
        var id = tour._id
        requests.put(`/tours/${id}`, tour)
    },
    delete: id =>
        requests.del(`/tours/${id}`)
}

const Devices = {
    create: device =>
        requests.post(`/devices`, device),
    all: () =>
        requests.get(`/devices`),
    get: id =>
        requests.get(`/devices/${id}`),
    update: device => {
        var id = device._id
        requests.put(`/devices/${id}`, device)
    },
    delete: id =>
        requests.del(`/devices/${id}`)
}

const Languages = {
    all: () =>
        requests.get(`/languages`),
    actives: () =>
        requests.get(`/languages/active`),
    get: id =>
        requests.get(`/languages/${id}`),
    update: lang => {
        var id = lang._id;
        requests.put(`/languages/${id}`, lang)
    },
    delete: id =>
        requests.del(`/languages/${id}`)
}

const Waypoints = {
    create: state => {
        var tourId = state._id
        var payload = state.waypoint
        requests.post(`/tours/${tourId}/waypoints`, payload)
    },
    all: (tourId) =>
        requests.get(`/tours/${tourId}/waypoints`),
    get: id => {
        requests.get(`/waypoints/${id}`)
    },
    update: waypoint => {
        var id = waypoint._id
        var tourId = waypoint.tourId
        requests.put(`/tours/${tourId}/waypoints/${id}`, waypoint)
    },
    delete: waypoint => {
        var id = waypoint._id
        var tourId = waypoint.tourId
        requests.del(`/tours/${tourId}/waypoints/${id}`)
    }
}

export default {
    Auth,
    Tours,
    Devices,
    Languages,
    Waypoints,
    setToken: _token => { token = _token; }
}
