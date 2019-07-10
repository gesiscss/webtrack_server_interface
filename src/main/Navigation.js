import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../defined/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import LocalstorageHandler from '../module/LocalstorageHandler';
import logo from '../static/track.png'

export default class Navigation extends Component {

  static defaultProps = {
    username: 'username',
    admin: 0
  }

  constructor(props){
    super(props);
    this.storage = new LocalstorageHandler('short_sidebar', false);
    this.state = {
      sidebar: false,
      short: this.storage.get()
    }
    this.onToogleSideBar = this.onToogleSideBar.bind(this);
    this.onToogleShortSideBar = this.onToogleShortSideBar.bind(this);
    this.getURLPath = this.getURLPath.bind(this);

  }

  getURLPath(){
    return window.location.hash.slice(1, window.location.hash.length);
  }

  onToogleSideBar(){
    this.setState({
      sidebar: !this.state.sidebar,
    })
  }

  onToogleShortSideBar(){
    this.storage.set(!this.state.short)
    this.setState({
      short: !this.state.short
    })
  }

  componentWillReceiveProps(){
    this.setState({
      sidebar: false
    })
  }


  render() {

    const LinkUser = (this.props.admin)? <li className={'nav-link '+(this.getURLPath()==='/user'? 'active': '')} ><Link to={'/user'}><FontAwesomeIcon icon={Icons.faUsers} /><span>User</span></Link></li>: null

    let toSetClassSidebar = this.state.sidebar? 'display': '';
    let toSetClassButton = this.state.sidebar? '': 'display';

    toSetClassSidebar += this.state.short? ' short': '';


    return (
      <div className="root-page" >

        <div onClick={this.onToogleSideBar} className={'background '+toSetClassSidebar} ></div>

        <section className="navbar-toggler" >
          <button type="button" onClick={this.onToogleSideBar} className={"navbar-toggler "+toSetClassButton} data-toggle="collapse" data-target=".navbar-collapse">
              <FontAwesomeIcon icon={Icons.faBars} />
          </button>
        </section>

        <section  className={"navbar-default sidebar "+toSetClassSidebar} role="navigation">
          <div className="sidebar-nav">
                <ul className="nav" id="side-menu">

                    <li className="header nav-link uppercase" >
                      <Link to={'/'}> <img  src={logo} alt={config.projectName} className="logo" /> <span>{config.projectName}</span></Link>
                    </li>

                    <li className={'nav-link '+(this.getURLPath()==='/'? 'active': '')} >
                        <Link to={'/'}><FontAwesomeIcon icon={Icons.faTachometerAlt} /> <span>Dashboard</span></Link>
                    </li>
                    {LinkUser}

                </ul>

                <ul className="nav nav-bottom">
                  <li className='nav-link logout' >
                      <Link to={'/'}><FontAwesomeIcon icon={Icons.faPowerOff} /> <span>Logout</span></Link>
                  </li>
                </ul>

            </div>
        </section>

        <div className={'content '+toSetClassSidebar} >
          <div className="navbar navbar-default navbar-static-top" role="navigation" style={{marginBottom: 0}}>

            <ul className="nav nav-flex">

              <li className="side-menu-toggler" >
                <button onClick={()=> this.onToogleShortSideBar()} >
                    <FontAwesomeIcon icon={this.state.short? Icons.faChevronRight: Icons.faBars} />
                </button>
              </li>


              <li className="title" >
                {this.props.head}
              </li>

              <li className="logout" >
                  <a onClick={this.props.logout} ><FontAwesomeIcon icon={Icons.faPowerOff} /></a>
              </li>



            </ul>
          </div>
          {this.props.children}


        </div>

      </div>

    );
  }
}
