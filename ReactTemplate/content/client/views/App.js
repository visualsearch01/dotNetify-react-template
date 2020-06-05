import React from 'react';
import PropTypes from 'prop-types';
import LoginPage from './LoginPage';
import AppLayout from './AppLayout';
import auth from '../auth';
/*
There is a better way to do this in React using state and not directly accessing the DOM which should be avoided.
Store the value of an input in the component's state, then give it to the button's onClick event handler via this.state.inputVal.
class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          inputVal: ''
      };
  }
*/

// Variabili globali create per poter condividere dati, tipo
// il deliverable (uso ipotizzato inizialmente, poi dismesso)
// nome e id utente
global.foo = 'foo';
global.bar = 'bar';
global.g_deliverable = true;
global.g_username = '';
global.g_userid = 0;

global.g_did_ita = '';
global.g_did_lis = '';
global.g_did_videoname = '';
global.g_did_output_preview = '';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      authenticated: auth.hasAccessToken(),
      inputVal: '',
      userid: auth.userid //78 // auth._userid // 78
    };
    console.log('App auth: ', auth);
  }

  componentWillUnmount() {
    // this.vm.$destroy();
    console.log('App.js - componentWillUnmount');
  };

  componentDidMount() {
    console.log('App.js - componentDidMount');
  };

  handleAuthenticated = _ => this.setState({ authenticated: true });

  render() {
    // const handleAuthenticated = _ => this.setState({ authenticated: true });
    return !this.state.authenticated ? 
      <LoginPage onAuthenticated={this.handleAuthenticated} /> : 
      <AppLayout userid={this.state.userid} />;
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
