import React, { Component } from 'react'
//import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class Languages extends Component {
    render() {
        return <div>
            <h2>Languages</h2>
        </div>
    }
}

export default connect(mapStateToProps, () => ({}))(Languages)
