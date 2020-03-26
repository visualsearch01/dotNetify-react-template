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
import BasePage from '../components/BasePage';
import Pagination from '../components/table/Pagination';
import InlineEdit from '../components/table/InlineEdit';
import TextareaAutosize from 'react-textarea-autosize';
import RaisedButton from 'material-ui/RaisedButton';

const glossario = [
'600',
'800',
'1000',
'3100',
'abruzzese',
'abruzzo',
'addensamenti',
'adriatiche',
'adriatico',
'agitati',
'agitato',
'al di sopra',
'alta toscana',
'altrove',
'annuvolamenti',
'appenniniche',
'appenninico',
'appennino',
'appennino toscano',
'arco alpino',
'area alpina',
'aree alpine',
'aree alpine del piemonte',
'aree appenniniche',
'aree costiere',
'aree interne',
'aree montuose',
'aree prealpine',
'attenuazione dei fenomeni',
'attenuazione della nuvolosità',
'attenuazione della nuvolosità e dei fenomeni',
'attenuazione delle precipitazioni',
'aumento',
'aumento della nuvolosità',
'aumento delle velature',
'bacini',
'bacino',
'bel tempo',
'calabria',
'campania',
'canale di sardegna',
'centrale',
'centroccidentale',
'centromeridionale',
'centromeridionali',
'centro-nord',
'centrorientale',
'centrosettentrionale',
'centro-sud',
'cielo',
'cielo molto nuvoloso',
'cielo nuvoloso',
'cielo sereno',
'coperto',
'copertura medio alta',
'costa',
'coste',
'costiere adriatiche',
'dai quadranti settentrionali al nord',
'debole fenomeno',
'deboli',
'deboli nevicate',
'deboli piogge',
'deboli piogge o rovesci',
'deboli precipitazioni ',
'decisi rinforzi',
'dell\'abruzzo',
'diradamento della nuvolosità compatta',
'dopo il tramonto',
'due isole maggiori',
'emiliano-romagnole',
'emilia-romagna',
'emiliane',
'estensione della nuvolosità',
'estese velature',
'fenomeni',
'fenomeni con ampie schiarite',
'fenomeni convettivi diffusi',
'fenomeni nevosi',
'forti',
'foschie',
'friuli-venezia giulia',
'gran parte del settore',
'in estensione serale',
'in attenuazione',
'in aumento',
'in calo',
'in diminuzione',
'in lieve aumento',
'in lieve diminuzione',
'in rialzo',
'in special modo',
'in successiva estensione serale',
'intensificazione dei fenomeni',
'ionio',
'isola',
'isolati addensamenti compatti',
'isole maggiori',
'l\'adriatico',
'lazio',
'levante ligure',
'liguria',
'locali deboli nevicate',
'locali nevicate',
'locali rinforzi',
'locali temporali',
'lombardi',
'lombardia',
'maltempo',
'marche',
'mare di sardegna',
'mare e canale di sardegna',
'mari',
'massime',
'massime in calo',
'mattino',
'meridionale',
'meridionali',
'metri',
'miglioramento',
'minime',
'moderati',
'molise',
'molte nubi',
'molto agitati',
'molto agitato',
'molto mossi',
'molto mosso',
'molto nuvoloso',
'mossi',
'nebbia',
'nevicate',
'nevose',
'nevoso',
'nord',
'nord-ovest',
'nubi',
'nuvolosità',
'nuvolosità compatta',
'occidentale',
'occidentali',
'orientali',
'ovest',
'ovunque',
'padana',
'parziale diradamento della nuvolosità',
'parzialmente nuvoloso',
'pianura',
'piemonte',
'piogge',
'piogge o rovesci',
'piogge o rovesci diffusi',
'piogge o rovesci sparsi',
'pioggia o rovescio',
'piovaschi',
'poco nuvoloso',
'pomeridiane',
'pomeriggio',
'precipitazioni a carattere nevoso',
'precipitazioni diffuse',
'precipitazioni sparse di debole intensità',
'prima parte della giornata',
'primo mattino',
'puglia',
'quadranti meridionali',
'quadranti nord-orientali',
'quadranti settentrionali',
'qualche isolato debole fenomeno',
'qualche isolato fenomeno',
'quote superiori',
'regioni',
'regioni adriatiche',
'regioni alpine e prealpine',
'regioni centrali',
'regioni centro-meridionali',
'regioni ioniche',
'regioni meridionali',
'regioni tirreniche',
'restanti',
'restanti mari',
'resto_______________________________________1',
'resto del paese',
'resto del settore',
'resto del territorio',
'resto delle regioni',
'resto delle regioni tirreniche',
'rilievi',
'rilievi alpini',
'rilievi appenninici',
'rimanenti',
'rimanenti bacini',
'rinforzi',
'rovesci',
'rovesci o temporali',
'rovesci o temporali anche di forte intensità',
'rovesci o temporali da sparsi a diffusi',
'rovescio o temporale',
'sardegna',
'scarsa nuvolosità',
'scarsa nuvolosita in rapida intensificazione',
'schiarite',
'seconda parte della mattinata',
'serali',
'serata',
'sereno',
'settentrionale',
'settentrionali',
'sicilia',
'sicilia tirrenica',
'soleggiamento',
'soleggiamento',
'spesse velature',
'stazionarie',
'stretto di sicilia',
'sud',
'sulla parte alta',
'tarda mattinata',
'tarda sera',
'temperature minime ',
'temporale',
'tirreniche',
'tirreno',
'toscana',
'toscano',
'tramonto',
'triveneto',
'tutto il paese',
'tutto il settore',
'umbria',
'velato',
'velature',
'venti',
'vento moderato',
'vento poco',
'versante tirrenico'
];

