import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

class Device extends Component {
    constructor() {
        super();
    }
	render() {
        console.log(this.props);
		return <div>
            <h2>
                <p>Device</p>
                <Link to={`/devices/${this.props.routeParams.id}`}>edit</Link>{' '}
                <Link to={`/devices/${this.props.routeParams.id}/tours`}>tours</Link>
            </h2>
            {this.props.children}
		</div>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Device)
