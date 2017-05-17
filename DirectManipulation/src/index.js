import React from 'react';
import MyApp from './App';
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';

const App = () => (
  <MuiThemeProvider>
    <MyApp />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
