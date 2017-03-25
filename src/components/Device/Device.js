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
		return <div>
            <h2>
                <p>Device</p>
                <Link to={`/devices/${this.props.routeParams.id}/edit`} activeClassName='active'>edit</Link>{' '}
                <Link to={`/devices/${this.props.routeParams.id}/tours`} activeClassName='active'>tours</Link>
            </h2>
            {this.props.children}
		</div>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Device)
