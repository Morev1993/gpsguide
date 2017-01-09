'use strict';

export default (state = {
    tours: [],
    langsActive: [],
    files: []
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
        case 'TOUR_DETAIL_LOADED':
            return {
                ...state,
                tour: action.payload.data
            }
        case 'UPDATE_TOUR':
            const tour = Object.assign({}, state.tour, action.payload.data)
            return {
                ...state,
                tour,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_TOUR':
            let tours = [...state.tours, action.payload.data]
            return {
                tours,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'DELETE_TOUR':
            let deletedIndex

            state.tours.forEach(function(item, i) {
                if (item._id === action.payload.data._id) {
                    deletedIndex = i;
                }
            })

            tours = [...state.tours.slice(0, deletedIndex), ...state.tours.slice(deletedIndex + 1)]
            return {
                tours,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_WAYPOINT':
            let waypoints = [...state.waypoints, action.payload.data]
            return {
                ...state,
                waypoints: waypoints,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_FILES':
            let files = [...state.files, action.payload.data]
            return {
                ...state,
                files,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'GET_FILES':
            return {
                ...state,
                files: action.payload.data
            }
        case 'DELETE_FILE':
            deletedIndex

            state.files.forEach(function(item, i) {
                if (item._id === action.payload.data._id) {
                    deletedIndex = i;
                }
            })

            files = [...state.files.slice(0, deletedIndex), ...state.files.slice(deletedIndex + 1)]

            console.log(files)
            return {
                ...state,
                files,
                errors: action.error ? action.payload.errors : null
            }
        case 'GET_WAYPOINTS':
            return {
                ...state,
                waypoints: action.payload.data
            }
        case 'UPDATE_WAYPOINT':
            deletedIndex

            state.waypoints.forEach(function(item, i) {
                if (item._id === action.payload.data._id) {
                    deletedIndex = i;
                }
            })

            waypoints = [...state.waypoints.slice(0, deletedIndex), ...state.waypoints.slice(deletedIndex + 1)]
            waypoints.splice(deletedIndex, 0, action.payload.data)
            return {
                ...state,
                waypoints,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'DELETE_WAYPOINT':
            deletedIndex

            state.waypoints.forEach(function(item, i) {
                if (item._id === action.payload.data._id) {
                    deletedIndex = i;
                }
            })

            waypoints = [...state.waypoints.slice(0, deletedIndex), ...state.waypoints.slice(deletedIndex + 1)]
            return {
                ...state,
                waypoints: waypoints,
                errors: action.error ? action.payload.errors : null
            }
        case 'UPDATE_FIELD_TOUR':
            return { ...state,
                [action.key]: action.value
            }
    }

    return state;
};
