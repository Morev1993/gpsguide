import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: 'LOGOUT' })
});

class Breadcrumbs extends Component {
    render() {
        return <div className='container top-layout'>
            <ol className='breadcrumb float-xs-left'>
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
            </ol>
            <div className='float-xs-right'>
                <button className='btn btn-danger' onClick={this.props.onClickLogout}>Logout</button> 
            </div>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs)
