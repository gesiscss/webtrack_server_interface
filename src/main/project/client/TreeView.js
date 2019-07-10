import React from 'react';
import MyComponent from '../../module/MyComponent';

import { Button, Col, Row } from 'react-bootstrap';

import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"

import PagesGraph from './PagesGraph';


export default class TreeView extends MyComponent {

  static defaultProps = { hasAdminPermission: false }

  constructor(props) {
    super(props);
    this.state = {
      table: this.getTableAndTable(this.props.pages.slice(0)).table
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      table: this.getTableAndTable(nextProps.pages.slice(0)).table
    })
  }

  extractHostname(url){
      var hostname;
      if (url.indexOf("://") > -1) {
          hostname = url.split('/')[2];
      }
      else {
          hostname = url.split('/')[0];
      }
      hostname = hostname.split(':')[0];
      hostname = hostname.split('?')[0];
      return hostname;
  }

  extractRootDomain(url){
      var domain = this.extractHostname(url),
          splitArr = domain.split('.'),
          arrLen = splitArr.length;
      if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
          if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
              domain = splitArr[arrLen - 3] + '.' + domain;
          }
      }
      return domain;
  }

  getTableAndTable(pages){
    // console.log(this.props.pages);
    let tree = {
      name: 'User',
      children: []
    };
    let table = [];
    let pointers = {};
    // const MAX = 10;
    // let now = 0;

    // console.clear();
    do {
      let f = false
      pages = pages.filter(function(n){ return n !== undefined });
      let MAXCOUNT = pages.length;

      for (var i = 0; i < pages.length; i++) {
        let index = parseInt(i, 10);
        let p = pages[index];
        if(!p.hasOwnProperty('count')) p.count = 0;

        if(p.PRECURSOR_ID===0){
          let o = {
                name: this.extractRootDomain(p.URL),
                id: p.ID,
                url: p.URL,
                duration: p.DURATION,
                starttime: p.STARTTIME,
                title: p.TITLE
          }
          tree.children.push(o);

          table.push({
            STARTTIME: new Date(p.STARTTIME),
            ENDTIME: new Date(p.STARTTIME),
            DURATION: p.DURATION,
            ids: [p.ID],
            indexs: [index]
          })
          pointers[p.ID] = {
            tableIndex: table.length-1,
            to: o
          }
          delete pages[index];
          f = true;
        }else if(pointers.hasOwnProperty(p.PRECURSOR_ID)){

          let t = table[pointers[p.PRECURSOR_ID].tableIndex];
          t.ids.push(p.ID);
          t.indexs.push(index);
          t.DURATION += p.DURATION
          if(t.ENDTIME.getTime() < new Date(p.STARTTIME).getTime()) t.ENDTIME = new Date(p.STARTTIME);

          let o = {
                name: this.extractRootDomain(p.URL),
                url: p.URL,
                id: p.ID,
                duration: p.DURATION,
                starttime: p.STARTTIME,
                title: p.TITLE
          }
          if(!pointers[p.PRECURSOR_ID].to.hasOwnProperty('children')) pointers[p.PRECURSOR_ID].to.children = [];
          pointers[p.PRECURSOR_ID].to.children.push(o);
          pointers[p.ID] = {
            tableIndex: pointers[p.PRECURSOR_ID].tableIndex,
            to: o
          }
          f = true;
        }else{
          if(pages[index].count <= MAXCOUNT){
            pages[index].count += 1;
            // console.log('Not found ', p.ID, pages[index].count);
            // delete pages[index];
          }else{
            pages[index].PRECURSOR_ID=0;
          }
        }
        if(f) delete pages[index];

        // f = true;
      }//for



      // console.log('--------------');
      // console.log('tree', tree);
      // console.log('pages', pages);
      // console.log('table', table);


      // now++;
      // if(MAX<=now) {
      //   console.log('now?????', now);
      //   break;
      // }
      // console.log(pages.length);
    } while (pages.length>0);


    // table.push(table[0]);

    return {table: table, tree: tree};


    // for (let p of this.props.pages) {
    //   console.log(p);
    //   if()
    //
    // }

  }

  componentDidMount(){
    let selected = this.state.table.length>0? [0]: [];
    let tree = this.state.table.length>0? this.getTree(selected): {};
    this.setState({
      tree: tree,
      selected: selected
    });
  }

  handleDelete(ids){
    this.setState({
      selected: [0]
    });
    this.props.deletePages(ids);
  }

  getTree(selected){
    let indexs = [];
    for (let i of selected){
      if(this.state.table[i] !== undefined && this.state.table[i].indexs!==undefined)
      indexs = indexs.concat(this.state.table[i].indexs);
    }
    let pages = []
    for (let i of indexs) pages.push(this.props.pages[i]);
    return this.getTableAndTable(pages).tree;
  }

  render() {
    if(this.state.selected===undefined) return null;
    let columns = [
        {
          Header: 'MaxDuration',
          accessor: 'DURATION',
          Cell: props => <span className='number'>{moment().startOf('day').seconds(props.value).format('H:mm:ss')}</span>
        },
        {
          Header: 'Starttime',
          accessor: 'STARTTIME',
          Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          Header: 'Endtime',
          accessor: 'ENDTIME',
          Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss')
        }
      ];

      if(this.props.hasAdminPermission) columns.unshift({
        Header: '#',
        width: 50,
        sortable: false,
        Cell: props => <Button onClick={ e => this.handleDelete(props.original.ids)} bsStyle="danger" block><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>
      });

    let ColTable = this.state.selected.length===0? 12: 3;
    let JSXPagesGraph = this.state.selected.length===0? null: <Col lg={9} ><PagesGraph tree={this.state.tree} open={this.props.open.page}/></Col>;
    // let JSXPagesGraph = null;
    // console.log(this.state.selected);

    return (
      <div>
        <Row className={'seven-cols'}>
          <Col lg={ColTable} >
            <ReactTable
              data={this.state.table}
              columns={columns}
              defaultPageSize={5}
              className="-highlight center"
              getTrProps={(state, rowInfo) => {
                return {
                  onClick: (e) => {
                      this.setState(state => {
                        let indexOfState = state.selected.indexOf(rowInfo.index);
                        if(indexOfState<0){
                          state.selected.push(rowInfo.index);
                        }else{
                          delete state.selected[indexOfState];
                          state.selected = state.selected.filter(function(n){ return n !== undefined });
                        }
                        state.tree = this.getTree(state.selected);
                        return state;
                      });

                  },
                  style: {
                    background: rowInfo !== undefined && this.state.selected.indexOf(rowInfo.index)>=0 ? '#337ab7' : '',
                    color: rowInfo !== undefined && this.state.selected.indexOf(rowInfo.index)>=0 ? 'white' : ''
                  }
                }
              }}
             />
           </Col>
           {JSXPagesGraph}
         </Row>
       </div>
    );
  }

}
