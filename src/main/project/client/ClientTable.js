import React, { Component } from 'react';
import matchSorter from 'match-sorter'

// import { Panel } from 'react-bootstrap';

import ReactTable from "react-table";
import "react-table/react-table.css";

import moment from 'moment';


const columns = [{
    Header: 'Client',
    id: "CLIENT_HASH",
    accessor: d => d.CLIENT_HASH,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["CLIENT_HASH"] }),
    filterAll: true
  },{
    Header: 'Number of pages',
    Cell: props => <span className='number'>{props.value}</span>,
    id: "COUNTPAGE",
    accessor: d => d.COUNTPAGE,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["COUNTPAGE"] }),
    filterAll: true
  },{
    Header: 'Last Activity',
    accessor: 'ACTIVITY',
    Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss'),
    Filter: ({ filter, onChange }) => null
  }];


export default class ClientTable extends Component {

  componentWillMount(){
    this.setState({
      selected: null
    })
  }

  render() {
    if(this.state==null) return null;

    return (
      <ReactTable
          data={this.props.client}
          columns={columns}
          filterable
          defaultPageSize={5}
          className="-highlight"
          getTrProps={(state, rowInfo) => {
            return {
              onClick: (e) => {
                  let selected = this.state.selected!== rowInfo.index? rowInfo.index: null;
                  let id = selected!=null? rowInfo.original.ID: null;
                  this.props.selectClient(id);
                  this.setState({
                    selected: selected
                  })
              },
              style: {
                background: rowInfo !== undefined && rowInfo.index === this.state.selected ? '#337ab7' : '',
                color: rowInfo !== undefined && rowInfo.index === this.state.selected ? 'white' : ''
              }
            }
          }}
          />
    );
  }
}
