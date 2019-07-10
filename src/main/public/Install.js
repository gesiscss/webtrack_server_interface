import React from 'react';
import MyComponent from '../module/MyComponent';
import { Redirect } from 'react-router'
import Public from '../Public';

import { Panel, Button, FormGroup, FormControl, InputGroup, ControlLabel, Form } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import Core from '../../module/core';

export default class Install extends MyComponent {

  static defaultProps = {
    pageHeader: 'Login'
  }

  constructor(props) {
    super(props)
    this.send = this.send.bind(this);


    this.form = [
      {
        name: 'MySQL-Settings',
        items: [
            {
              type: 'text',
              text: 'Hostname',
              name: 'MYSQL_HOST',
              defaultValue: '',
              require: true,
              validate: (v) => v.length > 0
            },
            {
              type: 'text',
              text: 'Username',
              name: 'MYSQL_USER',
              defaultValue: '',
              require: true,
              validate: (v) => v.length > 0
            },
            {
              type: 'password',
              text: 'Password',
              name: 'MYSQL_PASSWORD',
              defaultValue: '',
              require: true,
              validate: (v) => v.length > 0
            },
            {
              type: 'text',
              text: 'Database-Name',
              name: 'MYSQL_DATABASE',
              defaultValue: '',
              require: true,
              validate: (v) => v.length > 0
            }

        ]
      },
      {
        name: 'Adminuser',
        items: [
            {
              type: 'text',
              text: 'Username',
              name: 'username',
              defaultValue: '',
              require: true,
              inputgroup: <InputGroup.Addon><FontAwesomeIcon icon={Icons.faUser} /></InputGroup.Addon>,
              validate: (v) => v.length >= 4
            },
            {
              type: 'password',
              text: 'Password',
              name: 'password',
              defaultValue: '',
              require: true,
              inputgroup: <InputGroup.Addon><FontAwesomeIcon icon={Icons.faKey} /></InputGroup.Addon>,
              validate: (v) => v.length >= 4
            },
            {
              type: 'password',
              text: 'Confirm Password',
              name: 'confirm_password',
              defaultValue: '',
              require: false,
              inputgroup: <InputGroup.Addon><FontAwesomeIcon icon={Icons.faRedoAlt} /></InputGroup.Addon>,
              validate: (v) => this.state.elements.password.value === v
            }
        ]
      }
    ]


    this.state = {
        redirect: false,
        ready: false,
        elements: {}
    }

    for (let group of this.form) {
      for (let item of group.items) {
          this.state.elements[item.name] = {
            validate: item.validate,
            value: '',
            require: item.require,
            validationState: 'warning'
          }
      }
    }

  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  componentWillUpdate(nextProps, nextState){
    let ready = true;
    for (let item in nextState.elements) {
      if(nextState.elements[item].validationState!=='success') ready = false;
    }
    if(ready !== nextState.ready) this.setState({ready: ready});
  }

  handleChange(type, event) {
    let value = event.target.value;
    if(this.state.elements[type]!==undefined){
      this.setState(state => {
        state.elements[type].validationState = state.elements[type].validate(value)? 'success': 'warning';
        state.elements[type].value = value;
        return state;
      });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.send();
    }
  }

  async send(){
    if(this.state.ready){
      let values =  {};
      for (let item in this.state.elements) {
        if(this.state.elements[item].require){
          values[item] = this.state.elements[item].value;
        }
      }

      try {
        let r = await Core.sendData('/api/install', values, false);
        Core.token.set(r.token)
        this.setState( {redirect: true} )
      } catch (e) {
        this.msgError(e)
      }

    }
  }


  render() {
    const { redirect } = this.state;

    if (redirect)  return <Redirect to='/'/>;


    return (
      <Public>
          {this.state.msg}

              <Panel className={'public-panel transparent'}>
                <Panel.Body>

                   <Form componentClass="fieldset" >
                     {
                       this.form.map((v, i) =>{
                         return <div key={i} >
                            <h3>{v.name}</h3>
                           {
                             v.items.map((v,i) => {
                                 let formControl = <FormControl defaultValue={v.defaultValue} placeholder={v.text} type={v.type} onChange={e => this.handleChange(v.name, e)}  />
                                 if(v.inputgroup!==undefined) formControl = <InputGroup>{v.inputgroup}{formControl}</InputGroup>

                                 return <FormGroup key={i} controlId={v.name} validationState={this.state.elements[v.name].validationState}>
                                      <ControlLabel>{v.text}</ControlLabel>
                                      {formControl}
                                      <FormControl.Feedback />
                                 </FormGroup>
                             })
                           }
                         </div>
                       })
                     }

                     <Button bsStyle="primary" bsSize="lg" block onClick={this.send} disabled={!this.state.ready}>Install</Button>
                    </Form>


                </Panel.Body>
             </Panel>

      </Public>

    );
  }
}
