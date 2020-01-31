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

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.vm = dotnetify.react.connect('Form', this);
    this.dispatch = state => this.vm.$dispatch(state);
    this.routeTo = route => this.vm.$routeTo(route);

    this.state = {
      dirty: false,
      Employees: [],
      FirstName: '',
      LastName: '',
      PaginaTelevideo: '',
      IndirizzoFTP: '',
      IndirizzoEmail: '',
      time1: '10:00',
      time2: '18:00'
    };
  }

  componentWillUnmount() {
    this.vm.$destroy();
  }
  
  onChange = time1 => this.setState({ time1 })
  
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
      buttons: {
        marginTop: 30,
        float: 'right'
      },
      saveButton: { marginLeft: 5 }
    };

    // Usata nella configurazione originale per gestire la selezione delle voci nella select in alto
    // const handleSelectFieldChange = (event, idx, value) => this.routeTo(Employees.find(i => i.Id == value).Route);

    const handleCancel = _ => {
      this.dispatch({ Cancel: Id });
      this.setState({ dirty: false });
    };

    const handleSave = _ => {
      this.dispatch({ Save: {
        Id: Id,
        FirstName: FirstName,
        LastName: LastName,
        PaginaTelevideo: PaginaTelevideo,
        IndirizzoFTP: IndirizzoFTP,
        IndirizzoEmail: IndirizzoEmail
      } });
      this.setState({ dirty: false });
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title="Impostazioni" navigation="Application / Impostazioni">
          <form>
            { /*
            <SelectField value={Id} onChange={handleSelectFieldChange} floatingLabelText="Select to edit" floatingLabelStyle={styles.selectLabel}>
              {Employees.map(item => <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />)}
            </SelectField>
            */ }
            <div>
              <TextField
                hintText="FirstName"
                floatingLabelText="FirstName"
                fullWidth={true}
                value={FirstName}
                onChange={event => this.setState({ FirstName: event.target.value, dirty: true })}
              />
              <TextField
                hintText="LastName"
                floatingLabelText="LastName"
                fullWidth={true}
                value={LastName}
                onChange={event => this.setState({ LastName: event.target.value, dirty: true })}
              />
              <TextField
                hintText="Inserire un indirizzo HTTPS"
                floatingLabelText="Indirizzo pagina televideo"
                fullWidth={true}
                value={PaginaTelevideo}
                onChange={event => this.setState({ PaginaTelevideo: event.target.value, dirty: true })}
              />
              <TextField
                hintText="Inserire un indirizzo FTP"
                floatingLabelText="Indirizzo FTP di pubblicazione"
                fullWidth={true}
                value={IndirizzoFTP}
                onChange={event => this.setState({ IndirizzoFTP: event.target.value, dirty: true })}
              />

              <TextField
                hintText="Inserire un indirizzo email"
                floatingLabelText="Email di amministrazione"
                fullWidth={true}
                value={IndirizzoEmail}
                onChange={event => this.setState({ IndirizzoEmail: event.target.value, dirty: true })}
              />
            </div>

{ /*
            <div style="font-size: 16px; line-height: 24px; width: 100%; height: 72px; display: inline-block; position: relative; background-color: transparent; font-family: Roboto, sans-serif; transition: height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; cursor: auto;"><label for="undefined-FirstName-FirstName-32894" style="position: absolute; line-height: 22px; top: 38px; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; z-index: 1; transform: scale(0.75) translate(0px, -28px); transform-origin: left top; pointer-events: none; user-select: none; color: rgba(0, 0, 0, 0.3);">FirstName</label><div style="position: absolute; opacity: 0; color: rgba(0, 0, 0, 0.3); transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; bottom: 12px;">FirstName</div><input type="text" id="undefined-FirstName-FirstName-32894" value="Clive" style="padding: 0px; position: relative; width: 100%; border: none; outline: none; background-color: rgba(0, 0, 0, 0); color: rgba(0, 0, 0, 0.87); cursor: inherit; font: inherit; opacity: 1; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); height: 100%; box-sizing: border-box; margin-top: 14px;"><div><hr aria-hidden="true" style="border-top: none rgb(224, 224, 224); border-left: none rgb(224, 224, 224); border-right: none rgb(224, 224, 224); border-bottom: 1px solid rgb(224, 224, 224); bottom: 8px; box-sizing: content-box; margin: 0px; position: absolute; width: 100%;"><hr aria-hidden="true" style="border-top: none rgb(0, 188, 212); border-left: none rgb(0, 188, 212); border-right: none rgb(0, 188, 212); border-bottom: 2px solid rgb(0, 188, 212); bottom: 8px; box-sizing: content-box; margin: 0px; position: absolute; width: 100%; transform: scaleX(0); transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;"></div></div>
*/ }

            <div style={{fontSize: "16px", lineHeight: "24px", width: "100%", height: "300px", display: "inline-block", position: "relative", backgroundColor: "transparent"}}>
              <div style={{height: '200px', width: '200px', float: 'left'}}>
              Prima estrazione
            <TimePicker
                      onChange={this.onChange}
                      isOpen={true}
                      value={this.state.time1}
                    />
            </div>
            
            <div style={{height: '200px', width: '200px', float: 'left'}}>
              Seconda estrazione
                    <TimePicker
                      onChange={this.onChange}
                      isOpen={true}
                      value={this.state.time2}
                    />
            </div>
            </div>

            
{ /*
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>Prima estrazione</TableHeaderColumn>
                  <TableHeaderColumn>Seconda estrazione</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableRowColumn>
                    <TimePicker
                      onChange={this.onChange}
                      isOpen={true}
                      value={this.state.time1}
                    />
                  </TableRowColumn>
                  <TableRowColumn>
                    <TimePicker
                      onChange={this.onChange}
                      isOpen={true}
                      value={this.state.time2}
                    />
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table> */}
            <div style={styles.buttons}>
              <RaisedButton label="Cancel" onClick={handleCancel} disabled={!dirty} />
              <RaisedButton label="Save" onClick={handleSave} disabled={!dirty} style={styles.saveButton} primary={true} />
            </div>
          </form>
        </BasePage>
      </MuiThemeProvider>
    );
  }
}

export default FormPage;
