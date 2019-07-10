import React from 'react';
import ReactDOM from 'react-dom';

import './static/3rdpart/bootstrap/css/bootstrap.min.css';
// import './static/3rdpart/metisMenu/metisMenu.css';
// import './static/3rdpart/sb-admin-2/css/sb-admin-2.css';
import './static/navigation.css';
import './static/index.css';
import "../node_modules/react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import App from './main/App';




// ReactDOM.render(<div></div>, document.getElementById('root'));
ReactDOM.render(<App />, document.getElementById('root'));
