import React, { Component } from 'react';

import { Modal, Button } from 'react-bootstrap';


export default class MyModal extends Component {

  static defaultProps = {
    show: true,
    title: 'Modal heading',
    bsSize: false,
    closeButton: false,
    onSuccess: () =>{},
    onOpen:  () =>{},
    onCancel: ()=>{},
    onClose: ()=>{},
    changeState: ()=>{},
    disableFooter: false,
    className: ''
  }

  constructor(props, context) {
      super(props, context);

      this.handleShow = this.handleShow.bind(this);
      this.handleSuccess = this.handleSuccess.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      

      this.state = {
        show: this.props.show
      };

    }

    handleSuccess() {
      this.setState({ show: false });
      this.props.onSuccess();
    }

    handleCancel(){
      this.setState({ show: false });
      this.props.onCancel();
    }

    handleShow() {
      this.setState({ show: true });
      this.props.onOpen();
    }


    render() {
      const buttonAccept = typeof this.props.onSuccess !=='function'? null: <Button bsStyle="success" onClick={this.handleSuccess}>Accept</Button>
      const buttoCancel = typeof this.props.onCancel !=='function'? null:   <Button onClick={this.handleCancel}>Cancel</Button>

      const Footer = !this.props.disableFooter? <Modal.Footer> {buttoCancel} {buttonAccept} </Modal.Footer> : null

      const title = typeof this.props.title==='boolean' && !this.props.title? null: <Modal.Header closeButton={this.props.closeButton}> <Modal.Title>{this.props.title}</Modal.Title></Modal.Header>
      const bsSize = this.props.bsSize? {bsSize: this.props.bsSize} : null
      return (
        <div>
          <Modal {...bsSize} show={this.state.show} className={this.props.className} onHide={this.props.onClose}>
            {title}
            <Modal.Body>
              {this.props.children}
            </Modal.Body>
            {Footer}
          </Modal>
        </div>
      );
    }
  }
