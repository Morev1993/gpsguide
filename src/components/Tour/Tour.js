import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'
import controllable from 'react-controllables'

import GoogleMap from 'google-map-react'
import MyGreatPlaceWithControllableHover from './my_great_place_with_controllable_hover.js'
import {K_SIZE} from './my_great_place_with_controllable_hover_styles.js'

const mapStateToProps = state => ({
    tour: state.tours.tour || {},
    langsActive: state.tours.langsActive || [],
    waypoints: state.tours.waypoints || []
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: 'TOUR_DETAIL_LOADED', payload })
    },
    onLangsLoaded: (payload) => {
        dispatch({ type: 'GET_LANGS_ACTIVE', payload })
    },
    onWaypointsLoaded: (payload) => {
        dispatch({ type: 'GET_WAYPOINTS', payload })
    },
    onWaypointUpdate: (payload) => {
        dispatch({ type: 'GET_WAYPOINTS', payload: agent.Waypoints.update(payload) })
    },
    onWaypointDelete: (payload) => {
        dispatch({ type: 'GET_WAYPOINTS', payload })
    },
    onTourSubmit: (payload) => {
        dispatch({ type: 'UPDATE_TOUR', payload: agent.Tours.update(payload) })
    },
    onTourDelete: (payload) => {
        dispatch({ type: 'DELETE_TOUR', payload: agent.Tours.delete(payload) })
    }
})

@controllable(['center', 'zoom', 'hoverKey', 'clickKey'])
class Tour extends Component {
    static propTypes = {
        center: PropTypes.array, // @controllable
        zoom: PropTypes.number, // @controllable
        hoverKey: PropTypes.string, // @controllable
        clickKey: PropTypes.string, // @controllable
        onCenterChange: PropTypes.func, // @controllable generated fn
        onZoomChange: PropTypes.func, // @controllable generated fn
        onHoverKeyChange: PropTypes.func, // @controllable generated fn

        greatPlaces: PropTypes.array
      };

      static defaultProps = {
        center: [25.7877390574819, -80.1408648490906],
        zoom: 14,
        greatPlaces: [
          {id: 'A', lat: 59.955413, lng: 30.337844},
          {id: 'B', lat: 59.724, lng: 30.080}
        ]
      };

      shouldComponentUpdate = shouldPureComponentUpdate;
    constructor() {
        super();
        this.state = {
            _id: '',
            name: '',
            status: false
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        }

        this.toggleStatus = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.checked });
            this.setState(newState);
        }

        this.updateTour = (e) => {
            e.preventDefault();

            const tour = Object.assign({}, this.state);

            console.log(tour);

            this.props.onTourSubmit(tour)
        }
    }

    _onBoundsChange = (center, zoom /* , bounds, marginBounds */) => {
        this.props.onCenterChange(center);
        this.props.onZoomChange(zoom);
      }

      _onChildClick = (key, childProps) => {
        this.props.onCenterChange([childProps.lat, childProps.lng]);
      }

      _onChildMouseEnter = (key /*, childProps */) => {
        this.props.onHoverKeyChange(key);
      }

      _onChildMouseLeave = (/* key, childProps */) => {
        this.props.onHoverKeyChange(null);
      }
    componentWillMount() {
        this.props.onLoad(agent.Tours.get(this.props.params.id))
        this.props.onLangsLoaded(agent.Languages.actives())
        this.props.onWaypointsLoaded(agent.Waypoints.all(this.props.params.id))

        Object.assign(this.state, {
            _id: this.props.tour._id,
            name: this.props.tour.name,
            status: this.props.tour.status
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            _id: nextProps.tour._id,
            name: nextProps.tour.name,
            status: nextProps.tour.status
        }));
    }
    render() {
        const waypoints = this.props.waypoints
          .map(waypoint => {
            const {_id, name, ...coords} = waypoint;

            return (
              <MyGreatPlaceWithControllableHover
                key={_id}
                {...coords}
                text={name}
                // use your hover state (from store, react-controllables etc...)
                hover={this.props.hoverKey === _id} />
            );
          });

          console.log(waypoints)
        return <div>
            <h2>{this.state.name}</h2>
            <p><small>{new Date(this.props.tour.createdAt).toDateString()}</small></p>
            <Form onSubmit={this.updateTour}>
                <FormGroup row>
                    <Label for='name' sm={3}>Name</Label>
                    <Col sm={9}>
                        <Input type='text' value={this.state.name} onChange={this.updateState('name')} name='name' id='name' required/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='orderBy' sm={3}>Available languages</Label>
                    <Col sm={9}>
                        <Input type='select' name='selectMulti' id='exampleSelectMulti' multiple>
                            { this.props.langsActive.map(lang => {
                                return (
                                    <option key={lang._id}>{lang.name}</option>
                                    )
                                })
                            }
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='status' sm={3}>Status</Label>
                    <Col sm={9}>
                        <Input type='checkbox' checked={this.state.status} onChange={this.toggleStatus('status')} name='status' id='status'/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm={12}>Waypoints</Col>
                    <Col className='map' sm={12}>
                        <GoogleMap
                            bootstrapURLKeys={'AIzaSyBFVKi5ynE6HyuzGMfQMv5cQkOmHblGXQQ'}
                            center={this.props.center}
                            zoom={this.props.zoom}
                            hoverDistance={K_SIZE / 2}
                            onBoundsChange={this._onBoundsChange}
                            onChildClick={this._onChildClick}
                            onChildMouseEnter={this._onChildMouseEnter}
                            onChildMouseLeave={this._onChildMouseLeave}>
                            {waypoints}
                          </GoogleMap>
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Button className='btn btn-success'>Update</Button>
                    </Col>
                </FormGroup>
            </Form>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tour)
