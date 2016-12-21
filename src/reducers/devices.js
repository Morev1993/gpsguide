'use strict';

export default (state = { tours: []}, action) => {
  switch (action.type) {
    case 'DEVICES_PAGE_LOADED':
      return {
        ...state, devices: action.payload.data
      }
      case 'DEVICE_DETAIL_LOADED':
        return {
          ...state, device: action.payload.data
        }
        case 'UPDATE_DEVICE':
          return {
              ...state,
              inProgress: null,
              errors: action.error ? action.payload.errors : null
          }
      case 'CREATE_DEVICE':
          return {
              ...state,
              inProgress: null,
              errors: action.error ? action.payload.errors : null
      }
      case 'DELETE_DEVICE':
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
