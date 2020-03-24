import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import UploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import LatencyIcon from 'material-ui/svg-icons/notification/network-check';
import UserIcon from 'material-ui/svg-icons/action/face';
import DateIcon from 'material-ui/svg-icons/action/alarm';
import { cyan600, pink600, purple600, orange600 } from 'material-ui/styles/colors';
import { InfoBox, CircularProgressExampleDeterminate, ChipExampleSimple, ListExampleSelectable } from '../components/dashboard/InfoBox';
import Traffic from '../components/dashboard/Traffic';
import ServerUsage from '../components/dashboard/ServerUsage';
import { Utilization , VideoPreview, CardExampleExpandable } from '../components/dashboard/Utilization';
import RecentActivities from '../components/dashboard/RecentActivities';
import BasePage from '../components/BasePage';
import globalStyles from '../styles/styles';
import ThemeDefault from '../styles/theme-default';
import RaisedButton from 'material-ui/RaisedButton';
import auth from '../auth';
import DatePicker from 'react-date-picker';
import TextareaAutosize from 'react-textarea-autosize';
// import { Player } from 'video-react';
// import AppBar from 'material-ui/AppBar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import SvgIcon from 'material-ui/SvgIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
// import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
// import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField'
// import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
// import FontIcon from 'material-ui/FontIcon';
// import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
// import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Toggle from 'material-ui/Toggle';
// import {Snackbar, SnackbarBody } from 'material-ui/Snackbar';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Badge from 'material-ui/Badge';
// import UploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import FolderIcon from 'material-ui/svg-icons/file/folder-open';
// import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

