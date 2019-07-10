import React from 'react';
import MyComponent from '../../module/MyComponent';
import { usersService } from '../../../module/services';
import { InputGroup, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"


export default class PopoverUsersearch extends MyComponent {

  static defaultProps = {
    disabledUser: [],
    // onSelect: ()=>{}
  }

  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.displayAll = this.displayAll.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.input = null;
  }

  componentWillMount(){
    usersService.getAll().then(list=>{
      this.setState({
        users: list,
        search: '',
        select: null,
        selectUser: null
      });
    }).catch(this.msgError);
  }

  handleKeyUp(){
    let search = this.input.value;
    let select = this.state.select;
    let selectUser = this.state.selectUser;
    if(search.length===0){
      select = null;
      selectUser = null;
    }
    this.setState({
      search: search,
      select: select,
      selectUser: selectUser
    })
  }

  displayAll(){
    this.setState({
      search: null
    })
  }

  handleSelect(i, user){
    if(i===this.state.select){
      i= null;
      user = null;
    }
    this.setState({
      select: i,
      selectUser: user
    })
  }




  render() {

    if(this.state.users===undefined) return null;
    let AddonCheck = this.state.select!=null? <InputGroup.Addon className="input-group-addon-success" onClick={e =>{this.props.onSelect(this.state.selectUser)} } ><FontAwesomeIcon icon={Icons.faCheck} /></InputGroup.Addon>: null;

    // positionLeft={110}
    // positionTop={65}

    return (
      <div>
        {this.state.msg}

        <InputGroup>
         <InputGroup.Addon onClick={this.displayAll} ><FontAwesomeIcon icon={Icons.faUser} /></InputGroup.Addon>
         <FormControl inputRef={ref => { this.input = ref; }} onKeyUp={this.handleKeyUp} type="text" placeholder="Search the user" />
         {AddonCheck}
       </InputGroup>

       <ListGroup>
         {
           this.state.users.map((v, i)=>{
             if(this.state.search != null && (v.NAME.indexOf(this.state.search)<0 || this.state.search.length===0)) return null;
             let active = this.state.select===i? true : false;
             let disabled = this.props.disabledUser.indexOf(v.ID)>=0? true: false;
             let _click = !disabled? this.handleSelect: _=>{};

             return <ListGroupItem className={'select'} active={active} disabled={disabled} key={i} onClick={e => {_click(i, v)}} >{v.NAME}</ListGroupItem>
           })
         }
       </ListGroup>

      </div>
    );
  }

}
