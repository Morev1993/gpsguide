import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName,
    projects: state.projects
})

class Projects extends Component {
	render() {
		return <div>
			<h2>Tours</h2>
			<div className='row'>
				{ this.props.projects.map(project => {
					return (
						<div key={project._id} className='col-sm-3 item'>
							<p>
								<Link to={`/main/projects/${project._id}/scenes`}>
									<img className='img-thumbnail' src={project.picture}/>
								</Link>
							</p>
							<h4>
								<Link to={`/main/projects/${project._id}/scenes`}>{project.name}</Link>
							</h4>
							<p><small>{new Date(project.createdDate).toDateString()}</small></p>
						</div>
						)
					})
				}	
			</div>
		</div>
	}
}

export default connect(mapStateToProps, () => ({}))(Projects)