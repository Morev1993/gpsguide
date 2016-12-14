import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Main extends Component {
    render() {
        return <div>
            <ol className='breadcrumb'>
                <li className='breadcrumb-item'>
                    <Link to='/admin/dashboard'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/admin/tours'>Tours</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/admin/devices'>Devices</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/admin/languages'>Languages</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/auth'>Auth</Link>
                </li>
            </ol>
        </div>
    }
}
