'use strict';

export default (state = {
    devices: [],
    disabledTours: []
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
        case 'DISABLED_TOURS_DEVICE_LOADED':
            disabledTours = []

            action.payload.data.forEach(tour => {
                disabledTours.push(tour.tourId)
            })

            return {
                ...state,
                disabledTours: disabledTours
            }

            case 'UPDATE_DEVICE_TOUR':
                let disabledTours = []
                if (action.payload.data.result && action.payload.data.result.ok === 1) {
                    let deletedIndex

                    state.disabledTours.forEach(function(item, i) {
                        if (item === action.payload.data.id) {
                            deletedIndex = i
                        }
                    })

                    disabledTours = [...state.disabledTours.slice(0, deletedIndex),
                        ...state.disabledTours.slice(deletedIndex + 1)]
                } else {
                    disabledTours = [...state.disabledTours, action.payload.data.tourId]
                }

            return {
                disabledTours,
                inProgress: null,
                errors: action.error ? action.payload.errors : null
            }
        case 'CREATE_DEVICE':
            let devices
            if (!action.error) {
                devices = [...state.devices, action.payload.data];
            } else {
                devices = state.devices
            }

            return {
                devices,
                inProgress: null,
                errors: action.error ? action.payload : null
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
