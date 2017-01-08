import React, { Component } from 'react'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap'

const mapStateToProps = state => ({
    device: state.devices.device || {}
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: 'DEVICE_DETAIL_LOADED', payload })
    },
    onSubmit: (payload) => {
        dispatch({ type: 'UPDATE_DEVICE', payload: agent.Devices.update(payload) })
    },
    onDelete: (payload) => {
        dispatch({ type: 'DELETE_DEVICE', payload: agent.Devices.delete(payload) })
    }
})

class Device extends Component {
    constructor() {
        super();
        this.state = {
            _id: '',
          name: '',
          authCode: '',
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

        this.updateDevice = (e) => {
            e.preventDefault();

            const device = Object.assign({}, this.state);


            this.props.onSubmit(device)
        }
    }
    componentWillMount() {
        this.props.onLoad(agent.Devices.get(this.props.params.id))

        Object.assign(this.state, {
            _id: this.props.device._id,
            name: this.props.device.name,
            authCode: this.props.device.authCode,
            status: this.props.device.status
          });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            _id: nextProps.device._id,
          name: nextProps.device.name,
          authCode: nextProps.device.authCode,
          status: nextProps.device.status
        }));
      }
	render() {
		return <div>
            <h2>{this.state.name}</h2>
            <p><small>{new Date(this.props.device.createdAt).toDateString()}</small></p>
            <Form onSubmit={this.updateDevice}>
                <FormGroup row>
                    <Label for='name' sm={3}>Name</Label>
                    <Col sm={9}>
                        <Input type='text' value={this.state.name} onChange={this.updateState('name')} name='name' id='name' required/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='authCode' sm={3}>Auth code</Label>
                    <Col sm={9}>
                        <Input type='text' value={this.state.authCode} onChange={this.updateState('authCode')} name='authCode' id='authCode' required/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='device' sm={3}>Device name</Label>
                    <Col sm={9}>
                        <Input type='text' value={this.props.device.device} name='device' id='device' disabled/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='name' sm={3}>Version</Label>
                    <Col sm={9}>
                        <Input type='text' value={this.props.device.version} name='version' id='version' disabled/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for='status' sm={3}>Status</Label>
                    <Col sm={9}>
                        <Input type='checkbox' checked={this.state.status} onChange={this.toggleStatus('status')} name='status' id='status'/>
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Button className='btn btn-success'>Update</Button>
                    </Col>
                </FormGroup>
            </Form>
		</div>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Device)
