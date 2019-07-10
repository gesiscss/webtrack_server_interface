import React from 'react';
import MyComponent from '../../module/MyComponent';
import Filter from '../filter/Filter';
import { downloadsService } from '../../../module/services';
import { Button, Panel } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import ReactTable from "react-table";
import moment from 'moment';
import matchSorter from 'match-sorter'
import { ClipLoader } from 'react-spinners';


export default class Downloads extends MyComponent {

  static defaultProps = {
    enable: false,
  };

  constructor(props){
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this._update = this._update.bind(this);

    this.interval = null;
    this.state = {
      list: []
    }

  }

  componentWillMount(){
    this._update();
  }

  _update(){
    downloadsService.getList(this.props.project_id).then(e => {
      if(e !== this.state.list){
        this.setState({ list: e })
      }
      //if wait for download
      if(e.filter(e => e.ERROR == null && !e.IS_FILE).length>0) setTimeout(this._update, 3000);

    }).catch(this.msgError)
  }

  handleDelete(id){
    this.modalOpen({
       title: false,
       content: <p>Do you really want to delete the download file?</p>
     }).then((b)=>{
       if(b) downloadsService.delete(this.props.project_id, id).then(this._update).catch(this.msgError)
     });
  }

  handleError(error){
    this.modalOpen({
       title: 'Error',
       content: error,
       onCancel: false
     })
  }

  handleDownload(id){
    downloadsService.get(this.props.project_id, id).then(e => {
      this.createDownload(e, undefined, 'TrackingProject_'+this.project_id+'_'+id+'.zip');
    }).catch(this.msgError)
  }

  handleCreate(filterIds, level=1){
    downloadsService.add(this.props.project_id, filterIds, level).then(e => this._update()).catch(this.msgError)
  }


  render() {
    const columns = [
      {
        Header: 'ID',
        accessor: 'ID',
        width: 50,
        Cell: props => props.value,
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: 'Delete',
        width: 60,
        sortable: false,
        Cell: props => <Button onClick={ e => this.handleDelete(props.original.ID)} bsStyle="warning" block><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>,
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: 'User',
        id: "USERNAME",
        accessor: d => d.USERNAME,
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["USERNAME"] }),
        filterAll: true
      },
      {
        Header: 'Create date',
        accessor: 'CREATEDATE',
        Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss'),
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: '#',
        width: 50,
        sortable: false,
        Cell: props => {
          if(props.original.ERROR != null){
            return <Button onClick={ e => this.handleError(props.original.ERROR)} bsStyle="danger" block><FontAwesomeIcon icon={Icons.faExclamationTriangle} /></Button>
          }else if(props.original.IS_FILE){
            return <Button onClick={ e => this.handleDownload(props.original.ID)} bsStyle="primary" block><FontAwesomeIcon icon={Icons.faDownload} /></Button>
          }else{
            return <ClipLoader
              sizeUnit={"px"}
              size={40}
              color={'#2e6da4'}
              loading={true}
            />;
          }
        },
        Filter: ({ filter, onChange }) => null
      }
    ];

    return (
       <div>
          {this.state.modal}
          {this.state.msg}
          <Filter enable={this.props.enable} project_id={this.props.project_id} handleCreate={this.handleCreate}/>

          <Panel>
            <Panel.Body>
              <ReactTable
                  data={this.state.list}
                  columns={columns}
                  filterable
                  defaultPageSize={5}
                  className="-highlight center" />
              </Panel.Body>
          </Panel>

       </div>
    );
  }

}
