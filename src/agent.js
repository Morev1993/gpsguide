import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'
import { setCookie } from './cookie'

const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = checkOrigin(location.hostname)

function checkOrigin(host) {
    if (host === 'localhost') {
        return 'http://localhost:8090/api/admin'
    } else {
        return `http://${host}:8078/api/admin`
    }
}

const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
    if (token) {
        setCookie('gps-session', true, {
            expires: 3600
        })

        req.set('authorization', `${token}`)
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
    getDisabledTours: (id) =>
        requests.get(`/tours/down/${id}`),
    update: (tour) => {
        let id = tour._id
        return requests.put(`/tours/${id}`, tour)
    },
    updateDeviceTour: (params) => {
        return requests.put(`/tours/down/${params.deviceId}/${params.tourId}`)
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
    update: id => {
        return requests.post(`/languages/${id}`)
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
            formData.append(`uploadFiles_${key}_${uploadFiles[key].langCode}`, uploadFiles[key].file)
        }

        return requests.post(`/tours/${tourId}/waypoints/${id}/files`, formData)
    },
    getFiles: state => {
        let tourId = state._id
        let id = state.waypoint._id

        return requests.get(`/tours/${tourId}/waypoints/${id}/files`)
    },
    delete: (payload) => {
        let tourId = payload.state._id
        let id = payload.state.waypoint._id
        let fileId = payload.fileId

        return requests.del(`/tours/${tourId}/waypoints/${id}/files/${fileId}/`)
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
