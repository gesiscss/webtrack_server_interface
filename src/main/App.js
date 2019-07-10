import React, { Component } from 'react';
import Dashboard from './dashboard/Dashboard';
import User from './user/User';
import Login from './public/Login';
import Install from './public/Install';
import NoPage from './public/NoPage';
import Project from './project/Project';
import config from '../defined/config';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

export default class App extends Component {

  componentDidMount(){
    document.title = config.projectName;
  }

  render() {
    return (
      <Router >
        <div>

            <Switch>
                <Route exact path="/install" component={Install} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/" component={Dashboard}/>
                <Route exact path="/user" component={User}/>
                <Route exact path="/project/:id" component={Project}/>
                <Route component={NoPage}/>
            </Switch>

        </div>
      </Router>
    );
  }
}
