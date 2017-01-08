'use strict';

export default (state = {
    devices: []
}, action) => {
    switch (action.type) {
        case 'DEVICES_PAGE_LOADED':
            return {
                ...state,
                devices: action.payload.data
            }
        case 'DEVICE_DETAIL_LOADED':
            return {
                ...state,
                device: action.payload.data
            }
        case 'UPDATE_DEVICE':
            const device = Object.assign({}, state.device, action.payload.data);
            return {
                device,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_DEVICE':
            let devices = [...state.devices, action.payload.data];
            return {
                devices,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'DELETE_DEVICE':
            let deletedIndex

            state.devices.forEach(function(item, i) {
                if (item._id === action.payload.data._id) {
                    deletedIndex = i;
                }
            })

            devices = [...state.devices.slice(0, deletedIndex), ...state.devices.slice(deletedIndex + 1)];

            return {
                devices,
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
