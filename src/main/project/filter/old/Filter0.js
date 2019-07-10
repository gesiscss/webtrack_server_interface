import React from 'react';
import MyComponent from '../../module/MyComponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"

import filter from '../../module/filter';
import LocalstorageHandler from '../../module/LocalstorageHandler';
import Filtergroup from './Filtergroup';


import { Panel, Button, Col, ListGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';


export default class Filter extends MyComponent {

  static defaultProps = { enable: true }

  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.select = this.select.bind(this);
    this.remove = this.remove.bind(this);
    this.groupAdd = this.groupAdd.bind(this);
    console.log(LocalstorageHandler);
    // this.storage = new LocalstorageHandler('project_'+this.projectId, []);
  }

  componentWillMount() {
    filter.groupGetAll().then(e =>{
      this.setState({
        filtergroup: e,
        select: this.getCheckedSelect(this.getStorageSelectFilter(), e),
        modal: null
      });
    }).catch(this.msgError);
  }

  initStorageSelectFilter(project_id){
    if(typeof project_id === 'undefined'){
      localStorage.setItem('select_filter', '{}');
    }else{
      let d = JSON.parse(localStorage.getItem('select_filter'));
      d[project_id] = [];
      localStorage.setItem('select_filter', JSON.stringify(d));
    }
  }

  getStorageSelectFilter(){
    let json = localStorage.getItem('select_filter');
    if(json==null){
      this.initStorageSelectFilter();
      return this.getStorageSelectFilter();
    }else{
      let select = JSON.parse(json);
      if(!select.hasOwnProperty(this.props.project_id)){
        this.initStorageSelectFilter(this.props.project_id);
        return this.getStorageSelectFilter();
      }else{
        return select[this.props.project_id];
      }
    }
  }

  updateStorageSelectFilter(){
    setTimeout(()=>{
        let d = JSON.parse(localStorage.getItem('select_filter'));
        d[this.props.project_id] = this.state.select;
        localStorage.setItem('select_filter', JSON.stringify(d));
    }, 500);
  }

  add(){
    // let group = this.state.filtergroup.length>0?
    let fg = this.state.filtergroup;
    let group = fg.length>0? fg[0].ID: null;
    let filter = fg.length>0 && fg[0].FILTER.length>0? fg[0].FILTER[0].ID: null;


    this.setState( (state) => {
        return state.select.push([group, filter]);
    });
    this.updateStorageSelectFilter();
  }

  remove(index){
    this.setState( (state) => {
        delete state.select[index];
        state.select = state.select.filter(function(n){ return n !== undefined });
        this.updateStorageSelectFilter();
        return state;
    });
  }

  select(index, group_id, filter_id){
    let filter_ids = [];
    this.setState( state => {
        state.select[index] = [group_id, filter_id];
        state.select.map(v =>{ filter_ids.push(parseInt(v[1],10)); return null;})
        this.updateStorageSelectFilter();
        return state;
    });
    this.props.setFilter(filter_ids);
  }

  groupAdd(){
    this.modalOpen({
        title: 'New Group',
        content: <div>
              <ControlLabel>What is the name of the group?</ControlLabel>
              <FormControl componentClass="input" onChange={(ref) => { this.input = ref.target.value}} defaultValue={'New Group'} placeholder={'New Group'}/>
            </div>
      }).then((b)=>{
        if(this.input===undefined) this.input = 'New Group';
        if(b) filter.groupAdd(this.props.project_id, this.input).then(this.componentWillMount).catch(this.msgError);
      })
  }

  getCheckedSelect(select, filtergroup){
    // let select = this.state.select.slice(0);
    let group_ids = filtergroup.map(v=>{return v.ID;})
    let filter_ids = [];
    filtergroup.map(v=>{ filter_ids = filter_ids.concat(v.FILTER.map(e =>{return e.ID})); return null });
    for (let s of select) {
      if(group_ids.indexOf(parseInt(s[0], 10))<0) s[0] = null;
      if(filter_ids.indexOf(parseInt(s[1], 10))<0) s[1] = null;
    }
    return select;
  }

  getDisableMsg(){
    return <Alert bsStyle="warning">There are currently no user data.</Alert>
  }


  render() {
    if(this.state.select===undefined) return null;

    let fg = this.state.filtergroup.length===0? null:
      this.state.select.map((e, i) =>{
        return <Filtergroup key={i} reload={this.componentWillMount} project_id={this.props.project_id} select={this.select} removeCallBack={this.remove} index={i} group_id={e[0]} filter_id={e[1]} groups={this.state.filtergroup} />
      })
    let addButton = this.state.filtergroup.length===0? null: <Button onClick={this.add} bsStyle="success" bsSize="xs"><FontAwesomeIcon icon={Icons.faPlus} /></Button>




    return (
       <div>
        {this.state.msg}
        {this.state.modal}
         <Panel>
             <Panel.Heading>
                <Panel.Title componentClass="h3">Settings Filters</Panel.Title>
             </Panel.Heading>
                {
                  !this.props.enable?
                    <Panel.Body>{this.getDisableMsg()}</Panel.Body>
                  :
                  <div>
                    <Panel.Body>
                      <Col xs={1}>
                        {addButton}
                      </Col>
                      <Col xs={5}>
                        <Button bsStyle="success" bsSize="xs" onClick={this.groupAdd} ><FontAwesomeIcon icon={Icons.faPlus} /></Button>
                        <ControlLabel>Group</ControlLabel>
                      </Col>
                      <Col xs={6}>
                        <ControlLabel>Filter</ControlLabel>
                      </Col>
                    </Panel.Body>
                    <ListGroup>
                      {fg}
                    </ListGroup>
                  </div>
                }
           </Panel>
       </div>
    );
  }

}
