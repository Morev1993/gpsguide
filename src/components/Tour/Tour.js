import React, { Component } from 'react'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap'

const mapStateToProps = state => ({
    tour: state.tours.tour || {}
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: 'TOUR_DETAIL_LOADED', payload })
    },
    onSubmit: (payload) => {
        dispatch({ type: 'UPDATE_TOUR', payload: agent.Tours.update(payload) })
    },
    onDelete: (payload) => {
        dispatch({ type: 'DELETE_TOUR', payload: agent.Tours.delete(payload) })
    }
})

class Tour extends Component {
    constructor() {
        super();
        this.state = {
            _id: '',
          name: '',
          status: false
        };

        this.updateState = field => ev => {
          const state = this.state;
          const newState = Object.assign({}, state, { [field]: ev.target.value });
          this.setState(newState);
        }

        this.toggleStatus = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.checked });
            this.setState(newState);
        }

        this.updateTour = (e) => {
            e.preventDefault();

            const tour = Object.assign({}, this.state);

            console.log(tour);

            this.props.onSubmit(tour)
        }
    }
    componentWillMount() {
        this.props.onLoad(agent.Tours.get(this.props.params.id))

        Object.assign(this.state, {
            _id: this.props.tour._id,
            name: this.props.tour.name,
            status: this.props.tour.status
          });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            _id: nextProps.tour._id,
          name: nextProps.tour.name,
          status: nextProps.tour.status
        }));
      }
	render() {
		return <div>
            <p><small>{new Date(this.props.tour.createdAt).toDateString()}</small></p>
            <Form onSubmit={this.updateTour}>
                <FormGroup row>
                    <Label for='name' sm={3}>Name</Label>
                    <Col sm={9}>
                        <Input type='text' value={this.state.name} onChange={this.updateState('name')} name='name' id='name' placeholder='tour name' required/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='orderBy' sm={3}>Available languages</Label>
                    <Col sm={9}>
                        English
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='status' sm={3}>Status</Label>
                    <Col sm={9}>
                        <Input type='checkbox' checked={this.state.status} onChange={this.toggleStatus('status')} name='status' id='status'/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm={12}>Waypoints</Col>
                    <Col sm={12}>
                        Map
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Button>Update</Button>
                    </Col>
                </FormGroup>
            </Form>
		</div>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Tour)
