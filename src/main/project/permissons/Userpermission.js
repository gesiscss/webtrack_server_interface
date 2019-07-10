import React from 'react';
import MyComponent from '../../module/MyComponent';

import Toggle from 'react-bootstrap-toggle';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"


import { Button, ListGroupItem, Col } from 'react-bootstrap';


export default class Permissons extends MyComponent {

  static defaultProps = {
    default: true,
    index: null,
    onToggle: (id, b) =>{},
    name: 'Name',
    offstyle: 'default',
    on: 'Administrator',
    off: 'Reader',
    disabled: false,
    onDel: (id, b) =>{}
  }

  constructor(props) {
    super(props);
    this.state = {
        modal: null
    }
    this.delete = this.delete.bind(this);
  }


  delete(){
    this.modalOpen({
        title: false,
        content: <p>Do you really want to delete the user ({this.props.name}) for this project?</p>
      }).then((b)=>{
        if(b) this.props.onDel(this.props.index);
      })

  }



  render() {
    return (
       <div>
         {this.state.modal}
         <ListGroupItem disabled={this.props.disabled} className={'seven-cols'}>

            <Col xs={1}>
              <Button bsStyle="danger" disabled={this.props.disabled} bsSize="xs" onClick={this.delete} ><FontAwesomeIcon icon={Icons.faMinus} /></Button>
            </Col>
            <Col xs={2}>
              {this.props.name}
            </Col>
            <Col xs={5}>
              <Toggle
                  disabled={this.props.disabled}
                  onClick={b => {this.props.onToggle(this.props.index, b)}}
                  on={this.props.on}
                  off={this.props.off}
                  offstyle={this.props.offstyle}
                  active={this.props.default}
                />
            </Col>

           </ListGroupItem>

       </div>
    );
  }

}
