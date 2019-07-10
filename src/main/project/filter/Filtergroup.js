import React from 'react';
import MyComponent from '../../module/MyComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import EditFilter from './edit/FilterEdit';
import { filterService } from '../../../module/services';
import { InputGroup, Button, FormControl, ListGroupItem, Col, ControlLabel } from 'react-bootstrap';

export default class Filtergroup extends MyComponent {

  constructor(props) {
    super(props);
    this.selectGroup = this.selectGroup.bind(this);
    this.selectFilter = this.selectFilter.bind(this);

    this.filterAdd = this.filterAdd.bind(this);
    this.filterEdit = this.filterEdit.bind(this);
    this.filterDelete = this.filterDelete.bind(this);

    this.groupEdit = this.groupEdit.bind(this);
    this.groupDelete = this.groupDelete.bind(this);

    this.filter = React.createRef();

  }

  componentWillMount(){
    var group_id = this.props.group_id==null? this.props.groups[0].ID : this.props.group_id;
    this.setState({
      index: this.getIndex(group_id),
      group_id: group_id,
      filter_id: this.props.filter_id,
    });

  }

  selectGroup(e){
    let group_id = e.target.value

    setTimeout( () => {
      this.setState({
        group_id: group_id,
        filter_id: this.filter.value,
        index: this.getIndex(group_id)
      });
      this.props.select(this.props.index, group_id, this.filter.value);
    }, 500);
  }

  selectFilter(filter_id=null){
    filter_id = parseInt(this.filter.value || filter_id, 10);
    this.setState({
      filter_id: filter_id
    });
    this.props.select(this.props.index, this.state.group_id, filter_id);
  }

  getIndex(group_id){
    for (var i in this.props.groups) {
      let e = this.props.groups[i];
      if(parseInt(e.ID, 10)===parseInt(group_id, 10)) return i;
    }
    return 0
  }

  getSelectFilterData(){
    let e = this.filter
    let index = e.options[e.selectedIndex].getAttribute('data-index');
    return this.props.groups[this.getIndex(this.state.group_id)].FILTER[index];
  }

  getSelectGroupData(){
    return this.props.groups[this.getIndex(this.state.group_id)];
  }

  filterAdd(){
    this.setState({
      modal: <EditFilter project_id={this.props.project_id}
        onSuccess={ (id, r) => {
          filterService.add(this.state.group_id, r.name, r.colume, r.type, r.value).then(filter_id =>{

              this.selectFilter(filter_id);
              this.modalClose();
              this.props.reload();
          }).catch(this.msgError);
        }}
        onCancel={ e => this.modalClose() } />

    })
  }

  filterEdit(){
    let _filter = this.getSelectFilterData();

    this.setState({
      modal: <EditFilter title={'Edit Filter'}
                project_id={this.props.project_id}
                id={this.filter.value}
                name={_filter.NAME}
                colume={_filter.COLUME}
                type={_filter.TYPE}
                value={_filter.VALUE}
                onSuccess={ (id, r) => {
                  filterService.change(id, r.name, r.colume, r.type, r.value).then(()=>{
                      this.modalClose();
                      this.props.reload();
                  }).catch(this.msgError);
                }}
                onCancel={ e => this.modalClose() }
                />
    })
  }

  filterDelete(){
    let f = this.getSelectFilterData();

    this.modalOpen({
        title: false,
        content:  <p>Do you really want to delete the filter ({f.NAME})?</p>
      }).then((b)=>{
        if(b) filterService.delete(f.ID).then(this.props.reload).catch(this.msgError);
      })

  }

  groupEdit(){
    let group = this.getSelectGroupData();

    this.modalOpen({
        title: 'Change Groupname',
        content: <div>
              <ControlLabel>What is the name of the group?</ControlLabel>
              <FormControl componentClass="input" onChange={(ref) => { this.input = ref.target.value}} defaultValue={group.NAME} placeholder={'Change Groupname'}/>
            </div>
      }).then((b)=>{
        if(this.input===undefined) this.input = group.NAME;
        if(b) filterService.groupChange(group.ID, this.input).then(this.props.reload).catch(this.msgError);
      })

  }

  groupDelete(){
    let group = this.getSelectGroupData();

    this.modalOpen({
      title: false,
      content: <p>Do you really want to delete the group ({group.NAME})?</p>
    }).then((b)=>{
      if(b) filterService.groupDelete(group.ID).then(this.props.reload).catch(this.msgError);
    })

  }



  render() {

    if(this.state==null) return null;


    let index = this.props.groups.hasOwnProperty(this.state.index)? this.state.index: 0;
    let filter = this.props.groups.hasOwnProperty(index)? this.props.groups[index].FILTER: [];

    let filterButtonEdit = filter.length>0? <InputGroup.Addon onClick={this.filterEdit} ><FontAwesomeIcon icon={Icons.faEdit} /></InputGroup.Addon>: null;
    let filterButtonDel = filter.length>0? <InputGroup.Addon onClick={this.filterDelete} ><FontAwesomeIcon icon={Icons.faTrash} /></InputGroup.Addon>: null;

    let filterButtonAdd = this.props.groups.length>0? <InputGroup.Addon onClick={this.filterAdd} ><FontAwesomeIcon icon={Icons.faPlus} /></InputGroup.Addon>: null;
    let groupButtonEdit = this.props.groups.length>0? <InputGroup.Addon onClick={this.groupEdit} ><FontAwesomeIcon icon={Icons.faEdit} /></InputGroup.Addon>: null;
    let groupButtonDel = this.props.groups.length>0? <InputGroup.Addon onClick={this.groupDelete} ><FontAwesomeIcon icon={Icons.faTrash} /></InputGroup.Addon>: null;



    // console.log(this.props.groups[this.state.index], filter);


    return (


       <ListGroupItem className={'seven-cols'}>
           {this.state.msg}
           {this.state.modal}

          <Col xs={1}>
            <Button bsStyle="danger" bsSize="xs" onClick={e => {this.props.removeCallBack(this.props.index)}} ><FontAwesomeIcon icon={Icons.faMinus} /></Button>
          </Col>

          <Col xs={5}>
            <InputGroup>
              <FormControl componentClass="select" placeholder="select" defaultValue={this.state.group_id} onChange={e => { this.selectGroup(e)} }>
              {
                this.props.groups.map( (e, i) => {
                  return <option key={i} value={e.ID} >{e.NAME}</option>
                })
              }
              </FormControl>
              {groupButtonEdit}
              {groupButtonDel}

            </InputGroup>
          </Col>


          <Col xs={6}>
            <InputGroup>
                {filterButtonAdd}
                <FormControl componentClass="select" placeholder="select" inputRef={(ref) => {this.filter = ref}} onChange={this.selectFilter} defaultValue={this.state.filter_id}>
                  {filter.map( (e, i) => {
                      return <option key={i} value={e.ID} data-index={i} >{e.NAME}</option>
                  })}
                </FormControl>
                {filterButtonEdit}
                {filterButtonDel}
            </InputGroup>
          </Col>


       </ListGroupItem>
    );
  }

}
