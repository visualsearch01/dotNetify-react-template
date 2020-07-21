import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { cyan600, pink600, purple600, orange600 } from 'material-ui/styles/colors';
import { InfoBox, CircularProgressExampleDeterminate, ChipExampleSimple, ListExampleSelectable, handleChips_b } from '../components/dashboard/InfoBox';
import { Utilization , VideoPreview, CardExampleExpandable } from '../components/dashboard/Utilization';
import { ChipExampleSimple1 , RecentActivities} from '../components/dashboard/RecentActivities';
import ServerUsage from '../components/dashboard/ServerUsage';
import BasePage from '../components/BasePage';
import globalStyles from '../styles/styles';
import ThemeDefault from '../styles/theme-default';
import auth from '../auth';
import DatePicker from 'react-date-picker';
import TextareaAutosize from 'react-textarea-autosize';
// import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs';
// import Toggle from 'material-ui/Toggle';

// La dialog potrebbe essere usata per indicare un'operazione in corso
import Dialog from 'material-ui/Dialog';

// La snackbar potrebbe essere usata per indicare l'esito di un'operazione
import Snackbar from 'material-ui/Snackbar';
// import CircularProgress from 'material-ui/CircularProgress';
// import Badge from 'material-ui/Badge';

/**
 * Questa funzione estrae da un oggetto timeFrame json la prima o l'ultima versione di un testo
 * in base all'edition, al tipo di forecast e al giorno di offset
 */
