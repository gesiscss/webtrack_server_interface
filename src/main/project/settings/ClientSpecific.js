import React from 'react';
import MyComponent from '../../module/MyComponent';


import MyToogle from './MyToogle';

import { Panel, HelpBlock } from 'react-bootstrap';

export default class ClientSpecific extends MyComponent {

  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.state = props.settings;
  }

  componentWillReceiveProps(nextProps){
    this.setState( nextProps.settings )
  }

  onToggle(id, b) {
    this.props.handleChange(id, b);
  }



  render() {
    let editHistory = !this.state.SHOWHISTORY? null: <MyToogle id={'EDITHISTORY'} text={'Edit history'} on={'Enable'} off={'Disable'} default={this.state.EDITHISTORY} onToggle={this.onToggle} hoverText={
      <div> The user has the possibility to edit the history</div>
     }/>

     let check_clientids = !this.state.ENTERID? null: <MyToogle id={'CHECK_CLIENTIDS'} text={'Check client-ids'} on={'Enable'} off={'Disable'} default={this.state.CHECK_CLIENTIDS} onToggle={this.onToggle} hoverText={
       <div> Checks the entered client id</div>
      }/>
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Client specific</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
              <MyToogle id={'ENTERID'} text={'ID-Client determination'}  on={'Self-input'} off={'Randomization'} default={this.state.ENTERID} onToggle={this.onToggle} hoverText={
                <div>
                <b>Self-input:</b> The client must enter an ID
                <br/>
                <b>Randomization:</b> ID is generated automatically
                </div>
               }/>
               {check_clientids}
               <MyToogle id={'SENDDATAAUTOMATICALLY'} text={'Sending the data automatically'} on={'Automatically'} off={'Manually'} default={this.state.SENDDATAAUTOMATICALLY} onToggle={this.onToggle} hoverText={
                 <div>
                 <b>Automatically:</b> Data is sent automatically
                 <br/>
                 <b>Manually:</b> The client must send the data via button
                 </div>
                }/>
                <MyToogle id={'PRIVATEBUTTON'} text={'Private-button'} on={'Enable'} off={'Disable'} default={this.state.PRIVATEBUTTON} onToggle={this.onToggle} hoverText={
                  <div> The private button allows the user to disable the tracking </div>
                 }/>
                 <MyToogle id={'SHOW_DOMAIN_HINT'} text={'Show domain hint'} on={'Enable'} off={'Disable'} default={this.state.SHOW_DOMAIN_HINT} onToggle={this.onToggle} hoverText={
                   <div> Show hint if the domain is tracked or not</div>
                  }/>
               <MyToogle id={'SHOWHISTORY'} text={'Show History'} on={'Enable'} off={'Disable'} default={this.state.SHOWHISTORY} onToggle={this.onToggle} hoverText={
                 <div> The user has the possibility to observe the course</div>
                }/>
                {editHistory}
                <hr/>
                <h4>Extension Settings</h4>
                <HelpBlock>Works only by Plugin-Extension</HelpBlock>
                <MyToogle id={'FORGOT_ID'} text={'Forgot the client-id'} on={'Enable'} off={'Disable'} default={this.state.FORGOT_ID} onToggle={this.onToggle} hoverText={
                  <div> After closing the browser, the user have to login with his id</div>
                 }/>
                <MyToogle id={'PRIVATETAB'} text={'Allow private tab'} on={'Enable'} off={'Disable'} default={this.state.PRIVATETAB} onToggle={this.onToggle} hoverText={
                 <div> Allow the user to set the tabs to private</div>
                }/>

        </Panel.Body>
      </Panel>
    );
  }

}
