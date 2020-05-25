import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ThemeDefault from '../styles/theme-default';
import auth from '../auth';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { user: 'guest', password: 'dotnetify' };
    this.state = { user: 'rai', password: 'rai' };
  }
  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;
  componentWillUnmount() {
    // window.removeEventListener('beforeunload', this.handleLeavePage);
    console.log('Form - componentWillUnmount');
    this._isMounted = false;
    this.abortController.abort();
    // this.vm.$destroy();
  }

  componentDidMount() {
    this._isMounted = true;
    console.log('Form - componentDidMount');
    // window.addEventListener('beforeunload', this.handleLeavePage);    
  };


  render() {
    let { user, password, error } = this.state;
    const { onAuthenticated } = this.props;

    const styles = {
      loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: 'auto',
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        margin: 'auto'
      },
      paper: {
        padding: 20,
        overflow: 'auto'
      },
      loginBtn: {
        float: 'right'
      },
      logo: {
        width: 16,
        height: 16,
        borderRadius: 16,
        backgroundColor: '#92d050',
        marginRight: 6,
        display: 'inline-block'
      },
      text: {
        color: '#333',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        verticalAlign: 'text-bottom'
      },
      error: { color: 'red' }
    };
    const onFormSubmit = e => {
      console.log('LoginPage.js - onFormSubmit - Dovrebbe funzionare sia su click sia su Invio - Event: ', e);
      e.preventDefault();
      console.log('LoginPage.js - onFormSubmit - user: ', user);
      console.log('LoginPage.js - onFormSubmit - password: ', password);
      const { user, password } = this.state;
      // send to server with e.g. `window.fetch`
      handleLogin();
    };
    const handleLogin = _ => {
      this.setState({ error: null });
      console.log('LoginPage.js - handleLogin - user: ', user);
      console.log('LoginPage.js - handleLogin - password: ', password);
      auth.signIn(user, password).then(_ => onAuthenticated()).catch(error => {
        if (error.message == '400') this.setState({ error: 'Invalid password' });
        else this.setState({ error: error.message });
      });
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <div style={styles.loginContainer}>
            <Paper style={styles.paper}>
              <div>
                <span style={styles.logo} />
                <span style={styles.text}>RAI Virtual LIS</span>
              </div>
              { /*<form>*/ }
              <form onSubmit={onFormSubmit}>
               <TextField
                  hintText="User"
                  floatingLabelText="User"
                  fullWidth={true}
                  value={user}
                  onChange={event => this.setState({ user: event.target.value })}
                />
                <TextField
                  hintText="Password"
                  floatingLabelText="Password"
                  fullWidth={true}
                  type="password"
                  value={password}
                  onChange={event => this.setState({ password: event.target.value })}
                />
                {error ? <div style={styles.error}>{error}</div> : null}
                <div>
                  <span>
                    <RaisedButton type="submit" label="Login" onClick={handleLogin} primary={true} style={styles.loginBtn} />
                  </span>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

LoginPage.propTypes = {
  onAuthenticated: PropTypes.func
};

export default LoginPage;
