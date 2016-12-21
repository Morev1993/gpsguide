import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'

const mapStateToProps = state => ({
    appName: state.appName,
    tours: state.tours.tours
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        console.log(payload);
        dispatch({ type: 'TOURS_PAGE_LOADED', payload})
    }
})

class Tours extends Component {
    componentWillMount() {
        this.props.onLoad(agent.Tours.all())
    }
    render() {
        console.log(this.props)
        return <div>
            <h2>Tours</h2>
            <div>
                {!this.props.tours.length ? 'No data' : ''}
                { this.props.tours.map(tour => {
                    return (
                        <div key={tour._id}>
                            <h4>
                                <Link to={`/tours/${tour._id}`}>{tour.name}</Link>
                            </h4>
                            <p><small>{new Date(tour.createdAt).toDateString()}</small></p>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tours)
