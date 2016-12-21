import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col } from 'reactstrap'
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
            <div>
                <h2>Tours</h2>
            </div>
            <div>
                {!this.props.tours.length ? 'No data' : ''}
                { this.props.tours.map(tour => {
                    return (
                        <div key={tour._id}>
                            <h4>
                                Name: <Link to={`/tours/${tour._id}`}>{tour.name}</Link>
                            </h4>
                            <p><Button color='danger' onClick={this.deleteTour.bind(this, tour._id)}>Del</Button></p>
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
                                <Button>Submit</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tours)
