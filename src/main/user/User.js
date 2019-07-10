import React from 'react';
import MyComponent from '../module/MyComponent';
import { usersService } from '../../module/services';
import Private from '../Private';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import Toggle from 'react-bootstrap-toggle';
import "../../../node_modules/react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import matchSorter from 'match-sorter'
import moment from 'moment';
import AddUser from './AddUser';
import { Col, Button, Tooltip, OverlayTrigger, FormControl  } from 'react-bootstrap';


export default class User extends MyComponent {

  static defaultProps = {
    pageHeader: 'User'
  }

  constructor(props) {
    super(props)
    this.state = {
      errorMsg: false
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEnable = this.handleEnable.bind(this);
    this.handlePwChange = this.handlePwChange.bind(this);

    // setTimeout(this.handleAdd, 500);
  }

  componentWillMount() {
    usersService.getAll()
    .then(users => {
      let id2index = {};
      for (let i in users) id2index[users[i].ID] = i;
      this.setState({
        users: users,
        id2index: id2index
      });
    })
    .catch(err => {
      this.msgError(err);
      this.setState({users: []});
    });
  }

  getUser(id){
    return this.state.users[this.state.id2index[id]];
  }

  handleDelete(id){
    this.modalOpen({
        title: false,
        content: <p>Do you really want to delete the user {this.getUser(id).NAME}?</p>
    }).then(b=>{
        if(b) usersService.delete(id).then(this.componentWillMount).catch(this.msgError);
    });
  }

  handleEnable(id, e){
    usersService.setEnable(id, !this.getUser(id).ENABLE).then(this.componentWillMount).catch(this.msgError);
  }

  handleAdmin(id){
    usersService.setAdmin(id, !this.getUser(id).ADMIN).then(this.componentWillMount).catch(this.msgError);
  }

  handlePwChange(id){
    this.modalOpen({
        title: 'Change Password',
        content: <FormControl id="formControls" onChange={ref =>{ this.input = ref.target.value; }} type="password" placeholder={'New password'} />
    }).then(b=>{
        if(b) usersService.changePw(id, this.input).then(this.msgOpen({bsStyle: 'success', text: 'Change was successful'})).catch(this.msgError);
    });
  }

  handleAdd(){
    this.input = {
      loginname: null,
      password: null,
      admin: false,
      enable: true
    };

    this.setState({
      modal: <AddUser
        onSuccess={user => usersService.add(user).then(this.componentWillMount)
          .catch( err => {
            this.modalClose();
            this.msgError(err)
        })}
        onCancel={this.modalClose}/>
    })
  }

  render() {
    if(this.state.users===undefined) return null;

    const columns = [
      {
        Header: props => <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip">Add new User</Tooltip>}><span onClick={this.handleAdd} ><FontAwesomeIcon icon={Icons.faPlus} /></span></OverlayTrigger>,
        width: 50,
        className: "center",
        sortable: false,
        Cell: props => <Button onClick={ e => {this.handleDelete(props.original.ID)}} bsSize="xs" bsStyle="danger" block><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>,
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: 'Name',
        id: "NAME",
        className: "center",
        accessor: d => d.NAME,
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NAME"] }),
        filterAll: true
      },
      {
        Header: 'Enable',
        accessor: 'ENABLE',
        className: "center",
        Cell: p => <Toggle active={p.original.ENABLE? true: false} onClick={ e => this.handleEnable(p.original.ID) } on={'Enable'} off={'Disable'} />,
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: 'Admin',
        accessor: 'ADMIN',
        className: "center",
        Cell: p => <Toggle active={p.original.ADMIN? true: false} onClick={ e => this.handleAdmin(p.original.ID) } on={'Admin'} off={'no Admin'} />,
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: 'Change Pw.',
        sortable: false,
        width: 100,
        Cell: p => <Button onClick={ e => {this.handlePwChange(p.original.ID)}} bsSize="xs" bsStyle="warning" block><FontAwesomeIcon icon={Icons.faKey} /></Button>,
        Filter: ({ filter, onChange }) => null
      },
      {
        Header: 'Last Activity',
        accessor: 'ACTIVITY',
        className: "center",
        Cell: props => moment(props.value).format('YYYY-MM-DD HH:mm:ss'),
        Filter: ({ filter, onChange }) => null
      },
    ];
    return (
      <Private pageHeader={this.props.pageHeader} errorMsg={this.state.errorMsg} >
        {this.state.modal}
        {this.state.msg}
        <Col lg={12} >
        <ReactTable
            data={this.state.users}
            columns={columns}
            filterable
            defaultPageSize={5}
            className="-highlight"
            />
        </Col>

      </Private>
    );
  }
}
