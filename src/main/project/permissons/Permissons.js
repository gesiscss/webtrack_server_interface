import React from 'react';
import MyComponent from '../../module/MyComponent';
import Userpermission from './Userpermission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import PopoverUsersearch from './PopoverUsersearch';
import { Panel, ListGroup, OverlayTrigger, Button, Popover } from 'react-bootstrap';
import { projektService } from '../../../module/services';
import core from '../../../module/core';


export default class Permissons extends MyComponent {

  static defaultProps = {
    loginId: core.userdata.get().id
  }

  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.onDel = this.onDel.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.state = {
        users: []
    }
  }


  componentWillMount(){
    projektService.getPermissions(this.props.project_id).then(list => {
      for (let u of list) u.ADMIN = u.ADMIN===1? true: false;
      this.setState({
        users: list
      });
    }).catch(this.msgError);
  }

  onToggle(index, b){

    projektService.changeUserPermission(this.props.project_id, this.state.users[index].ID, b).then(()=>{
      this.setState(state => {
        state.users[index].ADMIN = b;
        return state;
      });
    }).catch(this.msgError);
  }

  onDel(index){
    projektService.deleteUserPermission(this.props.project_id, this.state.users[index].ID).then(this.componentWillMount).catch(this.msgError);
  }

  onAdd(user){
    this.refs.overlay.hide();
    projektService.addUserPermission(this.props.project_id, user.ID).then(this.componentWillMount).catch(this.msgError);
  }
// className={'panel-flex'}
////<PopoverUsersearch disabledUser={this.state.users.map(e => e.ID)} onSelect={this.onAdd}/>

  render() {
    const popoverLeft = (
    <Popover id="popoverUsersearch" title={false}>
      <PopoverUsersearch disabledUser={this.state.users.map(e => e.ID)} onSelect={this.onAdd}/>
    </Popover>
);

    return (
      <div>
        {this.state.msg}
        <Panel>
            <Panel.Heading className={'panel-flex'}>
              <Panel.Title componentClass="h3">Permissons User</Panel.Title>
              <OverlayTrigger
                 container={this}
                 ref="overlay"
                 trigger="click"
                 placement={'left'}

                 overlay={popoverLeft}
                 >
                 <Button bsStyle="success"><FontAwesomeIcon icon={Icons.faPlus} /> Add User</Button>
               </OverlayTrigger>
            </Panel.Heading>
             <ListGroup>
             {
               this.state.users.map((v, i) =>{
                 return  <Userpermission key={i} name={v.NAME} default={v.ADMIN} index={i} disabled={(v.ID===this.props.loginId)? true: false} onToggle={this.onToggle} onDel={this.onDel} />
               })
             }
             </ListGroup>

         </Panel>
      </div>
    );
  }

}
