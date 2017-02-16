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
    waypoints: state.tours.waypoints || [],
    files: state.tours.files || []
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
    onFilesCreate: payload => {
        dispatch({ type: 'CREATE_FILES', payload: agent.Files.createFiles(payload) })
    },
    onFilesLoaded: (payload) => {
        dispatch({ type: 'GET_FILES', payload: agent.Files.getFiles(payload) })
    },
    onFileDelete: (payload) => {
        dispatch({ type: 'DELETE_FILE', payload: agent.Files.delete(payload) })
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
        center: PropTypes.array,
        zoom: PropTypes.number,
        hoverKey: PropTypes.string,
        clickKey: PropTypes.string,
        onCenterChange: PropTypes.func,
        onZoomChange: PropTypes.func,
        onHoverKeyChange: PropTypes.func,

        greatPlaces: PropTypes.array
      };

      static defaultProps = {
        center: [25.7877390574819, -80.1408648490906],
        zoom: 14
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
            files: [],
            waypoint: {},
            mapShowed: true
        };

        this.files = {}

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        }

        this.updateWaypointState = (field, lang) => ev => {
            let value
            let newState
            const state = this.state.waypoint;
            if (field === 'uploadFiles') {
                value = ev.target.files[0]

                this.files[lang.id] = {
                    file: value,
                    langCode: lang.code
                }

                newState = Object.assign({}, state, {
                    [field]: this.files
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

            if (this.state.wayOperation === 'create') {
                this.props.onWaypointCreate(this.state)
            } else {
                const waypoint = Object.assign({}, this.state.waypoint);
                this.props.onWaypointUpdate(waypoint)
            }


            this.wayToggle();
        }

        this.addFilesSubmit = (e) => {
            e.preventDefault();

            this.props.onFilesCreate(this.state)

            this.filesToggle();
        }

        this.deleteFile = (state, fileId) => {
            let payload = {
                state: state,
                fileId: fileId
            }
            this.props.onFileDelete(payload);
        }

        this.updateStateMultiSelect = field => {
            var node = ReactDOM.findDOMNode(this.refs.languages);
            var options = [].slice.call(node.querySelectorAll('option'));
            var selected = options.filter(function (option) {
                return option.selected;
            });

            var selectedValues = selected.map(function (option) {
                return option.value;
            });

            const state = this.state;
            const newState = Object.assign({}, state, { [field]: selectedValues });
            this.setState(newState);
        }
    }

    _onBoundsChange = (center, zoom) => {
        this.props.onCenterChange(center);
        this.props.onZoomChange(zoom);
    }

    _onChildClick = (key, childProps) => {
        this.props.onCenterChange([childProps.lat, childProps.lng]);
    }

    _onChildMouseEnter = (key) => {
        this.props.onHoverKeyChange(key);
    }

    _onChildMouseLeave = () => {
        this.props.onHoverKeyChange(null);
    }

    _onClick = ({ lat, lng, event }) => {
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

    componentWillMount() {
        this.props.onLoad(agent.Tours.get(this.props.params.id))
        this.props.onLangsLoaded(agent.Languages.actives())
        this.props.onWaypointsLoaded(agent.Waypoints.all(this.props.params.id))

        Object.assign(this.state, {
            _id: this.props.tour._id,
            name: this.props.tour.name,
            status: this.props.tour.status,
            languages: this.props.tour.languages,
            waypoints: this.props.waypoints,
            files: this.props.files
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            _id: nextProps.tour._id,
            name: nextProps.tour.name,
            status: nextProps.tour.status,
            languages: nextProps.tour.languages,
            waypoints: nextProps.waypoints,
            files: nextProps.files
        }));
    }

    wayToggle() {
        this.setState(Object.assign({}, {
            wayModal: !this.state.wayModal
        }));
    }

    filesToggle() {
        this.setState(Object.assign({}, this.state, {
            filesModal: !this.state.filesModal
        }));
    }

    openEditWaypointModal(waypoint) {
        this.setState(Object.assign({}, this.state, {
            wayModal: true,
            wayOperation: 'edit',
            waypoint: waypoint
        }));
    }

    openEditFilesModal(waypoint) {
        this.files = {};
        const newState = Object.assign({}, this.state, {
            filesModal: true,
            waypoint: waypoint
        });
        if (!newState.languages.length) {
            console.log('need langs');
            return;
        }
        this.setState(newState)
        this.props.onFilesLoaded(newState)
    }

    deleteWaypoint(waypoint) {
        this.props.onWaypointDelete(waypoint);
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

          let selectedLangs = this.props.langsActive
             .filter(lang => {
                 if (this.state.languages.indexOf(lang.id) != -1) {
                     return lang
                 }
             })



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
                                    <option selected={this.state.languages.indexOf(lang.id) != -1} key={lang.id} value={lang.id}>{lang.name}</option>
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
                        <img onClick={this.showMap.bind(this)} src='/assets/map.svg'/>
                        <img onClick={this.showList.bind(this)} src='/assets/list.svg'/>
                    </Col>
                </FormGroup>
                { this.state.mapShowed ?
                <FormGroup className='map'>
                    <GoogleMap
                        bootstrapURLKeys={{
                            key: 'AIzaSyCOMNCPL5zmbgk2riCy7luNk-Z5zxmFGpQ'
                        }}
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
                                            <Button type='button' color='primary' onClick={this.openEditWaypointModal.bind(this, waypoint)}>Edit waypoint</Button>{' '}
                                            <Button type='button'  color='secondary' onClick={this.openEditFilesModal.bind(this, waypoint)}>Edit files</Button>{' '}
                                            <Button ctype='button' color='danger' onClick={this.deleteWaypoint.bind(this, waypoint)}>Delete</Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                    <div className='t-R'>
                        <Button type='button' onClick={this.openCreateWaypointModal.bind(this)} className='btn btn-primary'>Create waypoint</Button>
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
                                <Input type='number' step='any' value={this.state.waypoint.lat} onChange={this.updateWaypointState('lat')} name='lat' id='lat' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='lng' sm={3}>Longitude</Label>
                            <Col sm={9}>
                                <Input type='number' step='any' value={this.state.waypoint.lng} onChange={this.updateWaypointState('lng')} name='lng' id='lng' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for='direction' sm={3}>Direction</Label>
                          <Col sm={9}>
                              <Input type='select' value={this.state.waypoint.direction}  name='direction' onChange={this.updateWaypointState('direction')}  id='direction'>
                                <option value='N'>N</option>
                                <option value='S'>S</option>
                                <option value='E'>E</option>
                                <option value='W'>W</option>
                                <option value='SW'>SW</option>
                                <option value='SE'>SE</option>
                                <option value='NW'>NW</option>
                                <option value='NE'>NE</option>
                                <option value='OD'>OD</option>
                              </Input>
                         </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for='overlap' sm={3}>Overlap</Label>
                          <Col sm={9}>
                              <Input type='select' name='overlap' value={this.state.waypoint.overlap} onChange={this.updateWaypointState('overlap')} id='overlap'>
                                <option value='ignore'>ignore</option>
                                <option value='interrupt'>interrupt</option>
                                <option value='queue'>queue</option>
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
                <ModalHeader toggle={this.filesToggle.bind(this)}>Audio files</ModalHeader>
                <ModalBody>
                    <ListErrors errors={this.props.errors}></ListErrors>
                    <Form onSubmit={this.addFilesSubmit}>

                        { selectedLangs.map((lang, i) => {
                                if (!this.state.files[i]) {
                                    return (
                                        <div key={lang.id}>
                                            <FormGroup row>
                                                <Label for='uploadFile' sm={3}>{lang.name}</Label>
                                                <Col sm={9}>
                                                    <Input type='file' name='uploadFiles[]' onChange={this.updateWaypointState('uploadFiles', lang)} id='uploadFile' required/>
                                                </Col>
                                            </FormGroup>
                                            { i === selectedLangs.length - 1 ?
                                            <FormGroup row>
                                                <Col className='t-R' sm={{ size: 12, offset: 0 }}>
                                                    <Button className='btn btn-success'>Send</Button>
                                                </Col>
                                            </FormGroup>
                                            : '' }
                                        </div>
                                    )
                                } else {
                                    return (
                                        <FormGroup key={lang.id}  row>
                                            <Label for='uploadFile' sm={2}>{lang.name}</Label>
                                            <Col sm={6}>
                                                <video controls>
                                                    <source src={this.state.files[i].path} type='audio/mp3'/>
                                                </video>
                                            </Col>
                                            <Col className='t-C' sm={4}>
                                                <Button type='button' onClick={this.deleteFile.bind(this, this.state, this.state.files[i]._id)} color='danger'>Delete</Button>
                                            </Col>
                                        </FormGroup>
                                    )
                                }
                            })
                        }
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
