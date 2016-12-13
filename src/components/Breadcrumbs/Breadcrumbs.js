import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Main extends Component {
    render() {
        return <div>
            <ul className='breadcrumb'>
                <li><Link to='/auth'>Login</Link></li>
                <li><Link to='/projects'>Projects</Link></li>
            </ul>
        </div>
    }
}