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
// import RecentActivities from '../components/dashboard/RecentActivities';
import { ChipExampleSimple1 , RecentActivities} from '../components/dashboard/RecentActivities';
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
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
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

function getTextByVersion(timeFrameJsonArray, edition_id, id_forecast_type, offset_days, version) {
  console.log('getTextByVersion - edition_id: ', edition_id);
  console.log('getTextByVersion - id_forecast_type: ', id_forecast_type);
  console.log('getTextByVersion - offset_days: ', offset_days);
  console.log('getTextByVersion - version: ', version);

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
      // Se le versioni dovessero essere uguali
      // ordina partendo dal presupposto che il testo lis di una versione successiva e' sempre piu' lungo rispetto a una versione precedente (sicuramente da migliorare)
      if (a.it_version == b.it_version) {
        if (a.text_lis.length < b.text_lis.length) {
          return -1;
        }
        if (a.text_lis.length > b.text_lis.length) {
          return 1;
        }
      }
      // return 0;
    });
  console.log('getTextByVersion - res: ', res);

  if (!(Array.isArray(res) && res.length)) {
    console.log('getTextByVersion - res vuoto - popolato oggetto di default');
    return {
      text_ita:         'Nessun dato per la selezione corrente',
      text_lis:         'Nessun dato per la selezione corrente',
      id_text_trans:    0,
      id_text_ita:      0,
      it_version:       0,
      id_text_lis:      0,
      it_version:       0
    };
  } else {
    if(version === 1)
      return res.shift(); // Dovrebbe prendere il primo
    else
      return res.pop();
    // .filter(function(data){return data.it_version == 1});
  }
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    var arg = { User: { Name: "Test" } }; // Visibile in: vm.$vmArg.User.Name
    // dotnetify.react.connect("HelloWorld", this, { vmArg: arg });
    dotnetify.debug= true;
    this.vm = dotnetify.react.connect('Dashboard', this, {
      exceptionHandler: ex => {
        // alert(ex.message);
        console.log('Dashboard - exceptionHandler: ', ex);
        auth.signOut();
      },
      vmArg: arg
    });
    this.dispatch = state => this.vm.$dispatch(state);
    // this.abortController = new AbortController();
    // mySignal = abortController.signal;
    console.log('Dashboard - dotnetify: ', dotnetify);
    console.log('Dashboard - props: ', props);
    
    this.state = {
      dirty:                    false, // flag di abilitazione bottone di salvataggio (se e' stata effettuata una modifica in un campo TextArea)
      // success1:              true, // Non usato
      // popOverOpen:              false, // Usato dal popover, ma il popover al momento non e' implementato - quindi niente
      showSnackbar:             false, // Mostra snackbar di salvataggio avvenuto
      snackbarMessage:          "Nuova versione di testo salvata!!",
      snackbarAutoHideDuration: 2000,
      showProgress:             false, // Mostra circular progress, inizialmente pensato per dare evidenza di caricamento - sostituito dalla dialog
      showDialog:               false, // Mostra la dialog
      showVideoPreview:         false, // Mostra anteprima video
      showActions:              false, // Mostra bottoni solo se c'e' un testo ita/lis presente
      videoProgressCompleted:   false, // flag true/false di selezione vista progress/video - il componente restituisce un valore false mentre sta caricando, true quando ha finito
      justTranslated:           false, // Subito dopo una traduzione, disabilita il bottone relativo per evitare ritraduzione dello stesso testo
      justSaved:                false, // Subito dopo un salvataggio, abilita la preview video
      justPreviewed:            false, // Subito dopo una preview, abilita il publish che e' l'ultima fase
      dialogTitle:              "Attendere, caricamento...",
      dialogContent:            "Attendere, caricamento...",
      Traffic:                  [],
      ServerUsage:              [],
      ServerUsageLabel:         [],
      Utilization:              [],
      UtilizationLabel:         [],
      UtilizationLabel1:        "Testo ITA originale",
      UtilizationLabel2:        "Testo LIS originale",
      RecentActivities:         [],
      
      sign_json:                {},    // Oggetto "finale" da passare all'endpoint preview
      sign_names:               [],    // Array piatto dei nomi - usato per trovare comodamente con il filtro se una parola inserita c'e'
      sign_array:               [],    // Array associativo name -> {id: int, name: string} per poter recuperare l'id in handleChips e costruire sign_json
      // sign_filtered:         [],    // Array usato effettivamente nella lista - uguale alla lista completa se non c'e' filtro, altrimenti diminuito in accordo con la parola cercata
      // sign_selected:         null,  // Oggetto che rappresenta l'eventuale segno cliccato nella lista
      chips:                    [],    // Chips delle parole inserite in lis_edit - verde: trovata, rossa: non trovata
      allWordsFound:            false, // true se tutte le parole in lis_edit hanno corrispondente segno (tutti chips verdi)
      
      pickDate:                 new Date(), // .toISOString().split('T')[0], // Data iniziale (oggi) - Se il datepicker viene spostato in un componente diverso, questo valore va ricreato nel componente che contiene il datepicker
      edition_id:               1, // ID dell'edizione di default da visualizzare (ID 1, cioe' 9:00)
      forecast_id:              1, // ID del tipo di forecast di default (NORD)
      offset_day:               1, // Numero di giorni di offset rispetto a oggi - per tutte le aree meno l'ultima (tutta Italia) dovrebbe sempre essere +1, l'ultima area invece ha di solito i due valori +2 e +3
      offsets:                  [],// Possibili valori di offset nella lista di valori per la data selezionata
      offsets_calc1:            [],
      testi:                    null, // Memorizza il contenuto totale dei forecast della data corrente, per non dover fare altre chiaamte API // this.state.testi.timeframe.editions
      
      ita_id:                   0, // Memorizza l'ID del testo ITA corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente
      ita_orig:                 'Attendere..', //Testo di default
      ita_edit:                 'Attendere..',
      ita_edit_version:         0,
      ita_notes:                'Attendere..',

      lis_id:                   0,
      lis_orig:                 'Attendere..',
      lis_edit:                 'Attendere..',
      lis_edit_version:         0,
      lis_notes:                'Attendere..',

      id_text_trans:            0,

      path_video:               null, // Eventuale path video di un testo gia' renderizzato

      path_postergen:           null, // Path poster generato in anteprima
      path_videogen:            null, // Path video generato in anteprima
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
    // this.handleChangePicker_child = this.handleChangePicker_child.bind(this);
    this.handleUpdateTextAreas = this.handleUpdateTextAreas.bind(this);
    this.handleChangeEditionId = this.handleChangeEditionId.bind(this);
    // this.handleEditIta = this.handleEditIta.bind(this);
    // this.handleEditLis = this.handleEditLis.bind(this);
    // this.setNum1 = this.setNum1.bind(this);
    // this.setNum2 = this.setNum2.bind(this);
    // console.log('Dashboard.js costruttore - props: ', props); // .userid qui non funziona
    this.handleChips = this.handleChips.bind(this);
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
    this.handleGetSigns();
    this.handleChangePicker_dashboard(this.state.pickDate);
  };

  handleChangeEditionId = (event, index, value) => {
    console.log('handleChangeEditionId - value: ', value);
    console.log('handleChangeEditionId - this.state.offsets_calc1[value]: ', this.state.offsets_calc1[value]);
    // this.setState({ value_ed: value});
    this.setState({
      offsets:    this.state.offsets_calc1[value],
      edition_id: value
      }, this.handleUpdateTextAreas);
    // this.handleUpdateTextAreas(value);
  };

  handleChangeForecastId = (event, index, value) => {
    console.log('handleChangeForecastId - value: ', value);
    console.log('handleChangeForecastId - this.state.offsets_calc1.shift(): ', this.state.offsets_calc1.shift());
    console.log('handleChangeForecastId - this.state.offsets_calc1.slice(1): ', this.state.offsets_calc1.slice(1));
    // this.setState({ value_area: value });
    this.setState({
      forecast_id: value,
      offset_day: (value === 7 ? // 2 : 1
        // this.state.offsets[0][0] : // 2 : 
        // this.state.offsets[0][1]   // 1
        this.state.offsets[1] :
        this.state.offsets[0]
    )}, this.handleUpdateTextAreas); //.id});
    // this.handleUpdateTextAreas(7);
  };

  handleChangeOffsetDay = (event, index, value) => {
    console.log('handleChangeOffsetDay - value: ', value);
    // this.setState({ value_area: value });
    this.setState({ offset_day: value }, this.handleUpdateTextAreas); //.id});
    // this.handleUpdateTextAreas(7);
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
        /*
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
        */
        console.log('Dashboard - handleGetSigns data: ',       data); // 0: {id: 60, name: "a"}
        console.log('Dashboard - handleGetSigns sign_group: ', sign_group);
        console.log('Dashboard - handleGetSigns sign_names: ', sign_names);
        console.log('Dashboard - handleGetSigns sign_array: ',  sign_array);

        this.setState({
          // sign_json:       data,
          sign_names:     sign_names,
          sign_array:      sign_array,
          // sign_filtered:  sign_iniz
        });

        // this.setState({ dirty: true });
        // this.setState({ justTranslated: true });
        // this.setState({ lis_edit:         data.translation }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
      })
      .catch(error => {
        console.log('Dashboard - handleGetSigns - Error: ', error);
      });
  };

  handleChips = (event) => {
    if (event.target.value.indexOf('Nessun dato') !== -1) {
      console.log('Dashboard - handleChips - testo vuoto');
      this.setState({
        allWordsFound: false,
        sign_json: {},
        chips: []
      },this.handleCloseDialog());

    } else {
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
        console.log('Dashboard - handleChips keyCode 12 - Space pressed! ')
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
        console.log('Dashboard - handleChips - Check array: ', ar.some(function(k) {return k.Found === false}));
        console.log('Dashboard - handleChips - Tot JSON: ', ret);
        this.setState({
          allWordsFound: ar.some(function(k) {return k.Found === false}),
          sign_json: ret,
          chips: ar // [{Word: 'Redemptioggn', Found: false}, {Word: 'Godfatrrrher', Found: true}, {Word: 'Part', Found: true}, {Word: 'Knight', Found: true}]        
        },this.handleCloseDialog());
      }
      // this.setState({ lis_edit: event.target.value });
    }
  };

  /*
  // Versione di handleChangePicker prevista se il picker dovesse essere inserito in un componente child (InfoBox)
  handleChangePicker_child = date1 => {
    this.setState({ pickDate: date1 });
    console.log('handleChangePicker_child - date1: ', date1);
    console.log('handleChangePicker_child - date1.toISOString(): ', date1.toISOString());
      this.handleChangePicker_dashboard(date1);
      // onChange={this.handleChangePicker_dashboard} value={this.state.pickDate} 
    }
  */
  
  /**
   * Metodo di aggiornamento data
   * La selezione di una data e' l'unica operazione che carica i dati di un nuov giorno
   * Questa versione e' quella pilotata dal picker qui nella dashboard stessa - ce n'e' anche una vesione che passa il bind a un eventuale componente child
   */
  handleChangePicker_dashboard = date1 => {
    var datestring = ("0" + date1.getDate()).slice(-2) + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" +
    date1.getFullYear() + " " + ("0" + date1.getHours()).slice(-2) + ":" + ("0" + date1.getMinutes()).slice(-2);
    var datestring1 = date1.getFullYear() + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" + ("0" + date1.getDate()).slice(-2);
    fetch("/api/values/meteo/" + datestring1,
      { signal: this.mySignal }
      ).then((response) => {
        return response.json();
      })
      .then(data => {
        console.log('handleChangePicker_dashboard - Data: ', data);
        if (data.id_day == null) {
          this.setState({
            pickDate:         date1,
            showActions:      false,
            ita_orig:         'Nessun dato per la data selezionata',
            ita_edit:         'Nessun dato per la data selezionata',
            lis_orig:         'Nessun dato per la data selezionata',
            lis_edit:         'Nessun dato per la data selezionata'}, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        } else {
          let offsets_calc = [
              [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 1})
                .map(data => data.offset_days)) ],
              [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 3})
                .map(data => data.offset_days)) ]
            ];
          console.log('handleChangePicker_dashboard - offsets_calc: ', offsets_calc);

          let offsets_calc1 = [];
          offsets_calc1[1] = [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 1})
                .map(data => data.offset_days)) ];
          offsets_calc1[3] = [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 3})
                .map(data => data.offset_days)) ];
          // offsets_calc1 = offsets_calc1.filter(Array);
          console.log('handleChangePicker_dashboard - offsets_calc1: ', offsets_calc1);

          let orig = getTextByVersion(
            data.timeframe.editions[0].forecast_data, 
            this.state.edition_id, 
            this.state.forecast_id, 
            offsets_calc1[1][0], // data.timeframe.editions[0].offsets.min, // this.state.offset_day,
            1);
          let edit = getTextByVersion(
            data.timeframe.editions[0].forecast_data, 
            this.state.edition_id, 
            this.state.forecast_id, 
            offsets_calc1[1][0], // data.timeframe.editions[0].offsets.min, // this.state.offset_day, 
            99);

          this.setState({
            pickDate:         date1,
            showActions:      true,
            testi:            data,
            offsets_calc1:    offsets_calc1,
            offset_day:       offsets_calc1[1][0], //data.timeframe.editions[0].offsets.min,
            /*
            offsets:          [
              [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 1})
                .map(data => data.offset_days)) ],
              [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 3})
                .map(data => data.offset_days)) ]
            ],
            */
            // offsets:          Array.from(Array( data.timeframe.editions[0].offsets.max - 1)).map((e,i) => i + data.timeframe.editions[0].offsets.min),

            offsets:          offsets_calc1[1], // Array.from(Array( data.timeframe.editions[0].offsets.max)).map((e,i) => i + data.timeframe.editions[0].offsets.min),

            ita_orig:         orig.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            ita_edit:         edit.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_orig:         orig.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_edit:         edit.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            id_text_trans:    edit.id_text_trans,
            ita_id:           orig.id_text_ita, // });
            ita_edit_version: edit.it_version, // });
            ita_notes:        'Campo non estratto, da correggere', // })
            lis_id:           orig.id_text_lis, // });
            lis_edit_version: edit.it_version, // });
            lis_notes:        'Campo non ancora estratto'
          }, this.handleChips({keyCode: 32, target: {value: edit.text_lis}})); // this.handleCloseDialog);
          console.log('handleChangePicker_dashboard - this.state: ', this.state);
        }
      })
      .catch(error => {
        console.log('handleChangePicker_dashboard - Error: ', error);
      });
  };

  /**
   * Metodo di aggiornamento contenuti delle textarea
   * La selezione di una nuova data, una nuova edizione, un'area diversa o un valore di offset days diverso provocano
   * il caricamento di nuovi testi nei due campi, se disponibili
   */
  handleUpdateTextAreas = (i) => {
    console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
    console.log('handleUpdateTextAreas - this.state.forecast_id: ', this.state.forecast_id);
    console.log('handleUpdateTextAreas - this.state.offset_day: ', this.state.offset_day);
    try {
      // this.setState({
        // offset_day:       this.state.offsets_calc1[this.state.edition_id][0],
      //   offsets:          this.state.offsets_calc1[this.state.edition_id]
      // }, () => {
        // let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
        let orig = getTextByVersion(
          this.state.testi.timeframe.editions[0].forecast_data,
          this.state.edition_id,
          this.state.forecast_id,
          this.state.offset_day,
          1);
        console.log('handleUpdateTextAreas - orig: ', orig);
        let edit = getTextByVersion(
          this.state.testi.timeframe.editions[0].forecast_data, 
          this.state.edition_id, 
          this.state.forecast_id, 
          this.state.offset_day, 
          99);
        console.log('handleUpdateTextAreas - edit: ', edit);
        this.setState({
            ita_orig:         orig.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            ita_edit:         edit.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_orig:         orig.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            lis_edit:         edit.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
            id_text_trans:    edit.id_text_trans,
            ita_id:           orig.id_text_ita, // });
            ita_edit_version: edit.it_version, // });
            ita_notes:        'Campo non estratto, da correggere', // })
            lis_id:           orig.id_text_lis, // });
            lis_edit_version: edit.it_version, // });
            lis_notes:        'Campo non ancora estratto'
        },
        this.handleChips({keyCode: 32, target: {value: edit.text_lis}})
        );
        // console.log('handleUpdateTextAreas - this.state.edition_id: ', this.state.edition_id);
        // console.log('handleUpdateTextAreas - this.state.forecast_id: ', this.state.forecast_id);
        console.log('handleUpdateTextAreas - this.state: ', this.state);
      // });
    } catch (error) {
      console.log('handleUpdateTextAreas catch - Error: ', error);
      // console.log('handleUpdateTextAreas catch - this.state.edition_id: ', this.state.edition_id);
      // console.log('handleUpdateTextAreas catch - this.state.forecast_id: ', this.state.forecast_id);
    }
  };

  /*
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
  */

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
    this.setState({ videoProgressCompleted: true }, this.handleStopProgress); // ita: this.state.testi[0]['CENTRO E SARDEGNA']});
    // this.setState({ lis: this.state.testi[1]['NORD']}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    // alert('child progress comple');
  };

  handleStopProgress() {
    // Il metodo Stop ha gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
    // Start e stop servono a far partire e a fermare l'observable che dovrebbe ritornare il valore della dimensione del file video man mano che viene generato
    this.dispatch({
      Stop: {
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
  };

  handleOpenDialogChangePicker = (date1) => {
    this.setState({showDialog: true}, () => this.handleChangePicker_dashboard(date1));
  };

  handleOpenDialogPublish = () => {
    this.setState({
      dialogTitle:        "Attendere, pubblicazione...",
      dialogContent:      "Attendere, pubblicazione...",
      showDialog: true
    }, this.handlePublish);
  };

  handleOpenDialogTranslate = () => {
    this.setState({
      dialogTitle:        "Attendere, traduzione...",
      dialogContent:      "Attendere, traduzione...",
      showDialog: true
    }, this.handleTranslate);
  };

  handleOpenDialogPreview = () => {
    this.setState({
      // dialogTitle:        "Attendere, caricamento anteprima...",
      // dialogContent:      "Attendere, caricamento anteprima...",
      snackbarAutoHideDuration: 20000, // 20 secondi invece di 2
      snackbarMessage:  'Attendere, rendering in corso..',
      showSnackbar: true
      // showDialog: false   // Niente dialog per l'anteprima (preview) - c'e' gia' il progress
    }, this.handlePreview);
  };

  // TODO: aprire la Snackbar solo in fase di salvataggio o comunque quando si vuole che sia visibile, non ogni volta che si chiude la dialog
  // OK quindi handleOpenSnackbar richiamata di volta in volta solo dove serve
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

  /**
   * Reimposta le textarea con l'ultima versione salvata
   */
  handleCancel = _ => {
      // let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
      let last_edit = getTextByVersion(
        this.state.testi.timeframe.editions[0].forecast_data,
        this.state.edition_id,
        this.state.forecast_id,
        this.state.offset_day,
        99);
      this.setState({ ita_edit:         last_edit.text_ita });
      this.setState({ lis_edit:         last_edit.text_lis });
      this.setState({ dirty: false });
  };

  handleSave = _ => {
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

  handleTranslate_get = _ => {
    // var datestring1 = date1.getFullYear() + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" + ("0" + date1.getDate()).slice(-2);
    // var url = "/api/values/translate/";
    // this.setState({ showProgress: true });
    fetch("/api/values/translate",
      { signal: this.mySignal }
      ).then((response) => {
        return response.json();
      })
      .then(data => {
        console.log('handleChangePicker_dashboard - Data: ', data);
        this.setState({ dirty: true });
        this.setState({ justTranslated: true });
        this.setState({ lis_edit:         data.translation }, this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        /*          
        this.setState({ lis_orig:         orig.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ lis_edit:         edit.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                  this.setState({ ita_id:           orig.id_text_ita });
                  this.setState({ ita_edit_version: edit.it_version });
                  this.setState({ ita_notes:        'Non estratte ancora' })
                  this.setState({ lis_id:           orig.id_text_lis });
                  this.setState({ lis_edit_version: edit.it_version });
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
      "/api/values/translate",
      {
        signal: this.mySignal,
        method: 'POST',
        body: "'"+JSON.stringify({value: btoa(this.state.ita_edit)})+"'", // Attenzione - il btoa Javascript sembra che converte sempre in UTF8, non in Unicode
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
   * Genera l'anteprima video di un testo LIS
   * Bisogna creare una request e aspettare il rendering
   */
  handlePreview = _ => {
    console.log('handlePreview - creazione request');
    // let paaa = '';
    fetch("/api/values/request",
    {
      signal: this.mySignal,
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
      console.log('handlePreview - Risultato request POST: ', p);
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
      this.setState({
            showVideoPreview: true
      });

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
          console.log('handlePreview - Risultato preview POST: ' , p);
          // paaa = p.output_preview;
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

          this.setState({
            path_postergen: p.output_preview+'.jpg',
            path_videogen: p.output_preview+'.mp4',
            // showVideoPreview: true,
            justPreviewed:    true,
            snackbarAutoHideDuration: 2000 // Rimetti a 2 secondi
          }, this.handleCloseSnackBar); // this.handleCloseDialog); // Niente dialog per la preview - c'e' gia' il progress circolare
      }).catch(error => {
        console.log('handlePreview - preview Error: ', error);
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
    })
    .catch(error => {
      console.log('handlePreview - request Error: ', error);
    });
  };

  /**
   * Pubblica il video su FTP
   * Operazione "asincrona" - ci potrebbe volere un po' a pubblicare il video
   * Molto probabimente un'operazione da agganciare al componente children che visualizza il video
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
    
    fetch("/api/values/testpost_2", // 1/6",
    {
      signal: this.mySignal,
      method: 'POST',
      body: "'"+JSON.stringify({value: 'bacon'})+"'",
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(p => {
      console.log('testpost_2: ' , p);
      fetch("/api/values/testpost_3", // 1/6",
      {
        signal: this.mySignal,
        method: 'POST',
        body: JSON.stringify({value: 'bacon'}),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(p => {
        console.log('testpost_3: ' , p);
        this.setState({ lis_edit: 'Pubblicato!!!' }, this.handleCloseDialog);
        this.setState({ snackbarMessage: 'Video pubblicato su ftp://test@test.com' }, this.handleOpenSnackbar)
        fetch("/api/values/testpost_1/88", // 1/6",
        {
          signal: this.mySignal,
          method: 'POST',
          body: "'"+JSON.stringify({value: 'bacon'})+"'",
          headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(p => {
          console.log('testpost_1: ' , p);
          fetch(
            "/api/values/translate",
            {
              signal: this.mySignal,
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
    fetch("/api/values/testpost_1/88", // 1/6",
    {
      signal: this.mySignal,
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
  };

  render() {
    let { dirty, showActions, justTranslated, justSaved, justPreviewed } = this.state;

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
        float: 'left'
      },
      buttonStyle: { 
        marginLeft: 2,
        padding: '10px', //,
        float: 'left'
      },
      buttonLabel: {
        fontSize: 8, // '6px'
        padding: '.5em 0'
      }
    };

    const handleTranslate1 = _ => {
      // var datestring1 = date1.getFullYear() + "-" + ("0"+(date1.getMonth()+1)).slice(-2) + "-" + ("0" + date1.getDate()).slice(-2);
      // var url = "/api/values/translate/";
      // this.setState({ showProgress: true });
      fetch("/api/values/translate", { signal: this.mySignal }) //2019-12-23") // + date.toISOString().split('T')[0].trim()) // aggiungere la data // new Date().toISOString().split(' ')[0]
        .then((response) => {
          return response.json();
        })
        .then(data => {
          console.log('handleChangePicker_dashboard - Data: ', data);
          this.setState({ lis_edit:         data.translation }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          /*          
          this.setState({ lis_orig:         orig.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                    this.setState({ lis_edit:         edit.text_lis }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
                    this.setState({ ita_id:           orig.id_text_ita });
                    this.setState({ ita_edit_version: edit.it_version });
                    this.setState({ ita_notes:        'Non estratte ancora' })
                    this.setState({ lis_id:           orig.id_text_lis });
                    this.setState({ lis_edit_version: edit.it_version });
                    this.setState({ lis_notes:        'Da estrarre', });
                    console.log('handleChangePicker_dashboard - this.state: ', this.state);
          */
          // this.setState({ showProgress: false });
        })
        .catch(error => {
          console.log('handleChangePicker_dashboard - Error: ', error);
        });
    };

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
                  alignItems: 'left',
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
                <ToolbarTitle text="Data" style={{paddingLeft: 10, padding: 10}} />
                <DatePicker value={this.state.pickDate} onChange={this.handleOpenDialogChangePicker} />
                <ToolbarSeparator />
                <ToolbarTitle text="Edizione" style={{padding: 10}} />
                <DropDownMenu value={this.state.edition_id} onChange={this.handleChangeEditionId}>
                  <MenuItem value={1} primaryText="09:30" />
                  {/* <MenuItem value={2} primaryText="17:30" disabled={true}/> */}
                  <MenuItem value={3} primaryText="18:30" />
                </DropDownMenu>
                <ToolbarSeparator />
                <ToolbarTitle text="Area" style={{padding: 10}} />
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
                <ToolbarTitle text="Giorno" style={{padding: 10}} />
                <DropDownMenu value={this.state.offset_day} onChange={this.handleChangeOffsetDay} disabled={this.state.forecast_id != 7}>
                  {this.state.offsets.map(item => <MenuItem key={item} value={item} primaryText={'+' + item} />)}
                  {/*
                    <MenuItem value={1} primaryText="+1" disabled={this.state.forecast_id == 7}/>
                    <MenuItem value={2} primaryText="+2" />
                    <MenuItem value={3} primaryText="+3" />
                    <MenuItem value={4} primaryText="+4" />
                  */}
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
                {/*
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo ITA originale{this.state.ita_edit_version ? ' (versione 1)' : '' }:</div>
                </div>
                <label>{this.state.ita_orig}</label>
                */}
                <div style={dashboardStyles.buttons}>
                  <CardExampleExpandable title={"Testo ITA originale" + (this.state.lis_edit_version ? " (versione 1)" : "") } subtitle="Cliccare per espandere" text={this.state.ita_orig} />
                </div>
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo ITA editato{this.state.ita_edit_version ? ' (versione ' + this.state.ita_edit_version + ')' : '' }:</div>
                </div>
                <div style={dashboardStyles.buttons}>
                  <TextareaAutosize
                    cols={42}
                    rows={20}
                    maxRows={25}
                    minRows={3}
                    style={{overflowY: 'scroll'}}
                    value={this.state.ita_edit}
                    onChange={handleEditIta1}
                  />
                </div>
  {showActions ?
                <div style={dashboardStyles.buttons}>
                  <RaisedButton label="Annulla"         onClick={this.handleCancel}              style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={false} disabled={!dirty} />
                  <RaisedButton label="Traduci"         onClick={this.handleOpenDialogTranslate} style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true} disabled={justTranslated} />
                </div>
  : null}
              </div>

              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                {/*
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo LIS originale{this.state.lis_edit_version ? ' (versione 1)' : '' }:</div>
                </div>
                <label>{this.state.lis_orig}</label>

                value={this.state.lis_edit}
                onChange={handleEditLis1}
                */}
                <div style={dashboardStyles.buttons}>
                  <CardExampleExpandable title={"Testo LIS originale" + (this.state.lis_edit_version ? " (versione 1)" : "") } subtitle="Cliccare per espandere" text={this.state.lis_orig} />
                </div>
                <div style={dashboardStyles.buttons}>
                  <div style={globalStyles.navigation}>Testo LIS editato{this.state.lis_edit_version ? ' (versione ' + this.state.lis_edit_version + ')' : '' }:</div>
                </div>
                <div style={dashboardStyles.buttons}>
                  <TextareaAutosize
                    cols={42}
                    rows={20}
                    maxRows={25}
                    minRows={3}
                    style={{overflowY: 'scroll'}}
                    value={this.state.lis_edit}
                    onChange={(event) => {
                        this.setState({
                          lis_edit:       event.target.value,
                        }, this.handleChips(event))
                    }}
                    onKeyDown={(event) => {
                        this.setState({
                          lis_edit:       event.target.value,
                        }, this.handleChips(event))
                    }}
                  />
                </div>
                <div style={dashboardStyles.buttons}>
                  <ChipExampleSimple1 chips={this.state.chips}/>
                </div>
  {showActions ?
                <div style={dashboardStyles.buttons}>
                  <RaisedButton label="Salva"           onClick={this.handleSave}                style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={false} disabled={!dirty} />
                  <RaisedButton label="Anteprima"       onClick={this.handleOpenDialogPreview}   style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true}  disabled={justPreviewed && !this.state.allWordsFound} />
                  {/*
                  <br />
                  <RaisedButton label="Pubblica"        onClick={this.handleOpenDialogPublish}   style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true}  disabled={justPreviewed} />
                  */}
                  {/*<VideoPreview poster={this.state.Poster} source={this.state.Src} onPublish={this.onVideoChildClicked} />*/}
                </div>
  : null}
              </div>

              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
{/*
  this.state.path_video != null ? 
                <VideoPreview poster={this.state.Poster} source={this.state.path_video} onPublish={this.onVideoChildClicked} />
  :
  this.state.showVideoPreview ? 
  !this.state.videoProgressCompleted ? 
                <CircularProgressExampleDeterminate progress={this.state.Progress} onCompleted={this.onCircProgressCompleted} />
  :
                <VideoPreview poster={this.state.path_postergen} source={this.state.path_videogen} onPublish={this.onVideoChildClicked} />
  : null
*/}

{
this.state.path_videogen ? 
                <video controls autoPlay={true} width="320" height="240" key={this.state.path_videogen}><source src={this.state.path_videogen} /></video>
:
  null
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
              autoHideDuration={this.state.snackbarAutoHideDuration}
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
