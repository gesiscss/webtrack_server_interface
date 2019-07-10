import React, { Component } from 'react';


import { css } from 'react-emotion';
// First way to import
import { ClipLoader } from 'react-spinners';


const override = css`
    display: block;
    border-color: red;
    z-index: 1051;
    margin: 25% auto;
    left: 0;
    right: 0;
    position: fixed;
    top: 0;
`;


export default class Loading extends Component {

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }


  render(){
    return <div>
        <div className="background" style={{display: 'block', left: 0, 'zIndex': 1050}} ></div>
        <ClipLoader
          className={override}
          sizeUnit={"px"}
          size={150}
          color={'#ffffff'}
          loading={this.state.loading}
        />
      </div>
  }

}
