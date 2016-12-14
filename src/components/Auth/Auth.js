import React, { Component } from 'react'
import {Form, FormGroup, Label, Input, Button } from 'reactstrap';
import './Auth.scss'

export default class Auth extends Component {
    render() {
        return (
            <div className='auth'>
                <div className='container'>
                    <div className='row'>
                        <div className='offset-md-2 col-sm-6'>
                            <h1>Sign in to baseLine</h1>
                            <Form>
                                <FormGroup>
                                    <Label for='userEmail' hidden>Email</Label>
                                    <Input type='email' name='email' id='userEmail' placeholder='Email' />
                                </FormGroup>
                                {' '}
                                <FormGroup>
                                    <Label for='userPassword' hidden>Password</Label>
                                    <Input type='password' name='password' id='userPassword' placeholder='Password' />
                                </FormGroup>
                                {' '}
                                <Button>Submit</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}