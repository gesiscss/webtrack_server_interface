import React from 'react';
import MyComponent from '../module/MyComponent';
import Private from '../Private';
import Client from './client/Client';
import Downloads from './downloads/Downloads';
import Settings from './settings/Settings';
import { settingsService, projektService } from '../../module/services';
import Toggle from 'react-bootstrap-toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import { Tab, Col, PageHeader, Row, Nav, NavItem} from 'react-bootstrap';


export default class Project extends MyComponent {

  static defaultProps = {
    pageHeader: 'xy',
    offstyle: 'default',
    on: <span><FontAwesomeIcon icon={Icons.faPlay} /><span>Project active</span></span>,
    off: <span><FontAwesomeIcon icon={Icons.faStop} /><span>Project off</span></span>,
  }

  constructor(props){
    super(props);
    this.error = true;
    this.onToggle = this.onToggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDonwload = this.handleDonwload.bind(this);
    this.handleFilterIds = this.handleFilterIds.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleUpdateClients = this.handleUpdateClients.bind(this);

    this.project_id = parseInt(this.props.match.params.id, 10);

    this.tabsKeys = [];
    this.filterIds = [];
    this.state = {
      // activeKey: "Client",
      activeKey: "Client",
      download: false,
    }
  }

  /**settings**/
  async handleSettings(id, value, db=true){
    try {

      if(typeof value === 'boolean' && db === true){
        await settingsService.changeBoolean(this.project_id, id, value);
      }else if(db === true) {
        await settingsService.changeValue(this.project_id, id, value);
      }
      this.setState(state => {
        state.settings[id] = value;
        return state;
      });
    } catch (e) {
      this.msgError(e)
    }
  }

  /******/
  async componentWillMount() {
    try {
      let e = await projektService.get(this.project_id);
      // console.log(e);
      e.hasAdminPermission = await projektService.hasAdminPermission(this.project_id);
      e.settings = await settingsService.get(this.project_id);
      e.client = await projektService.getClients(this.project_id);
      e.download = e.client.length>0;
      e.project_id = this.project_id;

      this.setState(e);
    } catch (e) {
      this.msgError(e);
    }
  }

  async handleUpdateClients(){
    try {
      let e = {};
      e.client = await projektService.getClients(this.project_id);
      e.download = e.client.length>0;
      this.setState(e);
    } catch (e) {
      this.msgError(e);
    }
  }

  handleFilterIds(ids){
    this.filterIds = ids;
  }

  onToggle(b) {
    settingsService.changeBoolean(this.project_id, 'ACTIVE', b).then(()=>{
      this.setState({ ACTIVE: b });
    }).catch(this.msgError);
  }

  handleSelect(selectedKey){
    if(this.tabsKeys.includes(selectedKey))
      this.setState({ activeKey:  selectedKey})
    else if(this.hasOwnProperty(selectedKey))
      this[selectedKey]();
    else if (selectedKey.includes('{') && selectedKey.includes('}') && this.hasOwnProperty( JSON.parse(selectedKey).f )){
      let p = JSON.parse(selectedKey);
      this[p.f](p.param);
    }
  }

  handleDonwload(level=1){
    projektService.download(this.project_id, this.filterIds, level).then(e => {
      this.createDownload(JSON.stringify(e), "application/json", 'TrackingProject_'+this.project_id+'.json');
    }).catch(this.msgError)

  }


  getHeader(){
    return <div>
        <Col lg={12}><PageHeader>{this.state.NAME}
          <Toggle
              onClick={this.onToggle}
              on={this.props.on}
              off={this.props.off}
              offstyle={this.props.offstyle}
              active={this.state.ACTIVE}
              className={'pull-right'}
            />
            </PageHeader>
        </Col>
      </div>
  }

  render() {
    if(this.state.error===true) return <Private pageHeader={this.getHeader()}>{this.state.msg}</Private>

    if(this.state.ID===undefined) return null;
    this.tabsKeys = [];


    let tabs = [
      {
        title: <FontAwesomeIcon icon={Icons.faDownload} />,
        key: "Downloads",
        jsx: <Downloads project_id={this.project_id} handleFilterIds={this.handleFilterIds} enable={this.state.client.length>0} />
      },
      {
        title: <div><FontAwesomeIcon icon={Icons.faUsers} /><span>Clients</span></div>,
        key: "Client",
        jsx: <Client project_id={this.project_id} handleUpdateClients={this.handleUpdateClients} client={this.state.client}  hasAdminPermission={this.state.hasAdminPermission} handleSettings={this.handleSettings} settings={this.state.settings}  />
      }
    ]
    this.tabsKeys.push("Client", "Downloads");


    if(this.state.hasAdminPermission){
      tabs.push(
        {
          title: <div><FontAwesomeIcon icon={Icons.faCog} /><span>Settings</span></div>,
          key:   "Settings",
          jsx: <Settings project_id={this.project_id} settings={this.state.settings} handleSettings={this.handleSettings} hasAdminPermission={this.state.hasAdminPermission} />
        }
      );
      this.tabsKeys.push("Settings");
    }

    return (
      <Private pageHeader={this.getHeader()}>
        {this.state.msg}
        <Col lg={12} >

          <Row className="clearfix">
            <Col sm={12}>
              <Nav bsStyle="tabs" activeKey={this.state.activeKey} onSelect={this.handleSelect} >
                {tabs.map((v,i)=>{
                    return <NavItem key={i} eventKey={v.key}>{v.title}</NavItem>
                })}
              </Nav>
            </Col>

            <Col sm={12}>
              <Tab.Container id="project-tabs" onSelect={()=>{}} activeKey={this.state.activeKey} defaultActiveKey={this.state.activeKey}>
                <Tab.Content animation>
                   {tabs.map((v,i)=> <Tab.Pane key={i} eventKey={v.key}>{v.jsx}</Tab.Pane> )}
                 </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>

       </Col>
      </Private>
    );
  }

}
