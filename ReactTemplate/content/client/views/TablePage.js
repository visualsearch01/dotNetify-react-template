import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Snackbar from 'material-ui/Snackbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import IconRemove from 'material-ui/svg-icons/content/clear';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { pink500, grey200, grey500 } from 'material-ui/styles/colors';
import ThemeDefault from '../styles/theme-default';
import globalStyles from '../styles/styles';
import { ChipExampleSimple, ListExampleSelectable } from '../components/dashboard/InfoBox';
import { ChipExampleSimple1 } from '../components/dashboard/RecentActivities';
import { VideoPreview } from '../components/dashboard/Utilization';
import BasePage from '../components/BasePage';
import Pagination from '../components/table/Pagination';
import InlineEdit from '../components/table/InlineEdit';
import TextareaAutosize from 'react-textarea-autosize';
import RaisedButton from 'material-ui/RaisedButton';

class TablePage extends React.Component {
  constructor(props) {
    super(props);
    dotnetify.debug = true;
    this.vm = dotnetify.react.connect('Table', this);
    this.dispatch = state => this.vm.$dispatch(state);

    console.log('TablePage - dotnetify: ', dotnetify);
    console.log('TablePage - props: ', props);

    this.state = {
      addName: '',
      Employees: [],
      Requests: [],
      Pages: [],
      ShowNotification: false
    };
  }

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
    this._isMounted = false;
    this.abortController.abort();
    // this.vm.$destroy();
  };

  componentDidMount() {
    this._isMounted = true;
    console.log('TablePage - componentDidMount');
    window.addEventListener('beforeunload', this.handleLeavePage);    
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
    let { addName, Employees, Requests, Pages, SelectedPage, ShowNotification } = this.state;
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

    const handleSelectPage = page => {
      const newState = { SelectedPage: page };
      this.setState(newState);
      this.dispatch(newState);
    };

    const hideNotification = _ => this.setState({ ShowNotification: false });

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title="Lista video" navigation="Applicazione / Video">
          <div>
          {/*
            <div>
              <FloatingActionButton onClick={handleAdd} style={styles.addButton} backgroundColor={pink500} mini={true}>
                <ContentAdd />
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
                  <TableHeaderColumn style={styles.columns.id}>Versione</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.firstName}>Data</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.remove}>Area</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.remove}>Testo ITA</TableHeaderColumn>
                  <TableHeaderColumn style={styles.columns.lastName}>Stato</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Requests.map((item, index) => (
                  <TableRow key={index}>
                    <TableRowColumn style={styles.columns.id}>{item.Version}</TableRowColumn>
                    <TableRowColumn style={styles.columns.firstName}>{item.Date}</TableRowColumn>
                      {/*<InlineEdit onChange={value => handleUpdate({ Id: item.Id, FirstName: value })}>{item.FirstName}</InlineEdit>
                    </TableRowColumn>*/}
                    <TableRowColumn style={styles.columns.lastName}>{item.Area}</TableRowColumn>
                      {/*<InlineEdit onChange={value => handleUpdate({ Id: item.Id, LastName: value })}>{item.LastName}</InlineEdit>
                    </TableRowColumn>*/}
                    <TableRowColumn style={styles.columns.remove}>{item.Notes}</TableRowColumn>
                    <TableRowColumn style={styles.columns.remove}>{item.Status}</TableRowColumn>
                    {/*
                      <FloatingActionButton
                        onClick={_ => this.dispatch({ Remove: item.Version })}
                        zDepth={0}
                        mini={true}
                        backgroundColor={grey200}
                        iconStyle={styles.removeIcon}
                      >
                        <IconRemove />
                      </FloatingActionButton>
                    </TableRowColumn>
                    */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination style={styles.pagination} pages={Pages} select={SelectedPage} onSelect={handleSelectPage} />
            <Snackbar open={ShowNotification} message="Changes saved" autoHideDuration={1000} onRequestClose={hideNotification} />
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
}

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
      // position:           0,
      allWordsFound:      false, // true se tutte le parole in lis_edit hanno corrispondente segno (tutti chips verdi)
      ita_edit:           '',    // campo di inserimento libero testo ITA - serve solo per appoggiare un testo, non e' prevista traduzione automatica
      lis_edit:           '',    // campo di inserimento segni LIS - durante l'inserimento viene tenuta traccia della posizione del cursore e ogni parola separata da spazio viene cercata nei segni
      file:               '',
      error:              '',
      msg:                '',
      selectionStart:     0,
      selectionEnd:       0,
      tab_mode_table1:    'dizionario', // switch del tab di selezione modo - Tab di default dizionario
      videoPoster:        '', // '/video_gen/mp4/sentence_04_03_2020_11_01_54.jpg',
      videoUrl:           '', // '/video_gen/mp4/amico.mp4' // 'http://www.silviaronchey.it/materiali/video/mp4/Intervista%20Vernant.mp4'
    };
    this.handleChangeSign = this.handleChangeSign.bind(this);
    this.handleChips = this.handleChips.bind(this);
  };

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  inputRef = ref => (this.inputRef = ref)

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
    // document.removeEventListener("keydown", this.handleSpaceKeyDown, false); // Rimane agganciato a tutti i campi, non solo lis_edit
    this._isMounted = false;
    this.abortController.abort();
    // this.vm.$destroy();
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
        console.log('Dashboard - handleGetSigns sign_array: ',  sign_array);

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
    console.log('TablePage_1 - handleChangeSign - this.state.tab_mode_table1: ', this.state.tab_mode_table1);
    if (this.state.tab_mode_table1 == 'dizionario') {
      this.setState({
        sign_selected: sign
        },
        this.updateVideo(sign.name)
      )
    }
    if (this.state.tab_mode_table1 == 'traduzione') {
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
    console.log('Dashboard - handleChips event.key: ', event.key);
    console.log('Dashboard - handleChips event.keyCode: ', event.keyCode);
    console.log('Dashboard - handleChips event.Code: ', event.code);
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
      tab_mode_table1: value,
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

  handleDownloadTxtFile = () => {
    const element = document.createElement("a");
    
    const file = new Blob([document.getElementById('targetField').value], {type: 'text/plain'});
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

  // handleTxtFileUpload = _ => {}  
  handleTxtFileUpload = (event) => {
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
    }).catch(error => console.log('TablePage_1 - handleTxtFileUpload error: ', error))

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

  handleSave = _ => {
    console.log('TablePage_1 handleSave - creazione text_trad');
    fetch(
      "/api/values/text_trad",
      {
        signal: this.mySignal,
        method: 'POST',
        body: "'"+JSON.stringify({
          IdUserEdit: 4,
          TextIta: this.state.ita_edit, //"Provaaaa_manda_a_dashboard",
          NotesIta: "Provaaa_note_ita_tablepage_1",
          TextLis: this.state.lis_edit, //"Provaaaa_manda_a_dashboard",
          NotesLis: "Provaaa_note_lis_tablepage_1"
        })+"'",
        headers: {'Content-Type': 'application/json'}
      })
    .then(res => res.json())
    .then(p => {
      console.log('TablePage_1 handleSave - Risultato text_trad POST: ', p);
      console.log('TablePage_1 handleSave - creazione request');
      fetch("/api/values/request",
      {
        signal: this.mySignal,
        method: 'POST',
        body: "'"+JSON.stringify({
          id: p.id_text_trans,
          path: '/path/to/video_idtrans'+p.id_text_trans,
          notes: 'note_request_idtrans'+p.id_text_trans
        })+"'",
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(p => {
        console.log('TablePage_1 handleSave - Risultato request POST: ', p);
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

    const hideNotification = _ => this.setState({ ShowNotification: false });

    const handleEditIta = event => {
      console.log('handleEditIta - event: ', event);
      // this.setState({ dirty: true });
      this.setState({ ita_edit: event.target.value });
    };

    const handleEditLis = (event) => {
      console.log('handleEditLis - event: ', event);
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

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title="Dizionario / traduzione" navigation="Applicazione / Video">
          <div>
            <Tabs style={{width: '100%', float: 'left'}} value={this.state.tab_mode_table1} onChange={this.handleUpdateTab}>
              <Tab label="Dizionario" value="dizionario" disabled={this.state.tab_mode_table1 === 'dizionario'}></Tab>
              <Tab label="Traduzione" value="traduzione" disabled={this.state.tab_mode_table1 === 'traduzione'}></Tab>
              {/* <Tab label="I miei video" value="video" disabled={this.state.tab_mode_table1 === 'video'}></Tab> */}
            </Tabs>

            <div className="row">
              
              
              
              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                <TextField
                  hintText="Digitare per filtrare"
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


              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
{
this.state.tab_mode_table1 === 'dizionario' && this.state.videoUrl != '' ? 
                <div style={Table_1Styles.buttons}>
                  <video controls autoPlay={true} width="320" height="240" key={this.state.videoUrl}><source src={this.state.videoUrl} /></video>
                </div>
:
  null
}


{
this.state.tab_mode_table1 === 'traduzione' ? 
                <React.Fragment>
                <div style={Table_1Styles.buttons}>
                Testo ITA:
                  <TextareaAutosize
                    cols={40}
                    rows={20}
                    maxRows={25}
                    minRows={3}
                    style={{overflowY: 'scroll'}}
                    onChange={handleEditIta}
                  />
                </div>
                
                <div style={Table_1Styles.buttons}>
                  Segni LIS:
                  <TextareaAutosize
                    cols={40}
                    rows={20}
                    maxRows={25}
                    minRows={3}
                    style={{overflowY: 'scroll'}}
                    inputRef={this.inputRef}
                    ref={el=>this.input=el}
                    className="form-control"
                    id="targetField"
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
                  <div className="mr-auto">Cursor at position: {this.state.selectionStart} (<input type='text' id="pos" />)</div>
                </div>
                <div style={Table_1Styles.buttons}>
                  <ChipExampleSimple1 chips={this.state.chips}/>
                </div>
                { /* <ChipExampleSimple /> */ }
                <div style={Table_1Styles.buttons}>
                  { /* <input id="targetField" /> */ }
                  { /* <button onClick={this.handleDownloadTxtFile}>Download txt</button> */ }
                  <RaisedButton label="Scarica txt" onClick={this.handleDownloadTxtFile} style={Table_1Styles.saveButton} primary={true} />
                  <input type="file" onChange={this.handleTxtFileChange}></input>
                  <RaisedButton label="Carica txt"  onClick={this.handleTxtFileUpload} disabled={false} style={Table_1Styles.saveButton} primary={true} />
                </div>

                <div style={Table_1Styles.buttons}>
                  <RaisedButton label="Anteprima"   onClick={this.handleSave} disabled={this.state.allWordsFound} style={Table_1Styles.saveButton} primary={true} />
                </div>
                </React.Fragment>
:
  null
}
              </div>
              
              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
{
  this.state.tab_mode_table1 === 'dizionario' && this.state.sign_selected ?
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
  :
  null
}

{
this.state.tab_mode_table1 === 'traduzione' && this.state.videoUrl != '' ? 
                <div style={Table_1Styles.buttons}>
                  <video controls autoPlay={true} width="320" height="240" key={this.state.videoUrl}><source src={this.state.videoUrl} /></video>
                </div>
:
  null
}
              </div>
            </div>
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
}

// export default TablePage;

export {
  // export default 
  TablePage, //;
  // export const 
  TablePage_1 //;
}
