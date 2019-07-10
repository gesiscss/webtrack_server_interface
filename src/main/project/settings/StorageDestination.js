import React from 'react';
import MyComponent from '../../module/MyComponent';
import { Panel, Form, FormGroup, Col, ControlLabel, FormControl, Alert, Button, HelpBlock} from 'react-bootstrap';
import { settingsService } from '../../../module/services';
import ShowPassword from '../../module/ShowPassword';
import Loading from '../../module/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import Toggle from 'react-bootstrap-toggle';
import moment from 'moment';

const DESTINATION = 'aws';

export default class StorageDestination extends MyComponent {

  static defaultProps = {
    offstyle: 'default',
    on: 'on',
    off: 'off',
    is: false,
    handleChange: ()=>{}
  }
  static cleanConfig = {
    FULLRIGTH_ACCESSKEYID: "",
    FULLRIGTH_NAME: "",
    FULLRIGTH_SECRETACCESSKEY: "",
    BUCKET: "",
    WRITEONLY_ACCESSKEYID: "",
    WRITEONLY_NAME: "",
    WRITEONLY_SECRETACCESSKEY: "",
    cron: {
      ENABLE: false,
      SECINTERVAL: 5
    }
  }

  constructor(props) {
    super(props)
    this.onToggle = this.onToggle.bind(this);
    this.config = null;
    this.state = {
      config: this.cleanConfig,
      change: false
    }
    this.changeConfig = this.changeConfig.bind(this);
    this.saveConfig = this.saveConfig.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.update(nextProps);
  }

  componentWillMount(){
    this.update(this.props)
  }

