import React from 'react';
import MyComponent from '../module/MyComponent';
import { Redirect } from 'react-router'
import Public from '../Public';
import Auth from '../../module/authentication';
import { Panel, Button, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"



export default class Login extends MyComponent {

  static defaultProps = {
    pageHeader: 'Login'
  }

  constructor(props) {
    super(props)
    this.state = {
      name: "",
      password: "",
      redirect: false
    };
    this.send = this.send.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange(type, event) {
    this.setState({
      [type]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.send();
    }
  }

  send(){
    Auth.sendCredits(this.state.name, this.state.password)
      .then( () => this.setState( {redirect: true} ) )
      .catch(this.msgError);
  }


  render() {
    const { redirect } = this.state;

    if (redirect)  return <Redirect to='/'/>;


    return (
      <Public>
          {this.state.msg}

              <Panel className={'public-panel transparent'}>

                <Panel.Body>

                          <fieldset>
                              <FormGroup>
                                <InputGroup>
                                  <InputGroup.Addon><FontAwesomeIcon icon={Icons.faUser} /></InputGroup.Addon>
                                  <FormControl componentClass="input" type="text" onChange={this.handleChange.bind(this, 'name')} onKeyPress={this.handleKeyPress} placeholder={'E-mail'} autoFocus/>
                                </InputGroup>
                              </FormGroup>

                              <FormGroup>
                                <InputGroup>
                                  <InputGroup.Addon><FontAwesomeIcon icon={Icons.faKey} /></InputGroup.Addon>
                                  <FormControl componentClass="input" type="password"  onKeyPress={this.handleKeyPress} onChange={this.handleChange.bind(this, 'password')}  placeholder={'Password'} />
                                </InputGroup>
                              </FormGroup>

                              <Button bsStyle="primary" bsSize="lg" block onClick={this.send.bind(this)} >Login</Button>

                          </fieldset>



                </Panel.Body>
             </Panel>

      </Public>

    );
  }
}
