import React, { Component } from 'react'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import UserMenu from '../UserMenu/UserMenu'
import { connect } from 'react-redux'
import agent from '../../agent'

const mapStateToProps = state => ({
    appName: state.appName,
    projects: state.projects
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: 'MAIN_PAGE_LOADED', payload})
    }
})

class Main extends Component {
    componentWillMount() {
        this.props.onLoad(agent.Projects.all())
    }
    render() {
        return <div>
            <div className='typepage'>
                <div className='container'>
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
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)