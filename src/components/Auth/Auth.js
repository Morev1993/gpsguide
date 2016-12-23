import React, { Component } from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import ListErrors from '../ListErrors'
import './Auth.scss'
import agent from '../../agent'
import { connect } from 'react-redux'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeEmail: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
    onChangePassword: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
    onSubmit: (email, password) =>
        dispatch({ type: 'LOGIN', payload: agent.Auth.login(email, password) })
});

class Auth extends Component {
    constructor() {
        super();
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.submitForm = (email, password) => e => {
            e.preventDefault();
            this.props.onSubmit(email, password);
        };
    }
    render() {
        const email = this.props.email;
        const password = this.props.password;
        return (
            <div className='auth'>
                <div className='container'>
                    <div className='row'>
                        <div className='offset-md-2 col-sm-6'>
                            <h1>GPSGuide admin panel</h1>
                            <ListErrors errors={this.props.errors} />
                            <Form onSubmit={this.submitForm(email, password)}>
                                <FormGroup>
                                    <Label for='userEmail' hidden>Email</Label>
                                    <Input type='email' value={email} onChange={this.changeEmail} name='email' id='userEmail' placeholder='Email' />
                                </FormGroup>
                                {' '}
                                <FormGroup>
                                    <Label for='userPassword' hidden>Password</Label>
                                    <Input type='password' value={password} onChange={this.changePassword} name='password' id='userPassword' placeholder='Password' />
                                </FormGroup>
                                {' '}
                                <Button className='btn btn-success' type='submit' disabled={this.props.inProgress}>Sign in</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
