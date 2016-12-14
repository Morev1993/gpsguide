import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class App extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

App.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, () => ({}))(App)