import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { grey400, pink400 } from 'material-ui/styles/colors';
import BasePage from '../components/BasePage';
import ThemeDefault from '../styles/theme-default';
import TimePicker from 'react-time-picker';
import Toggle from 'material-ui/Toggle';

// var glos = require("../../../../../../../../Desktop/Glossario ITA-LIS.csv");
// var st = require("../../../../../../../../Desktop/StopWords.csv");

// console.log("Form.js - glos: ", glos); // '/build/12as7f9asfasgasg.jpg'
// console.log("Form.js - st: ", st); // '/build/12as7f9asfasgasg.jpg'

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    // Connect this component to the back-end view model.
    dotnetify.debug = true;

    this.vm = dotnetify.react.connect('Form', this);
    // Set up function to dispatch state to the back-end with optimistic update.    
    this.dispatch = state => this.vm.$dispatch(state);
    this.routeTo = route => this.vm.$routeTo(route);
    /*
    Calling the $dispatch right after connect won't work because connect is async. Use this instead:
    this.vm = dotnetify.react.connect("RunFeedRow", this, {vmArg: {Run: this.props.Run} });
    The vmArg allows you to initialize one or more properties of the view model.
    Make sure you are using npm dotnetify v2.0.5-beta.
    */
    console.log('Form - dotnetify: ', dotnetify);

    this.state = {
      dirty:            false,
      Employees:        [],
      FirstName:        '',
      LastName:         '',
      PaginaTelevideo:  '',
      IndirizzoFTP:     '',
      IndirizzoEmail:   '',
      time1:            '09:10',
      time2:            '18:25',
      toggle1:          true,
      toggle2:          true,
      toggle3:          false,
      toggle4:          true,
      file:             '',
      error:            '',
      msg:              ''
    };
  }
  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;
  /*
  https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
  To remove - Can't perform a React state update on an unmounted component warning, use componentDidMount method under a condition and make false that condition on componentWillUnmount method. For example : -
  componentDidMount() {

    ajaxVar
      .get('https://domain')
      .then(result => {
        if (this._isMounted) {
          this.setState({
            news: result.data.hits,
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    ...
  }
  */

  /*
  $scope.$on('$destroy', function() {
      vm.stop();
      console.log('DashboardController scope destroyed.');
  })
  */

  componentWillUnmount() {
    // window.removeEventListener('beforeunload', this.handleLeavePage);
    console.log('Form - componentWillUnmount');
    this._isMounted = false;
    this.abortController.abort();
    this.vm.$destroy();
  }

  componentDidMount() {
    this._isMounted = true;
    console.log('Form - componentDidMount');
    // window.addEventListener('beforeunload', this.handleLeavePage);    
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  }
  
  /*
  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage(e) {
    const confirmationMessage = 'Some message';
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }
  */

  onChange1 = time1 => this.setState({ time1 })
  onChange2 = time2 => this.setState({ time2 })
  handleAddTime = _ => {}

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

  // handleDownload = _ => {}
  handleDownload = () => {
    // var url = "/api/values/download/";
    fetch("/api/values/download", { signal: this.mySignal })
      .then(response => {
        const filename =  'glossario.csv'; //response.headers.get('Content-Disposition').split('filename=')[1];
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
      });
   });
  }
  
  handleFileChange = (event) => {
    this.setState({
      file: event.target.files[0]
    });
  }

  // handleUpload = _ => {}  
  handleUpload = (event) => {
    event.preventDefault();
    this.setState({error: '', msg: ''});
 
    if(!this.state.file) {
      this.setState({error: 'Please upload a file.'})
      return;
    }
 
    if(this.state.file.size >= 2000000) {
      this.setState({error: 'File size exceeds limit of 2MB.'})
      return;
    }
    /*
    const formData = new FormData(oFormElement);

    try {
    const response = await fetch(oFormElement.action, {
      method: 'POST',
      body: formData
    });
    */
    let data = new FormData();
    data.append('files', this.state.file);
    data.append('name', this.state.file.name);
    
    fetch("/api/values/upload", {
      signal: this.mySignal,
      method: 'POST',
      body: data
    }).then(response => {
      this.setState({error: '', msg: 'Successfully uploaded file'});
    }).catch(err => {
      this.setState({error: err});
    });
  }
  
  render() {
    let { dirty, Employees, Id, FirstName, LastName, PaginaTelevideo, IndirizzoFTP, IndirizzoEmail } = this.state;

    const styles = {
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
      },
      textfield: {  
        fontSize: 20,
      },
      buttons: {
        marginTop: 10, //30,
        float: 'left', // 'right'
      },
      saveButton: { marginLeft: 5 }
    };

    // Usata nella configurazione originale per gestire la selezione delle voci nella select in alto
    // const handleSelectFieldChange = (event, idx, value) => this.routeTo(Employees.find(i => i.Id == value).Route);

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
          { /* <BasePage title="Impostazioni" navigation="Applicazione / Settings"> 
          <React.Fragment>
          <div id="subcontent_form" style={{position: 'fixed', top: 50}}>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
              <h3>Settings</h3>
            </div>
          </div>
          */ }
          <div>
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
                { /*
                <form>
                <SelectField value={Id} onChange={handleSelectFieldChange} floatingLabelText="Select to edit" floatingLabelStyle={styles.selectLabel}>
                  {Employees.map(item => <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />)}
                </SelectField>
                <div>
                  <TextField
                    hintText="FirstName"
                    floatingLabelText="FirstName"
                    fullWidth={true}
                    value={this.state.FirstName || ''}
                    onChange={event => this.setState({ FirstName: event.target.value, dirty: true })}
                  />
                  <TextField
                    hintText="LastName"
                    floatingLabelText="LastName"
                    fullWidth={true}
                    value={this.state.LastName || ''}
                    onChange={event => this.setState({ LastName: event.target.value, dirty: true })}
                  />
                  <div>
                  */ }
                <div style={styles.fields}>
                  <TextField
                    hintText="Inserire un indirizzo HTTPS"
                    floatingLabelText="Indirizzo pagina televideo"
                    fullWidth={true}
                    style={styles.textfield}
                    value={this.state.PaginaTelevideo || ''}
                    onChange={event => this.setState({ PaginaTelevideo: event.target.value, dirty: true })}
                  />
                  <TextField
                    hintText="Inserire un indirizzo FTP"
                    floatingLabelText="Indirizzo FTP di pubblicazione"
                    fullWidth={true}
                    style={styles.textfield}
                    value={this.state.IndirizzoFTP || ''}
                    onChange={event => this.setState({ IndirizzoFTP: event.target.value, dirty: true })}
                  />
                  <TextField
                    hintText="Inserire un indirizzo email"
                    floatingLabelText="Email di amministrazione"
                    fullWidth={true}
                    style={styles.textfield}
                    value={this.state.IndirizzoEmail || ''}
                    onChange={event => this.setState({ IndirizzoEmail: event.target.value, dirty: true })}
                  />
                </div>
                <div style={styles.buttons}>
                  <RaisedButton label="Cancel" onClick={this.handleCancel} disabled={!dirty} />
                  <RaisedButton label="Save" onClick={this.handleSave} disabled={!dirty} style={styles.saveButton} primary={true} />
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
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
                  <div style={styles.buttons}>
                    <RaisedButton label="Aggiungi" onClick={this.handleAddTime} primary={false} />
                    <RaisedButton label="Aggiorna" onClick={this.handleAddTime} primary={true} />
                  </div>    
                </div>
                <div>
                  <div style={styles.buttons}>
                    <h3>Gestione regole - Download CSV</h3>
                    <RaisedButton label="Download" onClick={this.handleDownload} disabled={false} style={styles.saveButton} primary={true} />
                    <h3>Gestione regole - Upload CSV</h3>
                    { /* <button onClick={this.handleDownload}>Download</button> */ }
                    { /*
                    The ::-webkit-file-upload-button CSS pseudo-element represents the button of an <input> of  type="file".
                    This pseudo-element is non-standard and only supported in WebKit/Blink compatible browsers like Chrome, Opera and Safari (indicated by the -webkit prefix).
                    */ }
                    <input type="file" onChange={this.handleFileChange}></input>
                    { /* <button onClick={this.handleUpload}>Upload</button> */ }
                    { /*
                          <div className="col-md-4">
                            &nbsp;
                          </div>
                          <div class="container">
                            <div class="row">
                              <div class="offset-md-3 col-md-6">
                                <div class="form-group files">
                                  <label>Upload Your File </label>
                                  <input type="file" class="form-control" multiple onChange={this.onChangeHandler}/>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </form>  </React.Fragment> */ }
                      { /* </BasePage> * / }
                    </MuiThemeProvider>*/ }
                    <RaisedButton label="Upload" onClick={this.handleUpload} disabled={false} style={styles.saveButton} primary={true} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
            {/*
            <div className="col-md-4">
              <div style={styles.buttons}>
                <RaisedButton label="Cancel" onClick={this.handleCancel} disabled={!dirty} />
                <RaisedButton label="Save" onClick={this.handleSave} disabled={!dirty} style={styles.saveButton} primary={true} />
              </div>
            </div>
            */}
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
                <h3>Monitor servizi</h3>
                <div style={styles.buttons}>
                  <Toggle
                    label="Webserver"
                    toggled={this.state.toggle1}
                    onToggle={() => this.setState({toggle1: !this.state.toggle1})}
                  />
                  <Toggle
                    label="ATLAS Player"
                    toggled={this.state.toggle2}
                    onToggle={() => this.setState({toggle1: !this.state.toggle2})}
                  />
                  <Toggle
                    label="FTP"
                    toggled={this.state.toggle3}
                    onToggle={() => this.setState({toggle1: !this.state.toggle3})}
                  />
                  <Toggle
                    label="MySQL"
                    toggled={this.state.toggle4}
                    onToggle={() => this.setState({toggle2: !this.state.toggle4})}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
                &nbsp;
              </div>
            </div>
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
}

export default FormPage;
