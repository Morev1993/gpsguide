import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class Device extends Component {
	render() {
		return <div>
			<h2>Device</h2>
			<p><small>{new Date().toDateString()}</small></p>
		</div>
	}
}

export default connect(mapStateToProps, () => ({}))(Device)
