import React, { Component } from 'react'
//import { Link } from 'react-router'
import { connect } from 'react-redux'
import agent from '../../agent'
import { Table } from 'reactstrap'

const mapStateToProps = state => ({
    languages: state.languages.languages || [],
    activeLanguages: state.languages.activeLanguages || []
})

const mapDispatchToProps = dispatch => ({
    onLangsLoad: (payload) =>
        dispatch({ type: 'LANGS_PAGE_LOADED', payload }),
    onActiveLangsLoad: (payload) =>
        dispatch({ type: 'ACTIVE_LANGS_PAGE_LOADED', payload }),
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
            languages: [],
            activeLanguages: []
        };

        this.toggleLang = (langId) => {
            this.props.onUpdate(langId);
        }
    }
    componentWillMount() {
        this.props.onLangsLoad(agent.Languages.all())
        this.props.onActiveLangsLoad(agent.Languages.actives())

        Object.assign(this.state, {
            languages: this.props.languages,
            activeLanguages: this.props.activeLanguages
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, {
            languages: nextProps.languages,
            activeLanguages: nextProps.activeLanguages
        }));
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
                      </tr>
                    </thead>
                    <tbody>
                        { this.state.languages.map(language => {
                              return (
                                  <tr key={language.id}>
                                    <th scope='row'>{language.name}</th>
                                    <td>{language.code}</td>
                                    <td>Status: <input type='checkbox' checked={this.state.activeLanguages.indexOf(language.id) !== - 1} onChange={this.toggleLang.bind(this, language.id)} name='status' id='status'></input></td>
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
