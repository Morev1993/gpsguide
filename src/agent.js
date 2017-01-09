import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = checkOrigin(location.origin)

function checkOrigin(url) {
    if (url && url.indexOf('localhost') != -1) {
        return 'http://localhost:8090/api/admin'
    } else {
        return url + ':8078/api/admin'
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
        let id = tour._id
        return requests.put(`/tours/${id}`, tour)
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
        let id = device._id
        return requests.put(`/devices/${id}`, device)
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
        console.log(lang)
        let id = lang._id;
        return requests.put(`/languages/${id}`, lang)
    },
    delete: id =>
        requests.del(`/languages/${id}`)
}

const Waypoints = {
    create: state => {
        let tourId = state._id
        let payload = state.waypoint

        return requests.post(`/tours/${tourId}/waypoints`, payload)
    },
    all: (tourId) =>
        requests.get(`/tours/${tourId}/waypoints`),
    get: id => {
        requests.get(`/waypoints/${id}`)
    },
    update: waypoint => {
        let id = waypoint._id
        let tourId = waypoint.tourId
        return requests.put(`/tours/${tourId}/waypoints/${id}`, waypoint)
    },
    delete: waypoint => {
        let id = waypoint._id
        let tourId = waypoint.tourId
        return requests.del(`/tours/${tourId}/waypoints/${id}`)
    }
}

const Files = {
    createFiles: state => {
        let tourId = state._id
        let id = state.waypoint._id
        var uploadFiles = state.waypoint.uploadFiles

        let formData = new FormData();
        for (let key in uploadFiles) {
            formData.append(`uploadFiles_${key}`, uploadFiles[key])
        }

        return requests.post(`/tours/${tourId}/waypoints/${id}/files`, formData)
    },
    getFiles: state => {
        let tourId = state._id
        let id = state.waypoint._id
        let langsStr = state.languages.join(',')

        return requests.get(`/tours/${tourId}/waypoints/${id}/files?langs=${langsStr}`)
    },
    getFilePath: (state, fileId) => {
        let tourId = state._id
        let id = state.waypoint._id

        return `${API_ROOT}/tours/${tourId}/waypoints/${id}/files/${fileId}`
    }
}
export default {
    Auth,
    Tours,
    Devices,
    Languages,
    Waypoints,
    Files,
    setToken: _token => { token = _token; }
}
