import './styles/app.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import Auth from './components/Auth/Auth'
import Projects from './components/Projects/Projects'
import NotFound from './components/NotFound/NotFound'
import store from './store'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Projects} />
                <Route path='auth' component={Auth} />
                <Route path='projects' component={Projects} />
                <Route path='*' component={NotFound} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
