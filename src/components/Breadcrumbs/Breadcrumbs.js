import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class Main extends Component {
    render() {
        return <div>
            {this.props.currentLocation}
            <ol className='breadcrumb'>
                <li className='breadcrumb-item'>
                    <Link to='/'>Dashboard</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/tours'>Tours</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/devices'>Devices</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/languages'>Languages</Link>
                </li>
                <li className='breadcrumb-item'>
                    <Link to='/auth'>Auth</Link>
                </li>
            </ol>
        </div>
    }
}

export default connect(mapStateToProps, () => ({}))(Main)