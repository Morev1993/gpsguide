import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col, Table } from 'reactstrap'
import ListErrors from '../ListErrors'

const mapStateToProps = state => ({
    tours: state.tours.tours || []
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: 'TOURS_PAGE_LOADED', payload }),
    onSubmit: (payload) => {
        dispatch({ type: 'CREATE_TOUR', payload: agent.Tours.create(payload) })
    },
    onDelete: (payload) => {
        dispatch({ type: 'DELETE_TOUR', payload: agent.Tours.delete(payload) })
    }
})


class Tours extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            name: '',
            orderBy: 0
        };

        this.toggle = this.toggle.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeOrderBy = this.changeOrderBy.bind(this);

        this.createTour = e => {
            e.preventDefault();

            const tour = {
                name: this.state.name,
                orderBy: this.state.orderBy
            };
            this.props.onSubmit(tour);
            this.props.onLoad(agent.Tours.all())

            this.setState({
                modal: false
            });
        }
    }
    changeName(e) {
        this.setState({
            name: e.target.value
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
        this.props.onLoad(agent.Tours.all())
        this.deleteTour = id => {
            this.props.onDelete(id)
            this.props.onLoad(agent.Tours.all())
        }
    }
    render() {
        return <div>
            <div className='row'>
                <div className='col-xs-6 float-xs-left'>
                    <h2>Tours</h2>
                </div>
                <p className='col-xs-6 float-xs-right t-R'>
                    <Button color='primary' onClick={this.toggle}>Add tour</Button>
                </p>
            </div>
            <div>
                {!this.props.tours.length ? 'No data' : ''}
                <Table>
                    <thead>
                      <tr>
                        <th>Tour name</th>
                        <th>CreatedAt</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                    { this.props.tours.map(tour => {
                        return (
                            <tr key={tour._id}>
                                <th scope='row'><Link to={`/tours/${tour._id}/edit`}>{tour.name}</Link></th>
                                <td><small>{new Date(tour.createdAt).toDateString()}</small></td>
                                <td><Button color='danger' onClick={this.deleteTour.bind(this, tour._id)}>Delete</Button></td>
                            </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>New tour</ModalHeader>
                <ModalBody>
                    <ListErrors errors={this.props.errors}></ListErrors>
                    <Form onSubmit={this.createTour}>
                        <FormGroup row>
                            <Label for='name' sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input type='text' value={this.state.name} onChange={this.changeName} name='name' id='name' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='orderBy' sm={3}>OrderBy</Label>
                            <Col sm={9}>
                                <Input type='number' value={this.state.orderBy} onChange={this.changeOrderBy} name='orderBy' id='orderBy' required/>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10, offset: 2 }}>
                                <Button className='btn btn-success'>Create tour</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tours)
