import React from 'react';
import MyComponent from '../../../module/MyComponent';
import MyTags from './MyTags';

import { FormControl, Col, ControlLabel, FormGroup } from 'react-bootstrap';

import OPTIONS from './options.js';

export default class FilterString extends MyComponent {

  static defaultProps = {
    select: OPTIONS.REGEX
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.props.handleType(this.props.value)


    this.props.handleValue(this.getValue(this.props.select, this.props.value))
    this.props.handleType(this.props.select);

    this.state = {
      mgs: null,
      select: this.props.select,
      value: this.getValue(this.props.select, this.props.value, false),
      input: this.getInput(this.props.select, this.props.value)
    }
  }

  componentWillUpdate(nextProps, nextState){
    this.props.handleValue(this.getValue(nextState.select, nextState.value))
    this.props.handleType(nextState.select)
  }

  getValue(type, value = null, sending=true){
    switch (type) {
      case OPTIONS.REGEX:
          if(value == null) value = '//gm';
        break;
      case OPTIONS.CONTAINS:
          if(value == null) value = [];
          if(sending) value = JSON.stringify(value)
        break;
      default:
    }
    return value;
  }

  handleSelect(e){
    this.setState({
      select: e.target.value,
      msg: null,
      value: this.getValue(e.target.value, null),
      input: this.getInput(e.target.value, null)
    })
  }


  handleChangeInput(e){
    this.setState({
      msg: null,
      value: e
    })
  }

  handleRegexInput(e){
    let flags = e.replace(/.*\/([gimy]*)$/, '$1');
    let pattern = e.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
    let msg = null;
    try {
      new RegExp(pattern, flags);
    } catch (err) {
      msg = <ControlLabel>{err.toString()}</ControlLabel>
    }
    this.setState({
      msg: msg,
      value: e
    })
  }

  getInput(type, value){
    let jsx = null;
    switch (type) {
      case OPTIONS.REGEX:
          value = this.getValue(type, value, false);
          jsx = <FormControl componentClass="textarea" defaultValue={value} onChange={e => this.handleRegexInput(e.target.value)} ></FormControl>
        break;
      case OPTIONS.CONTAINS:
          value = this.getValue(type, value, false);
          jsx = <MyTags tags={value} onChange={this.handleChangeInput}  />;
        break;
      default:
    }//Switch
    return jsx;
  }


  render() {
    return (
      <div>

        <Col lg={3}>

          <FormControl type="select" componentClass="select" onChange={this.handleSelect} defaultValue={this.state.select}>
              <option value={OPTIONS.REGEX} >{OPTIONS.REGEX}</option>
              <option value={OPTIONS.CONTAINS} >{OPTIONS.CONTAINS}</option>
          </FormControl>

        </Col>
        <Col lg={6}>
          <FormGroup controlId="inputgroup" validationState={this.state.msg!=null? 'error': null}>
            {this.state.msg}
            {this.state.input}
          </FormGroup>
        </Col>

      </div>
    )
  }


}
