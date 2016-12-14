import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Main extends Component {
    render() {
        return <div>
            <ol className='breadcrumb'>
                <li className='breadcrumb-item'>
                    <Link to='/auth'>Login</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/main/projects'>Projects</Link>
                </li>
            </ol>
        </div>
    }
}