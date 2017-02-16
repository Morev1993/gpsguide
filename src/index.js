import './styles/app.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from './containers/App'
import Auth from './components/Auth/Auth'
import Tours from './components/Tours/Tours'
import Tour from './components/Tour/Tour'
import Dashboard from './components/Dashboard/Dashboard'
import Devices from './components/Devices/Devices'
import Device from './components/Device/Device'
import Languages from './components/Languages/Languages'
import NotFound from './components/NotFound/NotFound'
import store from './store'

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Dashboard} />
                <Route path='auth' component={Auth} />
                <Route path='tours' component={Tours} />
                <Route path='tours/:id' component={Tour} />
                <Route path='tours/:id/edit' component={Tour} />
                <Route path='devices/:id' component={Device} />
                <Route path='devices' component={Devices} />
                <Route path='languages' component={Languages} />
                <Route path='*' component={NotFound} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
