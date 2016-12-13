import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserMenu from '../components/UserMenu/UserMenu'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'

const mapStateToProps = state => ({
    appName: state.appName
})

class App extends Component {
    render() {
        return (
            <div className='container'>
                <div className='typepage'>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <h1>{this.props.appName}</h1>
                            <Breadcrumbs></Breadcrumbs>
                            {this.props.children}
                        </div>
                        <div className='col-sm-3'>
                            <UserMenu/>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

App.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, () => ({}))(App)