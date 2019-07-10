import React from 'react';
import MyComponent from '../../module/MyComponent';
import { clientsService } from '../../../module/services';
import DynamicTable from '../../module/DynamicTable';
import { Panel } from 'react-bootstrap';

const COLUMES = [
  {
    filter: true,
    id: 'CLIENT_HASH',
    header: 'CLIENT_HASH',
    type: 'value'
  },
  {
    filter: false,
    id: 'CREATEDATE',
    header: 'Create Date',
    type: 'date'
  }
]


export default class ClientIds extends MyComponent {

  constructor(props) {
    super(props)
    this.fetchData = this.fetchData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  fetchData(min, max, sorted=[], filtered=[]){
    return new Promise(async (resolve, reject)=>{
      try {
        let values = await clientsService.get(this.props.project_id, [min, max], sorted, filtered);
        let c = await clientsService.getCount(this.props.project_id);
        resolve({values: values, count: c})
      } catch (e) {
         this.msgError(e)
      }
    });
  }


  onAdd(values=[]){
    return new Promise((resolve, reject)=>{
      clientsService.add(this.props.project_id, values).then(resolve).catch(this.msgError);
    })
  }

  onChange(id=null, name){
    return new Promise((resolve, reject)=>{
      if(id!=null) clientsService.change(this.props.project_id, id, name).then(resolve).catch(this.msgError);
    })
  }

  onDelete(id=null){
    return new Promise((resolve, reject)=>{
      if(id!=null) clientsService.delete(this.props.project_id, parseInt(id, 10)).then(resolve).catch(this.msgError);
    })
  }

  onClear(){
    return new Promise((resolve, reject)=>{
      clientsService.clean(this.props.project_id).then(resolve).catch(this.msgError);
    })
  }


  render() {
    return (<div>
          {this.state.modal}
          {this.state.msg}

          <Panel>
            <Panel.Heading >
                <Panel.Title componentClass="h3">Clients</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                 <DynamicTable onClear={this.onClear} onDelete={this.onDelete} onAdd={this.onAdd} onChange={this.onChange} columes={COLUMES} fetchData={this.fetchData} />
              </Panel.Body>
          </Panel>

      </div>)
  }

}
