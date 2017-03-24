import React, { Component } from 'react'
//import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Table } from 'reactstrap'

const mapStateToProps = state => ({
    tours: state.tours.tours || []
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: 'TOURS_PAGE_LOADED', payload })
})

class DeviceTours extends Component {
    constructor() {
        super();
        this.state = {
            tours: [],
            disabledTours: []
        };

        this.toggleTour = () => {
            // this.props.onUpdate(langId);
        }
    }
    componentWillMount() {
        this.props.onLoad(agent.Tours.all())

        Object.assign(this.state, {
            tours: this.props.tours,
            disabledTours: []
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            tours: nextProps.tours,
            disabledTours: []
        }));
    }
    render() {
        return <div>
            <Table>
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Code</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                    { this.state.tours.map(tour => {
                          return (
                              <tr key={tour.id}>
                                <th scope='row'>{tour.name}</th>
                                <td>Status:
                                    <input type='checkbox'
                                        checked={this.state.disabledTours.indexOf(tour.id) !== - 1}
                                        onChange={this.toggleTour.bind(this, tour.id)}
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
