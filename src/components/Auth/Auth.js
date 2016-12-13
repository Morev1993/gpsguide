import React, { Component } from 'react'
import './Auth.scss'

export default class Auth extends Component {
	render() {
		return <div className='auth'>
			<div className='row'>
				<div className='col-sm-offset-1 col-sm-6'>
					<h1>Login page</h1>
					<form>
						<div className='form-group'>
							<input className='form-control'/>
						</div>
						<div className='form-group'>
							<input className='form-control'/>
						</div>
						<div className='form-group'>
							<button className='btn btn-success' type='submit'>Login</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	}
}