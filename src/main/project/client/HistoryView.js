import React, { Component } from 'react';

import { Button } from 'react-bootstrap';

import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"


export default class HistoryView extends Component {

  static defaultProps = { hasAdminPermission: false }

  componentWillMount(nextProps){
    this.setState({
      pages: this.props.pages
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      pages: nextProps.pages
    })
  }


  render() {
    let columns = [
        {
          Header: 'Site',
          accessor: 'SITE',
          Cell: props => <a href={props.original.URL} target="_blank">{props.original.URL}</a>
        },
        {
          Header: 'Duration',
          accessor: 'DURATION',
          Cell: props => <span className='number'>{moment().startOf('day').seconds(props.value).format('H:mm:ss')}</span>
        },
        {
          width: 120,
          sortable: false,
          Header: 'Count of events',
          accessor: 'countEvents',
          Cell: props => {
            if(props.value>0){
              return <Button onClick={ e => this.props.open.events( props.original.ID, props.original.TITLE)} block>{props.value}</Button>
            }else{
              return props.value
            }
          }
        },
        {
          Header: 'Start',
          accessor: 'STARTTIME',
          Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          Header: 'Create',
          accessor: 'CREATEDATE',
          Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          Header: 'Show Content',
          accessor: 'ID',
          width: 120,
          sortable: false,
          Cell: props => <Button onClick={ e => {this.props.open.page(props.original.ID, props.original.TITLE)}} block><FontAwesomeIcon icon={Icons.faExternalLinkAlt} /></Button>
        }
      ];

      if(this.props.hasAdminPermission) columns.unshift({
        Header: '#',
        width: 50,
        sortable: false,
        Cell: props => <Button onClick={ e => {this.props.delete(props.original.ID, props.original.TITLE)}} bsStyle="danger" block><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>
      });

    return (

      <ReactTable
          data={this.state.pages}
          columns={columns}
          defaultPageSize={5}
          className="-highlight center"
          />

    );
  }

}
