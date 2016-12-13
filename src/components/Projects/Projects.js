import React, { Component } from 'react'

export default class Projects extends Component {
	render() {
		return <div>
			<h1>Projects</h1>
			<div className='row'>
				<div className='col-sm-3 item'>
					<p>
						<img className='img-responsive' src='http://placehold.it/300x300'/>
					</p>
					<h4>
						<a href='#'>Project Name</a>
					</h4>
					<p><small>{new Date().toString()}</small></p>
				</div>
			</div>
		</div>
	}
}