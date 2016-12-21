'use strict';

export default (state = { tours: []}, action) => {
  switch (action.type) {
    case 'TOURS_PAGE_LOADED':
      return {
        ...state, tours: action.payload.data
      };
    case 'TOURS_PAGE_UNLOADED':
      return {};
  }

  return state;
};