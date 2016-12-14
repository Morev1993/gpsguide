import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, FormText, Col } from 'reactstrap'

class UserMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        }

        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }
    render() {
        return (
            <div className='user-menu'>
                <h2>Igor Morev</h2>
                <ul className='list-group list-unstyled'>
                    <li className='list-group-item'>
                        <Button color='primary' onClick={this.toggle}>Create new tour</Button>
                    </li>
                    <li className='list-group-item'>
                        <Link to='/auth'><Button color='danger'>Logout</Button></Link>
                    </li>
                </ul>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>New tour</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label for='name' sm={2}>Name</Label>
                                <Col sm={10}>
                                    <Input type='text' name='name' id='name' placeholder='tour name' required/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for='projectImg' sm={2}>Picture</Label>
                                <Col sm={10}>
                                    <Input type='file' name='thumb' id='projectImg' required/>
                                    <FormText color='muted'>
                                        This is some placeholder block-level help text for the above input.
                                        Its a bit lighter and easily wraps to a new line.
                                    </FormText>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for='projectText' sm={2}>Description</Label>
                                <Col sm={10}>
                                    <Input type='textarea' name='text' id='projectText' required/>
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
        )
    }
}

export default UserMenu