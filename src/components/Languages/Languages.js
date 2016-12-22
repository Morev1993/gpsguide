import React, { Component } from 'react'
//import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Table } from 'reactstrap'

const mapStateToProps = state => ({
    languages: state.languages.languages || []
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: 'LANGS_PAGE_LOADED', payload }),
    onUpdate: (payload) => {
        dispatch({ type: 'UPDATE_LANG', payload: agent.Languages.update(payload) })
    },
    onDelete: (payload) => {
        dispatch({ type: 'DELETE_LANG', payload: agent.Languages.delete(payload) })
    }
})

class Languages extends Component {
    constructor() {
        super();
        this.state = {
            _id: '',
            status: false
        };

        this.toggleStatus = field => ev => {
            //const state = this.state;
            //const newState = Object.assign({}, state, { [field]: ev.target.checked });
            this.setState({ [field]: ev.target.checked });
        }

        this.updateLang = (id) => {
            this.setState({ _id: id });
            console.log(this.state)
            this.props.onUpdate(this.state)
            this.props.onLoad(agent.Languages.all())
        }
    }
    componentWillMount() {
        this.props.onLoad(agent.Languages.all())
        this.deleteLang = id => {
            this.props.onDelete(id)
            this.props.onLoad(agent.Languages.all())
        }
    }
    render() {
        return <div>
            <h2>Languages</h2>
                <Table>
                    <thead>
                      <tr>
                        <th>Language</th>
                        <th>Code</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        { this.props.languages.map(language => {
                              return (
                                  <tr key={language._id}>
                                    <th scope='row'>{language.name}</th>
                                    <td>{language.code}</td>
                                    <td>Status: <input type='checkbox' checked={language.status} onChange={this.toggleStatus('status')} name='status' id='status'></input></td>
                                    <td><button onClick={this.updateLang.bind(this, language._id)} className='btn btn-success'>Update</button></td>
                                    <td><button onClick={this.deleteLang.bind(this, language._id)} className='btn btn-danger'>Delete</button></td>
                                  </tr>
                                )}
                            )
                        }
                    </tbody>
                  </Table>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Languages)
