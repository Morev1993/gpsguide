import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    appName: state.appName
})

class Devices extends Component {
    render() {
        return <div>
            <h2>Devices</h2>
            <div className='row'>
                <div className='col-sm-3 item'>
                    <p>
                        <Link to={`/main/projects/${this.props.params.projectId}/scenes/1`}>
                            <img className='img-thumbnail' src='http://placehold.it/200x200'/>
                        </Link>
                    </p>
                    <h4>
                        <Link to={`/main/projects/${this.props.params.projectId}/scenes/1`}>Scene Name</Link>
                    </h4>
                    <p><small>{new Date().toDateString()}</small></p>
                </div>
                <div className='col-sm-3 item'>
                    <p>
                        <Link to={`/main/projects/${this.props.params.projectId}/scenes/2`}>
                            <img className='img-thumbnail' src='http://placehold.it/200x200'/>
                        </Link>
                    </p>
                    <h4>
                        <Link to={`/main/projects/${this.props.params.projectId}/scenes/2`}>Scene Name</Link>
                    </h4>
                    <p><small>{new Date().toDateString()}</small></p>
                </div>
            </div>
        </div>
    }
}

export default connect(mapStateToProps, () => ({}))(Devices)
