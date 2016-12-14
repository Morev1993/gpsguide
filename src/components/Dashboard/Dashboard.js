import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class Dashboard extends Component {
	render() {
		return <div>
			<h2>Dashboard</h2>
		</div>
	}
}

export default connect(mapStateToProps, () => ({}))(Dashboard)
