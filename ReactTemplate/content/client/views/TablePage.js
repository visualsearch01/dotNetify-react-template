import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';

import IconClear from 'material-ui/svg-icons/content/clear';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconAlarm from 'material-ui/svg-icons/action/alarm';

import { pink500, grey200, grey500, blue600 } from 'material-ui/styles/colors';
import ThemeDefault from '../styles/theme-default';
import globalStyles from '../styles/styles';
import { ChipExampleSimple, ListExampleSelectable } from '../components/dashboard/InfoBox';
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
    this.vm = dotnetify.react.connect('Table', this);
    this.dispatch = state => this.vm.$dispatch(state);
    
    this.routeTo = route => this.vm.$routeTo(route);
    
    console.log('TablePage - dotnetify: ', dotnetify);
    console.log('TablePage - props: ', props);

    this.state = {
      // addName: '',
      // Employees: [],
      Requests: [],
      Pages: [],
      // Filter: ''
      // ShowNotification: false
    };
  }

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

  render() {
    let { 
      // addName, 
      // Employees, 
      Requests, Pages, SelectedPage, Filter
      // ShowNotification 
    } = this.state;
    // const { data_id } = this.props;
    // console.log('TablePage - data_id: ', data_id);
    const styles = {
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

    const handleMenuClick1 = (route) => { // route => {
      // Dashboard.handleFetch("2010-01-08");
      console.log('Table - handleMenuClick - route: ', route);
      // console.log('Table - handleMenuClick - idrequest: ', idrequest);
      // console.log('Table - handleMenuClick - area: ', area);
      this.vm.$routeTo(route); // {TemplateId: "FormPage", Path: "2", RedirectRoot: false}); // route);
      // window.location = '/Didattica/traduzione'; // /657';
    };

    const RenderConsoleLog = ({ children }) => {
      console.log('TablePage RenderConsoleLog: ', children);
      return false;
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title={"Lista video " + this.state.Mode} navigation="Applicazione / Video">
          <div>
            <RenderConsoleLog>{Requests}</RenderConsoleLog>
            {/*
              <div>
                <FloatingActionButton onClick={handleAdd} style={styles.addButton} backgroundColor={pink500} mini={true}>
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
            */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn style={styles.columns.id}>Nome request<br />
                  <TextField
                    hintText="Filtra.."
                    style={{width: '95%'}}
                    onChange={(event) => handleFilter(event.target.value)}
                  />
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.firstName}>Data request</TableHeaderColumn>
                  { this.state.Mode != "didattica" ?
                  <TableHeaderColumn style={styles.columns.remove}>Area forecast</TableHeaderColumn>
                  : null }
                  <TableHeaderColumn style={styles.columns.remove}>Testo ITA</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.remove}>Testo LIS</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.lastName}>Stato</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.lastName}>Azioni</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Requests.map((item, index) => (
                  <TableRow key={index}>
                    <TableRowColumn style={styles.columns.id}>{item.LisRequest.NameRequest}</TableRowColumn>
                    <TableRowColumn style={styles.columns.firstName}>{item.LisRequest.TimeRequest}</TableRowColumn>
                      {/*<InlineEdit onChange={value => handleUpdate({ Id: item.Id, FirstName: value })}>{item.FirstName}</InlineEdit>
                    </TableRowColumn>*/}
                    { this.state.Mode != "didattica" ?
                    <TableRowColumn style={styles.columns.lastName}>{item.ForecastArea}</TableRowColumn>
                    : null }
                      {/*<InlineEdit onChange={value => handleUpdate({ Id: item.Id, LastName: value })}>{item.LastName}</InlineEdit>
                    </TableRowColumn>*/}
                    <TableRowColumn
                      title={item.TextITA}
                      style={styles.columns.remove}>{item.TextITA}
                    </TableRowColumn>
                    <TableRowColumn
                      title={item.TextLIS}
                      style={styles.columns.remove}>{item.TextLIS}
                    </TableRowColumn>
                    <TableRowColumn style={styles.columns.remove}>{item.Status}</TableRowColumn>
                    <TableRowColumn style={styles.columns.remove}>
                      {/* onClick={_ => handleMenuClick(item.Route)} */}
                      {/* onClick={_ => this.dispatch({ Remove: item.Version })} */}
                      {/*
                      <FloatingActionButton
                        onClick={_ => handleMenuClick(item.LisRequest.IdRequest, item.ForecastArea)}
                        zDepth={0}
                        mini={true}
                        backgroundColor={pink500}
                        iconStyle={styles.removeIcon}
                      >
                        <IconClear />
                      </FloatingActionButton>
                      */}
                      <FloatingActionButton
                        onClick={_ => handleMenuClick1(item.Route)}
                        zDepth={0}
                        mini={true}
                        backgroundColor={grey200}
                        iconStyle={styles.removeIcon}
                      >
                        <IconAdd />
                      </FloatingActionButton>
                      {/*
                      <FloatingActionButton
                        onClick={_ => this.dispatch({ Remove: item.Version })}
                        zDepth={0}
                        mini={true}
                        backgroundColor={blue600}
                        iconStyle={styles.removeIcon}
                      >
                        <IconAlarm />
                      </FloatingActionButton>
                      */}
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination style={styles.pagination} pages={Pages} select={SelectedPage} onSelect={handleSelectPage} />
            {/* <Snackbar open={ShowNotification} message="Changes saved" autoHideDuration={1000} onRequestClose={hideNotification} /> */}
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
};

class TablePage_1 extends React.Component {
  constructor(props) {
    super(props);
    // console.log('TablePage_1 - props.data_id: ', props.data_id);
    dotnetify.debug = true;
    this.vm = dotnetify.react.connect('Table_1', this);
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

      /*
      ita_id:                   0, // Memorizza l'ID del testo ITA corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente
      ita_edit_version:         0,

      lis_id:                   0, // Memorizza l'ID del testo LIS corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente
      lis_edit_version:         0,
      */


      Mode:               'dizionario', // switch del tab di selezione modo - Tab di default dizionario
      videoPoster:        '', // '/video_gen/mp4/sentence_04_03_2020_11_01_54.jpg',
      // videoUrl:           '', // '/video_gen/mp4/amico.mp4' // 'http://www.silviaronchey.it/materiali/video/mp4/Intervista%20Vernant.mp4',
      videoName:          ''
    };
    console.log('TablePage_1 - this.state.Mode: ', this.state.Mode);
    this.handleChangeSign = this.handleChangeSign.bind(this);
    this.handleChips = this.handleChips.bind(this);
  };

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  inputRef = ref => (this.inputRef = ref)

  componentWillUnmount() {
    console.log('TablePage_1 - componentWillUnmount');
    // window.removeEventListener('beforeunload', this.handleLeavePage);
    // document.removeEventListener("keydown", this.handleSpaceKeyDown, false); // Rimane agganciato a tutti i campi, non solo lis_edit
    this._isMounted = false;
    this.abortController.abort();
    this.vm.$destroy();
  };

  componentDidMount() {
    console.log('TablePage_1 - componentDidMount');
    console.log('TablePage_1 - this.props.location: ', this.props.location);
    this._isMounted = true;
    window.addEventListener('beforeunload', this.handleLeavePage);
    // document.addEventListener("keydown", this.handleSpaceKeyDown, false);
    this.handleGetSigns();
    this.setState({
      sign_filtered: this.state.sign_iniz
    });
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
      videoPoster: '/video_gen/mp4/'+sign_name+'.gif',
      videoUrl: '/video_gen/mp4/'+sign_name+'.mp4' // http://www.silviaronchey.it/materiali/video/mp4/Racconti%20di%20Corrado%20Augias.mp4'
      // items[Math.floor(Math.random()*items.length)]
      // Math.floor(Math.random()*2)
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

  handleChips = (event) => {
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
      console.log('TablePage_1 - handleChips - Check array: ', ar.some(function(k) {return k.Found === false}));
      console.log('TablePage_1 - handleChips - Tot JSON: ', ret);
      this.setState({
        allWordsFound: ar.some(function(k) {return k.Found === false}),
        sign_json: ret,
        chips: ar // [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
      });
    }
    // this.setState({ lis_edit: event.target.value });
  };
  /*
  handleSpaceKeyDown1(event, yo){
    console.log('TablePage_1 - handleSpaceKeyDown1 event: ', event)
    console.log('TablePage_1 - handleSpaceKeyDown1 yo.props.inputRef.selectionStart: ', yo.props.inputRef.selectionStart)
  };

  handleRender = () => {
    var url = "/api/values/download/";
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
  };
  */
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

  handleTxtFileChange = (event) => {
    this.setState({
      file: event.target.files[0]
    });
  };

  handleUploadItaTxtFile = (event) => {
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

    /*
    const reader = new FileReader()
    reader.onload = event => console.log(this.state.file); // desired file content
    reader.onerror = error => reject(error);
    let cont = reader.readAsText(this.state.file) // you could also read images and other binaries
    console.log('TablePage_1 - cont: ', cont);
    */
  };

  // handleUploadLisTxtFile = _ => {}  
  handleUploadLisTxtFile = (event) => {
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
      showVideoPreview: true // Doveva servire per visualizzare o meno l'anteprima - non piu' usato, il player video e' visibile sempre
    }, () => {

      fetch(
        "/api/values/preview",
        {
          signal: this.mySignal,
          method: 'POST',
          // body: "'"+JSON.stringify({value: btoa('mostra perfetto bambino alto tutti_e_due ciascuno spiegare accordo esperienza suo avere')})+"'",
          body: "'"+JSON.stringify(this.state.sign_json)+"'",
          headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
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
          videoUrl: p.output_preview + '.mp4'
          
          // path_postergen: p.output_preview + '.jpg',
          // path_videogen: p.output_preview + '.mp4',
          // showVideoPreview: true,
          // justPreviewed:    true,
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
      justPreviewed:    true,
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


  handleSave = _ => {
    console.log('TablePage_1 handleSave - creazione text_trad e request');
        
    fetch(
      "/api/values/text_trad",
      {
        signal: this.mySignal,
        method: 'POST',
        body: "'"+JSON.stringify({
          IdUserEdit: 4,
          IdTextIta: 0,
          TextIta: this.state.ita_edit, //"Provaaaa_manda_a_dashboard",
          VersionIta: this.state.ita_edit_version, // La versione qui parte da 0 e rimane 0 perche' viene salvata sempre una versione 1 di una nuova coppia
          // deve diventare:
          // Mantengo il conteggio della versione corrente incrementando
          // oppure se uso il comando Salva come nuovo.., riparto da 0 (che verra' portato a 1 in backend)
          NotesIta: "Provaaa_note ita_tablepage_1 " + this.state.ita_edit,
          IdTextLis: 0,
          TextLis: this.state.lis_edit, //"Provaaaa_manda_a_dashboard",
          VersionLis: this.state.lis_edit_version,
          NotesLis: "Provaaa_note lis_tablepage_1 " + this.state.lis_edit
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
          id: p1.id_text_trans, // ID text_trans sulla trans2
          path_video: this.state.videoUrl,
          notes: "note_request id_text_trans: " + p1.id_text_trans
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
          ita_edit_version: this.state.ita_edit_version + 1,
          lis_edit_version: this.state.lis_edit_version + 1
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
            // justPreviewed:    true,
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
  };

  render() {
    // let { addName, Employees, Pages, SelectedPage, ShowNotification } = this.state;
    // const { data_id } = this.props;
    // console.log('TablePage_1 - render - data_id: ', data_id);
    const Table_1Styles = {
      buttons: {
        marginTop: 5, //30
        // float: 'right'
        float: 'left'
      },
      addButton: { margin: '1em' },
      removeIcon: { fill: grey500 },
      columns: {
        id: { width: '5%' },
        firstName: { width: '15%' },
        lastName: { width: '70%' },
        remove: { width: '10%' }
      },
      pagination: { marginTop: '1em' }
    };
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

    const handleSelectPage = page => {
      const newState = { SelectedPage: page };
      this.setState(newState);
      this.dispatch(newState);
    };

    // const hideNotification = _ => this.setState({ ShowNotification: false });

    const handleEditIta = event => {
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

    /*
    title="Dizionario / traduzione"
              <Reqtrans />
    this.state.Mode 
    this.state.FirstName 
    this.state.Reqtrans.Status 
    tabItemContainerStyle={{background: 'yellow'}}* inkBarStyle={{background: 'red'}} 
    <ChipExampleSimple /> 
    this.state.Mode === 'traduzione' && this.state.videoUrl != '' 
    && this.state.sign_selected 
    && this.state.videoUrl != '' 
    <Tab label="I miei video" value="video" disabled={this.state.Mode === 'video'}></Tab>
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
     && this.state.videoUrl != '' 
    */

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage navigation="Applicazione / Video">
          <div>
            <Tabs style={{width: '100%', float: 'left'}} value={this.state.Mode} onChange={this.handleUpdateTab}>
              { this.state.Mode === 'dizionario' ? 
              <Tab label="Dizionario" value="dizionario" disabled={this.state.Mode === 'dizionario'}></Tab>
              :
              <Tab label="Traduzione" value="traduzione" disabled={this.state.Mode === 'traduzione'}></Tab>
              }
            </Tabs>
            <div className="row">
              <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 m-b-15 ">
                <TextField
                  hintText="Cerca Segno"
                  style={{width: '95%'}}
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
                <div style={Table_1Styles.buttons}>
                  <video controls autoPlay={true} width="624" height="468" key={this.state.videoUrl}><source src={this.state.videoUrl} /></video>
                </div>
              </div>
              : null }
            
              { this.state.Mode === 'traduzione' ? 
              <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 m-b-15 ">
                <React.Fragment>
                  <div style={Table_1Styles.buttons}>
                    <div style={{float: 'left'}}>{"Testo ITA" + (this.state.ita_id ? " (ID " + this.state.ita_id + ") : " : " : ") + (this.state.ita_edit_version ? " (versione " + this.state.ita_edit_version + ") : " : " : ") }</div>
                    <div style={{float: 'right'}}>
                      { /* <input id="lisField" /> */ }
                      { /* <button onClick={this.handleDownloadItaTxtFile}>Download txt</button> */ }
                      <RaisedButton label="Salva Testo ITA" onClick={this.handleDownloadItaTxtFile} style={Table_1Styles.saveButton} primary={true} />
                      <input type="file" onChange={this.handleTxtFileChange}></input>
                      <RaisedButton label="Carica Testo ITA"  onClick={this.handleUploadItaTxtFile} disabled={false} style={Table_1Styles.saveButton} primary={true} />
                    </div>
                    <TextareaAutosize
                      cols={40}
                      rows={20}
                      maxRows={25}
                      minRows={3}
                      style={{overflowY: 'scroll'}}
                      value={this.state.ita_edit}
                      onChange={handleEditIta}
                    />
                  </div>
                  <div style={Table_1Styles.buttons}>
                    <div style={{float: 'left'}}>{"Testo LIS" + (this.state.lis_id ? " (ID " + this.state.lis_id + ") : " : " : ") + (this.state.lis_edit_version ? " (versione " + this.state.lis_edit_version + ") : " : " : ") }</div>
                    <div style={{float: 'right'}}>
                      { /* <input id="lisField" /> */ }
                      { /* <button onClick={this.handleDownloadLisTxtFile}>Download txt</button> */ }
                      <RaisedButton label="Salva Segni LIS" onClick={this.handleDownloadLisTxtFile} style={Table_1Styles.saveButton} primary={true} />
                      <input type="file" onChange={this.handleTxtFileChange}></input>
                      <RaisedButton label="Carica Segni LIS"  onClick={this.handleUploadLisTxtFile} disabled={false} style={Table_1Styles.saveButton} primary={true} />
                    </div>
                    <TextareaAutosize
                      cols={40}
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
                            selectionEnd:   selectionEnd
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
                            selectionEnd:   selectionEnd
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
                            selectionEnd:   selectionEnd
                          }, this.handleChips(event))
                        }
                      }}
                    />
                    <div className="mr-auto" style={{visibility: 'hidden'}}>Cursor at position: {this.state.selectionStart} (<input type='text' id="pos" />)</div>
                  </div>
                  <div style={Table_1Styles.buttons}>
                    <ChipExampleSimple1 chips={this.state.chips}/>
                  </div>
                </React.Fragment>
              </div>
              : null }

              { this.state.Mode === 'dizionario' && this.state.sign_selected ?
              <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 m-b-15 ">
                <div style={Table_1Styles.buttons}>
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
              <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 m-b-15 ">
                <div style={Table_1Styles.buttons}>
                  <video id="did_video" controls autoPlay={true} width="480" height="360" key={this.state.videoUrl}><source src={this.state.videoUrl} /></video>
                  {/* onload="valutare la possibilita' di lancaire load() ricorsivamente per far girare il progress finche' non c'e' il video" */}
                  <RaisedButton label="Anteprima" onClick={this.handlePreview} disabled={this.state.allWordsFound} style={{float: 'left'}} primary={true} />
                  <TextField
                    hintText="Nome video..."
                    style={{width: '95%'}}
                    onChange={event => 
                      this.setState({ videoName: event.target.value })
                    }
                  />
                  <RaisedButton label="Salva" onClick={this.handleSave} disabled={this.state.allWordsFound} style={{float: 'left'}} primary={true} />
                  <RaisedButton label="Salva come nuovo..." onClick={this.handleSave} disabled={this.state.allWordsFound || !this.state.videoUrl} style={{float: 'right'}} primary={true} />
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
