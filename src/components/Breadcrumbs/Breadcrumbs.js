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
        return <div className='container'>
            <button className='btn btn-danger' onClick={this.props.onClickLogout}>Logout</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs)
