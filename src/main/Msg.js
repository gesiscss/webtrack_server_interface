import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Alert, Button } from 'react-bootstrap';

export default class Msg extends Component {

  static defaultProps = {
    close: false,
    link: '',
    msg: 'MSG',
    code: '',
    nr: ''
  }

  render() {
    const close = (this.props.close)? <Button className="close" data-dismiss="alert" aria-hidden="true">×</Button> : null;
    const link = (this.props.link.length>0)? <Link to={this.props.link} className="alert-link">Back</Link> : null;

    return (
        <Col lg={12}>
          <Alert bsStyle="warning" className="alert-dismissable">
              {close}
              <b>{this.props.nr}</b> {this.props.code}: {this.props.msg} {link}
          </Alert>
        </Col>
    );
  }
}
