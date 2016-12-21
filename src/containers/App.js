import React, { Component } from 'react'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import { connect } from 'react-redux'
import agent from '../agent'

const mapStateToProps = state => ({
    appName: state.appName,
    tours: [],
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
})

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: 'APP_LOAD', payload, token }),
  onRedirect: () =>
    dispatch({ type: 'REDIRECT' })

});

class App extends Component {
    componentWillMount() {
        const token = window.localStorage.getItem('jwt');

        if (!token) { 
          this.context.router.push('/auth');
        }

        agent.setToken(token);
      }
    componentWillReceiveProps(nextProps) {
        if (nextProps.redirectTo) {
          this.context.router.replace(nextProps.redirectTo);
          this.props.onRedirect();
        }
      }
    render() {
        return (
            <div>
                {this.props.location.pathname !== '/auth' ?
                    <Breadcrumbs></Breadcrumbs> : ''}
                <div className='container'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

App.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
