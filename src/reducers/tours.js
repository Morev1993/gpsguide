'use strict';

export default (state = { tours: []}, action) => {
  switch (action.type) {
    case 'TOURS_PAGE_LOADED':
      return {
        ...state, tours: action.payload.data
      }
      case 'TOUR_DETAIL_LOADED':
        return {
          ...state, tour: action.payload.data
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
        return { ...state, [action.key]: action.value }
    case 'TOURS_PAGE_UNLOADED':
      return {};
  }

  return state;
};
