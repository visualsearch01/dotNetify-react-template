import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
// import SelectField from 'material-ui/SelectField';
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
      dirty:                    false,          // Flag di almeno un campo modificato
      Settings:                 [],             // Array di oggetti Setting
      // Employees:               [],
      showSnackbar:             false,          // Mostra/nascondi snackbar di operazione avvenuta
      snackbarMessage:          "Notifica!!",   // Messaggio di default della snackBar
      snackbarAutoHideDuration: 2000,           // Durata di autohide snackBar di default
      
      // FirstName:                '',
      // LastName:                 '',
      /*
      PaginaTelevideo:          '', // http://www.televideo.rai.it/televideo/pub/catturaSottopagine.jsp?pagina=710&regione=',
      IndirizzoFTP:             '', // ftp://rai_meteo_lis:Corso_Giambone_68@10.54.131.143/',
      IndirizzoEmail:           '', // andrea.delprincipe@rai.it',
      */
      // time1:                    '09:30',
      // time2:                    '18:30',

      toggle_webserver:         true,
      toggle_player:            true,
      toggle_ftp:               true,
      toggle_mysql:             true,
      files:                    null // '' //,
      // error:                   '',
      // msg:                     ''
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
    this.handleCancel();
  };

  onChange1 = new_time1 => this.setState({ Edition1 });
  onChange2 = new_time2 => this.setState({ Edition2 });
  onChange3 = new_time3 => this.setState({ Edition3 });
  // handleAddTime = _ => {}

  handleCancel = _ => {
    // this.dispatch({ Cancel: Id });
    this.setState({ dirty: false },
      () => {
        this.state.Settings.forEach((item, i) => {
          if (item.NameSetting === 'url')
            this.setState({ PaginaTelevideo: item.ValueSetting });
          if (item.NameSetting === 'ftp')
            this.setState({ IndirizzoFTP: item.ValueSetting });
          if (item.NameSetting === 'email')
            this.setState({ IndirizzoEmail: item.ValueSetting });
        });
      });
  };

  handleSave = _ => {
    this.dispatch({ Save: {
      Id:               1, // Id,
      FirstName:        this.state.FirstName,
      LastName:         this.state.LastName,
      PaginaTelevideo:  this.state.PaginaTelevideo,
      IndirizzoFTP:     this.state.IndirizzoFTP,
      IndirizzoEmail:   this.state.IndirizzoEmail
    } });
    this.setState({ 
      dirty:            false,
      snackbarMessage:  'Salvataggio avvenuto con successo!!!',
      showSnackbar:     true
    });
  };

  handleDownload = () => {
    fetch("/api/values/download_glos/glossario", { signal: this.mySignal })
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

    fetch("/api/values/download_glos/stopwords", { signal: this.mySignal })
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

    fetch("/api/values/download_glos/regole", { signal: this.mySignal })
      .then(response => {
        const filename_s =  'regole.csv'; //response.headers.get('Content-Disposition').split('filename=')[1];
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
    let {
      dirty,
      Settings,
      // Id,
      FirstName,
      LastName,
      PaginaTelevideo,
      IndirizzoFTP,
      IndirizzoEmail
    } = this.state;

    const formStyles = {
      /*
      selectLabel: {
        color: pink400
      },
      */
      fieldsDiv: {
        // marginTop: 20, //30,
        top: '20%',
        float: 'left', // 'right'
        fontWeight: 8,
        fontSize: 20,
        padding: 20,
        width: "100%",
        height: 'auto',
        margin: 'auto',
        overflow: 'auto'
      },
      clockDiv: {
        fontSize: "16px",
        lineHeight: "24px",
        width: "100%",
        height: "300px",
        display: "inline-block",
        position: "relative",
        backgroundColor: "transparent"
      },
      toggleDiv_1: {
        margin: 'auto',
        padding: 20,
        overflow: 'hidden',
        margin: '10px auto 0',
      },
      toggleDiv: {
        display: "inline-block", 
        // width: 600,
        overflow: 'hidden',
        margin: 'auto',
        padding: 20
      },
      toggleLabel: {  
        fontSize: 20
      },
      toggleLabel_1: {
        color: grey400,
        fontWeight: 100
      },
      buttonLabel: {
        fontSize: 8, // '6px'
        padding: '.5em 0'
      },
      buttonsDiv: {
        marginTop: 10, //30,
        float: 'left', // 'right'
        width: "100%"
      },
      buttonStyle: {
        margin: 12, // marginLeft: 5
        // float: 'right'
      },
      buttonLabel: {
        fontSize: 8, // '6px'
        padding: '.5em 0'
      }
    };
    
    const setDefaults = _ => {
      Settings.forEach((item, i) => {
        if (item.NameSetting === 'url')
          this.setState({ PaginaTelevideo: item.ValueSetting });
        if (item.NameSetting === 'ftp')
          this.setState({ IndirizzoFTP: item.ValueSetting });
        if (item.NameSetting === 'email')
          this.setState({ IndirizzoEmail: item.ValueSetting });
      }); // .map(item => {
    };

    const handleEditUrl = (event) => {
      console.log('handleEditUrl - event: ', event);
      this.setState({
        dirty: true,
        PaginaTelevideo: event.target.value
      });
    };

    const handleEditFTP = (event) => {
      console.log('handleEditFtp - event: ', event);
      this.setState({
        dirty: true,
        IndirizzoFTP: event.target.value
      });
    };

    const handleEditEmail = (event) => {
      console.log('handleEditEmail - event: ', event);
      this.setState({
        dirty: true,
        IndirizzoEmail: event.target.value
      });
    };

    const handleCancel_1 = _ => {
      // this.dispatch({ Cancel: Id });
      setDefaults();
      // this.setState({ dirty: false });
    };

    const handleSave_1 = _ => {
      this.dispatch({ Save: {
        Id:               1, // Id,
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
                  <div style={formStyles.fieldsDiv}>
                      <TextField
                        id='PaginaTelevideo'
                        fullWidth={true}
                        hintText="Inserire un URL della pagina meteo Televideo"
                        floatingLabelText="Indirizzo pagina Televideo"
                        floatingLabelStyle={{fontSize: 40}}
                        value={PaginaTelevideo}
                        onChange={handleEditUrl}
                      />
                      <TextField
                        id='IndirizzoFTP'
                        fullWidth={true}
                        hintText="Inserire un indirizzo FTP"
                        floatingLabelText="Indirizzo FTP di pubblicazione"
                        floatingLabelStyle={{fontSize: 40}}
                        value={IndirizzoFTP}
                        onChange={handleEditFTP}
                      />
                      <TextField
                        id='IndirizzoEmail'
                        fullWidth={true}
                        hintText="Inserire una lista di indirizzi email"
                        floatingLabelText="Lista email di amministrazione"
                        floatingLabelStyle={{fontSize: 40}}
                        value={IndirizzoEmail}
                        onChange={handleEditEmail}
                      />
                  </div>
                  <div style={formStyles.buttonsDiv}>
                    <RaisedButton label="Annulla" onClick={this.handleCancel} disabled={!dirty} style={formStyles.buttonStyle} labelStyle={formStyles.buttonLabel} />
                    <RaisedButton label="Salva"   onClick={this.handleSave}   disabled={!dirty} style={formStyles.buttonStyle} labelStyle={formStyles.buttonLabel} primary={true} />
                  </div>
                  
                  <div style={formStyles.toggleDiv_1}>
                    <div style={formStyles.toggleDiv}>   {/*    style={{marginTop: 20, height: '200px', width: '200px', float: 'left'}}> */}
                      <h3>Monitor servizi</h3>
                      <Toggle
                        label="Webserver"
                        labelStyle={formStyles.toggleLabel}
                        toggled={this.state.toggle_webserver}
                        onToggle={() => this.setState({toggle_webserver: !this.state.toggle_webserver})}
                      />
                      <Toggle
                        label="LIS Player"
                        labelStyle={formStyles.toggleLabel}
                        toggled={this.state.toggle_player}
                        onToggle={() => this.setState({toggle_player: !this.state.toggle_player})}
                      />
                      <Toggle
                        label="FTP"
                        labelStyle={formStyles.toggleLabel}
                        toggled={this.state.toggle_ftp}
                        onToggle={() => this.setState({toggle_ftp: !this.state.toggle_ftp})}
                      />
                      <Toggle
                        label="MySQL"
                        labelStyle={formStyles.toggleLabel}
                        toggled={this.state.toggle_mysql}
                        onToggle={() => this.setState({toggle_mysql: !this.state.toggle_mysql})}
                      />
                    </div>
                    <div style={formStyles.toggleDiv}>   {/* style={{marginTop: 20, height: '200px', width: '200px', float: 'left'}}> */}
                      <h3>Gestione regole</h3>
                      <div>
                        <h4>Download CSV</h4>
                        <RaisedButton label="Download" onClick={this.handleDownload} style={formStyles.buttonStyle} secondary={true} disabled={false} />
                      </div>
                      <div>
                        <h4>Upload CSV</h4>
                        <input type="file" id="file" multiple name="file" accept=".csv" onChange={this.handleFileChange}></input>
                        <RaisedButton label="Upload" onClick={this.handleUpload} style={formStyles.buttonStyle} secondary={true} disabled={this.state.files === null} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 m-b-15 ">
                  {/*<div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "300px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>*/}
                  <div style={formStyles.clockDiv}>
                    <div style={{...formStyles.toggleDiv, height: '300px', width: '300px'}}>
                      <div>
                        Prima estrazione
                      </div>
                      <div>
                        <TimePicker
                          onChange={this.onChange1}
                          isOpen={true}
                          value={this.state.Edition1}
                        />
                      </div>
                    </div>
                    <div style={{...formStyles.toggleDiv, height: '300px', width: '300px'}}>
                      <div>
                        Seconda estrazione
                      </div>
                      <div>
                        <TimePicker
                          onChange={this.onChange2}
                          isOpen={true}
                          value={this.state.Edition2}
                        />
                      </div>
                    </div>
                    <div style={{...formStyles.toggleDiv, height: '300px', width: '300px'}}>
                      <div>
                        Terza estrazione
                      </div>
                      <div>
                        <TimePicker
                          onChange={this.onChange3}
                          isOpen={true}
                          value={this.state.Edition3}
                        />
                      </div>
                    </div>
                    {/*
                    <div style={formStyles.buttonsDiv}>
                      Commentati per ora - modificare e aggiungere estrazioni non e' (mai) stato implementato
                      Questo supponendo che in fondo le estrazioni saranno sempre le stesse
                      <RaisedButton label="Aggiungi" onClick={this.handleAddTime} primary={false} />
                      <RaisedButton label="Aggiorna" onClick={this.handleAddTime} primary={true} />
                    </div>
                    */}
                  </div>
                  {/*
                  <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "50px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Gestione regole<br />
                      Download CSV
                    </div>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      <RaisedButton label="Download" onClick={this.handleDownload} disabled={false} style={formStyles.buttonStyle} primary={true} />
                    </div>
                  </div>
                  <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "50px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      Gestione regole<br />
                      Upload CSV
                      <input type="file" id="file" multiple name="file" accept=".csv" onChange={this.handleFileChange}></input>
                    </div>  
                    <div style={{height: '200px', width: '200px', float: 'left'}}>
                      <RaisedButton label="Upload" onClick={this.handleUpload} disabled={false} style={formStyles.buttonStyle} primary={true} />
                    </div>
                  </div>
                  */}
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
