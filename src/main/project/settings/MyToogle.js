import React, { Component } from 'react';
import Toggle from 'react-bootstrap-toggle';


import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';

export default class MyToogle extends Component {

  static defaultProps = {
    default: true,
    id: null,
    onToggle: (id, b) =>{},
    hoverText: 'hoverText',
    text: 'text',
    offstyle: 'default',
    on: 'on',
    off: 'off'
  }

  onToggle(type, b){
    // console.log(type, b);
    this.props.onToggle(type, b);
  }

  render() {

    const popoverHoverFocus = (
      <Popover id="popover-trigger-hover-focus">{this.props.hoverText}</Popover>
    );

    
    return (
      <div className={'mytoogle'}>
        <Col lg={12}>
          <Row>
            <Col lg={4} xs={6}>
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}>
                <span>{this.props.text}</span>
              </OverlayTrigger>
            </Col>
            <Col lg={8} xs={6}>
              <Toggle
                  onClick={b => {this.onToggle(this.props.id, b)}}
                  on={this.props.on}
                  off={this.props.off}
                  offstyle={this.props.offstyle}
                  active={this.props.default}
                />
            </Col>
          </Row>
        </Col>

      </div>
    );
  }

}
