'use strict';

export default (state = {
    languages: [],
    activeLanguages: []
}, action) => {
    switch (action.type) {
        case 'LANGS_PAGE_LOADED':
            return {
                ...state,
                languages: action.payload.data
            }
        case 'ACTIVE_LANGS_PAGE_LOADED':
            activeLanguages = [];

            action.payload.data.forEach(lang => {
                activeLanguages.push(lang.id);
            })

            return {
                ...state,
                activeLanguages: activeLanguages
            }
        case 'UPDATE_LANG':
            let activeLanguages = []
            if (action.payload.data.result && action.payload.data.result.ok === 1) {
                let deletedIndex

                state.activeLanguages.forEach(function(item, i) {
                    if (item === +action.payload.data.id) {
                        deletedIndex = i
                    }
                })

                activeLanguages = [...state.activeLanguages.slice(0, deletedIndex), ...state.activeLanguages.slice(deletedIndex + 1)]
            } else {
                activeLanguages = [...state.activeLanguages, action.payload.data.languageId]
            }

            return {
                ...state,
                activeLanguages,
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
