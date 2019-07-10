import React from 'react';
import MyComponent from './module/MyComponent';
import Navigation from './Navigation';
import { Redirect } from 'react-router';
import auth from '../module/authentication';
import Msg from './Msg';
import { Col, PageHeader, Row, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"


export default class Private extends MyComponent {

  static defaultProps = {
    pageHeader: 'User',
    errorMsg: false
  }

  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      username: 'test',
      admin: 0
    };
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    let u = auth.getUserdata();
    if(u!==null){
      this.setState({
        username: u.name,
        admin: u.admin
      });
    }
    this.sessionExpired();
  }

  sessionExpired(){
    this.callIndex = auth.leaseCallback(timeDiff =>{
      if(timeDiff==null){
        this.logout();
      }else{

        let timer = setTimeout(this.logout, 15000);

        let credits = {
          username: '',
          password: '',
        }
        var handleKeyPress = (v, t) =>{
          clearTimeout(timer);
          credits[t] = v;
        }

        this.modalOpen({
            title: <div>Login</div>,
            content: <div>
              <p>Your session has expired. Please sign in again</p>
              <fieldset>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><FontAwesomeIcon icon={Icons.faUser} /></InputGroup.Addon>
                      <FormControl componentClass="input" type="text" onChange={e => handleKeyPress(e.target.value, 'username')} onKeyPress={e => handleKeyPress(e.target.value, 'username')} placeholder={'E-mail'} autoFocus/>
                    </InputGroup>
                  </FormGroup>

                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><FontAwesomeIcon icon={Icons.faKey} /></InputGroup.Addon>
                        <FormControl componentClass="input" type="password" onChange={e => handleKeyPress(e.target.value, 'password')}   onKeyPress={e => handleKeyPress(e.target.value, 'password')}  placeholder={'Password'} />
                    </InputGroup>
                  </FormGroup>
              </fieldset>
            </div>
        }).then(b=>{
            if(!b){
              this.logout();
            }else{
              clearTimeout(timer);
              auth.sendCredits(credits.username, credits.password)
                .then(this.modalClose)
                .catch(this.logout);
            }
        });
      }//else
    });
  }

  componentWillUnmount(){
    auth.deleteLeaseCallback(this.callIndex)
  }

  logout(){
    if(this.state.redirect===false){
      this.setState({redirect: true});
      auth.logout();
    }
  }

  render() {
    let { redirect, username, admin } = this.state;
    let content = (!this.props.errorMsg)? this.props.children: <Msg link='/' msg={this.props.errorMsg.message} code={this.props.errorMsg.code} nr={this.props.errorMsg.nr} />
    if (redirect) return <Redirect to='/login'/>;

    let head = typeof this.props.pageHeader === 'string'? <Col lg={12}><PageHeader>{this.props.pageHeader}</PageHeader></Col>: this.props.pageHeader

    return (
      <div>
        {this.state.modal}
          <Navigation head={head} username={username} admin={admin} logout={this.logout}  >
            <div id="wrapper">
              <div id="page-wrapper">
                  <Row>
                    {content}
                  </Row>
              </div>
            </div>
          </Navigation>
      </div>
    );
  }
}
