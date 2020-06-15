import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';

import IconClear from 'material-ui/svg-icons/content/clear';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconAlarm from 'material-ui/svg-icons/action/alarm';
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download';

import { pink500, grey200, grey500, blue600 } from 'material-ui/styles/colors';
import ThemeDefault from '../styles/theme-default';
import globalStyles from '../styles/styles';
import { ChipExampleSimple, ListExampleSelectable, handleChips_b } from '../components/dashboard/InfoBox';
import { ChipExampleSimple1 } from '../components/dashboard/RecentActivities';
import { VideoPreview } from '../components/dashboard/Utilization';
import BasePage from '../components/BasePage';
import Pagination from '../components/table/Pagination';
import InlineEdit from '../components/table/InlineEdit';
import TextareaAutosize from 'react-textarea-autosize';

class TablePage extends React.Component {
  constructor(props) {
    super(props);
    dotnetify.debug = true;
    // this.vm = dotnetify.react.connect('Table', this);
    
    
    var arg = { User1: { Id: g_userid, Name: g_username }, num1: 9043835 };
    // dotnetify.react.connect("HelloWorld", this, { vmArg: arg });
    dotnetify.debug= true;
    this.vm = dotnetify.react.connect('Table', this, {
      exceptionHandler: ex => {
        // alert(ex.message);
        console.log('Table - exceptionHandler: ', ex);
        auth.signOut();
      },
      vmArg: arg
    });
    
    
    this.dispatch = state => this.vm.$dispatch(state);
    
    this.routeTo = route => this.vm.$routeTo(route);
    
    console.log('TablePage - this: ', this);
    console.log('TablePage - dotnetify: ', dotnetify);
    console.log('TablePage - props: ', props);

    this.state = {
      // addName: '',
      // Employees: [],
      Requests: [],
      Pages: [],
      deleteOpen: false,
      deleteId: 0
      // Filter: ''
      // ShowNotification: false
    };
  };

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    console.log('TablePage - componentWillUnmount');
    // window.removeEventListener('beforeunload', this.handleLeavePage);
    this._isMounted = false;
    this.abortController.abort();
    this.vm.$destroy();
  };

  componentDidMount() {
    this._isMounted = true;
    console.log('TablePage - componentDidMount');
    // window.addEventListener('beforeunload', this.handleLeavePage);    
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  };

  /*
  componentWillUnmount() {
    this.vm.$destroy();
  }
  */

  handleDeleteOpen = (id) => {
    this.setState({deleteId: id, deleteOpen: true});
  };

  handleDeleteClose = () => {
    this.setState({deleteOpen: false});
  };

  handleDelete = () => {
    console.log('TablePage - handleDelete this.state.deleteId: ', this.state.deleteId);

    fetch("/api/values/menu/" + this.state.deleteId,    // request/delete",
    {
      signal: this.mySignal,
      method: "PUT", // 'DELETE',
      body: "'"+JSON.stringify({
        value:      this.state.deleteId // ,
        // notes:      'Cancellata'
      })+"'",
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(p => {
      console.log('TablePage_1 handleDelete - Risultato request PUT: ', p);
      const newState = { deleteOpen: false, deleteId: p.ok_upd_request}; // Filter: '' };
      this.setState(newState);
      this.dispatch(newState);
      /*
      this.setState({
        deleteOpen: false
      });
      this.dispatch();
      */
    })
    .catch(error => {
      console.log('TablePage_1 handleDelete - PUT menu/request Error: ', error);
    });
    // this.setState({deleteOpen: false});
  };

  render() {
    let { 
      // addName, 
      // Employees, 
      Requests, Pages, SelectedPage, Filter
      // ShowNotification 
    } = this.state;

    const TableStyles = {
      addButton: { margin: '1em' },
      removeIcon: { fill: grey500 },
      columns: {
        id: { width: 'auto'}, // '5%' },
        firstName: { width: 'auto'}, //'15%' },
        lastName: { width: 'auto'}, //'70%' },
        remove: { width: 'auto'}, //'10%' }
      },
      pagination: { marginTop: '1em' }
    };

    const deleteActions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.handleDelete}
      />,
      <FlatButton
        label="Annulla"
        primary={true}
        onClick={this.handleDeleteClose}
      />,
    ];


    /*
    const handleAdd = _ => {
      if (addName) {
        this.dispatch({ Add: addName });
        this.setState({ addName: '' });
      }
    };

    const handleUpdate = employee => {
      let newState = Employees.map(item => (item.Id === employee.Id ? Object.assign(item, employee) : item));
      this.setState({ Employees: newState });
      this.dispatch({ Update: employee });
    };
    */

    const handleFilter = value => {
      // setState({ filter: event.target.value })
      console.log('Table - handleFilter - value: ', value);
      const newState = { Filter: value };
      this.setState(newState);
      this.dispatch(newState);
    };


    const handleSelectPage = page => {
      const newState = { SelectedPage: page };
      this.setState(newState);
      this.dispatch(newState);
    };

    // const hideNotification = _ => this.setState({ ShowNotification: false });
    /*
    const handleMenuClick = (idrequest, area) => { // route => {
      // Dashboard.handleFetch("2010-01-08");
      // console.log('Table - handleMenuClick - route: ', route);
      console.log('Table - handleMenuClick - idrequest: ', idrequest);
      console.log('Table - handleMenuClick - area: ', area);
      // this.vm.$routeTo({TemplateId: "FormPage", Path: "2", RedirectRoot: false}); // route);
      // window.location = '/Didattica/traduzione'; // /657';
      if(area == '')
        window.location = '/Didattica/'+idrequest; // /657';
      else
        window.location = '/Meteo/'+idrequest; // /657';
    };
    */

    const handleLoadFromDB = (route) => { // route => {
      // Dashboard.handleFetch("2010-01-08");
      console.log('Table - handleLoadFromDB - route: ', route);
      // console.log('Table - handleLoadFromDB - idrequest: ', idrequest);
      // console.log('Table - handleLoadFromDB - area: ', area);
      this.vm.$routeTo(route); // {TemplateId: "FormPage", Path: "2", RedirectRoot: false}); // route);
      // window.location = '/Didattica/traduzione'; // /657';
    };

    const handleDownloadVideo = (path) => {
      const element = document.createElement("a");
      
      // const file = new Blob([document.getElementById('itaField').value], {type: 'text/plain'});
      // const file = new Blob([this.state.lis_edit], {type: 'text/plain'});
      element.href = path; // '/video_gen/mp4/sentence_06_03_2020_10_27_05.mp4'; // URL.createObjectURL(path);
      element.download = path.replace(/^.*[\\\/]/, ''); // "myFile.mp4";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    };

    const RenderConsoleLog = ({ children }) => {
      console.log('TablePage RenderConsoleLog: ', children);
      return false;
    };
    // title={"Lista video " + this.state.Mode} 
    // <RenderConsoleLog>{Requests}</RenderConsoleLog>
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage navigation="Applicazione / Video">
          <div>
            <Tabs>
              <Tab style={{fontSize: 32, fontWeight: 'bold'}} label="I miei video" value="I miei video"></Tab>
            </Tabs>            

            {/*
              <div>
                <FloatingActionButton onClick={handleAdd} style={TableStyles.addButton} backgroundColor={pink500} mini={true}>
                  <IconAdd />
                </FloatingActionButton>
                <TextField
                  id="AddName"
                  floatingLabelText="Add"
                  hintText="Type full name here"
                  floatingLabelFixed={true}
                  value={addName}
                  onKeyPress={event => (event.key === 'Enter' ? handleAdd() : null)}
                  onChange={event => this.setState({ addName: event.target.value })}
                />
              </div>
               multiSelectable={false}
               fixedHeader={false} style={{tableLayout: 'auto'}} 
            */}
            <Table selectable={false}>
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
              >
                <TableRow selectable={false}>
                  <TableHeaderColumn style={TableStyles.columns.id}>Nome request<br />
                  <TextField
                    hintText="Filtra.."
                    style={{width: '95%'}}
                    onChange={(event) => handleFilter(event.target.value)}
                  />
                  </TableHeaderColumn>
                  <TableHeaderColumn style={TableStyles.columns.firstName}>Data request</TableHeaderColumn>
                  { this.state.Mode != "didattica" ?
                  <TableHeaderColumn style={TableStyles.columns.remove}>Area forecast</TableHeaderColumn>
                  : null }
                  <TableHeaderColumn style={TableStyles.columns.remove}>Testo ITA</TableHeaderColumn>
                  <TableHeaderColumn style={TableStyles.columns.remove}>Testo LIS</TableHeaderColumn>
                  <TableHeaderColumn style={TableStyles.columns.remove}>Versione</TableHeaderColumn>
                  <TableHeaderColumn style={TableStyles.columns.lastName}>Utente</TableHeaderColumn>
                  { location.hostname === "localhost" ? 
                  <TableHeaderColumn style={TableStyles.columns.firstName}>URL video</TableHeaderColumn>
                  : null }
                  <TableHeaderColumn style={TableStyles.columns.lastName}>Azioni</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Requests.map((item, index) => (
                <TableRow key={index} selectable={false}>
                  <TableRowColumn title={item.LisRequest.NameRequest} style={TableStyles.columns.id}>{item.LisRequest.NameRequest}</TableRowColumn>
                  <TableRowColumn title={item.LisRequest.TimeRequest} style={TableStyles.columns.firstName}>{item.LisRequest.TimeRequest}</TableRowColumn>
                    {/*<InlineEdit onChange={value => handleUpdate({ Id: item.Id, FirstName: value })}>{item.FirstName}</InlineEdit>
                  </TableRowColumn>*/}
                  { this.state.Mode != "didattica" ?
                  <TableRowColumn title={item.ForecastArea} style={TableStyles.columns.lastName}>{item.ForecastArea}</TableRowColumn>
                  : null }
                  {/* <InlineEdit onChange={value => handleUpdate({ Id: item.Id, LastName: value })}>{item.LastName}</InlineEdit> </TableRowColumn> */}
                  <TableRowColumn title={item.TextITA} style={TableStyles.columns.remove}>{item.TextITA}</TableRowColumn>
                  <TableRowColumn title={item.TextLIS} style={TableStyles.columns.remove}>{item.TextLIS}</TableRowColumn>
                  <TableRowColumn style={TableStyles.columns.remove}>{item.VersionITA}</TableRowColumn>
                  <TableRowColumn style={TableStyles.columns.remove}>{item.User}</TableRowColumn>
                  { location.hostname === "localhost" ? 
                  <TableRowColumn title={item.LisRequest.PathVideo} style={TableStyles.columns.remove}>{item.LisRequest.PathVideo}</TableRowColumn>
                  : null }
                  <TableRowColumn style={TableStyles.columns.remove}>
                    {/* onClick={_ => handleMenuClick(item.Route)} */}
                    {/* onClick={_ => this.dispatch({ Remove: item.Version })} */}
                    {/*
                    <FloatingActionButton
                      onClick={_ => handleMenuClick(item.LisRequest.IdRequest, item.ForecastArea)}
                      zDepth={0}
                      mini={true}
                      backgroundColor={grey200}
                      iconStyle={TableStyles.removeIcon}
                    >
                      <IconClear />
                    </FloatingActionButton>
                    */}
                    <FloatingActionButton
                      onClick={_ => handleLoadFromDB(item.Route)}
                      zDepth={0}
                      title='Carica da DB'
                      mini={true}
                      backgroundColor={blue600}
                      iconStyle={TableStyles.removeIcon}
                    >
                      <IconAdd />
                    </FloatingActionButton>
                    &nbsp;
                    <FloatingActionButton
                      onClick={_ => this.handleDeleteOpen(item.LisRequest.IdRequest)}
                      zDepth={0}
                      title={'Elimina request ' + item.LisRequest.IdRequest}
                      mini={true}
                      backgroundColor={blue600}
                      iconStyle={TableStyles.removeIcon}
                    >
                      <IconClear />
                    </FloatingActionButton>
                    &nbsp;
                    <FloatingActionButton
                      onClick={_ => handleDownloadVideo(item.LisRequest.PathVideo)}
                      zDepth={0}
                      title={'Scarica video ' + item.LisRequest.PathVideo}
                      mini={true}
                      backgroundColor={blue600}
                      iconStyle={TableStyles.removeIcon}
                    >
                      <DownloadIcon />
                    </FloatingActionButton>
                    
                  </TableRowColumn>
                </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination style={TableStyles.pagination} pages={Pages} select={SelectedPage} onSelect={handleSelectPage} />
            {/* <Snackbar open={ShowNotification} message="Changes saved" autoHideDuration={1000} onRequestClose={hideNotification} /> */}
            <Dialog
              actions={deleteActions}
              modal={false}
              open={this.state.deleteOpen}
              onRequestClose={this.handleDeleteClose}
            >
              Eliminare la request?
            </Dialog>
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
};

class TablePage_1 extends React.Component {
  constructor(props) {
    super(props);
    dotnetify.debug = true;

    // this.vm = dotnetify.react.connect('Table_1', this);
    
    // var arg = { User: { Name: "Test" } }; // Visibile in: vm.$vmArg.User.Name
    var arg = { User1: { Id: g_userid, Name: g_username }, num1: 9043835 };
    // dotnetify.react.connect("HelloWorld", this, { vmArg: arg });
    dotnetify.debug= true;
    this.vm = dotnetify.react.connect('Table_1', this, {
      exceptionHandler: ex => {
        // alert(ex.message);
        console.log('Table_1 - exceptionHandler: ', ex);
        auth.signOut();
      },
      vmArg: arg
    });
    
    this.dispatch = state => this.vm.$dispatch(state);


    console.log('TablePage_1 - dotnetify: ', dotnetify);
    console.log('TablePage_1 - props: ', props);

    this.state = {
      // addName:            '',
      // Employees:          [],
      // Pages:              [],
      // ShowNotification:   false,
      sign_json:          [],    // Oggetto "finale" da passare all'endpoint preview
      sign_tot:           [],    // Array con la lista dei segni come arriva dall'endpoint api - serve per poter fare di nuovo il reduce in caso di filter
      sign_names:         [],    // Array piatto dei nomi - usato per trovare comodamente con il filtro se una parola inserita c'e'
      sign_array:         [],    // Array associativo name -> {id: int, name: string} per poter recuperare l'id in handleChips e costruire sign_json
      sign_iniz:          [],    // Array completo dei segni, raggruppati per iniziale e ordinati lettere/numeri
      sign_filtered:      [],    // Array usato effettivamente nella lista - uguale alla lista completa se non c'e' filtro, altrimenti diminuito in accordo con la parola cercata
      sign_selected:      null,  // Oggetto che rappresenta l'eventuale segno cliccato nella lista
      chips:              [],    // Chips delle parole inserite in lis_edit - verde: trovata, rossa: non trovata
      allWordsFound:      false, // true se tutte le parole in lis_edit hanno corrispondente segno (tutti chips verdi)
      // ita_edit:           '',    // campo di inserimento libero testo ITA - serve solo per appoggiare un testo, non e' prevista traduzione automatica
      // lis_edit:           '',    // campo di inserimento segni LIS - durante l'inserimento viene tenuta traccia della posizione del cursore e ogni parola separata da spazio viene cercata nei segni
      file:               '',
      error:              '',
      msg:                '',
      selectionStart:     0,
      selectionEnd:       0,
      showVideoPreview:   false, // Mostra anteprima video
      // position:           0,
      previewing:            false, // Subito dopo una preview, abilita il publish che e' l'ultima fase

      /*
      ita_id:                   0, // Memorizza l'ID del testo ITA corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente
      ita_edit_version:         0,

      lis_id:                   0, // Memorizza l'ID del testo LIS corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente
      lis_edit_version:         0,
      */


      // Mode:               'dizionario', // switch del tab di selezione modo - Tab di default dizionario
      videoPoster:        '', // '/video_gen/mp4/sentence_04_03_2020_11_01_54.jpg',
      // videoUrl:           '', // '/video_gen/mp4/amico.mp4' // 'http://www.silviaronchey.it/materiali/video/mp4/Intervista%20Vernant.mp4',
      videoName:          ''
    };
    // console.log('TablePage_1 - this.state.Mode: ', this.state.Mode);
    this.handleChangeSign = this.handleChangeSign.bind(this);
    // this.handleChips = this.handleChips.bind(this);
    this.handleChips = handleChips_b.bind(this);
  };

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  inputRef = ref => (this.inputRef = ref)

  componentWillUnmount() {
    console.log('TablePage_1 - componentWillUnmount');
    // window.removeEventListener('beforeunload', this.handleLeavePage);
    // document.removeEventListener("keydown", this.handleSpaceKeyDown, false); // Rimane agganciato a tutti i campi, non solo lis_edit
    // if (this.state.Mode == 'traduzione') {
    // Se sono in traduzione e non c'e' un ita_id (non ho salvato e non arrivo da una request della lista) salvo nelle globals i valori dei campi
    // Per ricaricarli quando torno
    if (this.state.Mode == 'traduzione' && this.state.ita_id == 0) {
      console.log('TablePage_1 - componentWillUnmount - aggiornamento globals');
      g_did_ita = this.state.ita_edit;
      g_did_lis = this.state.lis_edit;
      g_did_videoname = this.state.videoName;
      g_did_output_preview = this.state.videoUrl;
    }
    /*
    try {
      await AsyncStorage.setItem('timeKey', this.state.ita_edit);
    } catch (error) {
      // Error saving data
    }
    */
    this._isMounted = false;
    this.abortController.abort();

    this.vm.$destroy();
  };

  componentDidMount() {
    console.log('TablePage_1 - componentDidMount');
    console.log('TablePage_1 - g_did_ita: ', g_did_ita);
    console.log('TablePage_1 - g_userid: ', g_userid);
    console.log('TablePage_1 - this.props.location: ', this.props.location);
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      console.log("It's a local server!");

    this._isMounted = true;
    // window.addEventListener('beforeunload', this.handleLeavePage);
    // document.addEventListener("keydown", this.handleSpaceKeyDown, false);
    this.handleGetSigns();

    // && this.state.ita_id == 0
    /*
    if (true) { // this.state.Mode == 'traduzione') {
      console.log('TablePage_1 - g_did_output_preview: ', g_did_output_preview);
      this.setState({
        ita_edit: g_did_ita,
        lis_edit: g_did_lis,
        videoName: g_did_videoname,
        videoUrl: g_did_output_preview
        },
        this.handleChips({keyCode: 32, target: {value: g_did_lis}})
      );
      document.getElementById('lisField').value = 'ghrhtrhrthrhtrhr';
    }
    */
    if (this.state.Mode == 'dizionario') {
      this.setState({
        sign_filtered: this.state.sign_iniz
      }, () => {
        console.log('TablePage_1 - componentDidMount - Caricamento segno di benvenuto');
        this.handleChangeSign(
          /*
          {id: 911, 
          animatore: "Francesca Sasso - 48HStudio ",
          code: "",
          contesto: "",
          contributo: "",
          inteprete: "Nadia Decarolis",
          name: "amico",
          name_editor: "04720-amico-",
          name_player: "amico.lis",
          progetto: "PPE",
          validatore: ""}
        */  
          {id: 161,
          animatore: "",
          code: "",
          contesto: "",
          contributo: "",
          inteprete: "",
          name: "benvenuto",
          name_editor: "08000-benvenuto-",
          name_player: "benvenuto.lis",
          progetto: "",
          validatore: ""}
        );
        // this.updateVideo('benvenuto');// {
      });
    }
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  };

  handleGetSigns = _ => {
    fetch("/api/values/sign",
      { signal: this.mySignal }
      ).then((response) => {
        return response.json();
      })
      .then(data => {
        let sign_names = [];
        let sign_array = [];
        let sign_group = data.reduce((r, e) => {
          // get first letter of name of current element
          // if(e.name.includes("gga")) {
          sign_names.push(e.name);
          sign_array[e.name] = e;
          let Iniziale = e.name[0].toUpperCase();
          // if there is no property in accumulator with this letter create it
          if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [e.name], Signs_object: [e]}; //[e]}
          // if there is push current element to children array for that letter
          else {r[Iniziale].Signs.push(e.name); r[Iniziale].Signs_object.push(e);}
          // }
          // return accumulator
          return r;
        }, {});
        let sign_iniz = Object.values(sign_group).sort(function(a, b) {
          // var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          // var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (Number.isInteger(+a.Iniziale)) {
            return 1;
          }
          if (Number.isInteger(+b.Iniziale)) {
            return -1;
          }
        });
        console.log('TablePage_1 - handleGetSigns data: ',       data); // 0: {id: 60, name: "a"}
        console.log('TablePage_1 - handleGetSigns sign_group: ', sign_group);
        console.log('TablePage_1 - handleGetSigns sign_names: ', sign_names);
        console.log('TablePage_1 - handleGetSigns sign_iniz: ',  sign_iniz);
        console.log('TablePage_1 - handleGetSigns sign_array: ',  sign_array);

        this.setState({
          sign_tot:       data,
          sign_names:     sign_names,
          sign_iniz:      sign_iniz,
          sign_array:     sign_array,
          sign_filtered:  sign_iniz
        }, () => {
          if (this.state.Mode == 'dizionario') {
            console.log('TablePage_1 - componentDidMount - Caricamento segno di benvenuto');
            this.updateVideo('benvenuto');// {
          }
          console.log('TablePage_1 - this.state.Mode: ', this.state.Mode);
          if (this.state.Mode == 'traduzione' && this.state.ita_id == 0) {
            console.log('TablePage_1 - this.state.ita_id: ', this.state.ita_id);
            console.log('TablePage_1 - g_did_ita: ', g_did_ita);
            console.log('TablePage_1 - g_did_lis: ', g_did_lis);
            try {
              const value = 1; // await AsyncStorage.getItem('timeKey');
              if (value !== null){
                // We have data!!
                console.log(value);
                this.setState({
                  ita_edit: g_did_ita,
                  lis_edit: g_did_lis,
                  videoName: g_did_videoname,
                  videoUrl: g_did_output_preview
                  }, () =>{
                    this.handleChips({keyCode: 32, target: {value: g_did_lis}})
                  }
                );
                // document.getElementById('lisField').value = 'ghrhtrhrthrhtrhr';
              }
            } catch (error) {
              // Error retrieving data
            }
          }
        });

        // this.setState({ dirty: true });
        // this.setState({ justTranslated: true });
        // this.setState({ lis_edit:         data.translation }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
      })
      .catch(error => {
        console.log('TablePage_1 - handleGetSigns - Error: ', error);
      });
  };

  updateVideo(sign_name) {
    // const position = this.state.position + 1;
    console.log('TablePage_1 - updateVideo(sign_name): ', sign_name);
    this.setState({
      // position: position,
      videoPoster: '',
      videoUrl: ''
      // items[Math.floor(Math.random()*items.length)]
      // Math.floor(Math.random()*2)
    }, () =>{

      this.setState({
        // position: position,
        videoPoster: '/video_gen/mp4/'+sign_name+'.gif',
        videoUrl: '/video_gen/mp4/'+sign_name+'.mp4' // http://www.silviaronchey.it/materiali/video/mp4/Racconti%20di%20Corrado%20Augias.mp4'
        // items[Math.floor(Math.random()*items.length)]
        // Math.floor(Math.random()*2)
      });

    });
  };

  handleChangeSign = (sign) => {
    console.log('TablePage_1 - handleChangeSign - sign: ', sign);
    console.log('TablePage_1 - handleChangeSign - this.state.Mode: ', this.state.Mode);
    if (this.state.Mode == 'dizionario') {
      this.setState({
        sign_selected: sign
        },
        this.updateVideo(sign.name)
      )
    }
    if (this.state.Mode == 'traduzione') {
      console.log('TablePage_1 - ', this.state.lis_edit.substring(0, this.state.selectionStart));
      console.log('TablePage_1 - ', this.state.lis_edit.substring(this.state.selectionStart + sign.name.length, this.state.lis_edit.length));
      let newText = (this.state.lis_edit.substring(0, this.state.selectionStart) + ' ' + sign.name + ' ' + this.state.lis_edit.substring(this.state.selectionStart, this.state.lis_edit.length)).replace(/\s\s+/g, ' ').trim(); // + sign.name.length
      this.setState({
        sign_selected: sign,
        lis_edit: newText
        },
        this.handleChips({keyCode: 32, target: {value: newText}})
      );
    }
  };

  handleFilter = (value) => {
    this.setState({ sign_filtered: this.state.sign_iniz.reduce((r, e) => {
        // get first letter of name of current element
        if(e.includes(value)) {
          let Iniziale = e[0];
          // if there is no property in accumulator with this letter create it
          if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [e]}; //[e]}
          // if there is push current element to children array for that letter
          else r[Iniziale].Signs.push(e);
        }
        // return accumulator
        return r;
      }, {})
    });
    console.log('TablePage_1 - handleFilter - value: ', value);
  };

  handleChangeLisText = (value) => {
    console.log('TablePage_1 - handleChangeLisText - value: ', value);
    this.setState({
      // sign_filtered: this.state.children.filter(data => {return data.Signs.includes(value)})
      // allWordsFound: true,
      lis_edit: event.target.value
    },
      () => {                 
        // this.handleSpaceKeyDown(event);                 
    });
    // }, this.handleSpaceKeyDown);
    // console.log('onChangeDate1 - date1: ', date1);
    // console.log('onChangeDate1 - date1.toISOString(): ', date1.toISOString());
      // this.handleFetch(date1);
      // onChange={this.handleFetch} value={this.state.pickDate} 
  };

  handleChips_backup_tablepage1 = (event) => {
    console.log('TablePage_1 - handleChips event.key: ', event.key);
    console.log('TablePage_1 - handleChips event.keyCode: ', event.keyCode);
    console.log('TablePage_1 - handleChips event.Code: ', event.code);
    // console.log('Dashboard - handleChips input: ', input)
    // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    /*        
    <script>
    window.addEventListener("keydown", function(event) {
    let str = "KeyboardEvent: key='" + event.key + "' | code='" +
      event.code + "'";
    let el = document.createElement("span");
    el.innerHTML = str + "<br/>";
    document.getElementById("output").appendChild(el);
    }, true);
    */
    let ret = {};
    if ([undefined,8,17,32,46].includes(event.keyCode)) { //  === 32) { // 27) { // Space
      // Do whatever when esc is pressed
      console.log('TablePage_1 - handleChips keyCode 12 - Space pressed! ')
      let list = event.target.value.replace(/\s\s+/g, ' ').trim().split(' '); // replace("\s\s+","\s"
      ret.tot = event.target.value.replace(/\s\s+/g, ' ').trim();
      ret.it = [];
      ret.count = 0;
      let ar = [];
      // let tt = ['Test', 'Prova'];
      list.forEach((item, i) => {
        // if (i === idx) {
        // console.log(Object.assign({}, {"key3": "value3"}, item));
        // ar[] = Object.assign({Word: item, Found: tt.includes(item)});
        // if (!tt.includes(item)) this.setState({ allWordsFound: false });
        ar[i] = {Word: item, Found: this.state.sign_names.includes(item)};
        if (this.state.sign_names.includes(item)) {
          ret.it.push(this.state.sign_array[item]);
          ret.count += 1;
        }
      });
      // Object.assign
      // Object.keys(obj).some(function(k) {
      // return obj[k] === "test1";
      // });
      // allWordsFound:  false
      console.log('TablePage_1 - handleChips - Check array at least one false value: ', !ar.some(function(k) {return k.Found === false}));
      console.log('TablePage_1 - handleChips - Tot JSON: ', ret);
      this.setState({
        allWordsFound: !ar.some(function(k) {return k.Found === false}),
        sign_json: ret,
        chips: ar // [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
      });
    }
    // this.setState({ lis_edit: event.target.value });
  };

  handleUpdateTab = (value) => {
    console.log('TablePage_1 - handleUpdateTab - value: ', value);
    // this.setState({ value_area: value });
    this.setState({
      Mode: value,
      // ita_edit: '',
      // lis_edit: '',
      videoUrl: '' // "dist/videos/output.mp4"
      }, this.handleUpdateDiz); //.id});
    // this.handleUpdateTextAreas(7);
  };

  handleUpdateDiz = () => {
    // setOpen(true);
    // this.setState({showSnackbar: true});
  };

  handleDownloadItaTxtFile = () => {
    const element = document.createElement("a");
    
    const file = new Blob([document.getElementById('itaField').value], {type: 'text/plain'});
    // const file = new Blob([this.state.lis_edit], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  handleDownloadLisTxtFile = () => {
    const element = document.createElement("a");
    
    const file = new Blob([document.getElementById('lisField').value], {type: 'text/plain'});
    // const file = new Blob([this.state.lis_edit], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  handleItaTxtFileChange = (event) => {
    this.setState({
      file: event.target.files[0]
    }, () => {

      if(!this.state.file) {
        this.setState({error: 'Please upload a file.'})
        return;
      }
      if(this.state.file.size >= 2000000) {
        this.setState({error: 'File size exceeds limit of 2MB.'})
        return;
      }
      const reader = new FileReader()
      new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(this.state.file)
      }).then(content => {
        // target.value = content
        // console.log('TablePage_1 - cont: ', content);
        this.setState({ ita_edit: content }); // .replace(/\n/g, 'accapo').trim()
        /*
          warnwarn: dotnetify_react_template.server.Controllers.ValuesController[0]
                ValuesController text_trad POST - value: {"IdUserEdit":4,"IdTextIta":0,"TextIta":"file
          : dotnetify_react_template.server.Controllers.ValuesController[0]
                ValuesController text_trad POST - value: {"IdUserEdit":4,"IdTextIta":0,"TextIta":"file
          infoinfo: Microsoft.AspNetCore.Mvc.Internal.ControllerActionInvoker[2]
        */
      }).catch(error => console.log('TablePage_1 - handleUploadItaTxtFile error: ', error))

    });
  };

  handleLisTxtFileChange = (event) => {
    this.setState({
      file: event.target.files[0]
    }, () => {

      if(!this.state.file) {
        this.setState({error: 'Please upload a file.'})
        return;
      }
      if(this.state.file.size >= 2000000) {
        this.setState({error: 'File size exceeds limit of 2MB.'})
        return;
      }
      const reader = new FileReader()
      new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(this.state.file)
      }).then(content => {
        // target.value = content
        // console.log('TablePage_1 - cont: ', content);
        this.setState({ lis_edit: content }, () => {
          // this.handleChips(event);
          this.handleChips({keyCode: 32, target: {value: content}});
        });
      }).catch(error => console.log('TablePage_1 - handleUploadItaTxtFile error: ', error))

    });
  };

  handleUploadItaTxtFile = (event) => {
    event.preventDefault();
    this.setState({error: '', msg: ''}, () => {
      document.getElementById('my-file-ita').click();
    });
    /*
    if(!this.state.file) {
      this.setState({error: 'Please upload a file.'})
      return;
    }
    if(this.state.file.size >= 2000000) {
      this.setState({error: 'File size exceeds limit of 2MB.'})
      return;
    }
    const reader = new FileReader()
    new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(this.state.file)
    }).then(content => {
      // target.value = content
      // console.log('TablePage_1 - cont: ', content);
      this.setState({ ita_edit: content });
    }).catch(error => console.log('TablePage_1 - handleUploadItaTxtFile error: ', error))
    */
    /*
    const reader = new FileReader()
    reader.onload = event => console.log(this.state.file); // desired file content
    reader.onerror = error => reject(error);
    let cont = reader.readAsText(this.state.file) // you could also read images and other binaries
    console.log('TablePage_1 - cont: ', cont);
    */
  };

  handleUploadLisTxtFile = (event) => {
    event.preventDefault();
    this.setState({error: '', msg: ''}, () => {
      document.getElementById('my-file-lis').click();
    });
    /*
    if(!this.state.file) {
      this.setState({error: 'Please upload a file.'})
      return;
    }
    if(this.state.file.size >= 2000000) {
      this.setState({error: 'File size exceeds limit of 2MB.'})
      return;
    }
    const reader = new FileReader()
    new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(this.state.file)
    }).then(content => {
      // target.value = content
      // console.log('TablePage_1 - cont: ', content);
      this.setState({ lis_edit: content });
    }).catch(error => console.log('TablePage_1 - handleUploadLisTxtFile error: ', error))
    */
    /*
    const reader = new FileReader()
    reader.onload = event => console.log(this.state.file); // desired file content
    reader.onerror = error => reject(error);
    let cont = reader.readAsText(this.state.file) // you could also read images and other binaries
    console.log('TablePage_1 - cont: ', cont);
    */
  };

  handleArrowKeysDown = (e) => {
    /*
    The event. which property normalizes event. keyCode and event.
    ...
    #Keycode values.
    Key	Code
    left arrow	37
    up arrow	38
    right arrow	39
    down arrow	40
    */
    // const { cursor, result } = this.state

    /*
    onKeyDown={(event) => {
      if (typeof(this.input)==='object'&&this.input!==null) {
        const selectionStart = this.input.props.inputRef.selectionStart;
        console.log('onKeyDown - selectionStart: ', selectionStart);
        if (typeof(selectionStart)==='number') {
          this.setState({
            selectionStart: selectionStart,
            selectionEnd:   selectionStart
          })
          return
        }
      }
      if(event.keyCode === 32) { // 27) { // Space
        // Do whatever when esc is pressed
        console.log('TablePage_1 - event.keyCode === 32 - Space pressed! ')
        let list = event.target.value.replace(/\s\s+/g, ' ').trim().split(' '); // replace("\s\s+","\s"
        let ar = [];
        // let tt = ['Test', 'Prova'];

        list.forEach((item, i) => {
          // if (i === idx) {
          // console.log(Object.assign({}, {"key3": "value3"}, item));
          // ar[] = Object.assign({Word: item, Found: tt.includes(item)});
          // if (!tt.includes(item)) this.setState({ allWordsFound: false });
          ar[i] = {Word: item, Found: this.state.sign_names.includes(item)};
        });
        // Object.assign

        // Object.keys(obj).some(function(k) {
        // return obj[k] === "test1";
        // });
        console.log('TablePage_1 - handleSpaceKeyDown - Check array: ', ar.some(function(k) {return k.Found === false}));
        this.setState({
          allWordsFound: ar.some(function(k) {return k.Found === false}),
          chips: ar // [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
        });
      }
    }}
    */

    let cursor = 1;
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 37) {
      console.log('TablePage_1 - left - e.keyCode: ', e.keyCode);
      this.setState({
        selectionStart: this.state.selectionStart - 1,
        selectionStart: this.state.selectionEnd - 1
      });
    } else if (e.keyCode === 38) {
      console.log('TablePage_1 - render - e.keyCode: ', e.keyCode);
      // this.setState( prevState => ({
      //   cursor: prevState.cursor + 1
      // }))
    } else if (e.keyCode === 39) {
      console.log('TablePage_1 - render - e.keyCode: ', e.keyCode);
      this.setState({
        selectionStart: this.state.selectionStart + 1,
        selectionStart: this.state.selectionEnd + 1
      });
    } else if (e.keyCode === 40) {
      console.log('TablePage_1 - render - e.keyCode: ', e.keyCode);
      // this.setState( prevState => ({
      //   cursor: prevState.cursor + 1
      // }))
    }
  };

  handlePreview = _ => {
    console.log('TablePage_1 handlePreview - creazione anteprima - non salva nulla su DB');

    // Attiva il progress sul player a intervalli di 1 secondo
    var keepVideoLoading = setInterval(function() {
      document.getElementById("did_video").load();
    }, 1000);
    // let paaa = '';
    /*
    fetch("/api/values/request",
    {
      signal: this.mySignal,
      method: 'POST',
      body: "'"+JSON.stringify({
        name_video: this.state.videoName,
        id: this.state.id_text_trans,
        path_video: this.state.path_videogen, // '/path/to/video_idtrans'+this.state.id_text_trans,
        notes: 'note_request_idtrans'+this.state.id_text_trans
      })+"'",
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(p => {
      console.log('handlePreview - Risultato request POST: ', p);
    */
    /*
    this.dispatch({
      Start: { // I metodi Start e Stop hanno gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
        IdUserEdit: 2,
        IdTextIta: this.state.ita_id,
        VersionIta: this.state.ita_edit_version,
        TextIta: this.state.ita_edit,
        NotesIta: "Provaaa_note_ita",
        IdTextLis: this.state.lis_id,
        VersionLis: this.state.lis_edit_version,
        TextLis: this.state.lis_edit,
        NotesLis: "Provaaa_note_lis"
      }
    });
    */
    this.setState({
      videoUrl: null,
      showVideoPreview: true, // Doveva servire per visualizzare o meno l'anteprima - non piu' usato, il player video e' visibile sempre
      previewing:       true,
    }, () => {
      fetch(
        "/api/values/preview",
        {
          signal: this.mySignal,
          method: 'POST',
          // body: "'"+JSON.stringify({value: btoa('mostra perfetto bambino alto tutti_e_due ciascuno spiegare accordo esperienza suo avere')})+"'",
          body: "'"+JSON.stringify(
            {
              ...this.state.sign_json,
              filename: this.state.videoName
            }
          )+"'",
          headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json()) // {
        // console.log('TablePage_1 handlePreview - Risultato preview POST: ' , res);
        // res.json()
      // })
      .then(p => {
        console.log('TablePage_1 handlePreview - Risultato preview POST: ' , p);
        clearInterval(keepVideoLoading);
        // paaa = p.output_preview;
        /*
        this.dispatch({
          Stop: { // Il metodo Stop ha gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
            IdUserEdit: 2,
            IdTextIta: this.state.ita_id,
            VersionIta: this.state.ita_edit_version,
            TextIta: this.state.ita_edit,
            NotesIta: "Provaaa_note_ita",
            IdTextLis: this.state.lis_id,
            VersionLis: this.state.lis_edit_version,
            TextLis: this.state.lis_edit,
            NotesLis: "Provaaa_note_lis"
          }
        });
        */
        this.setState({
          // ita_edit: p.output_preview+'.jpg',
          videoUrl: p.output_preview + '.mp4',
          
          // path_postergen: p.output_preview + '.jpg',
          // path_videogen: p.output_preview + '.mp4',
          // showVideoPreview: true,
          previewing:    false,
          // snackbarAutoHideDuration: 2000 // Rimetti a 2 secondi
        }); // , this.handleCloseSnackBar); // this.handleCloseDialog); // Niente dialog per la preview - c'e' gia' il progress circolare
      }).catch(error => {
        console.log('TablePage_1 handlePreview - preview Error: ', error);
        clearInterval(keepVideoLoading);
      });
    });
    /*
    console.log('handlePreview - preview paaa: ', paaa);

    this.setState({
      path_videogen: paaa,
      showVideoPreview: true,
      previewing:    true,
      snackbarAutoHideDuration: 2000 // Rimetti a 2 secondi
    }, this.handleCloseSnackBar); // this.handleCloseDialog); // Niente dialog per la preview - c'e' gia' il progress circolare
    */
    /*
    })
    .catch(error => {
      console.log('handlePreview - request Error: ', error);
    });
    */
  };

  handleSave = (buttonName) => {
    console.log('TablePage_1 handleSave - creazione text_trad e request');
    console.log('TablePage_1 handleSave - nome bottone:', buttonName);

    // if (buttonName == 'SalvaNuovo') {
    this.setState({
      ita_id: buttonName == 'SalvaNuovo' ? 0 : this.state.ita_id,
      ita_edit_version: buttonName == 'SalvaNuovo' ? 0 : this.state.ita_edit_version,
      lis_id: buttonName == 'SalvaNuovo' ? 0 : this.state.lis_id,
      lis_edit_version: buttonName == 'SalvaNuovo' ? 0 : this.state.lis_edit_version
    }, () => {
      // }
      fetch(
        "/api/values/text_trad",
        {
          signal: this.mySignal,
          method: 'POST',
          // La versione qui parte da 0 e rimane 0 perche' viene salvata sempre una versione 1 di una nuova coppia
          // deve diventare:
          // Mantengo il conteggio della versione corrente incrementando
          // oppure se uso il comando Salva come nuovo.., riparto da 0 (che verra' portato a 1 in backend)
          body: "'"+JSON.stringify({
            IdUserEdit: g_userid, // 4,
            IdTextIta:  this.state.ita_id, // 0,
            TextIta:    this.state.ita_edit.replace(/'/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"), //"Provaaaa_manda_a_dashboard",
            VersionIta: this.state.ita_edit_version, 
            NotesIta:   "Provaaa_note ita_tablepage_1 ", // + this.state.ita_edit,
            IdTextLis:  this.state.lis_id, // 0,
            TextLis:    this.state.lis_edit, //"Provaaaa_manda_a_dashboard",
            VersionLis: this.state.lis_edit_version,
            NotesLis:   "Provaaa_note lis_tablepage_1 " + this.state.lis_edit
          })+"'",
          headers: {'Content-Type': 'application/json'}
        })
      .then(res => res.json())
      .then(p1 => {
        console.log('TablePage_1 handleSave - Risultato text_trad POST: ', p1);
        // TablePage.js:900 TablePage_1 handleSave - Risultato text_trad POST:  {id_text_trans: "503", id_text_ita: "507", id_text_lis: "504"}
        console.log('TablePage_1 handleSave - creazione request');
        fetch("/api/values/request",
        {
          signal: this.mySignal,
          method: 'POST',
          body: "'"+JSON.stringify({
            name_video: this.state.videoName,
            id:         p1.id_text_trans, // ID text_trans sulla trans2
            path_video: this.state.videoUrl,
            notes:      "note_request id_text_trans: " + p1.id_text_trans
          })+"'",
          headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(p2 => {
          console.log('TablePage_1 handleSave - Risultato request POST: ', p2);
          console.log('TablePage_1 handleSave - Assegnazione p1.id e versioni', p1.id_text_ita, p1.id_text_lis);
          this.setState({
            ita_id:           p1.id_text_ita,
            lis_id:           p1.id_text_lis,
            ita_edit_version: this.state.ita_edit_version + 1, // == 0 ? 1 : this.state.ita_edit_version + 1,
            lis_edit_version: this.state.lis_edit_version + 1  // == 0 ? 1 : this.state.lis_edit_version + 1
            // Attenzione
            // Da fronted si arriva al backend SEMPRE con la versione corrente che parte da 0
            // e che viene SEMPRE incrementata NEL BACKEND
            // oppure resettata a 0 (che diventara' 0 + 1 nel backend) se si fa SALVA COME NUOVO
          });
          /*
          console.log('TablePage_1 handleSave - creazione preview');
          fetch(
            "/api/values/preview",
            {
              signal: this.mySignal,
              method: 'POST',
              // 'mostra perfetto bambino alto tutti_e_due ciascuno spiegare accordo esperienza suo avere'
              // body: "'"+JSON.stringify({value: btoa(this.state.lis_edit)})+"'",
              // body: "'"+JSON.stringify({value: btoa('mostra perfetto bambino alto tutti_e_due ciascuno spiegare accordo esperienza suo avere')})+"'",
              body: "'"+JSON.stringify(this.state.sign_json)+"'",
              headers: {'Content-Type': 'application/json'}
          })
          .then(res => res.json())
          .then(p => {
            clearInterval(keepVideoLoading);
            console.log('TablePage_1 handleSave - Risultato preview POST: ', p);
            this.setState({
              ita_edit: p.output_preview+'.jpg',
              videoUrl: p.output_preview+'.mp4'
              // path_postergen: p.output_preview+'.jpg',
              // path_videogen: p.output_preview+'.mp4',
              // showVideoPreview: true,
              // previewing:    true,
              // snackbarAutoHideDuration: 2000 // Rimetti a 2 secondi
            }); // , this.handleCloseSnackBar); // this.handleCloseDialog); // Niente dialog per la preview - c'e' gia' il progress circolare
          })
          .catch(error => {
            console.log('TablePage_1 handleSave - preview Error: ', error);
          });
          */
        })
        .catch(error => {
          console.log('TablePage_1 handleSave - request Error: ', error);
        });
      })
      .catch(error => {
        console.log('TablePage_1 handleSave - text_trad Error: ', error);
      });
    });
  };

  render() {
    // let { previewing } = this.state;
    //  style={{border: '1px solid'}}
    const Table_1Styles = {
      buttons: {
        marginTop: 5, //30
        // float: 'right'
        float: 'left'
      },
      addButton: { margin: '1em', padding: '1em' },
      removeIcon: { fill: grey500 },
      columns: {
        id: { width: '5%' },
        firstName: { width: '15%' },
        lastName: { width: '70%' },
        remove: { width: '10%' }
      },
      pagination: { marginTop: '1em' },
      campi: {
        fontSize: 12,
        // fontWeight: typography.fontWeightLight
      },
      buttonLabel: {
        fontSize: 8, // '6px'
        padding: '.5em 0'
      }
    };
    
    const handleSelectPage = (page) => {
      const newState = { SelectedPage: page };
      this.setState(newState);
      this.dispatch(newState);
    };

    const handleEditIta = (event) => {
      console.log('TablePage_1 - handleEditIta - event: ', event);
      // this.setState({ dirty: true });
      this.setState({ ita_edit: event.target.value });
    };

    const handleEditLis = (event) => {
      console.log('TablePage_1 - handleEditLis - event: ', event);
      if(event.key === 'Space'){
        console.log('Space pressed! ')
      }
      this.setState({ 
        chips: [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
      });
    };

    const updateSel = (sel) => {
      this.setState({
        selectionStart: sel,
        selectionEnd:   sel
      });
    };

    const RenderConsoleLog = ({ children }) => {
      console.log('TablePage_1 RenderConsoleLog: ', children);
      return false;
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage navigation="Applicazione / Video">
          <div>
            <Tabs style={{width: '100%', float: 'left'}} value={this.state.Mode} onChange={this.handleUpdateTab}>
              { this.state.Mode === 'dizionario' ? 
              <Tab style={{fontSize: 32, fontWeight: 'bold'}} label="Dizionario" value="dizionario" disabled={this.state.Mode === 'dizionario'}></Tab>
              :
              <Tab style={{fontSize: 32, fontWeight: 'bold'}} label="Traduzione" value="traduzione" disabled={this.state.Mode === 'traduzione'}></Tab>
              }
            </Tabs>
            <div className="row">
              <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 m-b-15 ">
                <TextField
                  hintText="Cerca Segno"
                  style={{width: '90%'}}
                  onChange={event => 
                  this.setState({
                      sign_filtered: 
                        event.target.value != '' ?
                        Object.values(this.state.sign_tot.reduce((r, e) => {
                          // get first letter of name of current element
                          /*
                          if (this.state.sign_names.includes(event.target.value)) {
                            let Iniziale = event.target.value[0].toUpperCase();
                            // if there is no property in accumulator with this letter create it
                            if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [event.target.value], Signs_object: [{id: 1, name: event.target.value}]}; //[e]}
                            // if there is push current element to children array for that letter
                            // else r[Iniziale].Signs.push(e.Signs);
                            else {r[Iniziale].Signs.push(e.name); r[Iniziale].Signs_object.push(e);}
                          }
                          */
                          if(e.name.includes(event.target.value)) {
                            let Iniziale = e.name[0].toUpperCase();
                            // if there is no property in accumulator with this letter create it
                            if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [e.name], Signs_object: [e]}; //[e]}
                            // if there is push current element to children array for that letter
                            else {r[Iniziale].Signs.push(e.name); r[Iniziale].Signs_object.push(e);}
                          }
                          
                          return r;
                        }, {})).sort(function(a, b) {
                          // var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                          // var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                          if (Number.isInteger(+a.Iniziale)) {
                            return 1;
                          }
                          if (Number.isInteger(+b.Iniziale)) {
                            return -1;
                          }
                        })
                        :
                        this.state.sign_iniz
                  })
                  }
                />
                <br />
                <div style={{overflowY: "scroll", height: "400px"}}>
                  <ListExampleSelectable children={this.state.sign_filtered} onChangeSign={this.handleChangeSign} filtered={this.state.sign_iniz == this.state.sign_filtered ? null : true}/>
                </div>  
              </div>
              
              { this.state.Mode === 'dizionario' ? 
              <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 m-b-15 ">
                <div>
                  <video controls autoPlay={true} width="800" height="600" key={this.state.videoUrl}><source src={this.state.videoUrl} /></video>
                </div>
              </div>
              : null }
            
              { this.state.Mode === 'traduzione' ? 
              <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 m-b-15 ">
                <React.Fragment>
                  <div style={{float: 'left'}}>
                    <div style={Table_1Styles.addButton}>
                      <input type="file" onChange={this.handleItaTxtFileChange} id="my-file-ita"></input><br />
                      <span style={{fontSize: 16, fontWeight: 'bold'}}>{"Testo ITA" + (location.hostname === "localhost" && this.state.ita_id ? " (ID " + this.state.ita_id + ") : " : "") + (location.hostname === "localhost" && this.state.ita_edit_version ? " (versione " + this.state.ita_edit_version + ") : " : "") }</span>
                      { /* <input id="lisField" /> */ }
                      { /* onChange={handleEditIta} */ }
                      { /* <button onClick={this.handleDownloadItaTxtFile}>Download txt</button> */ }
                      { /* fontSize: 18, fontWeight: 'bold', */ }
                      <RaisedButton label="Salva" onClick={this.handleDownloadItaTxtFile} style={{float: 'right', padding: 1}} primary={true} />
                      <RaisedButton label="Carica" onClick={this.handleUploadItaTxtFile} disabled={false} style={{float: 'right', padding: 1}} primary={true} />
                    </div>
                    <TextareaAutosize
                      cols={48}
                      rows={20}
                      maxRows={25}
                      minRows={3}
                      style={{overflowY: 'scroll'}}
                      inputRef={this.inputRef}
                      ref={el=>this.input=el}
                      className="form-control"
                      id="itaField"
                      value={this.state.ita_edit}
                      onChange={(event) => {
                          this.setState({
                            ita_edit:       event.target.value,
                            // selectionStart: selectionStart,
                            // selectionEnd:   selectionEnd
                          })
                      }}
                    />
                  </div>
                  <div style={{float: 'left'}}>
                    <div style={Table_1Styles.addButton}>
                      <input type="file" onChange={this.handleLisTxtFileChange} id="my-file-lis"></input><br />
                      <span style={{fontSize: 16, fontWeight: 'bold'}}>{"Testo LIS" + (location.hostname === "localhost" && this.state.lis_id ? " (ID " + this.state.lis_id + ") : " : "") + (location.hostname === "localhost" && this.state.lis_edit_version ? " (versione " + this.state.lis_edit_version + ") : " : "") }</span>
                      { /* <input id="lisField" /> */ }
                      { /* <button onClick={this.handleDownloadLisTxtFile}>Download txt</button> */ }
                      { /* fontSize: 18, fontWeight: 'bold', */ }
                      <RaisedButton label="Salva" onClick={this.handleDownloadLisTxtFile} style={{float: 'right', padding: 1}} primary={true} />
                      <RaisedButton label="Carica"  onClick={this.handleUploadLisTxtFile} disabled={false} style={{float: 'right', padding: 1}} primary={true} />
                    </div>
                    <TextareaAutosize
                      cols={48}
                      rows={20}
                      maxRows={25}
                      minRows={3}
                      style={{overflowY: 'scroll'}}
                      inputRef={this.inputRef}
                      ref={el=>this.input=el}
                      className="form-control"
                      id="lisField"
                      value={this.state.lis_edit}
                      onChange={(event) => {
                        if (typeof(this.input)==='object'&&this.input!==null) {
                          const selectionStart = this.input.props.inputRef.selectionStart;
                          console.log('TextareaAutosize onKeyDown - selectionStart: ', selectionStart);
                          const selectionEnd = this.input.props.inputRef.selectionEnd;
                          console.log('TextareaAutosize onKeyDown - selectionEnd: ', selectionEnd);
                          this.setState({
                            lis_edit:       event.target.value,
                            selectionStart: selectionStart,
                            selectionEnd:   selectionEnd,
                            // allWordsFound:  false
                          }, this.handleChips(event))
                        }
                      }}

                      onKeyDown={(event) => {
                        if (typeof(this.input)==='object'&&this.input!==null) {
                          const selectionStart = this.input.props.inputRef.selectionStart;
                          console.log('TextareaAutosize onKeyDown - selectionStart: ', selectionStart);
                          // document.getElementById('pos').innerHTML = selectionStart;
                          document.getElementById('pos').value = selectionStart;
                          const selectionEnd = this.input.props.inputRef.selectionEnd;
                          console.log('TextareaAutosize onKeyDown - selectionEnd: ', selectionEnd);
                          this.setState({
                            lis_edit:       event.target.value,
                            selectionStart: selectionStart,
                            selectionEnd:   selectionEnd,
                            // allWordsFound:  false
                          }, this.handleChips(event))
                        }
                      }}
                                          
                      onClick={(event) => {
                        if (typeof(this.input)==='object'&&this.input!==null) {
                          const selectionStart = this.input.props.inputRef.selectionStart;
                          console.log('TextareaAutosize onClick - selectionStart: ', selectionStart);
                          const selectionEnd = this.input.props.inputRef.selectionEnd;
                          console.log('TextareaAutosize onClick - selectionEnd: ', selectionEnd);
                          this.setState({
                            lis_edit:       event.target.value,
                            selectionStart: selectionStart,
                            selectionEnd:   selectionEnd,
                            // allWordsFound:  false
                          }, this.handleChips(event))
                        }
                      }}
                    />
                    
                    <div className="mr-auto" style={{visibility: (location.hostname === "localhost" ? 'show' : 'hidden')}}>
                      Cursor at position: {this.state.selectionStart} (<input type='text' id="pos" />)<br />
                      this.state.allWordsFound: {this.state.allWordsFound.toString()}<br />
                      this.state.previewing: {this.state.previewing.toString()}<br />
                    </div>
                    <div style={Table_1Styles.buttons}>
                      <ChipExampleSimple1 chips={this.state.chips}/>
                    </div>
                  </div>
                </React.Fragment>
              </div>
              : null }

              { this.state.Mode === 'dizionario' && this.state.sign_selected ?
              <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 m-b-15 ">
                <div style={Table_1Styles.campi}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          ID:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.id}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Nome lemma:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.name}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Nome file player:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.name_player}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Nome editor:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.name_editor}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Contesto:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.contesto}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Progetto:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.progetto}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Contributo:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.contributo}</b>
                        </td>
                      </tr>                      
                      <tr>
                        <td>
                          Interprete:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.inteprete}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Animatore:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.animatore}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Validatore:
                        </td>
                        <td>
                          <b>{this.state.sign_selected.validatore}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              : null }
              
              { this.state.Mode === 'traduzione'? 
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15 ">
                <div style={Table_1Styles.buttonLabel}>
                  <video id="did_video" controls autoPlay={true} key={this.state.videoUrl}><source src={this.state.videoUrl} /></video><br />
                  {/* width="560" height="440" style={{ objectFit: 'contain'}}*/}
                  {/* onload="valutare la possibilita' di lancaire load() ricorsivamente per far girare il progress finche' non c'e' il video" */}
                  <RaisedButton label="Genera video" onClick={this.handlePreview} disabled={!this.state.allWordsFound || this.state.previewing} style={{float: 'left'}} primary={true} /><br />
                  <TextField
                    hintText="Nome video..."
                    style={{width: '95%'}}
                    value={this.state.videoName}
                    onChange={event => 
                      this.setState({ videoName: event.target.value })
                    }
                  /><br />
                  <RaisedButton label="Salva" onClick={() => this.handleSave('Salva')} disabled={!this.state.allWordsFound || this.state.previewing || !this.state.videoUrl || this.state.videoName == ''} style={{float: 'left'}} primary={true} />
                  <RaisedButton label="Salva come nuovo..." onClick={() => this.handleSave('SalvaNuovo')} disabled={!this.state.allWordsFound || this.state.previewing || !this.state.videoUrl || this.state.videoName == ''} style={{float: 'right'}} primary={true} />
                </div>
              </div>
              : null }
            </div>
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
};

// export default TablePage;

export {
  // export default 
  TablePage, //;
  // export const 
  TablePage_1 //;
}
