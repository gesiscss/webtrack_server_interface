import React, { Component } from 'react';
import arrow from '../static/arrow.png'
import track from '../static/track.png'
import '../static/logo.css';
import Core from '../module/core.js';

export default class Public extends Component {

  static defaultProps =  {
    title: Core.data.projectName,
    titleClass: ''
  }
  /**
   * <div className="public-background" ></div>
   <div className="public-background-text" ></div>
   */

  render() {
    const connect = Core.data.development? <div className="footer" >Conntect to {Core.getServerURL()}</div> : null

    return (
      <div className="public-main" >
      <div className="public-background" ></div>
      <div className="public-background-text" ></div>

        <div className="container">
          <div className="login-wrapper" >
            <img  src={arrow} alt="arrow" className="arrow left" id="top_left" />
            <img  src={arrow} alt="arrow" className="arrow right" id="top_right" />
            <img  src={arrow} alt="arrow" className="arrow left bottom" id="bottom_left" />
            <img  src={arrow} alt="arrow" className="arrow right bottom" id="bottom_right" />
            <div className="arrow-wrapper" >
              <img  src={track} alt="track" id="track" />
              <span id='title' className={this.props.titleClass} >{this.props.title}</span>
              <div className="children scrollbar" >
                {this.props.children}
              </div>
            </div>

          </div>
       </div>
       {connect}
     </div>
    );
  }
}
