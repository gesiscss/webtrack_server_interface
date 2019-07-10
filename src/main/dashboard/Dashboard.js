import React from 'react';
import MyComponent from '../module/MyComponent';
import Private from '../Private';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { Button, Col, FormControl, FormGroup, ControlLabel, PageHeader, Alert } from 'react-bootstrap';
import { projektService } from '../../module/services';
import ProjectView from './ProjectView';



export default class Dashboard extends MyComponent {

  static defaultProps = {
    pageHeader: 'Dashboard',
  }

  constructor(props) {
    super(props);
    this.state = {
      projects: []
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.projectModal = this.projectModal.bind(this);
  }

  projectModal(id=null, input='', description='', errorMsg=null){
    if(errorMsg!=null) errorMsg = <Alert bsStyle="danger"><p>{errorMsg}</p></Alert>

    this.modalOpen({
        title: 'Assign a project name and description.',
        content: <div>
          {errorMsg}
          <FormGroup controlId="name">
            <ControlLabel>Name</ControlLabel>
            <FormControl defaultValue={input} onChange={ref => input = ref.target.value }  type="text" placeholder="Enter text" />
          </FormGroup>
          <FormGroup controlId="description">
            <ControlLabel>Short description</ControlLabel>
            <FormControl defaultValue={description} style={{resize: 'none'}} onChange={ref => description = ref.target.value } componentClass="textarea" placeholder="textarea" />
          </FormGroup>
        </div>
      }).then(async (b)=>{
        if(!b) return
        try {
          if(input===undefined || input.length===0){
            throw new Error('Project was not created. You have not given a name.');
          }else if(id==null){
            if(await projektService.add(input, description)) this.componentWillMount();
          }else{
            if(await projektService.change(id, input, description)) this.componentWillMount();
          }
        } catch (err) {
          this.projectModal(id, input, description, err.toString())
        }
      })
  }

  handleDelete(id){
    this.modalOpen({
        title: false,
        content: "Do you really want to delete the project?"
    }).then((b)=>{
      if(b) projektService.delete(id).then(this.componentWillMount).catch(this.msgError);
    })
  }

  componentWillMount(){
      projektService.getAll().then(list => {
          this.setState({
            projects: list
          });
      }).catch(this.msgError)
  }

  getHeader(){
    return <div>
        <Col lg={12}>
          <PageHeader>
            {this.props.pageHeader}
            <Button className="pull-right" bsStyle="success" onClick={()=>this.projectModal()} ><FontAwesomeIcon icon={Icons.faPlus} /> New Project</Button>
          </PageHeader>
        </Col>
      </div>
  }


  render() {
    console.log(this.state.projects);

    let content = this.state.projects.length>0?
      this.state.projects.map((d, i) => {
        return <ProjectView key={i} handleDelete={this.handleDelete} projectModal={this.projectModal} index={i} id={d.ID} name={d.NAME} description={d.DESCRIPTION} />
      }):
      <Col xs={12} sm={4} ><Alert bsStyle="warning">No projects available.</Alert></Col>


    return (
      <Private pageHeader={this.getHeader()}>
            {this.state.modal}
            {this.state.msg}

            {content}
      </Private>
    );
  }
}
