import React, { Component } from 'react';
import MyModal from '../module/MyModal';


import Toggle from 'react-bootstrap-toggle';
import "../../../node_modules/react-bootstrap-toggle/dist/bootstrap2-toggle.css";


import { Col, FormControl, ControlLabel, FormGroup, Form } from 'react-bootstrap';

export default class Dashboard extends Component {

  static defaultProps = {
    onSuccess: ()=>{},
    onCancel: ()=>{}
  }

  constructor(props) {
    super(props)
    this.state = {
      loginname: '',
      password: '',
      admin: false,
      enable: true
    }
  }


  render() {
    const settings = { title: 'Add New User', disableFooter: false, onSuccess: () => this.props.onSuccess(this.state), onCancel: () => this.props.onCancel()}
    if(this.state.loginname.length===0 || this.state.password.length===0) settings.onSuccess = false;

    return (
      <MyModal {...settings} >
        <Col lg={12} className='flot-disable' >
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Loginname</Col>
              <Col sm={10}>
                <FormControl onChange={ref =>{ this.setState({loginname: ref.target.value}); }} type="text" defaultValue={this.state.loginname} placeholder={'Loginname'} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Password</Col>
              <Col sm={10}>
                <FormControl onChange={ref =>{ this.setState({password: ref.target.value}); }} type="password" defaultValue={this.state.password} placeholder={'Password'} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Admin</Col>
              <Col sm={10}>
                <Toggle active={this.state.admin} onClick={ e => this.setState({admin: !this.state.admin}) } on={'Admin'} off={'no Admin'} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>Enable</Col>
              <Col sm={10}>
                <Toggle active={this.state.enable} onClick={ e => this.setState({enable: !this.state.enable}) } on={'Enable'} off={'Disable'}  />
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </MyModal>
    );
  }
}
