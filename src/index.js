import './styles/app.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory, IndexRedirect } from 'react-router'

import App from './containers/App'
import Auth from './components/Auth/Auth'
import Projects from './components/Projects/Projects'
import Main from './components/Main/Main'
import SceneList from './components/SceneList/SceneList'
import Scene from './components/Scene/Scene'
import NotFound from './components/NotFound/NotFound'
import store from './store'

render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Main} />
                <IndexRedirect to='/main/projects'/>
                <Route path='auth' component={Auth} />
                <Route path='main' component={Main}>
                    <IndexRoute component={Projects} />
                    <Route path='projects' component={Projects}/>
                    <Route path='projects/:projectId/scenes' component={SceneList} />
                    <Route path='projects/:projectId/scenes/:sceneId' component={Scene} />
                </Route>
                <Route path='*' component={NotFound} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
