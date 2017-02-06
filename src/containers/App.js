import React, { Component } from 'react'
import Header from '../components/Header/Header'
import { connect } from 'react-redux'
import agent from '../agent'
import store from '../store'
import { getCookie } from '../cookie'

const mapStateToProps = state => ({
    appName: state.appName,
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

        checkSession('gps-session', token);

        setInterval(() => {
            checkSession('gps-session', token);
        }, 60000)

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
                    <Header></Header> : ''}
                <div className='container'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

function checkSession(name, token) {
    if (!getCookie(name) || !token) {
        store.dispatch({ type: 'LOGOUT' })
    }
}

App.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
