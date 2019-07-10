import React from 'react';
import MyComponent from '../../module/MyComponent';
import { urllistService } from '../../../module/services';
import DynamicTable from '../../module/DynamicTable';
import Toggle from 'react-bootstrap-toggle';
import { Panel } from 'react-bootstrap';

const COLUMES = [
  {
    filter: true,
    id: 'URL',
    header: 'URL',
    type: 'value'
  },
  {
    filter: false,
    id: 'CREATEDATE',
    header: 'Create Date',
    type: 'date'
  }
]


export default class URLList extends MyComponent {

  static defaultProps = {
    offstyle: 'default',
    on: 'active',
    off: 'off',
    white: 'White-List',
    black: 'Black-List',
    whiteOrBlack: true,
    active: false,
  }


  constructor(props) {
    super(props)
    this.fetchData = this.fetchData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClear = this.onClear.bind(this);
    this._onToggleActive = this._onToggleActive.bind(this);
    this._onToggleWhiteBlack = this._onToggleWhiteBlack.bind(this);

    this.state = {
      active: this.props.active,
      whiteOrBlack: this.props.whiteOrBlack
    };
  }


  _onToggleActive(b){
    this.props.handleChange('ACTIVE_URLLIST', b)
  }

  _onToggleWhiteBlack(b){
    this.props.handleChange('URLLIST_WHITE_OR_BLACK', b)
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      active: nextProps.active,
      whiteOrBlack: nextProps.whiteOrBlack,
    });
  }

  fetchData(min, max, sorted=[], filtered=[]){
    return new Promise(async (resolve, reject)=>{
      try {
        let urls = await urllistService.get(this.props.project_id, [min, max], sorted, filtered);
        let c = await urllistService.getCount(this.props.project_id);
        resolve({values: urls, count: c})
      } catch (e) {
        this.msgError(e)
      }
    });
  }

  onAdd(values=[]){
    return new Promise((resolve, reject)=>{
      urllistService.add(this.props.project_id, values).then(resolve).catch(this.msgError);
    })
  }

  onChange(id=null, values=[]){
    return new Promise((resolve, reject)=>{
      if(id!=null) urllistService.change(this.props.project_id, id, values).then(resolve).catch(this.msgError);
    })
  }

  onDelete(id=null){
    return new Promise((resolve, reject)=>{
      if(id!=null) urllistService.delete(this.props.project_id, id).then(resolve).catch(this.msgError);
    })
  }

  onClear(){
    return new Promise((resolve, reject)=>{
      urllistService.clean(this.props.project_id).then(resolve).catch(this.msgError);
    })
  }

  render() {

    let Buttons = !this.state.active? null:
        <Toggle
              onClick={this._onToggleWhiteBlack}
              on={this.props.white}
              off={this.props.black}
              offstyle={this.props.offstyle}
              active={this.state.whiteOrBlack}
              className={'whiteOrBlack'}
            />

    let Content = !this.state.active? null: <DynamicTable onClear={this.onClear} onDelete={this.onDelete} onAdd={this.onAdd} onChange={this.onChange} columes={COLUMES} fetchData={this.fetchData} />

    return (<div>
        {this.state.modal}
        {this.state.msg}
        <Panel>
        <Panel.Heading className={'panel-flex'}>
              <Panel.Title componentClass="h3"><span>URL-List </span>
                <Toggle
                  onClick={this._onToggleActive}
                  on={this.props.on}
                  off={this.props.off}
                  offstyle={this.props.offstyle}
                  active={this.state.active}
                />
              </Panel.Title>
              {Buttons}
            </Panel.Heading>
            <Panel.Body>
             {Content}
            </Panel.Body>
        </Panel>

      </div>)
  }

}
