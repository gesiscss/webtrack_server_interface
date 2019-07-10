import React from 'react';
import MyComponent from '../../../module/MyComponent';


import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';

import moment from 'moment';

import { FormControl, Col } from 'react-bootstrap';

import OPTIONS from './options.js';

export default class FilterDate extends MyComponent {

  static defaultProps = {
    select: OPTIONS.SLIDERDATE
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);

    this.inputProps = this.props.inputProps;
    for (let i in this.inputProps) this.inputProps[i] = new Date(this.inputProps[i]).getTime();
    if(this.inputProps[0] === this.inputProps[1]) this.inputProps[1] += 1;


    this.props.handleValue(this.getValue(this.props.select, this.props.value))
    this.props.handleType(this.props.select);

    this.state = {
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
      case OPTIONS.SLIDERDATE:
          if(value == null) value = [this.inputProps[0], this.inputProps[1]];
          for (let i in value) value[i] = new Date(value[i]).getTime();
          if(sending) value = JSON.stringify(value)
        break;
      default:
    }
    return value;
  }

  handleSelect(e){
    this.setState({
      select: e.target.value,
      value: this.getValue(e.target.value, null),
      input: this.getInput(e.target.value, null)
    })
  }

  handleChangeInput(e){
    this.setState({
      value: e
    })
  }

  getInput(type, value){
    let jsx = null;
    switch (type) {
      case OPTIONS.SLIDERDATE:
          value = this.getValue(type, value, false);
          jsx = <Nouislider range={{ min: this.inputProps[0], max: this.inputProps[1] }} onKeydown={e=>{}} onChange={this.handleChangeInput} start={[value[0], value[1]]} connect tooltips format={ { to: value => moment(value).format('YYYY-MM-DD HH:mm:ss'), from: value =>  value } } />;
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
              <option value={OPTIONS.SLIDERDATE} >{OPTIONS.SLIDERDATE}</option>
          </FormControl>

        </Col>
        <Col lg={6}>
          {this.state.input}
        </Col>

      </div>
    )
  }


}
