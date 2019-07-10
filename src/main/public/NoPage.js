import React from 'react';
import MyComponent from '../module/MyComponent';
import Public from '../Public';
import { Panel, Button, Alert } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

class NoPage extends MyComponent {

  mixins: [ History ]

  static defaultProps = {
    pageHeader: 'Login'
  }
  constructor(props){
    super(props);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  handleGoBack(){
    this.props.history.goBack();
  }


  render() {

    return (
      <Public title={<span>404</span>} titleClass={'big'} >
          {this.state.msg}

              <Panel className={'public-panel transparent'}>
                <Panel.Body>
                  <Alert bsStyle="danger">
                    <h4>Page not found!</h4>
                    <Button bsStyle="danger" bsSize="large" block onClick={this.handleGoBack}>Back</Button>
                  </Alert>
                </Panel.Body>
             </Panel>

      </Public>

    );
  }
}

export default withRouter(NoPage);