function getTextByVersion(timeFrameJsonArray, id_edition, id_forecast_type, offset_days, version) {
  console.log('getTextByVersion - id_edition:       ', id_edition);
  console.log('getTextByVersion - id_forecast_type: ', id_forecast_type);
  console.log('getTextByVersion - offset_days:      ', offset_days);
  console.log('getTextByVersion - version:          ', version);

  let res = timeFrameJsonArray
    .filter(data => {return data.edition == id_edition})
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

function getShowDate (date_object, offset) {
  return new Date(new Date().setDate(date_object.getDate() + offset)).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0];
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    var arg = { User1: { Id: g_userid, Name: g_username }, num1: 9043835 };
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

    console.log('Dashboard - constructor - dotnetify: ', dotnetify);
    console.log('Dashboard - constructor - props::::: ', props);
    
    this.state = {
      dirty:                    false,          // Flag di abilitazione bottone di salvataggio  - se e' stata effettuata una modifica in un campo TextArea, diventa true
      showSnackbar:             false,          // Mostra/nascondi snackbar di operazione avvenuta
      snackbarMessage:          "Nuova versione di testo salvata!!",
      snackbarAutoHideDuration: 2000,

      showProgress:             false,          // Mostra circular progress, inizialmente pensato per dare evidenza di caricamento - sostituito dalla dialog
      videoProgressCompleted:   false,          // Flag true/false di selezione vista progress/video - il componente restituisce un valore false mentre sta caricando, true quando ha finito
      
      showDialog:               false,          // Mostra la dialog
      dialogTitle:              "Attendere, caricamento...",
      dialogContent:            "Attendere, caricamento...",

      showActions:              false,          // Mostra bottoni solo se c'e' un testo ita/lis presente
      
      justTranslated:           false,          // Subito dopo una traduzione, disabilita il bottone relativo per evitare ritraduzione dello stesso testo
      justSaved:                false,          // Subito dopo un salvataggio, abilita la preview video
      justPreviewed:            false,          // Subito dopo una preview, abilita il publish che e' l'ultima fase
      justPublished:            false,          // Subito dopo una publish, impedisci di rifarla con lo stesso file
      previewing:               false,          // Durante la preview, disabilita sia anteprima che publish
      
      sign_json:                {},             // Oggetto "finale" da passare all'endpoint preview
      sign_names:               [],             // Array piatto dei nomi - usato per trovare comodamente con il filtro se una parola inserita c'e'
      sign_array:               [],             // Array associativo name -> {id: int, name: string} per poter recuperare l'id in handleChips e costruire sign_json
      chips:                    [],             // Chips delle parole inserite in lis_edit - verde: trovata, rossa: non trovata
      allWordsFound:            false,          // true se tutte le parole in lis_edit hanno corrispondente segno (tutti chips verdi)
      
      // pickDate:                 location.pathname == '/' ||  location.pathname == '/Meteo' ? new Date() : new Date(Date.parse(location.pathname.split('/')[2].split('_')[0])),
      pickDate:                 new Date('1970-01-01'),     // '2020-04-21'), // pickDate vael la data odeirna, oppure la data di un video caricato dalla lista I miei video
      showDate:                 '',             // data della previsione (quindi es. domani rispetto a oggi nel caso di +1)
      
      offset_day:               1,              // Numero di giorni di offset rispetto a oggi del testo attuale - per tutte le aree meno l'ultima (tutta Italia) dovrebbe sempre essere +1, l'ultima area invece ha di solito i due valori +2 e +3
      offsets:                  [],             // Possibili valori di offset nella lista di valori, per la data selezionata - lista ricevuta da backend dal DB
      offsets_calcolati_2:      [],             // Possibili valori di offset nella lista di valori, per la data selezionata - lista calcolata in frontend sui distinct dei valori da array json
      testi:                    null,           // Memorizza il contenuto totale dei forecast della data corrente, per non dover fare altre chiaamte API quando si cambia edizione o forecast_type // this.state.testi.timeframe.editions
      
      ita_id:                   0, // location.pathname == '/' ||  location.pathname == '/Meteo' ? 0 : location.pathname.split('/')[2].split('_')[3],              // Memorizza l'ID del testo ITA corrente - bisogna portarselo dietro perche' nuove versioni salvate avranno sempre lo stesso ID ma versione crescente - viene incrementato in caso di publish/save
      ita_orig:                 'Attendere..',  // Testo ITA di default prima del caricamento
      // ita_edit:                 'Attendere..',
      ita_edit_version:         0,
      ita_notes:                'Attendere..',

      lis_id:                   0, // location.pathname == '/' ||  location.pathname == '/Meteo' ? 0 : location.pathname.split('/')[2].split('_')[4],
      lis_orig:                 'Attendere..',
      // lis_edit:                 'Attendere..',
      lis_edit_version:         0,
      lis_notes:                'Attendere..',
      
      id_edition:               1, // location.pathname == '/' ||  location.pathname == '/Meteo' ? 1 : location.pathname.split('/')[2].split('_')[1],              // ID dell'edizione visualizzata, di default ID 1, cioe' 09:30 (bisognerebbe farla diventare dinamica - visualizzare di default l'edizione piu' vicina all'ora client o server corrente
      id_text_trans:            0,              // ID della traduzione del testo corrente (id_text_trans su lis_text_trans2)
      id_forecast_type:         1, // location.pathname == '/' ||  location.pathname == '/Meteo' ? 1 : location.pathname.split('/')[2].split('_')[2],              // ID del tipo di forecast di default (1, cioe' NORD)
      id_forecast:              0,              // ID del record di forecast corrente (dipende dal giorno di offset)
      id_forecast_data:         0,              // ID del record di forecast_data corrente (dipende dal giorno di offset) - da passare alla funzione di publish, che fa anche un save prima
      
      // path_video:               null,           // Eventuale path video di un testo gia' renderizzato
      // path_postergen:           null,           // Path poster generato in anteprima
      path_videogen:            null,           // Path video generato in anteprima
      // videoName:                '',             // Nome del video da salvare (qui in meteo non usato, viene creato con naming convention)
      // tab_mode_dash:            'dizionario',   // Tab di default (UPDATE - i tab usati qui in dashboard servivano per gestire la prima versione "appoggiata" di deliverable 2 - ora e' tutto spostato in TablePage_1)
      // note_segno:               'Informazioni riguardo al segno selezionato',
      // num1:                     0, 
      // num2:                     300,
      // sum :                     0,
      // toggle1:                  false,
      // toggle2:                  false
    };

    // this.onVideoChildClicked = this.onVideoChildClicked.bind(this);
    // this.onCircProgressCompleted = this.onCircProgressCompleted.bind(this);
    // this.handleUpdateTextAreas = this.handleUpdateTextAreas.bind(this);
    this.handleChips = handleChips_b.bind(this);
    this.datepick_focus = React.createRef();
    this.tabforecast_focus = React.createRef();
  };
  abortController = new AbortController();
  mySignal = this.abortController.signal;
  
  handleBodyKeyDown = (event) => {
    // console.log(document.activeElement);
    var focused = document.activeElement;
    if (!focused || focused == document.body) {
      console.log('Dashboard handleBodyKeyDown event.keyCode: ', event.keyCode);
      switch( event.code ) {
        case 'ArrowLeft': // 37: //sx
          // this.setState(
          // {pickDate: new Date(new Date().setDate(this.state.pickDate.getDate()-1))}); //  , // new Date(this.state.pickDate.getDate() - 1)}, 
          // console.log(this.state.pickDate)
          var ieri = new Date(new Date().setDate(this.state.pickDate.getDate() - 1));
          console.log('Dashboard - handleBodyKeyDown - ieri: ', ieri);
          this.handleOpenDialogChangePicker(ieri);
          // );
          // this.handleChangePicker_dashboard( new Date(new Date().getDate() - 1) );
          break;
        case 'ArrowRight': // 39: // dx
          // this.setState(
          // {pickDate: new Date(new Date().setDate(this.state.pickDate.getDate()+1))}); // , // new Date(this.state.pickDate.getDate() - 1)}, 
          // console.log(this.state.pickDate)
          var domani = new Date(new Date().setDate(this.state.pickDate.getDate() + 1));
          console.log('Dashboard - handleBodyKeyDown - domani: ', domani);
          this.handleChangePicker_dashboard(domani);
            // );
          break;
        case 'ShiftLeft': // 37: //sx
          this.setState(
            {id_edition: 1},
            this.handleChangeEditionId_tab(this.state.id_edition)
          );
          break;
        case 'ShiftRigth': // 37: //sx
          this.setState(
            {id_edition: 3},
            this.handleChangeEditionId_tab(this.state.id_edition)
          );
          break;
        case 'ControlLeft':
          this.setState(
            {id_forecast_type: Math.max((this.state.id_forecast_type - 1 ), 1)},
            this.handleChangeForecastTypeId_tab(this.state.id_forecast_type)
          );
          break;
        case 'ControlRigth':
          this.setState(
            {id_forecast_type: Math.min((this.state.id_forecast_type + 1 ), 7)},
            this.handleChangeForecastTypeId_tab(this.state.id_forecast_type)
          );
          break;        
        default: 
          break;
      }
    }
  };

  componentWillUnmount() {
    console.log('Dashboard - componentWillUnmount()');
    this.abortController.abort();
    this.vm.$destroy();
    // Component is attempting to connect to an already active 'Dashboard'.
    // If it's from a dismounted component, you must add vm.$destroy to componentWillUnmount().
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleBodyKeyDown);
    this.handleGetSigns();
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
        
        console.log('Dashboard - handleGetSigns data: ',       data); // 0: {id: 60, name: "a"}
        console.log('Dashboard - handleGetSigns sign_group: ', sign_group);
        console.log('Dashboard - handleGetSigns sign_names: ', sign_names);
        console.log('Dashboard - handleGetSigns sign_array: ', sign_array);

        // this.setState({
        // sign_json:      data,
        // pickDate:          location.pathname == '/' ||  location.pathname == '/Meteo' ? new Date() : new Date(Date.parse(location.pathname.split('/')[2].split('_')[0]))
        // }, () => {
        this.setState({
          sign_names:        sign_names,
          sign_array:        sign_array
          }, () => {
            if (location.pathname == '/' ||  location.pathname == '/Meteo')
              this.setState({
                // pickDate:                 location.pathname == '/' ||  location.pathname == '/Meteo' ? new Date() : new Date(Date.parse(location.pathname.split('/')[2].split('_')[0])),
                pickDate:                 new Date(),
                // showDate: new Date(new Date().setDate(this.state.pickDate.getDate() + 1)).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
              //});
              }, () => {
                this.handleChangePicker_dashboard(this.state.pickDate);
              })
            else {
              // alert('>'+location.pathname.split('/')[2].split('_')[2]+'<');
              this.setState({
                  pickDate:                 new Date(Date.parse(location.pathname.split('/')[2].split('_')[0])),
                  ita_id:                   parseInt(location.pathname.split('/')[2].split('_')[3]),
                  ita_edit_version:         parseInt(location.pathname.split('/')[2].split('_')[5]),
                  lis_id:                   parseInt(location.pathname.split('/')[2].split('_')[4]),
                  lis_edit_version:         parseInt(location.pathname.split('/')[2].split('_')[6]),
                  id_edition:               parseInt(location.pathname.split('/')[2].split('_')[1]),
                  id_forecast_type:         parseInt(location.pathname.split('/')[2].split('_')[2]),
                  id_forecast:              parseInt(location.pathname.split('/')[2].split('_')[7]),
                  id_forecast_data:         parseInt(location.pathname.split('/')[2].split('_')[8])
                }, () => {
                  this.handleChangePicker_dashboard(this.state.pickDate);
              });
            }
          });
          // );
      })
      .catch(error => {
        console.log('Dashboard - handleGetSigns - Error: ', error);
      });
  };

  handleChangeEditionId_tab = (value) => {
    console.log('handleChangeEditionId_tab - value: ', value);
    // console.log('handleChangeEditionId_tab - this.state.offsets_calcolati_2[value]: ', this.state.offsets_calcolati_2[value]);
    /*
    this.setState({
      id_edition: value,
      // offsets:    (undefined === this.state.offsets_calcolati_2[value] ? [] : this.state.offsets_calcolati_2[value]) // Per evitare un errore js che incastra la pagina
      offsets:          this.state.offsets_calcolati_2[value] //  (this.state.offsets.length > 0 ? this.state.offsets_calcolati_2 : []),
    }, this.handleUpdateTextAreas);
    */

    this.state.id_forecast_type === 7 ? 
      this.setState({
        id_edition:       value,
        offsets:          this.state.offsets_calcolati_2[value], //  (this.state.offsets.length > 0 ? this.state.offsets_calcolati_2/*.slice(1)*/ : []),
        offset_day:       this.state.offsets_calcolati_2[value][1], // (undefined === this.state.offsets[1] ? 1 : this.state.offsets[1]), // Imposta il valore di offset_day corrente al secondo vaore possibile se visualizza TUTTA ITALIA
        // showDate:         new Date(new Date().setDate(this.state.pickDate.getDate() + this.state.offsets_calcolati_2[value][1])).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
        showDate:         getShowDate(this.state.pickDate, this.state.offsets_calcolati_2[value][1])
      }, this.handleUpdateTextAreas)
    :
      this.setState({
        id_edition:       value,
        offsets:          this.state.offsets_calcolati_2[value], // (this.state.offsets.length > 0 ? this.state.offsets_calcolati_2 : []),
        offset_day:       this.state.offsets_calcolati_2[value][0], // (undefined === this.state.offsets[0] ? 1 : this.state.offsets[0]),
        // showDate:        new Date(new Date().setDate(this.state.pickDate.getDate() + this.state.offsets_calcolati_2[value][0])).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
        showDate:         getShowDate(this.state.pickDate, this.state.offsets_calcolati_2[value][0])
      }, this.handleUpdateTextAreas); //.id});

  };

  handleChangeForecastTypeId_tab = (value) => { // (event, index, value) => {
    console.log('handleChangeForecastTypeId_tab - value: ', value);
    // console.log('handleChangeForecastTypeId_tab - this.state.offsets_calcolati_2:::::::::: ', this.state.offsets_calcolati_2);
    // console.log('handleChangeForecastTypeId_tab - this.state.offsets_calcolati_2.shift():: ', this.state.offsets_calcolati_2.shift());
    // console.log('handleChangeForecastTypeId_tab - this.state.offsets_calcolati_2.slice(1): ', this.state.offsets_calcolati_2.slice(1));
    // Si era pensato di togliere il primo valore (di solito +1) dall'array offsets quando si visualizza le voci 'TUTTA ITALIA'
    // perche' di solito per quell'area gli offset sono solo +2 e +3
    // ma generava un errore se si puntava a un array vuoto o che non aveva la chiave giusta
    // Si e' poi deciso di non farlo perche' anche le voci tutta italia a volte hanno un testo per +1
    value === 7 ? 
      this.setState({
        id_forecast_type: value,
        offsets:          this.state.offsets_calcolati_2[this.state.id_edition], //  (this.state.offsets.length > 0 ? this.state.offsets_calcolati_2/*.slice(1)*/ : []),
        offset_day:       this.state.offsets_calcolati_2[this.state.id_edition][1], // (undefined === this.state.offsets[1] ? 1 : this.state.offsets[1]), // Imposta il valore di offset_day corrente al secondo vaore possibile se visualizza TUTTA ITALIA
        // showDate: new Date(new Date().setDate(this.state.pickDate.getDate() + this.state.offsets_calcolati_2[this.state.id_edition][1])).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
        showDate:         getShowDate(this.state.pickDate, this.state.offsets_calcolati_2[this.state.id_edition][1])
      }, this.handleUpdateTextAreas)
    :
      this.setState({
        id_forecast_type: value,
        offsets:          this.state.offsets_calcolati_2[this.state.id_edition], // (this.state.offsets.length > 0 ? this.state.offsets_calcolati_2 : []),
        offset_day:       this.state.offsets_calcolati_2[this.state.id_edition][0], // (undefined === this.state.offsets[0] ? 1 : this.state.offsets[0]),
        // showDate: new Date(new Date().setDate(this.state.pickDate.getDate() + this.state.offsets_calcolati_2[this.state.id_edition][0])).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
        showDate:         getShowDate(this.state.pickDate, this.state.offsets_calcolati_2[this.state.id_edition][0])
      }, this.handleUpdateTextAreas); //.id});
  };

  handleChangeOffsetDay = (event, index, value) => {
    console.log('handleChangeOffsetDay - value: ', value);
    this.setState({
      offset_day: value,
      // showDate: new Date(new Date().setDate(this.state.pickDate.getDate() + value)).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
      showDate:         getShowDate(this.state.pickDate, value)
    }, this.handleUpdateTextAreas); //.id});
  };
    
  /**
   * Metodo di aggiornamento data
   * La selezione di una data e' l'unica operazione che carica i dati di un nuov giorno
   * Questa versione e' quella pilotata dal picker qui nella dashboard stessa - ce n'e' anche una vesione che passa il bind a un eventuale componente child
   */
  handleChangePicker_dashboard = (date_object) => {
    var datestring1 = (
      "0" + 
      date_object.getDate()).slice(-2) + 
      "-" + 
      ("0"+(date_object.getMonth()+1)).slice(-2) + 
      "-" +
      date_object.getFullYear() + 
      " " + 
      ("0" + date_object.getHours()).slice(-2) + 
      ":" + 
      ("0" + date_object.getMinutes()).slice(-2);
    
    var datestring2 = (
      date_object.getFullYear() + 
      "-" + 
      ("0"+(date_object.getMonth()+1)).slice(-2) + 
      "-" + 
      ("0" + date_object.getDate()).slice(-2));

    // console.log('handleChangePicker_dashboard - datestring1: ', datestring1);
    // console.log('handleChangePicker_dashboard - this.state.Pick_date_b: ', this.state.Pick_date_b);
    // console.log('handleChangePicker_dashboard - datestring2: ', datestring2);

    fetch("/api/values/meteo/" + datestring2,
      { signal: this.mySignal }
      ).then((response) => {
        return response.json();
      })
      .then(data => {
        console.log('handleChangePicker_dashboard - fetch "/api/values/meteo/' + datestring2 + '" data: ', data);
        // Dati non trovati per la combinazione di data/edizione/forecast_type_id        
        if (data.id_day == null) {
          this.setState({
            testi:            data,
            showActions:      false,
            dirty:            false,
            ita_orig:         'Nessun dato per la data selezionata',
            ita_edit:         'Nessun dato per la data selezionata',
            lis_orig:         'Nessun dato per la data selezionata',
            lis_edit:         'Nessun dato per la data selezionata',
            showSnackbar:     false,
            showDialog:       false,

            pickDate:         date_object,
            showDate:         getShowDate(date_object, 1)
            // }, () => this.setState({pickDate:         date_object}, this.handleCloseDialog)
            }, this.handleCloseDialog
          ) // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        }
        else {
          // La query di estrazione testi contiene dei valori di offset, ma non sono corretti (sono globali per tutte le edition quando invece per ogni edition possono cambiare)
          // Si e' deciso per ora di calcolarli lato frontend
          // calcolati_1 e _2 sono identici se non per le chiavi degli array che nel primo caso sono 0,1,2 ecc e nel secondo sono pari all'id dell'edition usata (1 e 3 per ora)
          let offsets_calcolati_1 = [
              [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 1})
                .map(data => data.offset_days)) ],
              [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 3})
                .map(data => data.offset_days)) ]
            ];
          console.log('handleChangePicker_dashboard - offsets_calcolati_1: ', offsets_calcolati_1);

          let offsets_calcolati_2 = [];
          offsets_calcolati_2[1] = [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 1})
                .filter(function (el) {return el != null;})
                .map(data => data.offset_days)) ];
          offsets_calcolati_2[3] = [...new Set( data.timeframe.editions[0].forecast_data
                .filter(data => {return data.edition == 3})
                .filter(function (el) {return el != null;})
                .map(data => data.offset_days)) ];
          // offsets_calcolati_2 = offsets_calcolati_2.filter(Array);
          console.log('handleChangePicker_dashboard - offsets_calcolati_2: ', offsets_calcolati_2);

          let offset_day_current_edition  = offsets_calcolati_2[this.state.id_edition][0]; // Il primo valore di offset dell'edizione corrente
          let offset_days_current_edition = offsets_calcolati_2[this.state.id_edition]     // Lista di possibili valori per l'edizione corrente

          // L'array data.timeframe.editions contiene due chiavi 0 e 1 che pero' contengono gli stessi dati, cioe' tutti i testi di entrambe le edizioni
          // Quindi puntare a 0 o 1 e' indifferente
          let orig = getTextByVersion(
            data.timeframe.editions[0].forecast_data, 
            this.state.id_edition, 
            this.state.id_forecast_type, 
            offset_day_current_edition, // offsets_calcolati_2[1][0], // data.timeframe.editions[0].offsets.min, // this.state.offset_day,
            1);
          let edit = getTextByVersion(
            data.timeframe.editions[0].forecast_data, 
            this.state.id_edition, 
            this.state.id_forecast_type, 
            offset_day_current_edition, // offsets_calcolati_2[1][0], // data.timeframe.editions[0].offsets.min, // this.state.offset_day, 
            99);

          this.setState({
            showActions:            true,
            dirty:                  false,
            testi:                  data,

            offsets_calcolati_2:    offsets_calcolati_2,
            offset_day:             offset_day_current_edition,  // offsets_calcolati_2[1][0], //data.timeframe.editions[0].offsets.min,
            offsets:                offset_days_current_edition, // offsets_calcolati_2[1], // Array.from(Array( data.timeframe.editions[0].offsets.max)).map((e,i) => i + data.timeframe.editions[0].offsets.min),
            
            showSnackbar:           false,
            showDialog:             false,

            pickDate:               date_object,
            showDate:               getShowDate(date_object, offset_day_current_edition)
            // }, this.handleUpdateTextAreas); // () => {
            // }, () => this.setState({
            // pickDate:               date_object,
            // showDate:             new Date(new Date().setDate(date_object.getDate() + 1)).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
            // showDate:         new Date(new Date().setDate(this.state.pickDate.getDate() + 1)).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
            // .toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
            // new Date(new Date().setDate(this.state.pickDate.getDate() + 1)).toLocaleTimeString('it-it', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            }, this.handleUpdateTextAreas);
          // );
          // });
          // }, this.handleChips({keyCode: 32, target: {value: edit.text_lis}})); // this.handleCloseDialog);
          // console.log('handleChangePicker_dashboard - this.state: ', this.state);
          // });
          // console.log('handleChangePicker_dashboard - this.state: ', this.state);
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
    console.log('handleUpdateTextAreas - this.state.id_edition::::::::', this.state.id_edition);
    console.log('handleUpdateTextAreas - this.state.id_forecast_type::', this.state.id_forecast_type);
    console.log('handleUpdateTextAreas - this.state.offset_day::::::::', this.state.offset_day);
    try {
      // this.setState({
      // offset_day:       this.state.offsets_calcolati_2[this.state.id_edition][0],
      //   offsets:          this.state.offsets_calcolati_2[this.state.id_edition]
      // }, () => { // Come definire un blocco di codice come callback senza dover creare una funzione apposta
      // let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;

      if (this.state.testi.id_day == null) {
        this.setState({
          ita_orig:         'Nessun dato per la data selezionata',
          ita_edit:         'Nessun dato per la data selezionata',
          lis_orig:         'Nessun dato per la data selezionata',
          lis_edit:         'Nessun dato per la data selezionata'
        }); // , this.handleCloseDialog); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
      }
      else {
        let orig = getTextByVersion(
          this.state.testi.timeframe.editions[0].forecast_data,
          this.state.id_edition,
          this.state.id_forecast_type,
          this.state.offset_day,
          1);
        console.log('handleUpdateTextAreas - orig: ', orig);
        let edit = getTextByVersion(
          this.state.testi.timeframe.editions[0].forecast_data, 
          this.state.id_edition, 
          this.state.id_forecast_type, 
          this.state.offset_day, 
          99);
        console.log('handleUpdateTextAreas - edit: ', edit);
        this.setState({
          ita_orig:         orig.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          ita_edit:         edit.text_ita, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          lis_orig:         orig.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          lis_edit:         edit.text_lis, // }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          
          id_text_trans:    edit.id_text_trans,
          id_forecast_data: edit.id_forecast_data,

          id_text_trans:    edit.id_text_trans,
          id_forecast:      edit.id_forecast,
          id_forecast_data: edit.id_forecast_data,

          ita_id:           orig.id_text_ita, // });
          ita_edit_version: edit.it_version, // });
          ita_notes:        'Campo non estratto, da correggere', // })
          lis_id:           orig.id_text_lis, // });
          lis_edit_version: edit.it_version, // });
          lis_notes:        'Campo non ancora estratto',

          path_videogen:    edit.path_video, // /video_gen/mp4/sentence_07_06_2020_14_38_04.mp4
          justPreviewed:    false,
          justPublished:    false,
          // path_videogen:    null
        },
          this.handleChips({keyCode: 32, target: {value: edit.text_lis}})
        );
        // console.log('handleUpdateTextAreas - this.state.id_edition: ', this.state.id_edition);
        // console.log('handleUpdateTextAreas - this.state.id_forecast_type: ', this.state.id_forecast_type);
        // console.log('handleUpdateTextAreas - this.state: ', this.state);
      }
      // });
    } catch (error) {
      console.log('handleUpdateTextAreas catch - Error: ', error);
      // console.log('handleUpdateTextAreas catch - this.state.id_edition: ', this.state.id_edition);
      // console.log('handleUpdateTextAreas catch - this.state.id_forecast_type: ', this.state.id_forecast_type);
    }
  };

  
  // Ogni metodo di handle decide se mostrare la dialog o la snackbar
  handleOpenDialogChangePicker = (date_object) => {
    this.setState({
      dialogTitle:        'Attendere, caricamento...',
      dialogContent:      'Attendere, caricamento data ' + date_object,
      showDialog:         true,
      snackbarMessage:    'Attendere..',
      showSnackbar:       false,
      path_videogen:      null,
      // this.setState({
      // showDate: new Date(new Date().setDate(date_object.getDate() + this.state.offset_day)).toLocaleTimeString('it-it', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(',')[0]
      // });
    }, () => this.handleChangePicker_dashboard(date_object));
  };
  

  handleOpenDialogPublish = () => {
    this.setState({
      dialogTitle:        "Attendere, pubblicazione...",
      dialogContent:      "Attendere, pubblicazione...",
      showDialog: true,
      snackbarMessage:    'Attendere..',
      showSnackbar:       false
    }, this.handlePublish);
  };

  handleOpenDialogTranslate = () => {
    this.setState({
      dialogTitle:        "Attendere, traduzione...",
      dialogContent:      "Attendere, traduzione...",
      showDialog: true,
      snackbarMessage:    'Attendere..',
      showSnackbar:       false
    }, this.handleTranslate);
  };

  handleOpenDialogSave = () => {
    this.setState({
      dialogTitle:        "Attendere, caricamento anteprima...",
      dialogContent:      "Attendere, caricamento anteprima...",
      showDialog: false,
      snackbarAutoHideDuration: 20000, // 20 secondi invece di 2
      snackbarMessage:  'Attendere, salvataggio in corso..',
      showSnackbar: true
      // Il fatto che il metodo chiamato come cappello al salva, traduci ecc possa attivare la dialog non significa che la attivi sempre
      // per salva e anteprima per ora si preferisce non appesantire con la dialog bianca enorme
      // showDialog: false
    }, this.handleSave);
  };

  handleOpenDialogPreview = () => {
    this.setState({
      // dialogTitle:        "Attendere, caricamento anteprima...",
      // dialogContent:      "Attendere, caricamento anteprima...",
      
      snackbarAutoHideDuration: 20000, // 20 secondi invece di 2
      snackbarMessage:  'Attendere, anteprima in corso..',
      showSnackbar: true
      
      // Niente dialog per l'anteprima (preview) - c'e' gia' il progress (UPDATE - ci dovrebbe essere...vediamo)
      // showDialog: false
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
        this.state.id_edition,
        this.state.id_forecast_type,
        this.state.offset_day,
        99);
      this.setState({
        ita_edit:         last_edit.text_ita,
        lis_edit:         last_edit.text_lis,
        dirty:            false,
        justTranslated:   false
        }, this.handleChips({keyCode: 32, target: {value: last_edit.text_lis}})); // this.handleCloseDialog);
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
        this.setState({
          dirty:            false,
          justTranslated:   true,
          justPreviewed:    false,
          lis_edit:         p.translation },
          () => {
            this.handleChips({keyCode: 32, target: {value: p.translation}});
            this.handleCloseDialog(); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
          }
        )
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
    console.log('Dashboard handlePreview - creazione anteprima');
    console.log('Dashboard handlePreview - non salva nulla su DB');
    console.log('Dashboard handlePreview - parte un setInterval che fa vedere la rotella nel video');
    
    this.dispatch({
      StartObserve: { // I metodi Start e Stop hanno gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
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
      previewing:       true,
      justPreviewed:    false,
      path_videogen:    ''
      // showVideoPreview: true // Doveva servire per visualizzare o meno l'anteprima - non piu' usato, il player video e' visibile sempre
    }, () => {
      var keepVideoLoading = setInterval(function() {
        document.getElementById("meteo_video").load();
      }, 1000);
      // var h = 
      fetch(
        "/api/values/preview",
        {
          signal: this.mySignal,
          method: 'POST',
          // body: "'"+JSON.stringify({value: btoa('mostra perfetto bambino alto tutti_e_due ciascuno spiegare accordo esperienza suo avere')})+"'",
          body: "'"+JSON.stringify(
            {
              ...this.state.sign_json,
              filename: 
                ("0" + 
                this.state.pickDate.getDate()).slice(-2) + 
                "-" + 
                ("0"+(this.state.pickDate.getMonth()+1)).slice(-2) + 
                "-" +
                this.state.pickDate.getFullYear() + 
                " " + 
                ("0" + this.state.pickDate.getHours()).slice(-2) + 
                "_" + 
                ("0" + this.state.pickDate.getMinutes()).slice(-2) +
                '_edizione_' + 
                this.state.id_edition + 
                '_id_forecast_type_' + 
                this.state.id_forecast_type
            }
          )+"'",
          headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(p => {
        clearInterval(keepVideoLoading);
        console.log('handlePreview - Risultato preview POST: ' , p);
        // paaa = p.output_preview;
        this.dispatch({
          StopObserve: { // Il metodo Stop ha gli stessi parametri di Save ma solo per comodita' di implementazione, non servono
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
          // path_postergen: p.output_preview + '.jpg',
          path_videogen: p.output_preview + '.mp4',
          justPreviewed: true,
          previewing:    false,
          snackbarAutoHideDuration: 2000 // Rimetti a 2 secondi
        }, this.handleCloseSnackBar); // this.handleCloseDialog); // Niente dialog per la preview - c'e' gia' il progress circolare
      }).catch(error => {
        console.log('handlePreview - preview Error: ', error);
        clearInterval(keepVideoLoading);
      });
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
    console.log('Dashboard handlePublish - creazione text_trad');
    // console.log('Dashboard handlePublish - pulizia text_ita: ', this.state.ita_edit.replace(/'/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"));
    fetch(
      "/api/values/text_trad", // La chiamata text_trad salva la coppia di testi e l'aggancio nella text_trans e text_trans2
      {
        signal: this.mySignal,
        method: 'POST',
        body: "'"+JSON.stringify({
          IdUserEdit: 3,
          IdForecast: this.state.id_forecast,
          IdForecastType: this.state.id_forecast_type,
          IdForecastData: this.state.id_forecast_data,
          IdTextIta: this.state.ita_id,
          TextIta: this.state.ita_edit.replace(/'/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"), //"Provaaaa_manda_a_dashboard",
          VersionIta: this.state.ita_edit_version,
          NotesIta: "Provaaa_note_ita dashboard ", // + this.state.ita_edit.replace(/'/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"),
          IdTextLis: this.state.lis_id,
          TextLis: this.state.lis_edit,
          VersionLis: this.state.lis_edit_version,
          NotesLis: "Provaaa_note_lis dashboard " + this.state.lis_edit
        })+"'",
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => res.json())
      .then(p => {
        console.log('Dasboard handlePublish - Risultato text_trad POST: ', p);
        console.log('Dashboard handlePublish - creazione request - bisogna passare l\'id_text_trans nella trans2');
        // return Ok("{\"id_text_trans\": \"" + lastId + "\"}");
        fetch(
          "/api/values/request",
          {
            signal: this.mySignal,
            method: 'POST',
            body: "'"+JSON.stringify({
              name_video: // this.state.videoName,
                ("0" + 
                this.state.pickDate.getDate()).slice(-2) + 
                "-" + 
                ("0"+(this.state.pickDate.getMonth()+1)).slice(-2) + 
                "-" +
                this.state.pickDate.getFullYear() + 
                " " + 
                ("0" + this.state.pickDate.getHours()).slice(-2) + 
                "_" + 
                ("0" + this.state.pickDate.getMinutes()).slice(-2) +
                '_edizione_' + 
                this.state.id_edition + 
                '_id_forecast_type_' + 
                this.state.id_forecast_type,
              id:         p.id_text_trans,                   // this.state.id_text_trans, // e' sulla trans2
              path_video: this.state.path_videogen,  // '/path/to/video_idtrans'+this.state.id_text_trans,
              // L'ultimo video generato
              // Passare solo il nome file con path.replace(/^.*[\\\/]/, '') se si vuole copiarlo o rinominarlo
              notes:    "Note_request handlePublish id_text_trans: " + p.id_text_trans + " - Attenzione, questo e l id sulla trans2"
          })+"'",
          headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(p => {
          console.log('Dashboard handlePublish - Risultato request POST: ', p);
          console.log('Dashboard handlePublish - publish');
          fetch(
            "/api/values/publish",
            {
              signal: this.mySignal,
              method: 'POST',
              body: "'"+JSON.stringify(
              {
                ita:  this.state.ita_edit.replace(/'/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"), //"Provaaaa_manda_a_dashboard",      // testo ita da salvare prima su txt
                name: this.state.path_videogen.replace(/^.*[\\\/]/, '').split('.')[0] // nome del file - adesso e' la URL completa, va corretto..
              }
            )+"'",
            headers: {'Content-Type': 'application/json'}
          })
          // .then(res => res.json())
          .then(response => response.text()) 
          .then(p => {
            console.log('Dashboard handlePublish - Risultato request POST: ', p);
            /*
            this.setState({
              // ita_edit_version: this.state.ita_edit_version + 1,
              // lis_edit_version: this.state.lis_edit_version + 1,
              // id_text_trans:    p.id_text_trans,
              dirty:            false,
              justSaved:        true,
              justPublished:    true
            }, this.handleCloseDialog);
            */
            location.hostname === "localhost" ?
              window.open('ftp://anonymous:anonymous@localhost/','ftp','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350')
            :
              window.open('ftp://rai_meteo_lis:Corso_Giambone_68@10.54.131.143/','ftp','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
            this.setState({
              ita_edit_version: this.state.ita_edit_version + 1,
              lis_edit_version: this.state.lis_edit_version + 1,
              id_text_trans:    p.id_text_trans,
              dirty:            false,
              justSaved:        true,
              justPublished:    true
            }, () => {
                this.handleCloseDialog();
                this.handleChangePicker_dashboard(this.state.pickDate);
              }
              ); // }, this.handleCloseSnackbar);
          })
          .catch(error => {
            console.log('Dashboard handlePublish - POST publish Error: ', error);
          });
      })
      .catch(error => {
        console.log('Dashboard handlePublish - POST request Error: ', error);
      });
    })
    .catch(error => {
      console.log('Dashboard handlePublish - POST text_trad Error: ', error);
    });
  };

  render() {
    let { dirty, showActions, justTranslated, justSaved, justPreviewed, justPublished, TextITA } = this.state;

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

    const handleEditIta1 = (event) => {
      console.log('handleEditIta1 - event: ', event);
      this.setState({
        dirty: true,
        ita_edit: event.target.value
      });
    };

    const handleEditLis1 = (event) => {
      console.log('handleEditLis1 - event: ', event);
      this.setState({
        dirty: true,
        lis_edit: event.target.value
      }, this.handleChips(event));
      // }, this.handleChips({keyCode: 32, target: {value: this.state.lis_edit}})); // this.handleCloseDialog);
    };

    const RenderConsoleLog = ({ children }) => {
      console.log('TablePage RenderConsoleLog: ', children);
      return false;
    };

    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <BasePage title="Meteo" navigation="Applicazione / Meteo">
          <React.Fragment>
          { location.hostname === "localhost" ?
            <div className="mr-auto">
              Pickdate: {this.state.pickDate.toString()}<br />
              Offset_day: {this.state.offset_day}<br />
              Offsets: {this.state.offsets.join(',')}<br />
              Offset calc2: {this.state.offsets_calcolati_2.join(',')}<br />
              Id edition: {this.state.id_edition}<br />
              ID forecast type: {this.state.id_forecast_type}<br />
              ID forecast: {this.state.id_forecast}<br />
              ID forecast data: {this.state.id_forecast_data}<br />
            </div>
          : null }
            <div>
              <RenderConsoleLog>{this.state}</RenderConsoleLog>
              <Tabs style={{width: '100%', float: 'left'}}>
                <Tab style={{fontSize: 18, fontWeight: 'bold', textTransform: 'none' }} buttonStyle={{paddingLeft: '55px', alignItems: 'flex-start'}} label={'Previsione per ' + this.state.showDate}></Tab>
              </Tabs>
              <Toolbar style={{
                backgroundColor: 'rgb(0, 188, 212)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '48px',
                paddingLeft: '60px',
              }}>
              {/* ref={this.datepick_focus} */}
                <ToolbarGroup firstChild={true} style={{paddingLeft: 10, padding: 10, color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  <ToolbarTitle text={"Dati televideo di " + this.state.pickDate.toLocaleDateString([], {  weekday: 'long'}) } style={{paddingLeft: 20, padding: 10, color: 'white', fontSize: 18, fontWeight: 'bold', float: 'left'}} />
                  <DatePicker value={this.state.pickDate} onChange={this.handleChangePicker_dashboard} />
                  <ToolbarSeparator />
                  <ToolbarTitle text="Estrazione delle" style={{paddingLeft: 10, padding: 10, color: 'white', fontSize: 18, fontWeight: 'bold', float: 'left'}} />
                  <Tabs style={{width: '10%', float: 'left'}} value={this.state.id_edition} onChange={this.handleChangeEditionId_tab}>
                    <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="09:30" value={1} disabled={this.state.id_edition === 1}></Tab>
                    <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="17:30" value={3} disabled={this.state.id_edition === 3}></Tab>
                  </Tabs>
                  { this.state.id_forecast_type == 7 && this.state.offsets.length > 0 ?
                  <React.Fragment>
                    <ToolbarSeparator />
                    <ToolbarTitle text="Giorno" style={{width: '30%', float: 'right', padding: 10}} />
                    <DropDownMenu value={this.state.offset_day} onChange={this.handleChangeOffsetDay} labelStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                      {this.state.offsets.map(item => <MenuItem key={item} value={item} primaryText={'+' + item} />)}
                    </DropDownMenu>
                  </React.Fragment>
                  : null}
                  {/*<ToolbarSeparator />*/}
                  <ToolbarTitle text="" style={{width: '10%', paddingLeft: 10, padding: 10, color: 'white', fontSize: 18, fontWeight: 'bold', float: 'left'}} />
                </ToolbarGroup>
              </Toolbar>

              <Tabs style={{width: '100%', float: 'left'}} value={this.state.id_forecast_type} onChange={this.handleChangeForecastTypeId_tab} ref={this.tabforecast_focus}>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="NORD" value={1} disabled={this.state.id_forecast_type === 1}></Tab>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="CENTRO E SARDEGNA" value={2} disabled={this.state.id_forecast_type === 2}></Tab>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="SUD E SICILIA" value={3} disabled={this.state.id_forecast_type === 3}></Tab>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="TEMPERATURE" value={4} disabled={this.state.id_forecast_type === 4}></Tab>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="VENTI" value={5} disabled={this.state.id_forecast_type === 5}></Tab>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="MARI" value={6} disabled={this.state.id_forecast_type === 6}></Tab>
                <Tab style={{fontSize: 18, fontWeight: 'bold'}} label="TUTTA ITALIA" value={7} disabled={this.state.id_forecast_type === 7}></Tab>
              </Tabs>

              <div className="row">
                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 m-b-15 ">
                  {/*
                  <div style={dashboardStyles.buttons}>
                    <div style={globalStyles.navigation}>Testo ITA originale{this.state.ita_edit_version ? ' (versione 1)' : '' }:</div>
                  </div>
                  <label>{this.state.ita_orig}</label>
                  */}
                  <div style={dashboardStyles.buttons}>
                    <CardExampleExpandable title={"Testo ITA originale" + (this.state.lis_edit_version ? " (versione 1)" : "") } subtitle="Cliccare per espandere" text={this.state.ita_orig} />
                    <div style={globalStyles.navigation}>Testo ITA editato{this.state.ita_edit_version ? ' (versione ' + this.state.ita_edit_version + ')' : '' }:</div>
                    <TextareaAutosize
                      cols={34}
                      rows={26}
                      maxRows={25}
                      minRows={3}
                      id='myTextarea' 
                      style={{overflowY: 'scroll'}}
                      value={this.state.ita_edit}
                      onChange={handleEditIta1}
                    />
                    <br />
                    {TextITA}
                    { showActions ?
                    <React.Fragment>
                      <RaisedButton label="Annulla"         onClick={this.handleCancel}              style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true} disabled={!dirty && !justTranslated} />
                      <RaisedButton label="Traduci"         onClick={this.handleOpenDialogTranslate} style={dashboardStyles.buttonStyle} labelStyle={dashboardStyles.buttonLabel} primary={true} />
                    </React.Fragment>
                    : null}
                  </div>
                </div>

                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 m-b-15 ">
                  <div style={dashboardStyles.buttons}>
                    <CardExampleExpandable title={"Testo LIS originale" + (this.state.lis_edit_version ? " (versione 1)" : "") } subtitle="Cliccare per espandere" text={this.state.lis_orig} />
                    <div style={globalStyles.navigation}>Testo LIS editato{this.state.lis_edit_version ? ' (versione ' + this.state.lis_edit_version + ')' : '' }:</div>
                    <TextareaAutosize
                      cols={34}
                      rows={26}
                      maxRows={25}
                      minRows={3}
                      style={{overflowY: 'scroll'}}
                      value={this.state.lis_edit}
                      onChange={handleEditLis1}
                      onKeyDown={handleEditLis1}
                      onKeyPress={handleEditLis1}
                    />
                    {/*this.state.TextLIS*/}
                    <ChipExampleSimple1 chips={this.state.chips}/>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15 ">
                  <div style={dashboardStyles.buttonLabel}> {/* width="560" height="440" style={dashboardStyles.buttonLabel}> */}
                    <video id="meteo_video" controls autoPlay={true} key={this.state.path_videogen}><source src={this.state.path_videogen} /></video><br />
                    <RaisedButton label="Anteprima" onClick={this.handleOpenDialogPreview} style={{float: 'left'}}  labelStyle={dashboardStyles.buttonLabel} primary={true} disabled={!this.state.allWordsFound || this.state.previewing} />
                    {/* <RaisedButton label="Pubblica"  onClick={this.handleOpenDialogSave}    style={{float: 'right'}} labelStyle={dashboardStyles.buttonLabel} primary={true} disabled={!justPreviewed} /> */}
                    <RaisedButton label="Pubblica"  onClick={this.handleOpenDialogPublish}    style={{float: 'right'}} labelStyle={dashboardStyles.buttonLabel} primary={true} disabled={!this.state.allWordsFound || this.state.previewing || !justPreviewed || justPublished} />
                  </div>
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
          </React.Fragment>
        </BasePage>
      </MuiThemeProvider>
    );
  };
};

export default Dashboard;
