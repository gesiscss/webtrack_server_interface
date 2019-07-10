import React from 'react';
import MyComponent from '../module/MyComponent';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { Button, Panel, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import { projektService } from '../../module/services';


export default class ProjectView extends MyComponent {

  static defaultProps = {
    ADMIN: 0,
    description: '--'
  }

  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      permisson: false,
      dir: 'left'
    }
  }

  componentWillMount(){
    projektService.hasAdminPermission(this.props.id).then(b =>{
      this.setState({permisson: b})
    }).catch(this.msgError)
  }

  handleEdit(e){
    this.props.projectModal(this.props.id, this.props.name, this.props.description);
  }


  render() {

    return (
      <Col xs={12} sm={8} >
        {this.state.msg}
        <Panel>
          <Panel.Heading className="panel-flex" >
            <Panel.Title componentClass="h3" >{this.props.name}</Panel.Title>
            <DropdownButton  pullRight={true} title={''} key={"0"} id={"test"} >
              <MenuItem onClick={this.handleEdit} eventKey="1"><FontAwesomeIcon icon={Icons.faEdit} /> Edit</MenuItem>
              <MenuItem divider />
              <MenuItem onClick={() => this.props.handleDelete(this.props.id)} ><FontAwesomeIcon icon={Icons.faTrash} /> Delete</MenuItem>
            </DropdownButton>
          </Panel.Heading>
          <Panel.Body>
            {this.props.description}
          </Panel.Body>
          <Panel.Footer className="panel-flex" >
              <span/>
              <Link to={'/project/'+this.props.id} >
                <Button><FontAwesomeIcon icon={Icons.faChevronRight} /></Button>
              </Link>
          </Panel.Footer>
        </Panel>
      </Col>
    );
  }

}
