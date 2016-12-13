import React, { Component } from 'react'

export default class UserMenu extends Component {
	render() {
		return <div className='user-menu'>
			<h3>Igor Morev</h3>
			<ul className='list-unstyled'>
				<li>
					<a href='#'>Create project</a>
				</li>
				<li>
					<a href='#'>Logout</a>
				</li>
			</ul>
		</div>
	}
}