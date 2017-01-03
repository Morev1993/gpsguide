import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import agent from '../../agent'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col, Table, ButtonGroup } from 'reactstrap'
import shouldPureComponentUpdate from 'react-pure-render/function'
import controllable from 'react-controllables'

import GoogleMap from 'google-map-react'
import MyGreatPlaceWithControllableHover from './my_great_place_with_controllable_hover.js'
import {K_SIZE} from './my_great_place_with_controllable_hover_styles.js'
import ListErrors from '../ListErrors'

import './waypoint.scss'

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
    onWaypointCreate: (payload) => {
        dispatch({ type: 'CREATE_WAYPOINT', payload: agent.Waypoints.create(payload) })
    },
    onFilesCreate: (payload) => {
        dispatch({ type: 'CREATE_FILES', payload: agent.Waypoints.createFiles(payload) })
    },
    onWaypointUpdate: (payload) => {
        dispatch({ type: 'UPDATE_WAYPOINT', payload: agent.Waypoints.update(payload) })
    },
    onWaypointDelete: (payload) => {
        dispatch({ type: 'DELETE_WAYPOINT', payload: agent.Waypoints.delete(payload) })
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
            status: false,
            wayModal: false,
            filesModal: false,
            languages: [],
            waypoints: [],
            waypoint: {},
            mapShowed: true
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        }

        this.updateWaypointState = field => ev => {
            const state = this.state.waypoint;
            let value
            let newState
            if (field === 'uploadFile') {
                value = ev.target.files[0]
                newState = Object.assign({}, state, {
                    [field]: value
                });
            } else {
                value = ev.target.value
                newState = Object.assign({}, state, {
                    [field]: value
                });
            }

            this.setState({
                waypoint: newState
            });
        }

        this.toggleStatus = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.checked });
            this.setState(newState);
        }

        this.updateTour = (e) => {
            e.preventDefault();

            const tour = Object.assign({}, this.state);

            this.props.onTourSubmit(tour)
        }

        this.editWaypoint = (e) => {
            e.preventDefault();

            const waypoint = Object.assign({}, this.state.waypoint);

            if (this.state.wayOperation === 'create') {
                this.props.onWaypointCreate(this.state)
            } else {
                this.props.onWaypointUpdate(waypoint)
            }

            this.props.onWaypointsLoaded(agent.Waypoints.all(this.props.params.id))

            this.wayToggle();
        }

        this.editFiles = (e) => {
            e.preventDefault();

            this.props.onFilesCreate(this.state)

            this.filesToggle();
        }

        this.updateStateMultiSelect = field => {
            var node = ReactDOM.findDOMNode(this.refs.languages);
            var options = [].slice.call(node.querySelectorAll('option'));
            var selected = options.filter(function (option) {
                return option.selected;
            });
            var selectedValues = selected.map(function (option) {
                return option.getAttribute('data-id');
            });

            const state = this.state;
            const newState = Object.assign({}, state, { [field]: selectedValues });
            this.setState(newState);
        }
    }

    _onBoundsChange = (center, zoom /* , bounds, marginBounds */) => {
        this.props.onCenterChange(center);
        this.props.onZoomChange(zoom);
      }

      _onChildClick = (key, childProps) => {
          console.log(childProps)
        this.props.onCenterChange([childProps.lat, childProps.lng]);
      }

      _onChildMouseEnter = (key /*, childProps */) => {
        this.props.onHoverKeyChange(key);
      }

      _onChildMouseLeave = (/* key, childProps */) => {
        this.props.onHoverKeyChange(null);
      }

      _onClick = ({lat, lng, event}) => {
        if (event.target.closest('.hint')) {
            return;
        }

        this.openCreateWaypointModal(lat, lng);
      }

    openCreateWaypointModal(lat, lng) {
          this.setState(Object.assign({}, this.state, {
              wayModal: true,
              filesModal: false,
              wayOperation: 'create',
              waypoint: {
                  lat: lat || '',
                  lng: lng || ''
              }
          }));
    }

    openCreateFilesModal() {
          this.setState(Object.assign({}, this.state, {
              wayModal: false,
              filesModal: true,
              filesOperation: 'create'
          }));
    }

    componentWillMount() {
        this.props.onLoad(agent.Tours.get(this.props.params.id))
        this.props.onLangsLoaded(agent.Languages.actives())
        this.props.onWaypointsLoaded(agent.Waypoints.all(this.props.params.id))

        Object.assign(this.state, {
            _id: this.props.tour._id,
            name: this.props.tour.name,
            status: this.props.tour.status,
            waypoints: this.props.waypoints,
            mapShowed: true
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            _id: nextProps.tour._id,
            name: nextProps.tour.name,
            status: nextProps.tour.status,
            waypoints: nextProps.waypoints,
            mapShowed: true
        }));
    }

    wayToggle() {
        this.setState({
            wayModal: !this.state.wayModal
        });
    }

    filesToggle() {
        this.setState({
            filesModal: !this.state.filesModal
        });
    }

    openEditWaypointModal(waypoint) {
        this.setState(Object.assign({}, this.state, {
            wayModal: true,
            wayOperation: 'edit',
            waypoint: waypoint
        }));
    }

    openEditFilesModal(waypoint) {
        this.setState(Object.assign({}, this.state, {
            filesModal: true,
            filesOperation: 'edit',
            waypoint: waypoint
        }));
    }

    deleteWaypoint(waypoint) {
        this.props.onWaypointDelete(waypoint);
        this.props.onWaypointsLoaded(agent.Waypoints.all(this.props.params.id))
    }
    showMap() {
        this.setState(Object.assign({}, this.state, {
            mapShowed: true
        }));
    }
    showList() {
        this.setState(Object.assign({}, this.state, {
            mapShowed: false
        }));
    }
    render() {
        const waypoints = this.state.waypoints
          .map(waypoint => {
            const {_id, name, ...coords} = waypoint;

            return (
              <MyGreatPlaceWithControllableHover
                key={_id}
                id={_id}
                openEditWaypointModal={this.openEditWaypointModal.bind(this)}
                openEditFilesModal={this.openEditFilesModal.bind(this)}
                deleteWaypoint={this.deleteWaypoint.bind(this)}
                {...coords}
                waypoint={waypoint}
                hover={this.props.hoverKey === _id} />
            );
          });
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
                        <Input type='select' ref='languages' name='selectMulti' onChange={this.updateStateMultiSelect.bind(this, 'languages')}  id='exampleSelectMulti' multiple>
                            { this.props.langsActive.map(lang => {
                                return (
                                    <option data-id={lang._id} key={lang._id}>{lang.name}</option>
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
                <FormGroup className='waypoints-heading' row>
                    <Col sm={6}>Waypoints</Col>
                    <Col className='t-R' sm={6}>
                        <img onClick={this.showMap.bind(this)} src='/src/assets/map.svg'/>
                        <img onClick={this.showList.bind(this)} src='/src/assets/list.svg'/>
                    </Col>
                </FormGroup>
                { this.state.mapShowed ?
                <FormGroup className='map'>
                    <GoogleMap
                        bootstrapURLKeys={'AIzaSyBFVKi5ynE6HyuzGMfQMv5cQkOmHblGXQQ'}
                        center={this.props.center}
                        zoom={this.props.zoom}
                        hoverDistance={K_SIZE / 2}
                        onBoundsChange={this._onBoundsChange}
                        onChildMouseDown={() => {}}
                        onClick={this._onClick}
                        onChildClick={this._onChildClick}
                        onChildMouseLeave={this._onChildMouseLeave}>
                        {waypoints}
                      </GoogleMap>
                </FormGroup>
                :
                <div>
                    <Table>
                        <thead>
                          <tr>
                            <th>Tour name</th>
                            <th>CreatedAt</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.state.waypoints.map(waypoint => {
                            return (
                                <tr key={waypoint._id}>
                                    <th scope='row'>{waypoint.name}</th>
                                    <td><small>{new Date(waypoint.createdAt).toDateString()}</small></td>
                                    <td className='t-C'>
                                        <ButtonGroup>
                                            <Button color='primary' onClick={this.openEditWaypointModal.bind(this, waypoint)}>Edit waypoint</Button>{' '}
                                            <Button color='secondary' onClick={this.openEditFilesModal.bind(this, waypoint)}>Edit files</Button>{' '}
                                            <Button color='danger' onClick={this.deleteWaypoint.bind(this, waypoint)}>Delete</Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                    <div className='t-R'>
                        <Button onClick={this.openCreateWaypointModal.bind(this)} className='btn btn-primary'>Create waypoint</Button>
                    </div>
                </div>
            }
                <FormGroup check row>
                    <Col sm={{ size: 10}}>
                        <Button className='btn btn-success'>Update</Button>
                    </Col>
                </FormGroup>
            </Form>

            <Modal isOpen={this.state.wayModal} toggle={this.wayToggle.bind(this)} className={this.props.className}>
                <ModalHeader toggle={this.wayToggle.bind(this)}>{this.state.wayOperation} waypoint</ModalHeader>
                <ModalBody>
                    <ListErrors errors={this.props.errors}></ListErrors>
                    <Form onSubmit={this.editWaypoint}>
                        <FormGroup row>
                            <Label for='point-name' sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input type='text' value={this.state.waypoint.name} onChange={this.updateWaypointState('name')} name='point-name' id='point-name' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='lat' sm={3}>Latitude</Label>
                            <Col sm={9}>
                                <Input type='number' step='any' value={this.state.waypoint.lat} onChange={this.updateWaypointState('lat')} name='lat' id='lat'/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='lng' sm={3}>Longitude</Label>
                            <Col sm={9}>
                                <Input type='number' step='any' value={this.state.waypoint.lng} onChange={this.updateWaypointState('lng')} name='lng' id='lng'/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for='direction' sm={3}>Direction</Label>
                          <Col sm={9}>
                              <Input type='select' value={this.state.waypoint.direction}  name='direction' onChange={this.updateWaypointState('direction')}  id='direction'>
                                <option>N</option>
                                <option>S</option>
                                <option>E</option>
                                <option>W</option>
                                <option>SW</option>
                                <option>SE</option>
                                <option>NW</option>
                                <option>NE</option>
                                <option>OD</option>
                              </Input>
                         </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for='overlap' sm={3}>Overlap</Label>
                          <Col sm={9}>
                              <Input type='select' name='overlap' value={this.state.waypoint.overlap} onChange={this.updateWaypointState('overlap')} id='overlap'>
                                <option>ignore</option>
                                <option>interrupt</option>
                                <option>queue</option>
                              </Input>
                         </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='overlap' sm={3}>Tolerance</Label>
                            <Col sm={9}>
                                <Input type='number' value={this.state.waypoint.tolerance} onChange={this.updateWaypointState('tolerance')} name='tolerance' id='tolerance' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='delay' sm={3}>Delay</Label>
                            <Col sm={9}>
                                <Input type='number' value={this.state.waypoint.delay} onChange={this.updateWaypointState('delay')} name='delay' id='delay' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='radius' sm={3}>Radius</Label>
                            <Col sm={9}>
                                <Input type='number' value={this.state.waypoint.radius} onChange={this.updateWaypointState('radius')} name='radius' id='radius' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='orderBy' sm={3}>OrderBy</Label>
                            <Col sm={9}>
                                <Input type='number' value={this.state.waypoint.orderBy} onChange={this.updateWaypointState('orderBy')} name='orderBy' id='orderBy' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10, offset: 2 }}>
                                <Button className='btn btn-success'>Send</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.filesModal} toggle={this.filesToggle.bind(this)} className={this.props.className}>
                <ModalHeader toggle={this.filesToggle.bind(this)}>{this.state.filesOperation} files</ModalHeader>
                <ModalBody>
                    <ListErrors errors={this.props.errors}></ListErrors>
                    <Form onSubmit={this.editFiles}>
                        <FormGroup row>
                            <Label for='uploadFile' sm={3}>Audio files</Label>
                            <Col sm={9}>
                                <Input type='file' name='uploadFile' onChange={this.updateWaypointState('uploadFile')} id='uploadFile' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10, offset: 2 }}>
                                <Button className='btn btn-success'>Send</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    }
}

(function() {
  if (!Element.prototype.closest) {

    // реализуем
    Element.prototype.closest = function(css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }

})();

export default connect(mapStateToProps, mapDispatchToProps)(Tour)
