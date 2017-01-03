import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {greatPlaceStyle, greatPlaceStyleHover} from './my_great_place_with_controllable_hover_styles.js';

export default class MyGreatPlaceWithControllableHover extends Component {
  static propTypes = {
    // use hover from controllable
    hover: PropTypes.bool,
    text: PropTypes.string
  };

  static defaultProps = {};

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  openEditWaypointModal(waypoint, e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.openEditWaypointModal(waypoint, e);
  }

  openEditFilesModal(waypoint, e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.openEditFilesModal(waypoint, e);
  }

  deleteWaypoint(waypoint, e) {
      e.preventDefault();
      this.props.deleteWaypoint(waypoint)
  }

  render() {
    const style = this.props.hover ? greatPlaceStyleHover : greatPlaceStyle;

    function setDirectionalMarker(direction) {
        var imgUrl = `./src/assets/${direction}.svg`
        return <img className='marker-image' src={imgUrl} />
    }
    return (
       <div className='hint hint--html hint--info hint--top' style={style}>
          {setDirectionalMarker(this.props.direction)}
          <div style={{width: 80}} className='hint__content'>
              <p>Name: {this.props.waypoint.name}</p>
              <p>Lat: {this.props.waypoint.lat}</p>
              <p>Long: {this.props.waypoint.lng}</p>
              <p>Direction: {this.props.waypoint.direction}</p>
              <p>
                  <a onClick={this.openEditWaypointModal.bind(this, this.props.waypoint)} href='#'>Edit waypoint</a>{' | '}
                  <a onClick={this.openEditFilesModal.bind(this, this.props.waypoint)} href='#'>Edit files</a>{' | '}
                  <a onClick={this.deleteWaypoint.bind(this, this.props.waypoint)} href='#'>Delete</a>
            
              </p>
          </div>
       </div>
    );
  }
}
