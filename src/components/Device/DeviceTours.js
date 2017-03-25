import React, { Component } from 'react'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Table } from 'reactstrap'

const mapStateToProps = state => ({
    tours: state.tours.tours || [],
    disabledTours: state.devices.disabledTours || []
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: 'TOURS_PAGE_LOADED', payload }),
    onDisabledToursLoad: (payload) =>
        dispatch({ type: 'DISABLED_TOURS_DEVICE_LOADED', payload }),
    onUpdate: (payload) => {
        dispatch({ type: 'UPDATE_DEVICE_TOUR', payload: agent.Tours.updateDeviceTour(payload) })
    }
})

class DeviceTours extends Component {
    constructor() {
        super();
        this.state = {
            tours: [],
            disabledTours: []
        };

        this.toggleTour = (tourId) => {
            let params = {
                deviceId: this.props.params.id,
                tourId: tourId
            }
            this.props.onUpdate(params);
        }
    }
    componentWillMount() {
        this.props.onLoad(agent.Tours.all())
        this.props.onDisabledToursLoad(
            agent.Tours.getDisabledTours(this.props.params.id
        ))

        Object.assign(this.state, {
            tours: this.props.tours,
            disabledTours: this.props.disabledTours
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            tours: nextProps.tours,
            disabledTours: nextProps.disabledTours
        }));
    }
    render() {
        return <div>
            <Table>
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                    { this.state.tours.map(tour => {
                          return (
                              <tr key={tour._id}>
                                <th scope='row'>{tour.name}</th>
                                <td>Status: {' '}
                                    <input type='checkbox'
                                        checked={this.state.disabledTours.indexOf(tour._id) == - 1}
                                        onChange={this.toggleTour.bind(this, tour._id)}
                                        name='status' id='status'></input>
                                    </td>
                              </tr>
                            )}
                        )
                    }
                </tbody>
              </Table>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceTours)
