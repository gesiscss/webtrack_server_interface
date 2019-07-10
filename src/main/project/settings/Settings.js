import React from 'react';
import MyComponent from '../../module/MyComponent';


import ClientSpecific from './ClientSpecific';
import Schedule from './Schedule';
import URLList from './URLList';
import ClientIds from './ClientIds';
import Extensionsfilter from './Extensionsfilter';
import StorageDestination from './StorageDestination';
import Permissons from '../permissons/Permissons';

import { Col, Row, Tab, Tooltip, OverlayTrigger, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"

export default class Settings extends MyComponent {

  static defaultProps = {
    handleSettings: ()=>{}
  }

  constructor(props){
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.tabs = [];
    this.state = {
      activeKey: null
    }
  }

  handleSelect(activeKey){
    // console.log(activeKey);
    this.setState({activeKey: activeKey})
  }


  render() {
    const tabs = [];


    tabs.push(
      {
        key: 'ClientSpecific',
        title: <span><FontAwesomeIcon icon={Icons.faSlidersH} /><span>Client Settings</span></span>,
        disabled: false,
        help: null,
        jsx: <ClientSpecific handleChange={this.props.handleSettings} settings={this.props.settings} />
      },
      {
        key: 'StorageDestination',
        title: <span><FontAwesomeIcon icon={Icons.faHdd} /><span>Storage Destination</span></span>,
        disabled: false,
        help: null,
        jsx: <StorageDestination is={this.props.settings.STORAGE_DESTINATION} project_id={this.props.project_id} handleChange={this.props.handleSettings} />
      },
      {
        key: 'Schedule',
        title: <span><FontAwesomeIcon icon={Icons.faCalendar} /><span>Schedule</span></span>,
        disabled: false,
        help: null,
        jsx: <Schedule isScheudle={this.props.settings.SCHEDULE} project_id={this.props.project_id} handleChange={this.props.handleSettings} />
      },
      {
        key: 'Extensionsfilter',
        title: <span><FontAwesomeIcon icon={Icons.faFilter} /><span>Extensionsfilter</span></span>,
        disabled: false,
        help: null,
        jsx: <Extensionsfilter list={this.props.settings.EXTENSIONSFILTER} project_id={this.props.project_id} handleChange={this.props.handleSettings}  />
      },
      {
        key: 'URLList',
        title: <span><FontAwesomeIcon icon={Icons.faListUl} /><span>URL-List</span></span>,
        disabled: false,
        help: null,
        jsx: <URLList active={this.props.settings.ACTIVE_URLLIST} whiteOrBlack={this.props.settings.URLLIST_WHITE_OR_BLACK} handleChange={this.props.handleSettings} project_id={this.props.project_id} />
      },
      {
        key: 'ClientIds',
        title: <span><FontAwesomeIcon icon={Icons.faIdBadge} /><span>Client-Ids</span></span>,
        help: 'Actived "Check client-ids" in client settings',
        disabled: !this.props.settings.CHECK_CLIENTIDS,
        jsx: <ClientIds project_id={this.props.project_id} />
      },
      {
        key: 'Permissons',
        title: <span><FontAwesomeIcon icon={Icons.faKey} /><span>Permissons</span></span>,
        help: 'You have no permissions',
        disabled: !this.props.hasAdminPermission,
        jsx: <Permissons project_id={this.props.project_id}/>
      }


    )


    let activeKey = tabs.length>0 && this.state.activeKey==null? tabs[0].key: this.state.activeKey;


    function MyTooltip(props) {
      if(props.help==null){
        return props.children;
      }else{
        return (
          <OverlayTrigger placement="bottom"
            overlay={<Tooltip id="tooltip">{props.help}</Tooltip>}
          ><div>{props.children}</div></OverlayTrigger>
        );
      }
    }


    return (
      <div>
        {this.state.msg}
        <Row>
          <Col lg={3}>
            <Panel>
              <ListGroup>
                {tabs.map((v,i)=>{
                   return <ListGroupItem key={i} onClick={e => this.handleSelect(v.key)}  active={v.key===activeKey} disabled={v.disabled}>
                            <MyTooltip help={v.disabled? v.help: null} >{v.title}</MyTooltip>
                          </ListGroupItem>
                })}
              </ListGroup>
            </Panel>
          </Col>
          <Col sm={9}>
            <Tab.Container id="settings-tabs" onSelect={()=>{}} activeKey={activeKey} defaultActiveKey={activeKey}>
              <Tab.Content animation>
                 {tabs.map((v,i)=> <Tab.Pane key={i} eventKey={v.key}>{v.jsx}</Tab.Pane> )}
               </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </div>
    );
  }

}
