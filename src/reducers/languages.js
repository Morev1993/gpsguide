'use strict';

export default (state = {
    languages: []
}, action) => {
    switch (action.type) {
        case 'LANGS_PAGE_LOADED':
            return {
                ...state,
                languages: action.payload.data
            }
        case 'UPDATE_LANG':
            return {
                ...state,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'DELETE_LANG':
            return {
                ...state,
                errors: action.error ? action.payload.errors : null
            }
    }

    return state;
};
