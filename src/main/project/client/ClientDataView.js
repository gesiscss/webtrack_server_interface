import React from 'react';
import MyComponent from '../../module/MyComponent';
import Loading from '../../module/Loading';
import { Tabs, Tab } from 'react-bootstrap';
import TreeView from './TreeView';
import HistoryView from './HistoryView';
import ShowPage from './ShowPage';
import ShowEvents from './ShowEvents';
import { urllistService, projektService } from '../../../module/services';


export default class ClientDataView extends MyComponent {

  static defaultProps = {
    hasAdminPermission: false,
    settings: {},
    handleSettings: ()=>{}
  }

  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.deletePages = this.deletePages.bind(this);
    this.openPage = this.openPage.bind(this);
    this.openEvents = this.openEvents.bind(this);
    this.state = {
      loading: null
    }
  }

  componentWillReceiveProps(nextProps){
    this.setPages(nextProps.client_id);

  }

  componentWillMount(){
    // console.log(this.props.settings.ACTIVE_URLLIST === false);
    //
    // console.log(this.props.settings.URLLIST_WHITE_OR_BLACK === false);

    this.setPages(this.props.client_id);
  }

  async setPages(client_id){
    try {
      let pages = await projektService.getClientPages(this.props.project_id, client_id);
      this.id2Index = {}
      for (let i in pages) this.id2Index[pages[i].ID] = i;

      this.setState({
        pages: pages,
        loading: null
      });
    } catch (err) {
      this.msgError(err)
    }
  }

  deletePages(ids){
   this.modalOpen({
      title: false,
      content: <p>Do you really want to delete all pages?</p>
    }).then(async (b)=>{
      try {
        if(b) {
          this.setState({ loading: <Loading /> })
          await projektService.deletePage(this.props.project_id, ids);
          this.componentWillMount();
        }
      } catch (err) {
        this.msgError(err);
      }
    });
  }

  getPage(id){
    return this.state.pages[this.id2Index[id]];
  }

  /**
   * [extractRootDomain get from url the domain]
   * @param  {String} url        [e.g. https://www.google.de/search?q=]
   * @return {String} domain     [e.g. google.de]
   */
  extractRootDomain(url){
      var hostname;
      if (url.indexOf("//") > -1)
          hostname = url.split('/')[2];
      else
          hostname = url.split('/')[0];

      hostname = hostname.split(':')[0];
      hostname = hostname.split('?')[0];

      var domain = hostname,
          splitArr = domain.split('.'),
          arrLen = splitArr.length;

      if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
          if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
              domain = splitArr[arrLen - 3] + '.' + domain;
          }
      }
      return domain;
  }


  _question_white_blacklist(){
    return new Promise((resolve, reject)=>{
      if(!this.props.settings.URLLIST_WHITE_OR_BLACK)
        resolve();
      else
        this.modalOpen({
          title: false,
          content: <p>Urllist is not set as a blacklist! Do you want to add the URL anyway?</p>
        }).then((b)=>{
          b? resolve(): reject();
        });
    });
  }

  _question_active_urlist(){
    return new Promise((resolve, reject)=>{

      if(this.props.settings.ACTIVE_URLLIST)
        resolve();
      else{
        this.modalOpen({
          title: false,
          content: <p>Urllist is not active. You want activate it?</p>
        }).then((b)=>{
          if(b)
            this.props.handleSettings('ACTIVE_URLLIST', true, ()=>resolve());
          else
           reject();
        });
      }
    });
  }

  _removeURL(id){
    return new Promise((resolve, reject)=>{
      projektService.deletePage(this.props.project_id, [id]).then(resolve).catch(this.msgError);
    })
  }

  _addDomain2URLList(url){
    return new Promise((resolve, reject)=>{
      urllistService.add(this.props.project_id, [url]).then(resolve).catch(this.msgError);
    });
  }

  delete(id, title){
    let url = this.extractRootDomain(this.getPage(id).URL);
    this.modalOpen({
      title: false,
      content: <p>Do you really want to delete this page ({title})?</p>
    }).then(async (b)=>{
      try {
        if(b){
          this.setState({
            loading: <Loading />
          })
          await this._removeURL(id);
          this.setState({
            loading: null
          })

          this.modalOpen({
              title: false,
              content: <p>You want to add <b>{url}</b> to the URL-list?</p>
          }).then((b)=>{
              if(b)
                this._question_active_urlist().then(() => this._question_white_blacklist().then(() => this._addDomain2URLList(url).then(()=> this.componentWillMount()) ))
              else
                this.componentWillMount()
          })
        }
      } catch (e) {
          this.msgError(e)
      }
    });
  }

  openPage(id, title){
    this.setState({
      modal: <ShowPage project_id={this.props.project_id} page_id={id} title={title} modalClose={this.modalClose} hasAdminPermission={this.props.hasAdminPermission} />
    })
  }

  openEvents(id, title){
    this.setState({
      modal: <ShowEvents project_id={this.props.project_id} page_id={id} title={title} modalClose={this.modalClose} hasAdminPermission={this.props.hasAdminPermission} />
    })
  }

  render() {
    if(this.state.pages===undefined) return null;

    return (
        <div>
         {this.state.modal}
         {this.state.msg}
         {this.state.loading}

         <Tabs defaultActiveKey={1} id="clientdata-tabs">
               <Tab eventKey={1} title="Tree">
                 <TreeView pages={this.state.pages} open={{
                   page: this.openPage,
                   events: this.openEvents
                 }} deletePages={this.deletePages} hasAdminPermission={this.props.hasAdminPermission} />
               </Tab>
               <Tab eventKey={2} title="History">
                <HistoryView pages={this.state.pages} delete={this.delete} open={{
                  page: this.openPage,
                  events: this.openEvents
                }} hasAdminPermission={this.props.hasAdminPermission}/>
               </Tab>
          </Tabs>
        </div>
    );
  }

}
