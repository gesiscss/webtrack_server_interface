import React from 'react';
import MyComponent from '../../module/MyComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { filterService } from '../../../module/services';
import LocalstorageHandler from '../../../module/LocalstorageHandler';
import Filtergroup from './Filtergroup';




import { Panel, Button, Col, ListGroup, ControlLabel, FormControl, Alert, ListGroupItem, FormGroup, Form } from 'react-bootstrap';


export default class Filter extends MyComponent {

  static defaultProps = { enable: true }

  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.select = this.select.bind(this);
    this.remove = this.remove.bind(this);
    this.groupAdd = this.groupAdd.bind(this);
    this.group_id2Index = {};
    this.storage = new LocalstorageHandler('select_filter_'+this.props.project_id, []);
    this.filter_ids = [];
    this.content_level = 0;
  }

  async componentWillMount() {
    try {
      let e = await filterService.groupGetAll();
      this.group_id2Index = {};
      for (let index in e) this.group_id2Index[e[index].ID] = index;
      this.setState({
        filtergroup: e,
        select: this.getStorage(e)
      });
    } catch (e) {
      this.msgError(e)
    }
  }

  getStorage(fg){
    let group_ids = fg.map(v=>v.ID)
    let filter_ids = [];
    for (let f of fg) filter_ids = filter_ids.concat(f.FILTER.map(e => e.ID ));

    let select = this.storage.get();
    for (let s of select) {
      if(!group_ids.includes(s[0])) s[0] = null;
      if(!filter_ids.includes(s[1])) s[1] = null;
    }


    return select;
  }

  componentWillUpdate(nextProps, nextState){
    if(nextState.select!==undefined) this.storage.set(nextState.select);
  }

  componentDidUpdate(){
    if(this.state.hasOwnProperty('select')){
      let filter_ids = [];
      let select = this.state.select;
      for (let s of select){
        if(s[1]==null && s[0]!=null && this.state.filtergroup[this.group_id2Index[s[0].toString()]].FILTER.length>0){
          s[1] = this.state.filtergroup[this.group_id2Index[s[0].toString()]].FILTER[0].ID;
        }
        if (s[1]!=null) {
          filter_ids.push(s[1]);
        }
      }
      this.storage.set(select)
      this.filter_ids = filter_ids;
      // this.props.setFilter(filter_ids);
    }
  }

  add(){
    // let group = this.state.filtergroup.length>0?
    let fg = this.state.filtergroup;
    let group = fg.length>0? fg[0].ID: null;
    let filter = fg.length>0 && fg[0].FILTER.length>0? fg[0].FILTER[0].ID: null;

    this.setState( (state) => {
        return state.select.push([group, filter]);
    });

  }

  remove(index){
    this.setState( state => {
        delete state.select[index];
        state.select = state.select.filter(function(n){ return n !== undefined });
        return state;
    });
  }

  select(index, group_id, filter_id){
    this.setState( state => {
        state.select[index] = [group_id, filter_id];
        return state;
    });
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
        if(b) filterService.groupAdd(this.props.project_id, this.input).then(this.componentWillMount).catch(this.msgError);
      })
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
                      <ListGroupItem className={'seven-cols download'} >
                       <Form inline>
                        <FormGroup controlId="formControlsSelect">
                         <ControlLabel>File</ControlLabel>
                         <FormControl componentClass="select" placeholder="select" defaultValue={this.content_level} onChange={e => this.content_level = parseInt(e.target.value, 10)} >
                           <option value="0">No Content</option>
                           <option value="1">Only Text</option>
                           <option value="2">Full HTML</option>
                         </FormControl>
                        </FormGroup>

                         <Button bsStyle="primary" onClick={(e => this.props.handleCreate(this.filter_ids, this.content_level))} >
                          <FontAwesomeIcon size="lg" icon={Icons.faFileMedical} />
                         </Button>
                        </Form>


                      </ListGroupItem>
                    </ListGroup>
                  </div>
                }
           </Panel>
       </div>
    );
  }

}
