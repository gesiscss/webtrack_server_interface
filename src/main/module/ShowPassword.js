import React, { Component } from 'react';
import { FormGroup, InputGroup, FormControl} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"

export default class ShowPassword extends Component {

  static defaultProps = {
    enable: false,
    defaultValue: '',
    placeholder: '',
    style: {},
    onChange: ()=>{}
  }

  constructor(props){
    super(props);
    this.state = {
      enable: this.props.defaultProps
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(){
    this.setState({
      enable: !this.state.enable
    })
  }


  render(){
    return <FormGroup style={this.props.style} >
              <InputGroup>
                <FormControl type={this.state.enable? 'text': 'password'} placeholder={this.props.placeholder} defaultValue={this.props.defaultValue} onChange={this.props.onChange} />
                <InputGroup.Addon onClick={this.handleChange} >
                  <FontAwesomeIcon icon={this.state.enable? Icons.faEye: Icons.faEyeSlash} />
                </InputGroup.Addon>
              </InputGroup>
           </FormGroup>
  }

}
