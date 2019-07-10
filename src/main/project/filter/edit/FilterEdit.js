import React from 'react';
import MyComponent from '../../../module/MyComponent';
import MyModal from '../../../module/MyModal';
import { projektService } from '../../../../module/services';
import FilterString from './FilterString';
import FilterNumber from './FilterNumber';
import FilterDate from './FilterDate';
import { FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import OPTIONS from './options.js';


export default class FilterEdit extends MyComponent {

  static defaultProps = {
    id: null,
    title: 'New Filter',
    name: 'MyFilter',
    colume: 'URL',
    type: OPTIONS.REGEX,
    value: null,
    onSuccess: ()=>{},
    onCancel: ()=>{},
  }

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeColume = this.handleChangeColume.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleType = this.handleType.bind(this);

    this.result = {
      name: this.props.name,
      colume: this.props.colume,
      value: this.props.value,
      type: this.props.type
    };

    this.colume2type = {};
    this.state = {
      columns: [],
      filter: null
    }

  }

  componentWillMount(){
    projektService.getColumns(this.props.project_id).then(columns => {

      for (let e of columns){
        this.colume2type[e.name] = {
          type: e.type
        }
        this.colume2type[e.name].props = null;
        if(e.props) this.colume2type[e.name].props = e.props
      }

      this.setState({
        columns: columns,
        filter: this.getFilter(this.props.colume)
      })

    }).catch(this.msgError);
  }

  getValue(){
    return this.props.colume===this.result.colume && this.props.type===this.result.type? this.props.value : null;
  }

  getType(){
    return this.props.colume===this.result.colume && this.props.type===this.result.type? this.props.type : undefined;
  }

  getFilter(colume){
    let jsx = null
    switch (this.colume2type[colume].type) {
      case 'string':
          jsx = <FilterString inputProps={this.colume2type[colume].props} select={this.getType()} value={this.getValue()} handleType={this.handleType} handleValue={this.handleValue}/>
        break;
      case 'number':
          jsx = <FilterNumber inputProps={this.colume2type[colume].props} select={this.getType()} value={this.getValue()} handleType={this.handleType} handleValue={this.handleValue}/>
        break;
      case 'date':
        jsx = <FilterDate inputProps={this.colume2type[colume].props} select={this.getType()} value={this.getValue()} handleType={this.handleType} handleValue={this.handleValue}/>
        break;
      default:

    }//switch
    return jsx;
  }


  handleSuccess(){
    this.props.onSuccess(this.props.id, this.result);
  }

  handleCancel(){
    this.props.onCancel();
  }

  handleValue(value){
    this.result.value = value
  }

  handleType(name){
    this.result.type = name
  }

  handleChangeName(e){
    this.result.name = e.target.value;
  }

  handleChangeColume(e){
    this.result.colume = e.target.value;
    this.setState({
      filter: this.getFilter(e.target.value)
    });
  }


  render() {
    if(this.state.columns.length===0) return null

    return (
       <MyModal className={'editFilter'} bsSize={'lg'} title={this.props.title} onSuccess={this.handleSuccess} onCancel={this.handleCancel} >
        {this.state.msg}

        <FormGroup>
             <ControlLabel>Name</ControlLabel>
             <FormControl componentClass="input" onChange={this.handleChangeName} defaultValue={this.props.name} placeholder={this.props.name}/>
        </FormGroup>

        <FormGroup>
           <Col lg={12}><ControlLabel>Filtername</ControlLabel></Col>
        </FormGroup>


        <Col lg={3}>
            <FormControl componentClass="select" placeholder="select" onChange={this.handleChangeColume} defaultValue={this.props.colume}>
            {
              this.state.columns.map( (e, i) => {
                return <option key={i} value={e.name} >{e.name}</option>
              })
            }
            </FormControl>
        </Col>

        {this.state.filter}


       </MyModal>
    );
  }


}
