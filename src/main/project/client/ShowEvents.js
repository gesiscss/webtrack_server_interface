import React from 'react';
import MyComponent from '../../module/MyComponent';
import MyModal from '../../module/MyModal';
import { projektService } from '../../../module/services';

import { Col, Button } from 'react-bootstrap';

import ReactTable from "react-table";
import moment from "moment";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"

export default class ShowEvents extends MyComponent {

  static defaultProps = {
    title: 'Page',
    hasAdminPermission: false
  }

  constructor(props) {
    super(props);
    this.state = {
      select: null
    }
  }

  async componentWillMount(){
    try {
      let events = await projektService.getPageEvents(this.props.project_id, this.props.page_id);
      this.setState({events: events});
    } catch (e) {
      this.msgError(e);
    }
  }

  handleDelete(eventId){
    this.modalOpen({
        title: false,
        content: <p>Do you really want to delete this event entry?</p>
      }).then((b)=>{
        if(b) console.log('delete eventId', eventId);
        if(b) projektService.deletePageEvent(this.props.project_id, this.props.page_id, eventId).then(this.componentWillMount).catch(this.msgError);
      });
  }

  render() {
    if(this.state.events===undefined) return null;
    let content = [];
    let columnsEvent = [
        {
          Header: 'Type',
          accessor: 'TYPE',
          Cell: props => props.value
        },
        {
          Header: 'Timestamp',
          accessor: 'TIMESTAMP',
          Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss'),
          Filter: ({ filter, onChange }) => null
        }
      ]
    if(this.props.hasAdminPermission) columnsEvent.unshift({
        Header: '#',
        width: 50,
        sortable: false,
        Cell: props => <Button onClick={ e => {this.handleDelete(props.original.ID)}} bsStyle="danger" block><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>
      })



    let columnsEventData = [
        {
          Header: 'Name',
          accessor: 'NAME',
          Cell: props => props.value
        },
        {
          Header: 'Value',
          accessor: 'VALUE',
          Cell: props => {
            if(typeof props.value === 'string' && props.value.indexOf('http')>=0){
              return <a href={props.value} >{props.value}</a>
            }else{
              return props.value;
            }
          }
        }
      ]


    let table = <ReactTable
      data={this.state.events}
      columns={columnsEvent}
      defaultPageSize={5}
      className="-highlight"
      getTrProps={(state, rowInfo) => {
        return {
          onClick: (e) => {
            let select = this.state.select!== rowInfo.index? rowInfo.index: null;
            this.setState({select: select})
          },
          style: {
            background: rowInfo !== undefined && rowInfo.index === this.state.select ? '#337ab7' : '',
            color: rowInfo !== undefined && rowInfo.index === this.state.select ? 'white' : ''
          }
        }
      }}
      NoDataComponent={({ state, ...rest }) => <div className="rt-noData">No rows found</div> }
      />
      content.push(table)

      //if select event then will be display the data of event
      if(this.state.select!=null){
        content.push(<ReactTable
          data={this.state.events[this.state.select].values}
          columns={columnsEventData}
          defaultPageSize={10}
          className="-highlight"
          />)
      }

      //

    return (
      <div>
        {this.state.modal}
        {this.state.msg}
        <MyModal className={'modal-disbale-float modal-full-width'} title={
          <div className="middle" >
            <a className="pointer" onClick={e => this.createDownload(JSON.stringify(this.state.events), "application/json", 'Event_'+this.props.title+'.json') }><FontAwesomeIcon icon={Icons.faDownload} /></a>
            <h3>Events from {this.props.title}</h3>
          </div>
        } bsSize={'large'} disableFooter={true} closeButton={true} onClose={this.props.modalClose} >
            {content.map((e, i)=>{
              let lg = 12;
              if(content.length>1) lg = i>0? 8: 4
              return <Col xs={12} lg={lg} key={i} >{e}</Col>
            })}
        </MyModal>
      </div>
    );
  }

}
