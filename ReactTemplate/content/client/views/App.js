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

global.foo = 'foo';
global.bar = 'bar';
global.deliver = true;

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

  handleAuthenticated_1 = _ => this.setState({ authenticated: true });

  render() {
    // const handleAuthenticated = _ => this.setState({ authenticated: true });
    return !this.state.authenticated ? 
      <LoginPage onAuthenticated={this.handleAuthenticated_1} /> : 
      <AppLayout userid={this.state.userid} />;
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;
