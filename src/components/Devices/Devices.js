import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col } from 'reactstrap'

const mapStateToProps = state => ({
    tours: state.tours.tours
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: 'TOURS_PAGE_LOADED', payload})
    }
})

class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false
        };

        this.toggle = this.toggle.bind(this);
      }

      toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
    componentWillMount() {
        this.props.onLoad(agent.Tours.all())
    }
    render() {
        return <div>
            <div>
                <h2>Devices</h2>
            </div>
            <div>
                {!this.props.tours.length ? 'No data' : ''}
                { this.props.tours.map(tour => {
                    return (
                        <div key={tour._id}>
                            <h4>
                                <Link to={`/devices/${tour._id}`}>{tour.name}</Link>
                            </h4>
                            <p><small>{new Date(tour.createdAt).toDateString()}</small></p>
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
                    <Form>
                        <FormGroup row>
                            <Label for='name' sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input type='text' name='name' id='name' placeholder='device name' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='AuthCode' sm={3}>Auth code</Label>
                            <Col sm={9}>
                                <Input type='text' name='AuthCode' id='AuthCode' required/>
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
