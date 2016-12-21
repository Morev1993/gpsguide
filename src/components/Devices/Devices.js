import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col } from 'reactstrap'

const mapStateToProps = state => ({
    devices: state.devices.devices || []
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: 'DEVICES_PAGE_LOADED', payload }),
    onSubmit: (payload) => {
        dispatch({ type: 'CREATE_DEVICE', payload: agent.Devices.create(payload) })
    },
    onDelete: (payload) => {
        dispatch({ type: 'DELETE_DEVICE', payload: agent.Devices.delete(payload) })
    }
})

class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
          authCode: '',
          name: '',
          orderBy: 0
        };

        this.toggle = this.toggle.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeAuthCode = this.changeAuthCode.bind(this);
        this.changeOrderBy = this.changeOrderBy.bind(this);

        this.createDevice = e => {
            e.preventDefault();

            const device = {
                name: this.state.name,
                authCode: this.state.authCode,
                orderBy: this.state.orderBy
              };
            this.props.onSubmit(device);
            this.props.onLoad(agent.Devices.all())

            this.setState({
              modal: false
            });
        }

        this.toggle = this.toggle.bind(this);
      }

      changeName(e) {
          this.setState({
            name: e.target.value
          });
      }

      changeAuthCode(e) {
          this.setState({
            authCode: e.target.value
          });
      }

      changeOrderBy(e) {
          this.setState({
            orderBy: e.target.value
          });
      }

      toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
    componentWillMount() {
        this.props.onLoad(agent.Devices.all())
        this.deleteDevice = id => {
            this.props.onDelete(id)
            this.props.onLoad(agent.Devices.all())
        }
    }
    render() {
        return <div>
            <div>
                <h2>Devices</h2>
            </div>
            <div>
                {!this.props.devices.length ? 'No data' : ''}
                { this.props.devices.map(device => {
                    return (
                        <div key={device._id}>
                            <h4>
                                <Link to={`/devices/${device._id}`}>{device.name}</Link>
                            </h4>
                            <p>Code: {device.authCode}</p>
                            <p><Button color='danger' onClick={this.deleteDevice.bind(this, device._id)}>Del</Button></p>
                            <p><small>{new Date(device.createdAt).toDateString()}</small></p>
                        </div>
                        )
                    })
                }
            </div>
            <div>
                <Button color='primary' onClick={this.toggle}>Add new</Button>
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>New device</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.createDevice}>
                        <FormGroup row>
                            <Label for='name' sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input type='text' value={this.state.name} onChange={this.changeName} name='name' id='name' placeholder='device name' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='AuthCode' sm={3}>Auth code</Label>
                            <Col sm={9}>
                                <Input type='number' value={this.state.authCode} onChange={this.changeAuthCode} name='AuthCode' id='AuthCode' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='orderBy' sm={3}>OrderBy</Label>
                            <Col sm={9}>
                                <Input type='number' name='orderBy' id='orderBy' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10, offset: 2 }}>
                                <Button>Submit</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)
