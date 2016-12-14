import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class Scene extends Component {
	render() {
		return <div>
			<h2>Scene {this.props.params.sceneId} - Detail</h2>
			<p><small>{new Date().toDateString()}</small></p>
			<img className='img-fluid' src='http://placehold.it/1000x600'/>
		</div>
	}
}

export default connect(mapStateToProps, () => ({}))(Scene)
