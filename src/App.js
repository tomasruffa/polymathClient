import React from 'react';
import './styles/App.css';
import {BrowserRouter, Switch} from 'react-router-dom';
import AuthControl from './sections/auth';

function App(props) {
  return (
    <BrowserRouter>
      <Switch>
        <AuthControl/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;