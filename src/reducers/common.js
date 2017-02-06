import { setCookie, deleteCookie } from '../cookie'

const defaultState = {
    appName: 'Conduit',
    token: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'APP_LOAD':
            return {
                ...state,
                token: action.token || null,
                appLoaded: true,
                currentUser: action.payload ? action.payload : null
            };
        case 'REDIRECT':
            return { ...state,
                redirectTo: null
            };
        case 'LOGIN':
            setCookie('gps-session', true, {
                expires: 3600
            })
            return {
                ...state,
                redirectTo: action.error ? null : '/',
                token: action.error ? null : action.payload.token,
                currentUser: action.error ? null : action.payload.data
            };
        case 'LOGOUT':
            deleteCookie('gps-session')
            return { ...state,
                redirectTo: '/auth',
                token: null,
                currentUser: null
            };
    }
    return state;
};
