import React from 'react';
import MyComponent from './MyComponent';

import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter'
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"


import { Button, Tooltip, OverlayTrigger, FormControl } from 'react-bootstrap';

const MAX_SPLIT = 100000;

export default class DynamicTable extends MyComponent {

  static defaultProps = {
    project_id: null,
    text_delete: 'Do you really want to delete this?',
    text_clear: 'Do you really want to delete all?',
    text_edit_error: 'No value was entered',

    columes: [
      {
        filter: true,
        id: 'v',
        header: 'Value 1',
        type: 'value'
      },
      {
        filter: false,
        id: 'CREATEDATE',
        header: 'Create Date',
        type: 'date'
      }
    ],
    text_Header: 'Header',
    handleSettings: ()=>{},
    onDelete: (id)=>{},
    onChange: (id, value)=>{},
    onAdd: ()=>{},
    onClear: ()=>{},
    fetchData: ()=> new Promise()

  }

  constructor(props) {
    super(props)
    this.state = {
      values: [],
      count: null,
      loading: true,
      pageSize: 5,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.getColumes = this.getColumes.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState){
    if(!this.state.loading) this.fetchData();
  }


  handleClear(){
    this.modalOpen({
        title: false,
        content: this.props.text_clear
    }).then((b)=>{
        if(b) this.props.onClear().then(this.fetchData)
    });
  }

  handleDelete(id){
    this.modalOpen({
        title: false,
        content: this.props.text_delete
    }).then((b)=>{
        if(b) this.props.onDelete(id).then(this.fetchData)
    });
  }

  handleAdd(){
    this.modal('Add', undefined, value => {
      this.props.onAdd([value]).then(this.fetchData)
    });
  }

  handleChange(id, value){
    this.modal('Edit', value, value => {
      this.props.onChange(parseInt(id, 10), value).then(this.fetchData)
    });
  }

  modal(title, value='', cb){
    this.modalOpen({
        title: title,
        content: <FormControl id="formControlsText" onChange={ref =>{ value = ref.target.value; }} defaultValue={value}  type="text" placeholder={value} />
      }).then((b)=>{
        if(!b) return;
        if(value.length===0)
          this.msgOpen({text: this.props.text_edit_error, bsStyle: 'danger'});
        else
          cb(value)
      })
  }

  handleSet(id=null, value){
    value = value || '';
    let title = (typeof id==='number'? 'Edit': 'New');


    this.modalOpen({
        title: title,
        content: <FormControl id="formControlsText" onChange={ref =>{ value = ref.target.value; }} defaultValue={value}  type="text" placeholder={value} />
      }).then((b)=>{
        if(!b) return;
        if(value.length===0)
          this.msgOpen({text: this.props.text_edit_error, bsStyle: 'danger'});
        else if(id!=null)
          this.props.onChange(parseInt(id, 10), value).then(this.fetchData)
        else
          this.props.onAdd([value]).then(this.fetchData)
      })

  }

  _displayUpload(values){
    let data = [];
    for (let value of values) data.push({v: value});


    let splitUpload = (a, next) => {
      if(a.length===0)
         next();
      else
        this.props.onAdd(a.slice(0, MAX_SPLIT))
          .then(()=> splitUpload(a.slice(MAX_SPLIT, a.length), next))
          .catch(this.msgError);
    };//()


    this.modalOpen({
        title: 'Upload URL-Files',
        content: <ReactTable
            data={data}
            filterable
            columns={[
              {
                Header: this.props.text_Header,
                Cell: props => <span className='number'>{props.value}</span>,
                id: "v",
                accessor: d => d.v,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["v"] }),
                filterAll: true
              }
            ]}
            defaultPageSize={5}
            className="-highlight"
            />
      }).then((b)=>{
        if(b) splitUpload(values, this.fetchData);
      })
  }

  uploadFile(){
    let onChange = e => {
      let reader = new FileReader();
      reader.onload = e => this._displayUpload(reader.result.split('\n').filter(u => u.length > 0))
      reader.readAsText(e.target.files[0]);
    };//()

    this.modalOpen({
        title: 'Upload File',
        onSuccess: false,
        content: <FormControl id="formControlsFile" onChange={onChange.bind(this)} type="file" />
      })
  }

  fetchData(state=null) {
      if(state==null) state = this.state.tableState;
      this.props.fetchData(state.page*state.pageSize, state.pageSize, state.sorted, state.filtered).then(r => {
        this.setState({
          loading: false,
          values: r.values,
          pageSize: state.pageSize,
          modal: null,
          tableState: state,
          count: r.count
        });
      });
  }

  getColumes(){
    let DELETE_COLUME = {
      Header: props => <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip">Add</Tooltip>}><span onClick={this.handleAdd} ><FontAwesomeIcon icon={Icons.faPlus} /></span></OverlayTrigger>,
      width: 50,
      sortable: false,
      Cell: props => <Button onClick={ e => {this.handleDelete(props.original.ID || props.original.id)}} bsSize="xs" bsStyle="danger" block><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>,
      filterMethod: (filter, row) => null,
      Filter: ({ filter, onChange }) => <Button onClick={this.handleClear} bsSize="small" bsStyle="danger" ><FontAwesomeIcon icon={Icons.faBroom} /></Button>
    },
    EDIT_COLUME = {
      Header: props => <OverlayTrigger placement="left" overlay={<Tooltip id="upload_file">Upload List-File</Tooltip>}><span onClick={this.uploadFile} ><FontAwesomeIcon icon={Icons.faUpload} /></span></OverlayTrigger>,
      width: 50,
      sortable: false,
      Cell: props => <Button onClick={ e => {this.handleChange(props.original.ID || props.original.id, props.original[this.props.columes[0].id])}} bsSize="xs" bsStyle="warning" block><FontAwesomeIcon icon={Icons.faPencilAlt} /></Button>,
      Filter: ({ filter, onChange }) => null
    },
    columes = []

    for (let colume of this.props.columes) {
        let c = {
            Header: colume.header,
            Cell: props => <span className='number'>{props.value}</span>,
          }
        if(colume.filter)
          Object.assign(c,
              {
                id: colume.id,
                accessor: d => d[colume.id],
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [colume.id] }),
                filterAll: true
              }
            );
        else
          Object.assign(c,
              {
                accessor: colume.id,
                Filter: ({ filter, onChange }) => null
              }
            );

        switch (colume.type) {
          case 'date':
            c.Cell = props => moment(props.value).format('YYYY-MM-DD HH:mm:ss');
            break;
          default:
        }
        columes.push(c)
    }

    return [DELETE_COLUME, ...columes, EDIT_COLUME];

  }

  render() {
    const { values, count, loading, pageSize } = this.state;
    let pageCount = parseInt(count/pageSize, 10)
    pageCount += count % pageSize===0?  0: 1;
    // console.log(values, count, loading, pageSize);



    return (<div>
        {this.state.modal}
      <ReactTable
                manual
                data={values}
                pages={pageCount}
                onFetchData={this.fetchData}
                loading={loading}
                filterable
                columns={this.getColumes()}
                defaultPageSize={5}
                className="-highlight"
                /></div>)
  }


}
