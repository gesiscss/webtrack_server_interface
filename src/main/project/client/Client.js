import React from 'react';
import MyComponent from '../../module/MyComponent';
import Loading from '../../module/Loading';
import { Panel, Button } from 'react-bootstrap';
import ClientTable from './ClientTable';
import ClientDataView from './ClientDataView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { projektService } from '../../../module/services';


export default class Client extends MyComponent {

  static defaultProps = { hasAdminPermission: false, client: [] }

  constructor(props){
    super(props);
    this.selectClient = this.selectClient.bind(this);
    this.state = {
      client_id: null,
      client: this.props.client,
      loading: null
    }
    this.syncHandle = this.syncHandle.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      client: nextProps.client
    })
  }


  selectClient(client_id){
    this.setState({
      client_id: client_id
    });
  }

  syncHandle(){
    this.setState({loading: <Loading />})
    projektService.sync(this.props.project_id).then(()=>{
      this.props.handleUpdateClients();
      this.setState({loading: null})
    }).catch( err => {
      this.setState({loading: null})
      this.msgError(err)
    });
  }

  render() {
    // console.log(this.props.settings);
    if(this.props.client===undefined) return <div>{this.state.msg}</div>;
    let DataView = this.state.client_id==null? null: <ClientDataView project_id={this.props.project_id} settings={this.props.settings} client_id={this.state.client_id} handleSettings={this.props.handleSettings} hasAdminPermission={this.props.hasAdminPermission} />

    let SycButton = <Button className="pull-right"  onClick={this.props.settings.STORAGE_DESTINATION? this.syncHandle: this.props.handleUpdateClients} ><FontAwesomeIcon icon={Icons.faSync} /></Button>

    return (
      <Panel>
        {this.state.loading}
        {this.state.msg}
        <Panel.Heading className="panel-flex" >
          <Panel.Title componentClass="h3" >Clients</Panel.Title>
          {SycButton}
        </Panel.Heading>

        <Panel.Body>
          <ClientTable client={this.state.client} selectClient={this.selectClient} />
          {DataView}
        </Panel.Body>
      </Panel>
    );
  }
}
