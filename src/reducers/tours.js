'use strict';

export default (state = {
    tours: [],
    langsActive: []
}, action) => {
    switch (action.type) {
        case 'TOURS_PAGE_LOADED':
            return {
                ...state,
                tours: action.payload.data
            }
        case 'GET_LANGS_ACTIVE':
            return {
                ...state,
                langsActive: action.payload.data
            }
        case 'CREATE_WAYPOINT':
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_FILES':
            //console.log(action)
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'GET_WAYPOINTS':
            return {
                ...state,
                waypoints: action.payload.data
            }
        case 'UPDATE_WAYPOINT':
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'DELETE_WAYPOINT':
            return {
                ...state,
                errors: action.error ? action.payload.errors : null
            }
        case 'TOUR_DETAIL_LOADED':
            return {
                ...state,
                tour: action.payload.data
            }
        case 'UPDATE_TOUR':
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_TOUR':
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'DELETE_TOUR':
            return {
                ...state,
                errors: action.error ? action.payload.errors : null
            }
        case 'UPDATE_FIELD_TOUR':
            return { ...state,
                [action.key]: action.value
            }

        case 'TOURS_PAGE_UNLOADED':
            return {};
    }

    return state;
};