function getVersion(timeFrameJsonArray, edition_id, id_forecast_type, offset_days, version) {
  let res = timeFrameJsonArray
    .filter(data => {return data.edition == edition_id})
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
    return res.shift(); // Dovrebbe prendere il primo
  else
    return res.pop();
  // .filter(function(data){return data.it_version == 1});
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    var arg = { User: { Name: "Test" } }; // Visibile in: vm.$vmArg.User.Name
    // dotnetify.react.connect("HelloWorld", this, { vmArg: arg });
    dotnetify.debug= true;
    this.vm = dotnetify.react.connect('Dashboard', this, {
      exceptionHandler: ex => {
        // alert(ex.message);
        console.log('Dashboard exceptionHandler: ', ex);
        auth.signOut();
      },
      vmArg: arg
    });
    this.dispatch = state => this.vm.$dispatch(state);
    // this.abortController = new AbortController();
    // mySignal = abortController.signal;
    this.state = {
      dirty:                    false, // flag di abilitazione bottone di salvataggio (se e' stata effettuata una modifica in un campo TextArea)
      // success1:              true, // Non usato
      // popOverOpen:              false, // Usato dal popover, ma il popover al momento non e' implementato - quindi niente
      showSnackbar:             false, // Mostra snackbar di salvataggio avvenuto
      snackbarMessage:          "Nuova versione di testo salvata!!",
      snackbarHide:             3000,
      showProgress:             false, // Mostra circular progress, inizialmente pensato per dare evidenza di caricamento - sostituito dalla dialog
      showDialog:               false, // Mostra la dialog
      showVideoPreview:         false, // Mostra anteprima video
      showActions:              false, // Mostra bottoni solo se c'e' un testo ita/lis presente
      videoProgressCompleted:   false, // flag true/false di selezione vista progress/video - il componente restituisce un valore false mentre sta caricando, true quando ha finito
      justTranslated:           false, // Subito dopo una traduzione, disabilita il bottone relativo per evitare ritraduzione dello stesso testo
      justSaved:                false, // Subito dopo un salvataggio, abilita la preview video
      justPreviewed:            false, // Subito dopo una preview, abilita il publish che e' l'ultima fase
      dialogTitle:        "Attendere, caricamento...",
      dialogContent:      "Attendere, caricamento...",
      Traffic:            [],
      ServerUsage:        [],
      ServerUsageLabel:   [],
      Utilization:        [],
      UtilizationLabel:   [],
      UtilizationLabel1:  'Testo ITA originale',
      UtilizationLabel2:  'Testo LIS originale',
      RecentActivities:   [],
      
      pickDate:           new Date(), // .toISOString().split('T')[0], // Data iniziale (oggi) - Se il datepicker viene spostato in un componente diverso, questo valore va ricreato nel componente che contiene il datepicker
      edition_id:         1, // ID dell'edizione di default da visualizzare (ID 1, cioe' 9:00)
      forecast_id:        1, // ID del tipo di forecast di default (NORD)
      offset_day:         1, // Numero di giorni di offset rispetto a oggi - per tutte le aree meno l'ultima (tutta Italia) dovrebbe sempre essere +1, l'ultima area invece ha di solito i due valori +2 e +3
      
      testi:              null, // Memorizza il contenuto totale dei forecast della data corrente, per non dover fare altre chiaamte API // this.state.testi.timeframe.editions
      
      ita_id:             0, // Memorizza l'ID del testo ITA corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente
      ita_orig:           'Attendere..', //Testo di default
      ita_edit:           'Attendere..',
      ita_edit_version:   0,
      ita_notes:          'Attendere..',

      lis_id:             0,
      lis_orig:           'Attendere..',
      lis_edit:           'Attendere..',
      lis_edit_version:   0,
      lis_notes:          'Attendere..',

      id_text_trans:      0,

      path_video:         null,
/*
      centro_ita_orig:    '',
      centro_ita_edit:    '',
      centro_lis_orig:    '',
      centro_lis_edit:    '',

      sud_ita_orig:       '',
      sud_ita_edit:       '',
      sud_lis_orig:       '',
      sud_lis_edit:       '',
*/
      // value:             1, 
      tab_mode_dash:      'dizionario', // Tab di default (UPDATE - i tab usati qui in dashboard servivano per gestire la prima versione "appoggiata" di deliverable 2 - ora tutto spostato in TablePage_1)
      // tab_mode_dash1:         3, 
      // value_area:         1,
      // value_ed:           1, //'09:30',
      note_segno:         'Informazioni riguardo al segno selezionato',
      num1:               0, 
      num2:               0,
      sum :               0,
      toggle1:            false,
      toggle2:            false
      // BottomNavigationSelectedIndex: 0
    };
    // console.log('Dashboard.js constructor - this: ', this);
    /*
    function handleChangeEd(e) {
              console.log(e.target.value);
              this.setState({edition_id: e.target.value});
              this.handleSubmitEd(e.target.value);
          };
    function handleSubmitEd(edition_id) {
        this.props.onChange(edition_id);
      };
    */
    this.onVideoChildClicked = this.onVideoChildClicked.bind(this);
    this.onCircProgressCompleted = this.onCircProgressCompleted.bind(this);
    // this.onClickp = this.onClickp.bind(this);
    this.handleChangePicker_child = this.handleChangePicker_child.bind(this);
    this.handleUpdateTextAreas = this.handleUpdateTextAreas.bind(this);
    this.handleChangeEditionId = this.handleChangeEditionId.bind(this);
    this.handleEditIta = this.handleEditIta.bind(this);
    this.handleEditLis = this.handleEditLis.bind(this);
    this.setNum1 = this.setNum1.bind(this);
    this.setNum2 = this.setNum2.bind(this);
    // console.log('Dashboard.js costruttore - props: ', props); // .userid qui non funziona
  }
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    this.abortController.abort();
    this.vm.$destroy();
    // Component is attempting to connect to an already active 'Dashboard'.
    // If it's from a dismounted component, you must add vm.$destroy to componentWillUnmount().
  };

  componentDidMount() {
    // this.state.testi.timeframe.editions = [];
    // this.handleChangePicker_dashboard(new Date());
    console.log('Dashboard - al mount del componente, caricamento dati meteo data corrente - area NORD di default');
    console.log('Dashboard - componentDidMount this.state.pickDate: ', this.state.pickDate);
    this.handleChangePicker_dashboard(this.state.pickDate);
  };

  // https://stackoverflow.com/questions/29280445/reactjs-setstate-with-a-dynamic-key-name
  inputChangeHandler1 = (event) => {
      var stateObject = function() {
        returnObj = {};
        returnObj[this.target.id] = this.target.value;
          return returnObj;
      }.bind(event)();
      this.setState( stateObject );
  }

  inputChangeHandler2(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeEditionId = (event, index, value) => {
    console.log('handleChangeEditionId - value: ', value);
    // this.setState({ value_ed: value});
    this.setState({ edition_id: value }, this.handleUpdateTextAreas);
    // this.handleUpdateTextAreas(value);
  }

  handleChangeForecastId = (event, index, value) => {
    console.log('handleChangeForecastId - value: ', value);
    // this.setState({ value_area: value });
    this.setState({ forecast_id: value,  offset_day: (value === 7 ? 2 : 1) }, this.handleUpdateTextAreas); //.id});
    // this.handleUpdateTextAreas(7);
  }

  handleChangeOffsetDay = (event, index, value) => {
    console.log('handleChangeOffsetDay - value: ', value);
    // this.setState({ value_area: value });
    this.setState({ offset_day: value }, this.handleUpdateTextAreas); //.id});
    // this.handleUpdateTextAreas(7);
  }

  handleChangeTabArea = (value) => {
    console.log('handleChangeTabArea - value: ', value);
    // this.setState({ value_area: value });
    this.setState({ forecast_id: value }, this.handleUpdateTextAreas); //.id});
    // this.handleUpdateTextAreas(7);
  }

  handleUpdateDel2 = (value) => {
    console.log('handleUpdateDel2 - value: ', value);
    // this.setState({ value_area: value });
    this.setState({ tab_mode_dash: value }, this.handleUpdateDiz); //.id});
    // this.handleUpdateTextAreas(7);
  }

  handleUpdateDiz = () => {
    // setOpen(true);
    this.setState({showSnackbar: true});
  };

  // Pilotato dal picker nel child (InfoBox)
  handleChangePicker_child = date1 => {
    this.setState({ pickDate: date1 });
    console.log('handleChangePicker_child - date1: ', date1);
    console.log('handleChangePicker_child - date1.toISOString(): ', date1.toISOString());
      this.handleChangePicker_dashboard(date1);
      // onChange={this.handleChangePicker_dashboard} value={this.state.pickDate} 
    }

  // Pilotato dal picker qui nella dashboard stessa
  handleChangePicker_dashboard = date1 => {
    /*
    this.setState({ showProgress: true }); // Non funziona, bisognerebbe usare la callback
    this.setState({ pickDate: date1 })
    */
    // if ()
    // date1 != this.state.pickDate ? 
    /*
    Promise.resolve(this.setState({ showProgress: true })).then(() => {
      // We're not in an event handler, so these are flushed separately.
        // this.setState({ showProgress: true }); // Non funziona, bisognerebbe usare la callback
        this.setState({ pickDate: date1 })
    */
    this.setState({ pickDate: date1 });
    /*
    this.setState((state) => {
      // Important: read `state` instead of `this.state` when updating.
      return {showProgress: true } // !state.showProgress}
    });
    */

    var datestring = ("0" + date1.getDate()).slice(-2) + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" +
    date1.getFullYear() + " " + ("0" + date1.getHours()).slice(-2) + ":" + ("0" + date1.getMinutes()).slice(-2);

    var datestring1 = date1.getFullYear() + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" + ("0" + date1.getDate()).slice(-2);
    var url = "http://localhost:5000/api/values/meteo/" + datestring1;
    /*
    console.log('handleChangePicker_dashboard - url: ', url);
    console.log('handleChangePicker_dashboard - datestring: ', datestring);
    console.log('handleChangePicker_dashboard - date obj: ', date1);
    console.log('handleChangePicker_dashboard - typeof date: ', typeof date1);
    console.log('handleChangePicker_dashboard - date.getDate(): ', date1.getDate());
    console.log('handleChangePicker_dashboard - date.toString(): ', date1.toString());
    console.log('handleChangePicker_dashboard - date.toISOString(): ', date1.toISOString());
    console.log('handleChangePicker_dashboard - date.toLocaleDateString(): ', date1.toLocaleDateString());
    console.log('handleChangePicker_dashboard - date.getYear(): ', date1.getYear());
    console.log('handleChangePicker_dashboard - date.toISOString().split(\'T\')[0]: ', date1.toISOString().split('T')[0]);
    console.log('handleChangePicker_dashboard - date.getUTCDate(): ', date1.getUTCDate());
    */
    fetch(url, { signal: this.mySignal }) //2019-12-23") // + date.toISOString().split('T')[0].trim()) // aggiungere la data // new Date().toISOString().split(' ')[0]
      .then((response) => {
        return response.json();
      })
      .then(data => {
        console.log('handleChangePicker_dashboard - Data: ', data);
        if (data.id_day == null) {
          this.setState({
            showActions:      false,
            ita_orig:         'Nessun dato per il giorno selezionato' ,
            ita_edit:         'Nessun dato per il giorno selezionato' ,
            lis_orig:         'Nessun dato per il giorno selezionato' ,
            lis_edit:         'Nessun dato per il giorno selezionato' }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          // this.setState({ ita_edit: 'Nessun dato per il giorno selezionato' }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          // this.setState({ lis_orig: 'Nessun dato per il giorno selezionato' }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          // this.setState({ lis_edit: 'Nessun dato per il giorno selezionato' }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        } else {
          /*
          console.log('handleChangePicker_dashboard - Data: ', data);
                  console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data[0].text_ita: ', data.timeframe.editions[0].forecast_data[0].text_ita);
                  var nord = data.timeframe.editions[0].forecast_data.filter(function(data){return data.id_forecast_type == 1});
                  console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data NORD: ', nord);
                  var nord_orig = nord.filter(function(data){return data.it_version == 1});
                  console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data NORD orig: ', nord_orig);
                  var nord_edit = nord.filter(function(data){return data.it_version != 1});
                  console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data NORD edit: ', nord_edit);
                  console.log('handleChangePicker_dashboard - NORD orig text_ita: ', nord_orig[0].text_ita);
          */
          /*
                  var centro = data.timeframe.editions[0].forecast_data.filter(function(data){return data.id_forecast_type == 2});
                  // console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data NORD: ', centro);
                  var centro_orig = centro.filter(function(data){return data.it_version == 1});
                  // console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data NORD orig: ', nord_orig);
                  var centro_edit = centro.filter(function(data){return data.it_version != 2}); // Da cambiare - prende l'ultima versione se non ha ID pari a 2, quindi prendera' la 1 se c'e' solo quella

                  this.setState({ centro_ita_orig: centro_orig[0].text_ita });
                  this.setState({ centro_ita_edit: centro_edit.length === 0 ? centro_orig[0].text_ita : centro_edit[0].text_ita });
                  this.setState({ centro_lis_orig: centro_orig[0].text_lis });
                  this.setState({ centro_lis_edit: centro_edit.length === 0 ? centro_orig[0].text_lis : centro_edit[0].text_lis });
          */
          /*
          Array(4)
          0:
          edition: 1
          date_day: "2020-01-14"
          text_ita: "ANNUVOLAMENTI COMPATTI SULLA LIGURIA E SULLA PORZIONE PIU' OCCIDENTALE DELL'EMILIA-ROMAGNA CON DEBOLI PIOGGE ASSOCIATE; ESTESA NUVOLOSITA' BASSA E STRATIFORME SULLE AREE PIANEGGIANTI E PEDEMONTANE CON FOSCHIE DENSE E NEBBIE, IN TEMPORANEO DIRADAMENTO NELLE ORE CENTRALI DELLA GIORNATA; ALTROVE CIELO SERENO O POCO NUVOLOSO, CON AL PIU'' TRANSITO DI SPESSE VELATURE"
          text_lis: "_SEGNI_NNUVOL_SEGNI_MENTI COMP_SEGNI_TTI SULL_SEGNI_ LIGURI_SEGNI_ E SULL_SEGNI_ PORZIONE PIU' OCCIDENT_SEGNI_LE DELL'EMILI_SEGNI_-ROM_SEGNI_GN_SEGNI_ CON DEBOLI PIOGGE _SEGNI_SSOCI_SEGNI_TE; ESTES_SEGNI_ NUVOLOSIT_SEGNI_' B_SEGNI_SS_SEGNI_ E STR_SEGNI_TIFORME SULLE _SEGNI_REE PI_SEGNI_NEGGI_SEGNI_NTI E PEDEMONT_SEGNI_NE CON FOSCHIE DENSE E NEBBIE, IN TEMPOR_SEGNI_NEO DIR_SEGNI_D_SEGNI_MENTO NELLE ORE CENTR_SEGNI_LI DELL_SEGNI_ GIORN_SEGNI_T_SEGNI_; _SEGNI_LTROVE CIELO SERENO O POCO NUVOLOSO, CON _SEGNI_L PIU'' TR_SEGNI_NSITO DI SPESSE VEL_SEGNI_TURE"
          name_type: "NORD"
          it_version: 1
          li_version: 1
          id_forecast: 69
          id_text_ita: 158
          id_text_lis: 156
          offset_days: 1
          id_text_trans: 155
          id_forecast_type: 1
          __proto__: Object
          1: {edition: 1, date_day: "2020-01-14", text_ita: "Versione 4 - ANNUVOLAMENTI COMPATTI SULLA LIGURIA …UVOLOSO, CON AL PIU'' TRANSITO DI SPESSE VELATURE", text_lis: "Versione 4 - _SEGNI_NNUVOL_SEGNI_MENTI COMP_SEGNI_…I_L PIU'' TR_SEGNI_NSITO DI SPESSE VEL_SEGNI_TURE", name_type: "NORD", …}
          2: {edition: 3, date_day: "2020-01-14", text_ita: "Versione 4 - ADDENSAMENTI COMPATTI SULLA LIGURIA C…ANCHI NEBBIA IN SUCCESSIVA, GRADUALE ATTENUAZIONE", text_lis: "Versione 4 - _SEGNI_DDENS_SEGNI_MENTI COMP_SEGNI_T…I_, GR_SEGNI_DU_SEGNI_LE _SEGNI_TTENU_SEGNI_ZIONE", name_type: "NORD", …}
          3: {edition: 3, date_day: "2020-01-14", text_ita: "ADDENSAMENTI COMPATTI SULLA LIGURIA CON DEBOLI PIO…ANCHI NEBBIA IN SUCCESSIVA, GRADUALE ATTENUAZIONE", text_lis: "_SEGNI_DDENS_SEGNI_MENTI COMP_SEGNI_TTI SULL_SEGNI…I_, GR_SEGNI_DU_SEGNI_LE _SEGNI_TTENU_SEGNI_ZIONE", name_type: "NORD", …}
          length: 4
          __proto__: Array(0)
          */
          // console.log('handleChangePicker_dashboard - Data stringify: ', JSON.stringify(data));
          // console.log('handleChangePicker_dashboard - Data del datepicker: ', this.state.pickDate);
          // let teamsFromApi = data.map(team => { return {value: team, display: team} })
          // this.state.ff = 
          this.setState({
            showActions:      true,
            testi:            data }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          //this.setState({ ita: data[1].NORD}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          //this.setState({ lis: data[0]['CENTRO E SARDEGNA']}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          // this.setState({ edition_id: 1 });
          // this.setState({ forecast_id: 1 }); // Azzera il selettore nella toolbar a NORD
          let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
          // console.log('handleUpdateTextAreas - forecast_data: ', forecast_data);
          // console.log('handleUpdateTextAreas - forecast_data filter: ', forecast_data.filter(function(data){return data.edition == 1}));
          let nord_orig = getVersion(forecast_data, this.state.edition_id, this.state.forecast_id, this.state.offset_day, 1);
          // forecast_data
              // .filter(function(data){return data.edition == 3})
              // .filter(data => {return data.edition == this.state.edition_id})
              // .filter(function(data){return data.it_version == 1})
              // .filter(data => {return data.id_forecast_type == this.state.forecast_id})
              // .filter(function(data){return data.id_forecast_type == 1}); //[0];
              // .filter(function(data){return data.offset_days == 1});
          let nord_edit = getVersion(forecast_data, this.state.edition_id, this.state.forecast_id, this.state.offset_day, 99);
          // forecast_data
              // .filter(function(data){return data.edition == 3})
              // .filter(data => {return data.edition == this.state.edition_id})
              // .filter(function(data){return data.it_version != 2})
              // .reverse().find(data => {return data.it_version >= 1})
              // .filter(data => {return data.id_forecast_type == this.state.forecast_id}) // value e' il forecast_id per adesso
              // .filter(function(data){return data.id_forecast_type == 1}); //[0];
              // .filter(function(data){return data.offset_days == 1});
          /*        
          this.setState({ ita_orig:         nord_orig[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ ita_edit:         nord_edit[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ lis_orig:         nord_orig[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ lis_edit:         nord_edit[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ ita_id:           nord_orig[0].id_text_ita });
                  this.setState({ ita_edit_version: nord_edit[0].it_version });
                  this.setState({ ita_notes:        'Non estratte ancora' })
                  this.setState({ lis_id:           nord_orig[0].id_text_lis });
                  this.setState({ lis_edit_version: nord_edit[0].it_version });
                  this.setState({ lis_notes:        'Da estrarre', });
          */

          this.setState({
            ita_orig:         nord_orig.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            ita_edit:         nord_edit.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_orig:         nord_orig.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_edit:         nord_edit.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            id_text_trans:    nord_edit.id_text_trans,
            ita_id:           nord_orig.id_text_ita, // });
            ita_edit_version: nord_edit.it_version, // });
            ita_notes:        'Campo non estratto, da correggere', // })
            lis_id:           nord_orig.id_text_lis, // });
            lis_edit_version: nord_edit.it_version, // });
            lis_notes:        'Campo non ancora estratto'
          }, this.handleCloseDialog);
          // console.log('handleChangePicker_dashboard - this.state: ', this.state);
        }
      })
      .catch(error => {
        console.log('handleChangePicker_dashboard - Error: ', error);
      });
      /*
      this.setState((state) => {
            // Important: read `state` instead of `this.state` when updating.
            return {showProgress: false } // !state.showProgress}
          });
      this.setState({showDialog: false});
      */
      // }).then(() => {
        // We're not in an event handler, so these are flushed separately.
          // this.setState({ showProgress: false }); // Non funziona, bisognerebbe usare la callback
          // this.setState({ pickDate: date1 })
      // })
      // this.setState({ showProgress: false });
    };

    /*
    this.state = {
      value: 'a', 
      num1: 0, 
      num2: 0,
      sum : 0
    };
    this.setNum1 = this.setNum1.bind(this);
    this.setNum2 = this.setNum2.bind(this);
    }
    */

  handleUpdateTextAreas = (i) => {
  /*
    if( i == 1 ) {
      console.log('handleUpdateTextAreas - i: ', i);
      // console.log('handleUpdateTextAreas - Selezione edition_id 1');
      this.setState({  tab_mode_dash: i });
      // this.setState({  edition_id: 3 });
      // this.setState({  tab_mode_dash1: 3 });
      // this.setState({ edition_id: 1 });
      console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
      console.log('handleUpdateTextAreas - this.state.tab_mode_dash1: ', this.state.tab_mode_dash1);
    }
    else if( i == 3 ) {
      console.log('handleUpdateTextAreas - i: ', i);
      // console.log('handleUpdateTextAreas - Selezione edition_id 3');
      this.setState({  tab_mode_dash: i });
      // this.setState({  edition_id: 1 });
      this.setState({  tab_mode_dash1: 1 });
      // console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
      // console.log('handleUpdateTextAreas - this.state.tab_mode_dash1: ', this.state.tab_mode_dash1);
    }


    if( i == 'a') {
      console.log('handleUpdateTextAreas - i: ', i);
      // console.log('handleUpdateTextAreas - Selezione edition_id 1');
      this.setState({  tab_mode_dash: i });
      this.setState({  edition_id: 1 });
      this.setState({  tab_mode_dash1: 1 });
      // this.setState({ edition_id: 1 });
      console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
      console.log('handleUpdateTextAreas - this.state.tab_mode_dash1: ', this.state.tab_mode_dash1);
    }
    else if( i == 'b') {
      console.log('handleUpdateTextAreas - i: ', i);
      // console.log('handleUpdateTextAreas - Selezione edition_id 3');
      this.setState({  tab_mode_dash: i });
      this.setState({  edition_id: 3 });
      this.setState({  tab_mode_dash1: 3 });
      console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
      console.log('handleUpdateTextAreas - this.state.tab_mode_dash1: ', this.state.tab_mode_dash1);
    }
  */

    // this.setState({ edition_id: i });
    console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
    console.log('handleUpdateTextAreas - this.state.forecast_id: ', this.state.forecast_id);
    // this.setState({ forecast_id: 1 }); // Azzera il selettore nella toolbar a NORD
    try {
      
/*

let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
      // console.log('handleUpdateTextAreas - forecast_data: ', forecast_data);
      // console.log('handleUpdateTextAreas - forecast_data filter: ', forecast_data.filter(function(data){return data.edition == 3}));
      let nord_orig = forecast_data
        // .filter(function(data){return data.edition == 3})
        .filter(data => {return data.edition == this.state.edition_id})
        .filter(function(data){return data.it_version == 1})
        .filter(data => {return data.id_forecast_type == this.state.forecast_id})
        // .filter(function(data){return data.id_forecast_type == 1}); //[0];
        // .filter(function(data){return data.offset_days == 1});
      let nord_edit = forecast_data
        // .filter(function(data){return data.edition == 3})
        .filter(data => {return data.edition == this.state.edition_id})
        .filter(function(data){return data.it_version != 2})
        // .reverse().find(data => {return data.it_version >= 1})
        .filter(data => {return data.id_forecast_type == this.state.forecast_id})
        // .filter(function(data){return data.id_forecast_type == 1}); //[0];
        // .filter(function(data){return data.offset_days == 1});

        this.setState({ ita_orig:         nord_orig[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ ita_edit:         nord_edit[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis_orig:         nord_orig[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis_edit:         nord_edit[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ ita_id:           nord_orig[0].id_text_ita });
        this.setState({ ita_edit_version: nord_edit[0].it_version });
        this.setState({ ita_notes:        'Non estratte ancora' })
        this.setState({ lis_id:           nord_orig[0].id_text_lis });
        this.setState({ lis_edit_version: nord_edit[0].it_version });
        this.setState({ lis_notes:        'Da estrarre', });
*/





        let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
        // console.log('handleUpdateTextAreas - forecast_data: ', forecast_data);
        // console.log('handleUpdateTextAreas - forecast_data filter: ', forecast_data.filter(function(data){return data.edition == 1}));
        let nord_orig = getVersion(forecast_data, this.state.edition_id, this.state.forecast_id, this.state.offset_day, 1);
// forecast_data
            // .filter(function(data){return data.edition == 3})
            // .filter(data => {return data.edition == this.state.edition_id})
            // .filter(function(data){return data.it_version == 1})
            // .filter(data => {return data.id_forecast_type == this.state.forecast_id})
            // .filter(function(data){return data.id_forecast_type == 1}); //[0];
            // .filter(function(data){return data.offset_days == 1});
        let nord_edit = getVersion(forecast_data, this.state.edition_id, this.state.forecast_id, this.state.offset_day, 99);
// forecast_data
            // .filter(function(data){return data.edition == 3})
            // .filter(data => {return data.edition == this.state.edition_id})
            // .filter(function(data){return data.it_version != 2})
            // .reverse().find(data => {return data.it_version >= 1})
            // .filter(data => {return data.id_forecast_type == this.state.forecast_id}) // value e' il forecast_id per adesso
            // .filter(function(data){return data.id_forecast_type == 1}); //[0];
            // .filter(function(data){return data.offset_days == 1});
/*        

this.setState({ ita_orig:         nord_orig[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ ita_edit:         nord_edit[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis_orig:         nord_orig[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis_edit:         nord_edit[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ ita_id:           nord_orig[0].id_text_ita });
        this.setState({ ita_edit_version: nord_edit[0].it_version });
        this.setState({ ita_notes:        'Non estratte ancora' })
        this.setState({ lis_id:           nord_orig[0].id_text_lis });
        this.setState({ lis_edit_version: nord_edit[0].it_version });
        this.setState({ lis_notes:        'Da estrarre', });
*/


        this.setState({
            ita_orig:         nord_orig.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            ita_edit:         nord_edit.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_orig:         nord_orig.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_edit:         nord_edit.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            id_text_trans:    nord_edit.id_text_trans,
            ita_id:           nord_orig.id_text_ita, // });
            ita_edit_version: nord_edit.it_version, // });
            ita_notes:        'Campo non estratto, da correggere', // })
            lis_id:           nord_orig.id_text_lis, // });
            lis_edit_version: nord_edit.it_version, // });
            lis_notes:        'Campo non ancora estratto'
        });
        /*
        this.setState({ ita_orig:         nord_orig.text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ ita_edit:         nord_edit.text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis_orig:         nord_orig.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis_edit:         nord_edit.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ ita_id:           nord_orig.id_text_ita });
        this.setState({ ita_edit_version: nord_edit.it_version });
        this.setState({ ita_notes:        'Non estratte ancora' })
        this.setState({ lis_id:           nord_orig.id_text_lis });
        this.setState({ lis_edit_version: nord_edit.it_version });
        */
        console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
        console.log('handleUpdateTextAreas - this.state.forecast_id: ', this.state.forecast_id);
        console.log('handleUpdateTextAreas - this.state: ', this.state);
    } catch (error) {
      console.log('handleUpdateTextAreas catch - Error: ', error);
      console.log('handleUpdateTextAreas catch - this.state.edition_id: ', this.state.edition_id);
      console.log('handleUpdateTextAreas catch - this.state.forecast_id: ', this.state.forecast_id);
    }
  };

  /*
    } catch (error) {
      console.log('handleUpdateTextAreas - Error: ', error);
    }
  */

  handleEditIta(event) {
      console.log('handleEditIta - event: ', event);
      this.setState({ dirty: true });
      this.setState({ ita_edit: event.target.value });
    };

  handleEditLis(event) {
      console.log('handleEditLis - event: ', event);
      this.setState({ dirty: true });
      this.setState({ lis_edit: event.target.value });
    };

  setNum1(event) {
    this.setState({
        num1: event.target.value,
    });
  }

  setNum2(event) {
    this.setState({
        num2: event.target.value,
    });
  }

  onVideoChildClicked = _ => {
    // this.props.click(this.props.id);
    // console.log('onVideoChildClicked - _: ', _);
    // this.setState({ ita: this.state.testi[0]['CENTRO E SARDEGNA']});
    // this.setState({ lis: this.state.testi[1]['NORD']}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    console.log('video child clicked');
    this.handleOpenDialogPublish();
    /*
    this.setState({ ita_orig: this.state.centro_lis_orig }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ ita_edit: this.state.centro_ita_edit }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ lis_orig: this.state.centro_lis_orig }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ lis_edit: this.state.centro_lis_edit }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    */
  };


onCircProgressCompleted = _ => {
    // this.props.click(this.props.id);
    // console.log('onVideoChildClicked - _: ', _);
    this.setState({ videoProgressCompleted: true }, this.handleStop); // ita: this.state.testi[0]['CENTRO E SARDEGNA']});
    // this.setState({ lis: this.state.testi[1]['NORD']}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    // alert('child progress comple');
/*
    this.setState({ ita_orig: this.state.centro_lis_orig }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ ita_edit: this.state.centro_ita_edit }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ lis_orig: this.state.centro_lis_orig }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ lis_edit: this.state.centro_lis_edit }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
*/
  };

  handleStop() {
    this.dispatch({
      Stop: { // Il metodo Start ha gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
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
  }
/*
  onClickp(id) {
    console.log(id);
  };
*/
  handleChangeArea_dashboard(id_type, offset_day){
    console.log('handleChangeArea_dashboard: ', id_type, offset_day);
    // var centro_orig = centro.filter(function(data){return data.it_version == 1});
    // console.log('handleChangePicker_dashboard - Data data.timeframe.editions[0].forecast_data NORD orig: ', nord_orig);
    // var centro_edit = centro.filter(function(data){return data.it_version != 2}); /
    this.setState({ ita_orig: 
      this.state.testi.timeframe.editions[0].forecast_data
      .filter(function(data){return data.it_version == 1})
      .filter(function(data){return data.id_forecast_type == id_type})
      .filter(function(data){return data.offset_days == offset_day})[0].text_ita
      });
    this.setState({ ita_edit: 
      this.state.testi.timeframe.editions[0].forecast_data
      .filter(function(data){return data.it_version != 2})
      .filter(function(data){return data.id_forecast_type == id_type})
      .filter(function(data){return data.offset_days == offset_day})[0].text_ita
      });
    this.setState({ lis_orig: 
      this.state.testi.timeframe.editions[0].forecast_data
      .filter(function(data){return data.it_version == 1})
      .filter(function(data){return data.id_forecast_type == id_type})
      .filter(function(data){return data.offset_days == offset_day})[0].text_lis
      });
    this.setState({ lis_edit: 
      this.state.testi.timeframe.editions[0].forecast_data
      .filter(function(data){return data.it_version != 2})
      .filter(function(data){return data.id_forecast_type == id_type})
      .filter(function(data){return data.offset_days == offset_day})[0].text_lis
      });
  }
  
  onChangeDate_1 = date1 => {
    this.setState({ pickDate: date1 });
    console.log('onChange - data: ', date1);
    console.log('onChange - date.toISOString(): ', date1.toISOString());
    this.handleChangePicker_dashboard(date1);
    // onChange={this.handleChangePicker_dashboard} value={this.state.pickDate} 
  }
/*
  handleProfileDropDown(e) {
		e.preventDefault();
		this.setState({
			popOverOpen: !this.state.popOverOpen,
			anchorEl: e.currentTarget,
		});
	}
*/
  /*
	handleRequestClose() {
    	this.setState({
      		popOverOpen: false,
    	});
    };
  */
/*
  uncheckAllToggle = () => {
    this.setState({
      toggle1: false, 
      toggle2: false
    });
  }
*/

  handleOpenDialogChangePicker = (date1) => {
    this.setState({showDialog: true}, () => this.handleChangePicker_dashboard(date1));
  };

  handleOpenDialogPublish = () => {
    this.setState({showDialog: true}, this.handlePublish);
  };


  handleOpenDialogTranslate = () => {
    this.setState({showDialog: true}, this.handleTranslate);
  };

  handleOpenDialogPreview = () => {
    this.setState({showDialog: true}, this.handlePreview);
  };

  // TODO: aprire la Snackbar solo in fase di salvataggio o comunque quando si vuole che sia visibile, non ogni volta che si chiude la dialog
  handleCloseDialog = () => {
    this.setState({showDialog: false}); // , this.handleOpenSnackbar);
  };

  handleOpenSnackbar = () => {
    // setOpen(true);
    this.setState({showSnackbar: true});
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    // setOpen(false);
    this.setState({showSnackbar: false});
  };


  handleCancel = _ => {
      let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
      // reimposta le textarea con l'ultima versione salvata
      let last_edit = getVersion(forecast_data, this.state.edition_id, this.state.forecast_id, this.state.offset_day, 99);
      this.setState({ ita_edit:         last_edit.text_ita });
      this.setState({ lis_edit:         last_edit.text_lis });
      this.setState({ dirty: false });
  };

  handleTranslate_get = _ => {
    // var datestring1 = date1.getFullYear() + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" + ("0" + date1.getDate()).slice(-2);
    var url = "http://localhost:5000/api/values/translate/";
    // this.setState({ showProgress: true });
    fetch(url) //2019-12-23") // + date.toISOString().split('T')[0].trim()) // aggiungere la data // new Date().toISOString().split(' ')[0]
      .then((response) => {
        return response.json();
      })
      .then(data => {
        console.log('handleChangePicker_dashboard - Data: ', data);
        this.setState({ dirty: true });
        this.setState({ justTranslated: true });
        this.setState({ lis_edit:         data.translation }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        /*          
        this.setState({ lis_orig:         nord_orig.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ lis_edit:         nord_edit.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ ita_id:           nord_orig.id_text_ita });
                  this.setState({ ita_edit_version: nord_edit.it_version });
                  this.setState({ ita_notes:        'Non estratte ancora' })
                  this.setState({ lis_id:           nord_orig.id_text_lis });
                  this.setState({ lis_edit_version: nord_edit.it_version });
                  this.setState({ lis_notes:        'Da estrarre', });
                  console.log('handleChangePicker_dashboard - this.state: ', this.state);

                  body: "'"+JSON.stringify({value: 'UkVTSURVRSBQSU9HR0UgTkVMTEUgUFJJTUUgT1JFIERFTCBNQVRUSU5PIFNVTExFIEFSRUUgQVBQRU5OSU5JQ0hFIEVNSUxJQU5FIEUgTFVOR08gTEUgWk9ORSBDT1NUSUVSRSBBRFJJQVRJQ0hFLCBNQSBJTiBTVUNDRVNTSVZPIFJBUElETyBNSUdMSU9SQU1FTlRPIENPTiBDSUVMTyBURVJTTy5CRUwgVEVNUE8gU1VMIFJFU1RBTlRFIFNFVFRFTlRSSU9ORSwgQSBQQVJURSBVTiBQTycgREkgTlVCSSBDT01QQVRURSBBVFRFU0UgTkVMTEEgUFJJTUEgUEFSVEUgREVMTEEgTUFUVElOQVRBIFNVTExFIEFSRUUgQUxQSU5FIENPTiBERUJPTEkgTkVWSUNBVEUgQSBBU1NPQ0lBVEUgQSBQQVJUSVJFIERBSSAxMjAwIEEgTUVUUkkuQUwgUFJJTU8gTUFUVElOTyBFIERPUE8gSUwgVFJBTU9OVE8gRk9STUFaSU9ORSBESSBGT1NDSElFIERFTlNFIEUgQkFOQ0hJIERJIE5FQkJJQSBFIFNVTExBIFBJQU5VUkEgRSBQQURBTkE='})+"'",
        headers: {'Content-Type': 'application/json'}
        */
        // this.setState({ showProgress: false });
      })
      .catch(error => {
        console.log('handleTranslate_get - Error: ', error);
      });
  };

  handleTranslate = _ => {
    fetch(
      "http://localhost:5000/api/values/translate",
      {
        method: 'POST',
        body: "'"+JSON.stringify({value: btoa(this.state.ita_edit)})+"'",
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(p => {
        console.log('translate post: ' , p);
        this.setState({ dirty: true });
        this.setState({ justTranslated: true });
        this.setState({ lis_edit:         p.translation }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
      })
      .catch(error => {
        console.log('handleTranslate - Error: ', error);
      });
  };

  /**
   * La preview qui non e' immediata
   * Quella che si chiama preview qui e' il fatto che del testo LIS presente nella textarea bisogna creare una request e aspettare il rendering
   */
  handlePreview = _ => {
    console.log('handlePreview');
    var url = "http://localhost:5000/api/values/request";

    fetch("http://localhost:5000/api/values/request", // 1/6",
    {
      method: 'POST',
      body: "'"+JSON.stringify({
        id: this.state.id_text_trans,
        path: '/path/to/video_idtrans'+this.state.id_text_trans,
        notes: 'note_request_idtrans'+this.state.id_text_trans
      })+"'",
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(p => {
      console.log('test request: ', p);
      this.dispatch({
        Start: { // Il metodo Start ha gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
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
      this.setState({
        lis_edit:         'Attendere, render in corso..',
        showVideoPreview: true,
        justPreviewed:    true 
      }, this.handleCloseDialog);
    })
    .catch(error => {
      console.log('handlePreview - Error: ', error);
    });
  }

  /**
   * Pubblica il video su FTP
   * Operazione "asincrona" - ci potrebbe volere un po' a pubblicarlo
   * Per il momento qui vengono fatte solo delle prove di passaggio di dati JSON in POST a delle api
   * L'endpoint dovra' probabilmente ricevere un ID o direttamente un path video
   * e girarlo a un comando di copia da locale a FTP
   */
  handlePublish = _ => {
    console.log('handlePublish');
    var payload1 = {
        a: "prova_1",
        b: "prova_2"
    };
    var payload2 = {
        value: "prova_1",
        b: "prova_2"
    };
    var payload3 = '"{\"a\":\"test_setting_name\",\"b\":\"dfdfref\"}"';
    var payload4 = '"{a:\"test_setting_name\",b:\"dfdfref\"}"';
    var payload5 = { value: {value: "prova_1"}};
    
    var data = new FormData();
    data.append( "value", "sdsdfsfds"); //JSON.stringify( payload1 ) );
    this.setState({ lis_edit: 'Attendere, pubblicazione..' }); //, this.handleOpenDialogPublish)
    
    fetch("http://localhost:5000/api/values/testpost_2", // 1/6",
    {
      method: 'POST',
      body: "'"+JSON.stringify({value: 'bacon'})+"'",
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(p => {
      console.log('testpost_2: ' , p);
      fetch("http://localhost:5000/api/values/testpost_3", // 1/6",
      {
        method: 'POST',
        body: JSON.stringify({value: 'bacon'}),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(p => {
        console.log('testpost_3: ' , p);
        this.setState({ lis_edit: 'Pubblicato!!!' }, this.handleCloseDialog);
        this.setState({ snackbarMessage: 'Video pubblicato su ftp://test@test.com' }, this.handleOpenSnackbar)
        fetch("http://localhost:5000/api/values/testpost_1/88", // 1/6",
        {
          method: 'POST',
          body: "'"+JSON.stringify({value: 'bacon'})+"'",
          headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(p => {
          console.log('testpost_1: ' , p);
          fetch(
            "http://localhost:5000/api/values/translate",
            {
              method: 'POST',
              body: "'"+JSON.stringify({value: 'UkVTSURVRSBQSU9HR0UgTkVMTEUgUFJJTUUgT1JFIERFTCBNQVRUSU5PIFNVTExFIEFSRUUgQVBQRU5OSU5JQ0hFIEVNSUxJQU5FIEUgTFVOR08gTEUgWk9ORSBDT1NUSUVSRSBBRFJJQVRJQ0hFLCBNQSBJTiBTVUNDRVNTSVZPIFJBUElETyBNSUdMSU9SQU1FTlRPIENPTiBDSUVMTyBURVJTTy5CRUwgVEVNUE8gU1VMIFJFU1RBTlRFIFNFVFRFTlRSSU9ORSwgQSBQQVJURSBVTiBQTycgREkgTlVCSSBDT01QQVRURSBBVFRFU0UgTkVMTEEgUFJJTUEgUEFSVEUgREVMTEEgTUFUVElOQVRBIFNVTExFIEFSRUUgQUxQSU5FIENPTiBERUJPTEkgTkVWSUNBVEUgQSBBU1NPQ0lBVEUgQSBQQVJUSVJFIERBSSAxMjAwIEEgTUVUUkkuQUwgUFJJTU8gTUFUVElOTyBFIERPUE8gSUwgVFJBTU9OVE8gRk9STUFaSU9ORSBESSBGT1NDSElFIERFTlNFIEUgQkFOQ0hJIERJIE5FQkJJQSBFIFNVTExBIFBJQU5VUkEgRSBQQURBTkE='})+"'",
              headers: {'Content-Type': 'application/json'}
            })
            .then(res => res.json())
            .then(p => {
              console.log('translate post: ' , p);
                  this.dispatch({
                Stop: { // Il metodo Start ha gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
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
          });
        });
      });
    });
    /*
    fetch("http://localhost:5000/api/values/testpost_1/88", // 1/6",
    {
      method: 'POST',
      // body: '"ggegrergerg"',
      body: JSON.stringify({value: 'bacon'}),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    // .then(console.log)
    .then(p => {
      this.setState({ lis_edit: 'Pubblicato!!!' }, this.handleCloseDialog);
      this.setState({ snackbarMessage: 'Video pubblicato su ftp://test@test.com' }, this.handleOpenSnackbar)
    });
    */
    // console.log('handlePreview');
    /*
    {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            // body: payload4
            // body:  '"{value:\"test_setting_name\",b:\"dfdfref\"}"'
            // body: JSON.stringify( payload1 )
            // body: data // JSON.stringify( data )
            body: data // JSON.stringify( data )
        })
        .then(function(res){ return res.json(); })        .catch(error => {
              console.log('handlePublish - res Error: ', error);
            })
        .then(function(data){ alert( JSON.stringify( data ) ) })        .catch(error => {
              console.log('handlePublish - data Error: ', error);
            });
    */
  }

  render() {
    // let { dirty, tab_mode_dash, edition_idn } = this.state;
    let { dirty, showActions, justTranslated, justSaved, justPreviewed } = this.state; // showProgress
    // let tab_mode_dashb = tab_mode_dash;
    /*
    console.log('Dashboard.js - deliver: ', deliver);
    if (deliver)
      console.log('Dashboard.js - deliverable 1: ', deliver);
    else
      console.log('Dashboard.js - deliverable 2: ', deliver);
    */


    const dashboardStyles = {
      dialogTitle: {
        fontSize: 52
      },
      dialogContent: {
        width: '100%',
        maxWidth: 'none',
      },
      buttons: {
        marginTop: 5, //30
        // float: 'right'
        float: 'left'
      },
      buttonStyle: { 
        marginLeft: 2,
        float: 'left'
      },
      buttonLabel: {
        fontSize: 8, // '6px'
        padding: '.5em 0'
      }
    };

    // console.log('handleUpdateTextAreas - edition_id: ', edition_id);
    /*
    const handleUpdateTextAreas1 = (i) => {
      console.log('handleUpdateTextAreas1 - i: ', i);
      this.setState({ edition_idn: 1 });
      if( i == 'a') {
        console.log('handleUpdateTextAreas1 - i: ', i);
        // console.log('handleUpdateTextAreas - Selezione edition_id 1');
        this.setState({ tab_mode_dash: i });
        this.setState({ edition_idn: 1 });
        // console.log('handleUpdateTextAreas1 - edition_id: ', edition_id);
      }
      else if( i == 'b') {
        console.log('handleUpdateTextAreas1 - i: ', i);
        // console.log('handleUpdateTextAreas - Selezione edition_id 3');
        this.setState({ tab_mode_dash: i });
        this.setState({ edition_idn: 3 });
        // console.log('handleUpdateTextAreas1 - edition_id: ', edition_id);
      }
      console.log('handleUpdateTextAreas1 - tab_mode_dash: ', tab_mode_dash);
      console.log('handleUpdateTextAreas1 - edition_idn: ', edition_idn);
    };
    */

    const handleTranslate1 = _ => {
      // var datestring1 = date1.getFullYear() + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" + ("0" + date1.getDate()).slice(-2);
      var url = "http://localhost:5000/api/values/translate/";
      // this.setState({ showProgress: true });
      fetch(url) //2019-12-23") // + date.toISOString().split('T')[0].trim()) // aggiungere la data // new Date().toISOString().split(' ')[0]
        .then((response) => {
          return response.json();
        })
        .then(data => {
          console.log('handleChangePicker_dashboard - Data: ', data);
          this.setState({ lis_edit:         data.translation }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          /*          
          this.setState({ lis_orig:         nord_orig.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                    this.setState({ lis_edit:         nord_edit.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                    this.setState({ ita_id:           nord_orig.id_text_ita });
                    this.setState({ ita_edit_version: nord_edit.it_version });
                    this.setState({ ita_notes:        'Non estratte ancora' })
                    this.setState({ lis_id:           nord_orig.id_text_lis });
                    this.setState({ lis_edit_version: nord_edit.it_version });
                    this.setState({ lis_notes:        'Da estrarre', });
                    console.log('handleChangePicker_dashboard - this.state: ', this.state);
          */
          // this.setState({ showProgress: false });
        })
        .catch(error => {
          console.log('handleChangePicker_dashboard - Error: ', error);
        });
    };
/*
    const handleCancel = _ => {
      // this.dispatch({ Cancel: Id });
      // this.setState({ dirty: false });
    };
*/
    const handleEditIta1 = event => {
      console.log('handleEditIta - event: ', event);
      this.setState({ dirty: true });
      this.setState({ ita_edit: event.target.value });
    };

    const handleEditLis1 = event => {
      console.log('handleEditLis - event: ', event);
      this.setState({ dirty: true });
      this.setState({ lis_edit: event.target.value });
    };

    /*
    it_version: 4
    li_version: 4
    id_forecast: 88
    id_text_ita: 217
    id_text_lis: 215
    offset_days: 1
    id_text_trans: 213
    id_forecast_type: 1


    this.setState({ ita_orig:         nord_orig[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            this.setState({ ita_edit:         nord_edit[0].text_ita }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            this.setState({ lis_orig:         nord_orig[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            this.setState({ lis_edit:         nord_edit[0].text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            this.setState({ ita_id:           nord_orig[0].id_text_ita });
            this.setState({ ita_edit_version: nord_edit[0].it_version });
            this.setState({ ita_notes:        'Non estratte ancora' })
            this.setState({ lis_id:           nord_orig[0].id_text_lis });
            this.setState({ lis_edit_version: nord_edit[0].it_version });
    */
    const handleSave = _ => {
      // this.setState({ ita_orig: 'Attendere..handleSave' });
      // console.log('handleSave - this.state.ita_id: ', this.state.ita_id);
      // console.log('handleSave - this.state.ita_edit_version: ', this.state.ita_edit_version);
      // console.log('handleSave - this.state.ita_edit: ', this.state.ita_edit);
      // console.log('handleSave - this.state.lis_id: ', this.state.lis_id);
      // console.log('handleSave - this.state.lis_edit_version: ', this.state.lis_edit_version);
      // console.log('handleSave - this.state.lis_edit: ', this.state.lis_edit);

      this.dispatch({
        Save: {
          IdUserEdit: 2,
          IdTextIta: this.state.ita_id, // Gli ID dei testi sia ita che lis servono perche' non deve essere creato un nuovo ID - bisogna riutilizzare quello che c'e'!!
          VersionIta: this.state.ita_edit_version, // Va aumentato di 1 sia nella INSERT sia in interfaccia
          TextIta: this.state.ita_edit, //"Provaaaa_manda_a_dashboard",
          NotesIta: "Provaaa_note_ita",
          IdTextLis: this.state.lis_id,
          VersionLis: this.state.lis_edit_version,
          TextLis: this.state.lis_edit, //"Provaaaa_manda_a_dashboard",
          NotesLis: "Provaaa_note_lis"
        }
      });
      this.setState({
        ita_edit_version: this.state.ita_edit_version+1,
        lis_edit_version: this.state.lis_edit_version+1,
        dirty:            false,
        justSaved:        true
      }, this.handleOpenSnackbar);
    };
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title="Meteo" navigation="Applicazione / Meteo">
          <div>
            <Toolbar style={{
                  // position: 'fixed', // 'relative', // 'fixed',
                  // height: 50, //'5%', // 57, //'5%', // 57,
                  // top: 20, // '5%', // maxHeight: '45%' // 57 // 56
                  // backgroundColor: cyan600,

                  backgroundColor: 'rgb(0, 188, 212)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '48px',
                  
                  // width: '100%',
                  // display: 'flex',
                  paddingLeft: '60px',
                  // title: {
                  //  padding: '40px' //,
                  // }
                }}>
              <ToolbarGroup firstChild={true}>
                <ToolbarTitle text="Selezione data" style={{padding: 10}} />
                <DatePicker value={this.state.pickDate} onChange={this.handleOpenDialogChangePicker} />
                <ToolbarSeparator />
                <ToolbarTitle text="Selezione edizione" style={{padding: 10}} />
                <DropDownMenu value={this.state.edition_id} onChange={this.handleChangeEditionId}>
                  <MenuItem value={1} primaryText="09:30" />
                  {/* <MenuItem value={2} primaryText="17:30" disabled={true}/> */}
                  <MenuItem value={3} primaryText="18:30" />
                </DropDownMenu>
                <ToolbarSeparator />
                <ToolbarTitle text="Selezione area" style={{padding: 10}} />
                <DropDownMenu value={this.state.forecast_id} onChange={this.handleChangeForecastId}>
                  <MenuItem value={1} primaryText="NORD" />
                  <MenuItem value={2} primaryText="CENTRO E SARDEGNA" />
                  <MenuItem value={3} primaryText="SUD E SICILIA" />
                  <MenuItem value={4} primaryText="TEMPERATURE" />
                  <MenuItem value={5} primaryText="VENTI" />
                  <MenuItem value={6} primaryText="MARI" />
                  <MenuItem value={7} primaryText="TUTTA ITALIA" />
                </DropDownMenu>
                <ToolbarSeparator />
                <DropDownMenu value={this.state.offset_day} onChange={this.handleChangeOffsetDay} disabled={this.state.forecast_id != 7}>
                  <MenuItem value={1} primaryText="+1" disabled={this.state.forecast_id == 7}/>
                  <MenuItem value={2} primaryText="+2" />
                  <MenuItem value={3} primaryText="+3" />
                  {/*<MenuItem value={4} primaryText="+4" />*/}
                </DropDownMenu>
                {/*<ToolbarSeparator />*/}
              </ToolbarGroup>
            </Toolbar>
            {/*
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                <InfoBox Icon={DownloadIcon} color={pink600} Title="Download" Value={this.state.Download} />
              </div>

              <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                <InfoBox Icon={UploadIcon} color={cyan600} Title="Upload" Value={this.state.Upload} />
              </div>

              <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                <InfoBox Icon={LatencyIcon} color={purple600} Title="Latency" Value={this.state.Latency} />
              </div>

              <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                <InfoBox Icon={UserIcon} color={orange600} Title="Users" Value={this.state.Users} />
              </div>
            </div>
            */}
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo ITA originale{this.state.ita_edit_version ? ' (versione 1)' : '' }:</div>
                </div>
                {/*<label>{this.state.ita_orig}</label>*/}
                <div style={dashboardStyles.buttons}>
                  <CardExampleExpandable title={"Testo ITA originale" + (this.state.lis_edit_version ? " (versione 1)" : "") } subtitle="Cliccare per espandere" text={this.state.ita_orig} />
                </div>
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo ITA editato{this.state.ita_edit_version ? ' (versione ' + this.state.ita_edit_version + ')' : '' }:</div>
                </div>
                <div style={dashboardStyles.buttons}>
                  <TextareaAutosize cols={42} rows={20} maxRows={25} value={this.state.ita_edit} onChange={handleEditIta1} />
                </div>
  {showActions ?
                <div style={dashboardStyles.buttons}>
                  <RaisedButton label="Annulla"    onClick={this.handleCancel}       style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={false} disabled={!dirty} />
                  <RaisedButton label="Traduci"         onClick={this.handleOpenDialogTranslate} style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={false} disabled={justTranslated} />
                </div>
  : null}
              </div>

              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo LIS originale{this.state.lis_edit_version ? ' (versione 1)' : '' }:</div>
                </div>
                {/*<label>{this.state.lis_orig}</label>*/}
                <div style={dashboardStyles.buttons}>
                  <CardExampleExpandable title={"Testo LIS originale" + (this.state.lis_edit_version ? " (versione 1)" : "") } subtitle="Cliccare per espandere" text={this.state.lis_orig} />
                </div>
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo LIS editato{this.state.lis_edit_version ? ' (versione ' + this.state.lis_edit_version + ')' : '' }:</div>
                </div>
                <div style={dashboardStyles.buttons}>
                  <TextareaAutosize cols={42} rows={20} maxRows={25} value={this.state.lis_edit} onChange={handleEditLis1} />
                </div>
  {showActions ?
                <div style={dashboardStyles.buttons}>
                  <RaisedButton label="Salva"      onClick={handleSave}              style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true} disabled={!dirty} />
                  <RaisedButton label="Anteprima"       onClick={this.handleOpenDialogPreview}   style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true}  disabled={justPreviewed} />
                  {/*
                  <br />
                  <RaisedButton label="Pubblica"        onClick={this.handleOpenDialogPublish}   style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true}  disabled={justPreviewed} />
                  */}
                </div>
  : null}
              </div>

              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                {/*<h3 style={globalStyles.navigation}>Video:</h3>*/}
                {/*<label>test</label>
                poster={require("../../../../../../../../Desktop/output_image.jpg")} >
                <source src={require("../../../../../../../../Desktop/output.mp4")}/>
                datanew={this.state.Utilization} label="Video LIS" text_orig="Video generato in 2 sec" text_edit={this.state.lis_edit}
                {this.state.tab_mode_dash === 'non e\' dizionario - qui deve esserci il check "se la versione corrente di testi ita/lis e\' gia\' stata renderizzata, visualizza il video, passando le URL del poster e del video' ? 
                */}
                {/* onClicked={this.onVideoChildClicked} onChanged={this.handleEditLis}/> */}
                {/* onClicked={this.onVideoChildClicked} onChanged={this.handleEditLis}/> */}
  {
  this.state.path_video != null ? 
                <VideoPreview Poster="dist/6e6432a4ede73a7d3e1459eb7ffd3fbe.jpg" Src="dist/videos/output.mp4" />
  :
  this.state.showVideoPreview ? 
  !this.state.videoProgressCompleted ? 
                <CircularProgressExampleDeterminate onCompleted={this.onCircProgressCompleted} />
  :
                <VideoPreview Poster="dist/6e6432a4ede73a7d3e1459eb7ffd3fbe.jpg" Src="dist/videos/output.mp4" onPublish={this.onVideoChildClicked} />
  : null
  }
              </div>
            </div>
            <Dialog
              title={this.state.dialogTitle}
              modal={false}
              titleStyle={dashboardStyles.dialogTitle}
              contentStyle={dashboardStyles.dialogContent}
              open={this.state.showDialog}
              onRequestClose={this.handleCloseDialog}
            >
              {this.state.dialogContent}
            </Dialog>
            {/* this.state.showProgress ? <CircularProgress size={200} thickness={12} /> : null */}
            <Snackbar 
              open={this.state.showSnackbar}
              autoHideDuration={this.state.snackbarHide}
              onRequestClose={this.handleCloseSnackbar}
              message={this.state.snackbarMessage}
            />
          </div>
        </BasePage>
      </MuiThemeProvider>
    );
  }
}

export default Dashboard;