let glossario_objects = [];

glossario.forEach((item, i) => {
  // y.push(Object.assign({}, {"name": item, "id": i}, item));
  glossario_objects.push(Object.assign({}, {"name": item, "id": i}));
}); 

// Iniziale: 'A', Signs: ['A

let data = glossario_objects.reduce((r, e) => {
  // get first letter of name of current element
// if(e.name.includes("gga")) {
  let Iniziale = e.name[0].toUpperCase();
  // if there is no property in accumulator with this letter create it
  if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [e.name]}; //[e]}
  // if there is push current element to children array for that letter
  else r[Iniziale].Signs.push(e.name);
// }
  // return accumulator
  return r;
}, {})

// since data at this point is an object, to get array of values
// we use Object.values method
let result = Object.values(data);
console.log('Result: ', result);

const glossario_iniziali = [
  {Iniziale: '1', Signs: [
    '1000', 
    '1500'
  ]}, 
  {Iniziale: '6', Signs: [
    '600', 
  ]}, 
  {Iniziale: '8', Signs: [
    '800', 
  ]}, 
  {Iniziale: 'A', Signs: [
    'abruzzese',
    'abruzzo',
    'addensamenti',
    'adriatiche',
    'adriatico',
    'agitati',
    'agitato',
    'al di sopra',
    'alta toscana',
    'altrove',
    'annuvolamenti',
    'appenniniche',
    'appenninico',
    'appennino',
    'appennino toscano',
    'arco alpino',
    'area alpina',
    'aree alpine',
    'aree alpine del piemonte',
    'aree appenniniche',
    'aree costiere',
    'aree interne',
    'aree montuose',
    'aree prealpine',
    'attenuazione dei fenomeni',
    'attenuazione della nuvolosità',
    'attenuazione della nuvolosità e dei fenomeni',
    'attenuazione delle precipitazioni',
    'aumento',
    'aumento della nuvolosità',
    'aumento delle velature',
  ]}, 
  {Iniziale: 'B', Signs: [
    'bacini',
    'bacino',
    'bel tempo',
  ]}, 
  {Iniziale: 'C', Signs: [
    'calabria',
    'campania',
    'canale di sardegna',
    'centrale',
    'centroccidentale',
    'centromeridionale',
    'centromeridionali',
    'centro-nord',
    'centrorientale',
    'centrosettentrionale',
    'centro-sud',
    'cielo',
    'cielo molto nuvoloso',
    'cielo nuvoloso',
    'cielo sereno',
    'coperto',
    'copertura medio alta',
    'costa',
    'coste',
    'costiere adriatiche',
  ]}
];

class TablePage extends React.Component {
  constructor(props) {
    super(props);
    dotnetify.debug = true;
    this.vm = dotnetify.react.connect('Table', this);
    this.dispatch = state => this.vm.$dispatch(state);

    console.log('Table - dotnetify: ', dotnetify);
    console.log('TablePage - props: ', props);
    console.log('TablePage - props.data_id: ', props.data_id);

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
  }

  componentDidMount() {
    this._isMounted = true;
    console.log('Form - componentDidMount');
    window.addEventListener('beforeunload', this.handleLeavePage);    
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  }

  /*
  componentWillUnmount() {
    this.vm.$destroy();
  }
  */