  getConfig(){
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.config == null)
          this.config = await settingsService.storageGet(this.props.project_id);
          resolve(this.config)
      } catch (e) {
        reject(e)
      }
    });
  }

  async update(props){
    try {
      let config = props.is ? await this.getConfig(): null
      this.setState(state => {
        state.modal = null;
        state.is = props.is
        if(config!=null) state.config = config;
        return state;
      });
      // if(!props.is) this.onToggle(true);
    } catch (e) {
      this.msgError(e)
    }

  }

  changeConfig(id, value){
    this.setState(state => {
      if(state.config.hasOwnProperty(id)){
        state.config[id] = value;
      }else{
        for (let e in state.config) {
          if(state.config[e].hasOwnProperty(id)) state.config[e][id] = value;
        }
      }
      state.change = true;
      return state;
    });
  }

  saveConfig(){
    settingsService.storageChange(this.props.project_id, this.state.config).then(()=>{
      this.setState({change: false, modal: null});
    }).catch(this.msgError);
  }

  addCredentials(accessKeyId='', secretAccessKey='cqA3i3V+MiBx/GrBtozJgnmJLVt06DPyNr6YBRIU', error=null){
    return new Promise((resolve, reject)=>{
      if(error!=null) error = <Alert bsStyle="danger" ><div><strong>{error.nr} {error.code}</strong> {error.message} </div></Alert>

      this.modalOpen({
          title: "Please provide the following credentials",
          content:  <Form horizontal>
                <Alert bsStyle="warning">
                  Please note that the user has the right <b>IAMFullAccess</b> & <b>AmazonS3FullAccess</b>.
                </Alert>
                {error}
                <FormGroup controlId="AccessKeyId">
                  <Col componentClass={ControlLabel} sm={3}>AccessKeyId</Col>
                  <Col sm={9}>
                    <FormControl type="text" placeholder="AccessKeyId" defaultValue={accessKeyId} onChange={e => accessKeyId = e.target.value} />
                  </Col>
                </FormGroup>

                <FormGroup controlId="SecretAccessKey">
                  <Col componentClass={ControlLabel} sm={3}>SecretAccessKey</Col>
                  <Col sm={9}>
                    <ShowPassword onChange={e => secretAccessKey = e.target.value} defaultValue={secretAccessKey} placeholder="SecretAccessKey" style={{margin: 0}}/>
                  </Col>
                </FormGroup>

            </Form>
      }).then(async b => {
        if(b){
          try {
            this.setState({modal: <Loading />})
            let config = await settingsService.storageSet(this.props.project_id, DESTINATION, {AccessKeyId: accessKeyId, SecretAccessKey: secretAccessKey})
            resolve(config);
          } catch (err) {
            this.addCredentials(accessKeyId, secretAccessKey, err);
          }
        }
      });
    });
  }

  onToggle(b=false) {
    if(b){
      this.addCredentials().then(config => {
        this.setState(state => {
          state.modal = null;
          state.is = true;
          state.config = config;
          return state;
        })
      })
    }else{
      this.modalOpen({
          title: false,
          content: <div>Do you really want to disable the storage destination?
                    <br/>
                    <b>Attention</b>: Please note that all data will be deleted!</div>
      }).then((b)=>{
          if(b){
            settingsService.storageRemove(this.props.project_id).then(()=>{
                this.props.handleChange('STORAGE_DESTINATION', false, false);
                this.config = null;
                this.setState({is: false, config: this.cleanConfig})
            }).catch(this.msgError);
          }
      });
    }

  }

  render() {
    let content = !this.state.is? <p>Storage destination is not activated</p>:
    <div>
      <Form horizontal>

        <HelpBlock>SETTINGS</HelpBlock>
        <FormGroup controlId="Update-Interval (min)">
          <Col componentClass={ControlLabel} sm={4} xs={12}>
          <Toggle
              onClick={b => this.changeConfig('ENABLE', b) }
              on={'Update Interval'}
              off={'Update disabled'}
              offstyle={this.props.offstyle}
              active={this.state.config.cron.ENABLE}
            />
          </Col>
          <Col sm={8}>
            <FormControl disabled={!this.state.config.cron.ENABLE} type="number" min="1" placeholder="90" defaultValue={Math.round(this.state.config.cron.SECINTERVAL/60)} onChange={e => this.changeConfig('SECINTERVAL', e.target.value*60)} />
            <HelpBlock>Details in minutes</HelpBlock>
          </Col>
        </FormGroup>

        <FormGroup controlId="Update-Interval (min)">
          <Col componentClass={ControlLabel} sm={4} xs={12}>
            Last synchronization
          </Col>
          <Col sm={8}>
            <HelpBlock>{moment(this.state.config.cron.LASTACTIVITY).format('YYYY-MM-DD HH:mm:ss')}</HelpBlock>
          </Col>
        </FormGroup>

        <hr/>
        <FormGroup controlId="Bucket-URL">
          <Col componentClass={ControlLabel} sm={4} xs={12}>Bucket</Col>
          <Col sm={8}>
            <FormControl type="text" placeholder="Bucket-URL" defaultValue={this.state.config.BUCKET} onChange={e => this.changeConfig('BUCKET', e.target.value)} />
          </Col>
        </FormGroup>

        <hr/>
        <HelpBlock>FULLRIGTH USER</HelpBlock>
        <FormGroup controlId="FULLRIGTH_NAME">
          <Col componentClass={ControlLabel} sm={4} xs={12}>Name</Col>
          <Col sm={8}>
            <FormControl type="text" placeholder="Name" defaultValue={this.state.config.FULLRIGTH_NAME} onChange={e => this.changeConfig('FULLRIGTH_NAME', e.target.value)} />
          </Col>
        </FormGroup>

         <FormGroup controlId="FULLRIGTH_ACCESSKEYID">
           <Col componentClass={ControlLabel} sm={4} xs={12}>AccesskeyId</Col>
           <Col sm={8}>
             <FormControl type="text" placeholder="AccesskeyId" defaultValue={this.state.config.FULLRIGTH_ACCESSKEYID} onChange={e => this.changeConfig('FULLRIGTH_ACCESSKEYID', e.target.value)} />
           </Col>
         </FormGroup>

         <FormGroup controlId="FULLRIGTH_NAME">
           <Col componentClass={ControlLabel} sm={4} xs={12}>SecretAccessKey</Col>
           <Col sm={8}>
             <ShowPassword defaultValue={this.state.config.FULLRIGTH_SECRETACCESSKEY} placeholder="SecretAccessKey" style={{margin: 0}} onChange={e => this.changeConfig('FULLRIGTH_SECRETACCESSKEY', e.target.value)}/>
           </Col>
        </FormGroup>

        <hr/>
        <HelpBlock>WRITEONLY USER</HelpBlock>

        <FormGroup controlId="WRITEONLY_NAME">
          <Col componentClass={ControlLabel} sm={4} xs={12}>Name</Col>
          <Col sm={8}>
            <FormControl type="text" placeholder="Name" defaultValue={this.state.config.WRITEONLY_NAME} onChange={e => this.changeConfig('WRITEONLY_NAME', e.target.value)} />
          </Col>
        </FormGroup>

         <FormGroup controlId="WRITEONLY_ACCESSKEYID">
           <Col componentClass={ControlLabel} sm={4} xs={12}>AccesskeyId</Col>
           <Col sm={8}>
             <FormControl type="text" placeholder="AccesskeyId" defaultValue={this.state.config.WRITEONLY_ACCESSKEYID} onChange={e => this.changeConfig('WRITEONLY_ACCESSKEYID', e.target.value)} />
           </Col>
         </FormGroup>

         <FormGroup controlId="WRITEONLY_SECRETACCESSKEY">
           <Col componentClass={ControlLabel} sm={4}>SecretAccessKey</Col>
           <Col sm={8}>
             <ShowPassword defaultValue={this.state.config.WRITEONLY_SECRETACCESSKEY} placeholder="SecretAccessKey" style={{margin: 0}} onChange={e => this.changeConfig('WRITEONLY_SECRETACCESSKEY', e.target.value)}/>
           </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            <Button bsStyle="success" disabled={!this.state.change} onClick={this.saveConfig}><FontAwesomeIcon icon={Icons.faSave} /> Save changes</Button>
          </Col>
        </FormGroup>

       </Form>
    </div>;


    return (
      <Panel>

        {this.state.modal}
        {this.state.msg}

        <Panel.Heading>
          <Panel.Title componentClass="h3" className={'panel-flex'}>
          Storage Destination

          <Toggle
              onClick={this.onToggle}
              on={this.props.on}
              off={this.props.off}
              offstyle={this.props.offstyle}
              active={this.state.is}
            />

          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {content}
        </Panel.Body>
      </Panel>
    );
  }

}
