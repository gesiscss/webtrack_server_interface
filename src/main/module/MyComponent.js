import React, { Component } from 'react';
import MyModal from '../module/MyModal';
import { Alert } from 'react-bootstrap';

export default class MyComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modal: null,
      msg: null
    }
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.msgOpen = this.msgOpen.bind(this);
    this.msgClose = this.msgClose.bind(this);
    this.msgError = this.msgError.bind(this);
    this.modalUpdate = this.modalUpdate.bind(this);


    if(this.componentWillMount!==undefined) this.componentWillMount = this.componentWillMount.bind(this);

  }

  modalOpen(settings){
    return new Promise((resolve, reject)=>{
      settings = Object.assign({
                                content: <div/>,
                                show: true,
                                title: 'Modal heading',
                                bsSize: false,
                                closeButton: false,
                                onOpen:  () =>{},
                                onClose: ()=>{},
                                disableFooter: false,
                                onSuccess: () => {
                                  resolve(true);
                                  this.modalClose();
                                },
                                onCancel: () => {
                                  this.modalClose();
                                  resolve(false);
                                },
                                className: ''}, settings);
        this.modalUpdate(settings);


    });
  }

  modalUpdate(settings){
    this.setState({
      modal: <MyModal {...settings} >
        {settings.content}
      </MyModal>
    })
  }

  modalClose(){
    this.setState({
      modal: null
    })
  }



  msgError(err){
    console.log(err);
    let message = '',
    code='',
    nr='';
    if(typeof err==='object'){
      message = err.message;
      code = err.code;
      nr = err.nr;
    }

    if(code!==undefined && code.length>0) code+=': ';
    this.msgOpen({dismiss: true, bsStyle: 'danger', text: <div><strong>{nr} {code}</strong> {message} </div>}, true);
  }

  msgOpen(settings, error=false){
    return new Promise((resolve, reject)=>{

      settings = Object.assign({
                                bsStyle: 'warning',
                                dismiss: true,
                                timeout: 10000,
                                closeLabel: 'Message',
                                text: 'Your text'
                                }, settings);

      let onDismiss = settings.dismiss? {onDismiss: ()=>{
        resolve();
        this.msgClose();
      }}: {}

      // settings.bsStyle += ' msg'


      this.setState({
          msg: <Alert
                closeLabel={settings.closeLabel}
                className={'msg'}
                bsStyle={settings.bsStyle}
                {...onDismiss}
                >{settings.text}</Alert>,
          error: error
      });

      if(typeof settings.timeout==='number'){
        setTimeout(()=>{
          resolve();
          this.msgClose();
        }, settings.timeout)
      }

    });

  }

  msgClose(){
    this.setState({
      msg: null
    })
  }

  createDownload(content='', type='application/json', name="download.txt"){
    let blob = null;
    if(typeof content === 'string'){
      blob = new Blob([content], {type: type});
    }else{
      blob = content;
    }
    let a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  }


}
