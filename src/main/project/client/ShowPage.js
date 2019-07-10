import React from 'react';
import MyComponent from '../../module/MyComponent';
import MyModal from '../../module/MyModal';
import { projektService } from '../../../module/services';
import { Tabs, Tab, Panel, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
// const patternBody = /<body[^>]*>((.|[\n\r])*)<\/body>/im
// const patternHead = /<head[^>]*>((.|[\n\r])*)<\/head>/im

export default class ShowPage extends MyComponent {

  static defaultProps = {
    title: 'Page',
    hasAdminPermission: false
  }

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.modalClose = this.modalClose.bind(this);
  }

  // setContent(v, key){
  //   console.log(this.state);
  //   if(this.state.versions[v].is){
  //     this.setState({
  //       key: key
  //     });
  //   }else{
  //     projektService.getPageContent(this.props.project_id, this.props.page_id, v).then(html => {
  //       this.setState(state =>{
  //
  //         try {
  //           let matchesBody = patternBody.exec(html);
  //           let matchesHead = patternHead.exec(html);
  //           if(matchesHead.length>0 && matchesBody.length>0)
  //           html = '<!DOCTYPE html><html>'+matchesHead[0]+matchesBody[0]+'</html>';
  //         } catch (e) {
  //           console.log(e);
  //         }
  //
  //
  //
  //         let iframe = state.versions[v].ref
  //
  //         let iframedoc = iframe.document;
  //         if (iframe.contentDocument) iframedoc = iframe.contentDocument;
  //         if (iframe.contentWindow) iframedoc = iframe.contentWindow.document;
  //
  //         if (iframedoc){
  //              // Put the content in the iframe
  //              iframedoc.open();
  //              iframedoc.writeln(html);
  //              iframedoc.close();
  //          } else {
  //             //just in case of browsers that don't support the above 3 properties.
  //             //fortunately we don't come across such case so far.
  //             alert('Cannot inject dynamic contents into iframe.');
  //          }
  //         state.versions[v].is = true;
  //         if(key!==undefined) state.key = key;
  //         return state;
  //       });
  //
  //     }).catch(this.msgError);
  //   }
  // }


  setContent(v, key){
    console.log(v, key);
    if(this.state.versions[v].is){
      this.setState({
        key: key
      });
    }else{
      projektService.getPageContent(this.props.project_id, this.props.page_id, v).then(text => {
        this.setState(state => {

          // console.log(text);

          state.versions[v].body = <div>{text}</div>

          state.versions[v].is = true;
          if(key!==undefined) state.key = key;
          return state;
        });

      }).catch(this.msgError);
    }
  }

  componentWillMount(){
    projektService.getPageVersions(this.props.project_id, this.props.page_id).then(list => {
      let firstVersions = Math.min.apply( Math, list );
      let versions = {};

      for (let v of list){
        versions[v] = {
          ref: null,
          body: null,
          is: false
        }
        // versions[v].iframe = <iframe title={v} ref={(ref) => versions[v].ref = ref} />;
        // console.log();
        versions[v].body = versions[v].ref;
      }
      this.setState({
        list: list,
        versions: versions,
        modal: null
      });
      if(list.length>0) this.setContent(firstVersions, firstVersions);
    }).catch(this.msgError);
  }

  handleSelect(key) {
    this.setContent(key, key);
  }

  handleRefresh(){
    this.setState(state => {
      state.versions[this.state.key].is = false;
      return state;
    });
    this.setContent(this.state.key, this.state.key);
  }

  handleDelete(){
    this.modalOpen({
        title: false,
        content: <p>Do you really want to delete this page-version {this.state.key+1}?</p>
      }).then((b)=>{
        if(b) projektService.deletePageContent(this.props.project_id, this.props.page_id, this.state.key).then(this.componentWillMount).catch(this.msgError);
      });
  }



  render() {
    if(this.state.list===undefined) return null;

    let content = this.state.list.length>0 ?
    <Tabs defaultActiveKey={this.state.key} activeKey={this.state.key} onSelect={this.handleSelect} id="showpage-tabs" >
    {Object.keys(this.state.versions).map((item, i) => {
      console.log(this.state.versions[i]);
      return <Tab key={i} eventKey={i} title={(i+1)}>
                <Panel>
                  <Panel.Heading>
                    <Button onClick={this.handleRefresh} className={"btn-circle"} ><FontAwesomeIcon icon={Icons.faSyncAlt} /></Button>
                    {delButton}
                  </Panel.Heading>
                  <Panel.Body>{this.state.versions[i].body}</Panel.Body>
                </Panel>
              </Tab>
    })}
    </Tabs>
    :
    'No content found'

    let delButton = !this.props.hasAdminPermission? null: <Button onClick={this.handleDelete} bsStyle="danger" className={"btn-circle pull-right"}><FontAwesomeIcon icon={Icons.faTrashAlt} /></Button>

    return (
      <div>
        {this.state.modal}
        {this.state.msg}
        <MyModal className={'showPage'} title={this.props.title} bsSize={'large'} disableFooter={true} closeButton={true} onClose={this.props.modalClose} >
        {content}
        </MyModal>
      </div>
    );
  }

}
