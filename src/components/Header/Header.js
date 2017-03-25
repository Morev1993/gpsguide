import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap'
import './Header.scss'

const mapStateToProps = state => ({
    appName: state.appName
})

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: 'LOGOUT' })
});

class Header extends Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
          collapsed: true
        };
      }

  toggleNavbar() {
        this.setState({
          collapsed: !this.state.collapsed
        });
      }
    render() {
        return <header>
            <div className='container'>
                <Navbar color='faded' light>
                  <NavbarToggler className='float-sm-right hidden-lg-up collapsed' onClick={this.toggleNavbar} />
                  <Collapse className='navbar-toggleable-md' isOpen={!this.state.collapsed}>
                    <Nav navbar>
                      <NavItem>
                        <Link className='nav-link' to='/'>Dashboard</Link>
                      </NavItem>
                      <NavItem>
                        <Link className='nav-link' to='/tours' activeClassName='active'>Tours</Link>
                      </NavItem>
                      <NavItem>
                        <Link className='nav-link' to='/devices' activeClassName='active'>Devices</Link>
                      </NavItem>
                      <NavItem>
                        <Link className='nav-link' to='/languages' activeClassName='active'>Languages</Link>
                      </NavItem>
                      <NavItem className='float-xs-right'>
                        <button className='btn btn-danger' onClick={this.props.onClickLogout}>Logout</button>
                      </NavItem>
                    </Nav>
                  </Collapse>
                </Navbar>
            </div>
        </header>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
