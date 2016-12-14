import './styles/app.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory, IndexRedirect } from 'react-router'

import App from './containers/App'
import Auth from './components/Auth/Auth'
import Tours from './components/Tours/Tours'
import Admin from './components/Admin/Admin'
import Dashboard from './components/Dashboard/Dashboard'
import Devices from './components/Devices/Devices'
import Languages from './components/Languages/Languages'
//import Scene from './components/Scene/Scene'
import NotFound from './components/NotFound/NotFound'
import store from './store'

render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Dashboard} />
                <IndexRedirect to='/admin/dashboard'/>
                <Route path='auth' component={Auth} />
                <Route path='admin' component={Admin}>
                    <IndexRoute component={Dashboard} />
                    <Route path='dashboard' component={Dashboard}/>
                    <Route path='tours' component={Tours} />
                    <Route path='devices' component={Devices} />
                    <Route path='languages' component={Languages} />
                </Route>
                <Route path='*' component={NotFound} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
