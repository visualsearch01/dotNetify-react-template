import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { grey400, pink400 } from 'material-ui/styles/colors';
import BasePage from '../components/BasePage';
import ThemeDefault from '../styles/theme-default';
import TimePicker from 'react-time-picker';
import Toggle from 'material-ui/Toggle';
import Snackbar from 'material-ui/Snackbar';

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    dotnetify.debug = true;
    this.vm = dotnetify.react.connect('Form', this);
    this.dispatch = state => this.vm.$dispatch(state);
    this.routeTo = route => this.vm.$routeTo(route);
    console.log('Form - dotnetify: ', dotnetify);
    this.state = {
      dirty:                    false,

      showSnackbar:             false,          // Mostra/nascondi snackbar di operazione avvenuta
      snackbarMessage:          "Notifica!!",
      snackbarAutoHideDuration: 2000,

      // Employees:        [],
      FirstName:        '',
      LastName:         '',
      // PaginaTelevideo:  '',
      // IndirizzoFTP:     '',
      // IndirizzoEmail:   '',
      time1:            '09:30',
      time2:            '18:30',

      toggle_webserver: true,
      toggle_player:    true,
      toggle_ftp:       true,
      toggle_mysql:     true,
      files:            '' //,
      // error:            '',
      // msg:              ''
    };
  };

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    // window.removeEventListener('beforeunload', this.handleLeavePage);
    console.log('Form - componentWillUnmount');
    this._isMounted = false;
    this.abortController.abort();
    this.vm.$destroy();
  };

  componentDidMount() {
    this._isMounted = true;
    console.log('Form - componentDidMount');
    // window.addEventListener('beforeunload', this.handleLeavePage);    
  };

  onChange1 = time1 => this.setState({ time1 });
  onChange2 = time2 => this.setState({ time2 });
  // handleAddTime = _ => {}

  handleCancel = _ => {
    this.dispatch({ Cancel: Id });
    this.setState({ dirty: false });
  };

  handleSave = _ => {
    this.dispatch({ Save: {
      Id:               Id,
      FirstName:        FirstName,
      LastName:         LastName,
      PaginaTelevideo:  PaginaTelevideo,
      IndirizzoFTP:     IndirizzoFTP,
      IndirizzoEmail:   IndirizzoEmail
    } });
    this.setState({ dirty: false });
  };

  handleDownload = () => {
    fetch("/api/values/download_glos", { signal: this.mySignal })
      .then(response => {
        const filename_g =  'glossario.csv'; //response.headers.get('Content-Disposition').split('filename=')[1];
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = filename_g;
          a.click();
      });
   });

   fetch("/api/values/download_stop", { signal: this.mySignal })
      .then(response => {
        const filename_s =  'stopwords.csv'; //response.headers.get('Content-Disposition').split('filename=')[1];
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = filename_s;
          a.click();
      });
   });
  };
  
  handleFileChange = (event) => {
    this.setState({
      files: event.target.files // [0]
    });
  };

  // handleUpload = _ => {}  
  handleUpload = (event) => {
    event.preventDefault();
    if (this.state.files.length == 0) {
      this.setState({
        snackbarMessage:  'Selezionare almeno un file!!!',
        showSnackbar:     true
      });
    }
    else {
      let formData:FormData = new FormData();
      for (var i = 0; i < this.state.files.length ; i++) {
        formData.append(this.state.files[i].name, this.state.files[i]);
      }
      
      fetch("/api/values/upload", {
        signal: this.mySignal,
        method: 'POST',
        body: formData
      }).then(response => {
        this.setState({
          snackbarMessage:  'Upload avvenuto con successo!!!',
          showSnackbar:     true
        });
      }).catch(error => {
        console.log('Upload - Error: ', error);
        this.setState({
          snackbarMessage:  'Errore di upload!!!',
          showSnackbar:     true
        });
      });
    }
  };

  handleOpenSnackbar = () => {
    this.setState({showSnackbar: true});
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({showSnackbar: false});
  };
  
  render() {
    let { dirty, Id, FirstName, LastName, PaginaTelevideo, IndirizzoFTP, IndirizzoEmail } = this.state;

    const forsStyles = {
      selectLabel: { color: pink400 },
      toggleDiv: {
        maxWidth: 300,
        marginTop: 40,
        marginBottom: 5
      },
      toggleLabel: {
        color: grey400,
        fontWeight: 100
      },
      fields: {
        marginTop: 0, //30,
        float: 'left', // 'right'
        fontWeight: 8,
        fontSize: 20,
        width: "100%"
      },
      textfield: {  
        fontSize: 20
      },
      buttons: {
        marginTop: 10, //30,
        float: 'left', // 'right'
        width: "100%"
      },
      saveButton: { marginLeft: 5 }
    };

    const handleCancel_1 = _ => {
      this.dispatch({ Cancel: Id });
      this.setState({ dirty: false });
    };

    const handleSave_1 = _ => {
      this.dispatch({ Save: {
        Id:               Id,
        FirstName:        FirstName,
        LastName:         LastName,
        PaginaTelevideo:  PaginaTelevideo,
        IndirizzoFTP:     IndirizzoFTP,
        IndirizzoEmail:   IndirizzoEmail
      } });
      this.setState({ dirty: false });
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title="Impostazioni" navigation="Applicazione / Video">
          <React.Fragment>
            <div>
              <div className="row">
                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 m-b-15 ">
                  <div style={forsStyles.fields}>
                    <TextField
                      hintText="Inserire un indirizzo HTTPS"
                      floatingLabelText="Indirizzo pagina televideo"
                      fullWidth={true}
                      style={forsStyles.textfield}
                      value='http://www.televideo.rai.it/televideo/pub/catturaSottopagine.jsp?pagina=710&regione='
                      onChange={event => this.setState({ PaginaTelevideo: event.target.value, dirty: true })}
                    />
                    <TextField
                      hintText="Inserire un indirizzo FTP"
                      floatingLabelText="Indirizzo FTP di pubblicazione"
                      fullWidth={true}
                      style={forsStyles.textfield}
                      value='test:test@ftp.rai.it'
                      onChange={event => this.setState({ IndirizzoFTP: event.target.value, dirty: true })}
                    />
                    <TextField
                      hintText="Inserire un indirizzo email"
                      floatingLabelText="Email di amministrazione"
                      fullWidth={true}
                      style={forsStyles.textfield}
                      value='crit@rai.it'
                      onChange={event => this.setState({ IndirizzoEmail: event.target.value, dirty: true })}
                    />
                  </div>
                  
                  <div style={forsStyles.buttons}>
                    <RaisedButton label="Annulla" onClick={this.handleCancel} disabled={!dirty} />
                    <RaisedButton label="Salva"   onClick={this.handleSave}   disabled={!dirty} style={forsStyles.saveButton} primary={true} />
                  </div>
                    
                  <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "300px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Monitor servizi
                      <Toggle
                        label="Webserver"
                        labelStyle={forsStyles.textfield}
                        toggled={this.state.toggle_webserver}
                        onToggle={() => this.setState({toggle_webserver: !this.state.toggle_webserver})}
                      />
                      <Toggle
                        label="LIS Player"
                        labelStyle={forsStyles.textfield}
                        toggled={this.state.toggle_player}
                        onToggle={() => this.setState({toggle_player: !this.state.toggle_player})}
                      />
                      <Toggle
                        label="FTP"
                        labelStyle={forsStyles.textfield}
                        toggled={this.state.toggle_ftp}
                        onToggle={() => this.setState({toggle_ftp: !this.state.toggle_ftp})}
                      />
                      <Toggle
                        label="MySQL"
                        labelStyle={forsStyles.textfield}
                        toggled={this.state.toggle_mysql}
                        onToggle={() => this.setState({toggle_mysql: !this.state.toggle_mysql})}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 m-b-15 ">
                  <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "300px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Prima estrazione
                      <TimePicker
                        onChange={this.onChange1}
                        isOpen={true}
                        value={this.state.time1}
                      />
                    </div>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Seconda estrazione
                      <TimePicker
                        onChange={this.onChange2}
                        isOpen={true}
                        value={this.state.time2}
                      />
                    </div>
                    <div style={forsStyles.buttons}>
                    {/*
                      Commentati per ora - modificare e aggiungere estrazioni non e' implementato
                      <RaisedButton label="Aggiungi" onClick={this.handleAddTime} primary={false} />
                      <RaisedButton label="Aggiorna" onClick={this.handleAddTime} primary={true} />
                    */}
                    </div>
                  </div>
                  <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "50px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Gestione regole<br />
                      Download CSV
                    </div>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      <RaisedButton label="Download" onClick={this.handleDownload} disabled={false} style={forsStyles.saveButton} primary={true} />
                    </div>
                  </div>
                  <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "50px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Gestione regole<br />
                      Upload CSV
                      <input type="file" id="file" multiple name="file" accept=".csv" onChange={this.handleFileChange}></input>
                    </div>  
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      <RaisedButton label="Upload" onClick={this.handleUpload} disabled={false} style={forsStyles.saveButton} primary={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Snackbar 
              open={this.state.showSnackbar}
              autoHideDuration={this.state.snackbarAutoHideDuration}
              onRequestClose={this.handleCloseSnackbar}
              message={this.state.snackbarMessage}
            />
          </React.Fragment>
        </BasePage>
      </MuiThemeProvider>
    );
  };
}

export default FormPage;