  render() {
    let { addName, Employees, Requests, Pages, SelectedPage, ShowNotification } = this.state;
    const { data_id } = this.props;
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
    console.log('TablePage_1 - props: ', props);
    // console.log('TablePage_1 - props.data_id: ', props.data_id);
    dotnetify.debug = true;
    this.vm = dotnetify.react.connect('Table_1', this);
    this.dispatch = state => this.vm.$dispatch(state);
    console.log('Table_1 - dotnetify: ', dotnetify);
    // [
    // { title: 'The Shawshank Redemption', year: 1994 },

    this.state = {
      addName:            '',
      Employees:          [],
      Pages:              [],
      children1:          ['tetete', 'yhtyjtjyuj'],
      children:           result, // glossario_iniziali, // [{Iniziale: 'A', Signs: ['Atto', 'Attgeruzz']}, {Iniziale: 'B', Signs: ['BafAtto', 'Buytktuzz']}, {Iniziale: 'C', Signs: ['Cutto', 'Cuzz']}],
      children_filtered:  [],
      chips:              [], // {Word: 'Redemption', Found: true}, {Word: 'Godfather', Found: false}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}],
      ShowNotification:   false,
      position:           0,
      allWordsFound:      false,
      ita_edit:           '',
      lis_edit:           '',
      tab_mode_table1:    'dizionario', // Tab di default
      videoUrl:           'http://www.silviaronchey.it/materiali/video/mp4/Intervista%20Vernant.mp4'
    };
    this.handelKeyDown = this.handelKeyDown.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  _isMounted = false;
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
    document.removeEventListener("keydown", this.handelKeyDown, false);
    this._isMounted = false;
    this.abortController.abort();
    // this.vm.$destroy();
  }

  componentDidMount() {
    this._isMounted = true;
    console.log('Form - componentDidMount');
    window.addEventListener('beforeunload', this.handleLeavePage);
    document.addEventListener("keydown", this.handelKeyDown, false);
    this.setState({
      children_filtered: this.state.children
    });
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  }

  updateVideoManually() {
    const position = this.state.position + 1;
    this.setState({
      position: position,
      videoUrl: 'http://www.silviaronchey.it/materiali/video/mp4/Racconti%20di%20Corrado%20Augias.mp4'


      // items[Math.floor(Math.random()*items.length)]
      // Math.floor(Math.random()*2)
    });
  }

/*
  function getVersion(timeFrameJsonArray, edition_id, id_forecast_type, offset_days, version) {
    let res = children
        .filter(data => {return data.Signsincludes(value)})
        .filter(data => {return data.id_forecast_type == id_forecast_type})
        .filter(data => {return data.offset_days == offset_days})
        .sort(function(a, b) {
          // var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          // var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (a.it_version < b.it_version) {
            return -1;
          }
          if (a.it_version > b.it_version) {
            return 1;
          }
          if (a.it_version > b.it_version) {
            if (a.text_ita.length < b.text_ita.length) {
              return -1;
            }
            if (a.text_ita.length > b.text_ita.length) {
              return 1;
            }
          }
          // return 0;
        });

    console.log('getVersion - version: ', version);
    console.log('getVersion - res: ', res);

    if(version === 1)
  */
  handleChangeIndex = value => {
    console.log('onChangeIndex - value: ', value);
    this.setState({
      ita_edit: 'Segno selezionato: ' + value
      }, this.updateVideoManually());
  }

  handleFilter = value => {
  this.setState({ children_filtered: this.state.children.reduce((r, e) => {
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
  console.log('onChangeIndex - value: ', value);
}
  onChangeText = value => {
    console.log('onChangeText - value: ', value);
    this.setState({
      // children_filtered: this.state.children.filter(data => {return data.Signs.includes(value)})
      // allWordsFound: true,
      lis_edit: event.target.value
    },
      () => {                 
            this.handelKeyDown(event);                 
        });
    // }, this.handelKeyDown);
    // console.log('onChangeDate1 - date1: ', date1);
    // console.log('onChangeDate1 - date1.toISOString(): ', date1.toISOString());
      // this.handleFetch(date1);
      // onChange={this.handleFetch} value={this.state.pickDate} 
  }

  handelKeyDown(event){
    if(event.keyCode === 32) { // 27) { // Space
      // Do whatever when esc is pressed
      console.log('Space pressed! ')
      let list = event.target.value.replace(/\s\s+/g, ' ').trim().split(' '); // replace("\s\s+","\s"
      let ar = [];
      // let tt = ['Test', 'Prova'];

      list.forEach((item, i) => {
        // if (i === idx) {
        // console.log(Object.assign({}, {"key3": "value3"}, item));
        // ar[] = Object.assign({Word: item, Found: tt.includes(item)});
        // if (!tt.includes(item)) this.setState({ allWordsFound: false });
        ar[i] = {Word: item, Found: glossario.includes(item)};
      });
      // Object.assign

      // Object.keys(obj).some(function(k) {
      // return obj[k] === "test1";
      // });
      console.log('Check ar: ', ar.some(function(k) {return k.Found === false}));
      this.setState({
        allWordsFound: ar.some(function(k) {return k.Found === false}),
        chips: ar // [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
      });
    }
    // this.setState({ lis_edit: event.target.value });
  }

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
  }

  handleUpdateTab = (value) => {
    console.log('handleUpdateTab - value: ', value);
    // this.setState({ value_area: value });


    this.setState({
      tab_mode_table1: value,
      ita_edit: '',
      lis_edit: '',
      videoUrl: "dist/videos/output.mp4"
      }, this.handleUpdateDiz); //.id});
    // this.handleUpdateTextAreas(7);
  }

  handleUpdateDiz = () => {
    // setOpen(true);
    // this.setState({showSnackbar: true});
  };

  render() {
    let { addName, Employees, Pages, SelectedPage, ShowNotification } = this.state;
    const { data_id } = this.props;
    console.log('TablePage_1 - data_id: ', data_id);
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

    const handleSelectPage = page => {
      const newState = { SelectedPage: page };
      this.setState(newState);
      this.dispatch(newState);
    };

    const hideNotification = _ => this.setState({ ShowNotification: false });

    const handleEditIta1 = event => {
      console.log('handleEditIta - event: ', event);
      // this.setState({ dirty: true });
      // this.setState({ ita_edit: event.target.value });
    };

    const handleEditLis1 = (event) => {
      console.log('handleEditLis - event: ', event);
      if(event.key === 'Space'){
        console.log('Space pressed! ')
      }
      this.setState({ 
        chips: [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
      });
      // this.setState({ lis_edit: event.target.value });
      /*
        onChange={event => this.setState({
                      children_filtered: this.state.children.filter(data => {return data.Signs.includes(event.target.value)})
                    })
        this.state.children.reduce((r, e) => {
          // get first letter of name of current element
          if(e.includes(value)) {
          let Iniziale = e[0];
          // if there is no property in accumulator with this letter create it
          if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [e]}; //[e]}
          // if there is push current element to children array for that letter
          else r[Iniziale].Signs.push(e);
          // }
          // return accumulator
          return r;
        }, {})
      */
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
                  onChange={event => this.setState({
                    children_filtered: Object.values(glossario_objects.reduce((r, e) => {
                      // get first letter of name of current element
                      if (e.name.includes(event.target.value)) {
                        let Iniziale = e.name[0].toUpperCase();
                        // if there is no property in accumulator with this letter create it
                        if(!r[Iniziale]) r[Iniziale] = {Iniziale, Signs: [e.name]}; //[e]}
                        // if there is push current element to children array for that letter
                        else r[Iniziale].Signs.push(e.name);
                      }
                        // return accumulator
                      return r;
                      }, {}))
                  })
                  }
                />
                <br />
                <div style={{overflowY: "scroll", height: "400px"}}>
                  <ListExampleSelectable children={this.state.children_filtered} onChangeIndex={this.handleChangeIndex} />
                </div>  
              </div>
{this.state.tab_mode_table1 === 'dizionario' ? 
              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                <div style={Table_1Styles.buttons}>
                  <div style={globalStyles.navigation}>Descrizione segno</div>
                </div>
                <div style={Table_1Styles.buttons}>
                  <TextareaAutosize cols={40} rows={20} maxRows={25} value={this.state.ita_edit} onChange={handleEditIta1} />
                </div>
              </div>
:
              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                <div style={Table_1Styles.buttons}>
                  <div style={globalStyles.navigation}>Testo ITA:</div>
                </div>
                <div style={Table_1Styles.buttons}>
                  <TextareaAutosize cols={40} rows={20} maxRows={25} value={this.state.ita_edit} onChange={handleEditIta1} />
                </div>
                <div style={Table_1Styles.buttons}>
                  <div style={globalStyles.navigation}>Segni LIS:</div>
                </div>
                <div style={Table_1Styles.buttons}>
                  <TextareaAutosize cols={40} rows={20} maxRows={25} value={this.state.lis_edit} onChange={this.onChangeText} />
                </div>
                <div style={Table_1Styles.buttons}>
                  <ChipExampleSimple1 chips={this.state.chips}/>
                </div>
                { /* <ChipExampleSimple /> */ }
                <RaisedButton label="Render" onClick={this.handleRender} disabled={this.state.allWordsFound} style={Table_1Styles.saveButton} primary={true} />
              </div>
}              
              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                <div style={Table_1Styles.buttons}>
                  <video 
                    width="320"
                    height="240"
                    key={this.state.videoUrl}>
                    <source src={this.state.videoUrl} />
                  </video>
                </div>
                <button onClick={() => this.updateVideoManually()}>Next</button>
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
