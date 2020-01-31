import React from 'react';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Downloadicon from 'material-ui/svg-icons/file/cloud-download';
import Uploadicon from 'material-ui/svg-icons/file/cloud-upload';
import Latencyicon from 'material-ui/svg-icons/notification/network-check';
import Usericon from 'material-ui/svg-icons/action/face';
import Dateicon from 'material-ui/svg-icons/action/alarm';
import { cyan600, pink600, purple600, orange600 } from 'material-ui/styles/colors';
import InfoBox from '../components/dashboard/InfoBox';
import Traffic from '../components/dashboard/Traffic';
import ServerUsage from '../components/dashboard/ServerUsage';
import { Utilization , NewUtilization_new } from '../components/dashboard/Utilization';
import RecentActivities from '../components/dashboard/RecentActivities';
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
// import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
// import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
// import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
import Toggle from 'material-ui/Toggle';
// import {Snackbar, SnackbarBody } from 'material-ui/Snackbar';
import Snackbar from 'material-ui/Snackbar';

const FullRoster = () => (
  <div>
    hello
  </div>
)

const Schedule = () => (
  <div>
    <ul>
      <li>6/5 @ Evergreens</li>
      <li>6/8 vs Kickers</li>
      <li>6/14 @ United</li>
    </ul>
  </div>
)

const Home = () => (
  <div>
    <h1>Welcome to the Tornadoes Website!</h1>
  </div>
)

const Roster = () => (
  <div>
    Roster Page
  </div>
)

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/roster' component={Roster}/>
      <Route exact path='/schedule' component={Schedule}/>
    </Switch>
  </main>
)

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/roster'>Roster</Link></li>
        <li><Link to='/schedule'>Schedule</Link></li>
      </ul>
    </nav>
  </header>
)

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const PopoverStyle = {
	top: '50px'
};

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.vm = dotnetify.react.connect('Dashboard', this, {
      exceptionHandler: ex => {
        // alert(ex.message);
        console.log('Dashboard exceptionHandler: ', ex);
        auth.signOut();
      }
    });
    this.dispatch = state => this.vm.$dispatch(state);

    this.state = {
      dirty:            false,
      success:          true,
      pop_open:         false,
      showSnackbar:     true,
      Traffic:          [],
      ServerUsage:      [],
      ServerUsageLabel: [],
      Utilization:      [],
      UtilizationLabel: [],
      UtilizationLabel1: 'Testo ITA originale',
      UtilizationLabel2: 'Testo LIS originale',
      RecentActivities: [],
      
      pickDate:         new Date(), // .toISOString().split('T')[0],
      edition_id:       1, 
      forecast_id:      1,
      testi:            null,
      // this.state.testi.timeframe.editions
      ita_id:           0,
      ita_orig:         'Attendere..',
      ita_edit:         'Attendere..',
      ita_edit_version: 0,
      ita_notes:        '',

      lis_id:           0,
      lis_orig:         'Attendere..',
      lis_edit:         'Attendere..',
      lis_edit_version: 0,
      lis_notes:        '',

      centro_ita_orig:  '',
      centro_ita_edit:  '',
      centro_lis_orig:  '',
      centro_lis_edit:  '',

      sud_ita_orig:     '',
      sud_ita_edit:     '',
      sud_lis_orig:     '',
      sud_lis_edit:     '',
      value:             1, 
      value_tab:        'a', 
      value_tab1:        3, 
      value_area:        1,
      value_ed:          1, //'09:30',
      num1:              0, 
      num2:              0,
      sum :              0,
      toggle1:           false,
      toggle2:           false,
      BottomNavigationSelectedIndex: 0
/*
,
      handleChangeEd: function(e) {
              console.log(e.target.value);
              this.setState({edition_id: e.target.value});
              this.handleSubmitEd(e.target.value);
          },
      handleSubmitEd: function(edition_id) {
        this.props.onChange(edition_id);
      },
*/
    };
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
    this.onChildClicked = this.onChildClicked.bind(this);
    // this.onClickp = this.onClickp.bind(this);
    this.handleChangePicker_child = this.handleChangePicker_child.bind(this);
    this.handleChangeEditionTab = this.handleChangeEditionTab.bind(this);
    this.handleChangeToolbarEd = this.handleChangeToolbarEd.bind(this);

    this.handleEditIta = this.handleEditIta.bind(this);
    this.handleEditLis = this.handleEditLis.bind(this);
    this.setNum1 = this.setNum1.bind(this);
    this.setNum2 = this.setNum2.bind(this);
    // console.log('Dashboard constructor - props.userid: ', props.userid); // Non funziona
  }

  componentWillUnmount() {
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
    // this.setState({ forecast_id: 1 }); // Azzera il selettore nella toolbar a NORD
    /*
    fetch("http://localhost:5000/api/values/meteo/2020-01-09")
      .then((response) => {
        console.log('Fetch componentDidMount response: ', response);
        return response.json();
      })
      .then(data => {
        console.log('Fetch componentDidMount JSON.stringify(data): ', JSON.stringify(data));
        console.log('Data del datepicker: ', this.state.pickDate);
        // let teamsFromApi = data.map(team => { return {value: team, display: team} })
        // this.state.ff = 
        this.setState({ ita: JSON.stringify(data)}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        this.setState({ lis: JSON.stringify(data)}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
      })
      .catch(error => {
        console.log(error);
      });
      */
  };

/*
handleSubmit: function(txt) {
        this.props.onChange(txt);
    },
    handleChange: function(e) {
        console.log(e.target.value);
        this.setState({message: e.target.value});
        this.handleSubmit(e.target.value);
    },

*/
/*
  handleChange: function(e) {
        console.log(e.target.value);
        this.setState({message: e.target.value});
        this.handleSubmit(e.target.value);
    },
*/
// handleSubmitEd


  handleChangeToolbarEd = (event, index, value) => {
    console.log('handleChangeToolbarEd - value: ', value);
    // this.setState({ value_ed: value});
    this.setState({ edition_id: value }, this.handleChangeEditionTab);
    // this.handleChangeEditionTab(value);
  }

  handleChangeToolbarArea = (event, index, value) => {
    console.log('handleChangeToolbarArea - value: ', value);
    // this.setState({ value_area: value });
    this.setState({ forecast_id: value }, this.handleChangeEditionTab); //.id});
    // this.handleChangeEditionTab(7);
  }

  BottomNavigationSelect = (index) => {
    console.log('BottomNavigationSelect - index: ', index);
    this.setState({BottomNavigationSelectedIndex: index});
  }

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
    this.setState({ pickDate: date1 })

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
    fetch(url) //2019-12-23") // + date.toISOString().split('T')[0].trim()) // aggiungere la data // new Date().toISOString().split(' ')[0]
      .then((response) => {
        return response.json();
      })
      .then(data => {
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
        this.setState({ testi:            data }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        //this.setState({ ita: data[1].NORD}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        //this.setState({ lis: data[0]['CENTRO E SARDEGNA']}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
        
        // this.setState({ edition_id: 1 });

        // this.setState({ forecast_id: 1 }); // Azzera il selettore nella toolbar a NORD
        let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
        // console.log('handleChangeEditionTab - forecast_data: ', forecast_data);
        // console.log('handleChangeEditionTab - forecast_data filter: ', forecast_data.filter(function(data){return data.edition == 1}));
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
            .filter(data => {return data.id_forecast_type == this.state.forecast_id}) // value e' il forecast_id per adesso
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
        console.log('handleChangePicker_dashboard - this.state: ', this.state);
      })
      .catch(error => {
        console.log('handleChangePicker_dashboard - Error: ', error);
      });
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

  handleChangeEditionTab = (i) => {
/*
    if( i == 1 ) {
      console.log('handleChangeEditionTab - i: ', i);
      // console.log('handleChangeEditionTab - Selezione edition_id 1');
      this.setState({  value_tab: i });
      // this.setState({  edition_id: 3 });
      // this.setState({  value_tab1: 3 });
      // this.setState({ edition_id: 1 });
      console.log('handleChangeEditionTab - this.state.edition_id: ', this.state.edition_id);
      console.log('handleChangeEditionTab - this.state.value_tab1: ', this.state.value_tab1);
    }
    else if( i == 3 ) {
      console.log('handleChangeEditionTab - i: ', i);
      // console.log('handleChangeEditionTab - Selezione edition_id 3');
      this.setState({  value_tab: i });
      // this.setState({  edition_id: 1 });
      this.setState({  value_tab1: 1 });
      // console.log('handleChangeEditionTab - this.state.edition_id: ', this.state.edition_id);
      // console.log('handleChangeEditionTab - this.state.value_tab1: ', this.state.value_tab1);
    }


    if( i == 'a') {
      console.log('handleChangeEditionTab - i: ', i);
      // console.log('handleChangeEditionTab - Selezione edition_id 1');
      this.setState({  value_tab: i });
      this.setState({  edition_id: 1 });
      this.setState({  value_tab1: 1 });
      // this.setState({ edition_id: 1 });
      console.log('handleChangeEditionTab - this.state.edition_id: ', this.state.edition_id);
      console.log('handleChangeEditionTab - this.state.value_tab1: ', this.state.value_tab1);
    }
    else if( i == 'b') {
      console.log('handleChangeEditionTab - i: ', i);
      // console.log('handleChangeEditionTab - Selezione edition_id 3');
      this.setState({  value_tab: i });
      this.setState({  edition_id: 3 });
      this.setState({  value_tab1: 3 });
      console.log('handleChangeEditionTab - this.state.edition_id: ', this.state.edition_id);
      console.log('handleChangeEditionTab - this.state.value_tab1: ', this.state.value_tab1);
    }
*/

    // this.setState({ edition_id: i });
    console.log('handleChangeEditionTab - this.state.edition_id: ', this.state.edition_id);
    console.log('handleChangeEditionTab - this.state.forecast_id: ', this.state.forecast_id);
    // this.setState({ forecast_id: 1 }); // Azzera il selettore nella toolbar a NORD
    try {
      let forecast_data = this.state.testi.timeframe.editions[0].forecast_data;
      // console.log('handleChangeEditionTab - forecast_data: ', forecast_data);
      // console.log('handleChangeEditionTab - forecast_data filter: ', forecast_data.filter(function(data){return data.edition == 3}));
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
        console.log('handleChangeEditionTab - this.state.edition_id: ', this.state.edition_id);
        console.log('handleChangeEditionTab - this.state.forecast_id: ', this.state.forecast_id);
        console.log('handleChangeEditionTab - this.state: ', this.state);
    } catch (error) {
      console.log('handleChangeEditionTab catch - Error: ', error);
      console.log('handleChangeEditionTab catch - this.state.edition_id: ', this.state.edition_id);
      console.log('handleChangeEditionTab catch - this.state.forecast_id: ', this.state.forecast_id);
    }
  };
  /*
    } catch (error) {
      console.log('handleChangeEditionTab - Error: ', error);
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

  onChildClicked = _ => {
    // this.props.click(this.props.id);
    // console.log('onChildClicked - _: ', _);
    // this.setState({ ita: this.state.testi[0]['CENTRO E SARDEGNA']});
    // this.setState({ lis: this.state.testi[1]['NORD']}); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ ita_orig: this.state.centro_lis_orig }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ ita_edit: this.state.centro_ita_edit }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ lis_orig: this.state.centro_lis_orig }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
    this.setState({ lis_edit: this.state.centro_lis_edit }); // { teams: [{value: '', display: '(Select your favourite team)'}].concat(teamsFromApi) });
  };

  onClickp(id) {
    console.log(id);
  };

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

  

  handleProfileDropDown(e) {
		e.preventDefault();
		this.setState({
			pop_open: !this.state.pop_open,
			anchorEl: e.currentTarget,
		});
	}

	handleRequestClose() {
    	this.setState({
      		pop_open: false,
    	});
    };


    uncheckAllToggle = () => {
      this.setState({
        toggle1: false, 
        toggle2: false
      });
    }










  render() {
    // let { dirty, value_tab, edition_idn } = this.state;
    let { dirty } = this.state;
    // let value_tabb = value_tab;
    const styles = {
      buttons: {
        marginTop: 30,
        // float: 'right'
        float: 'left'
      },
      stickToBottom: {
          width: '100%',
          position: 'fixed',
          bottom: 0,
        },
      saveButton: { marginLeft: 5 }
    };

/*
const styles = {
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
};
And then applying it to your BottomNavigation component:

<BottomNavigation className={classes.stickToBottom}></BottomNavigation>
*/



    // console.log('handleChangeEditionTab - edition_id: ', edition_id);

/*
    const handleChangeEditionTab1 = (i) => {
      console.log('handleChangeEditionTab1 - i: ', i);
      this.setState({ edition_idn: 1 });
      if( i == 'a') {
        console.log('handleChangeEditionTab1 - i: ', i);
        // console.log('handleChangeEditionTab - Selezione edition_id 1');
        this.setState({ value_tab: i });
        this.setState({ edition_idn: 1 });
        // console.log('handleChangeEditionTab1 - edition_id: ', edition_id);
      }
      else if( i == 'b') {
        console.log('handleChangeEditionTab1 - i: ', i);
        // console.log('handleChangeEditionTab - Selezione edition_id 3');
        this.setState({ value_tab: i });
        this.setState({ edition_idn: 3 });
        // console.log('handleChangeEditionTab1 - edition_id: ', edition_id);
      }
      console.log('handleChangeEditionTab1 - value_tab: ', value_tab);
      console.log('handleChangeEditionTab1 - edition_idn: ', edition_idn);
    };
*/

    const handleCancel = _ => {
      // this.dispatch({ Cancel: Id });
      // this.setState({ dirty: false });
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
      this.setState({ ita_orig: 'Attendere..handleSave' });
      this.dispatch({ Save: {
        IdUserEdit: 2,
        IdTextIta: this.state.ita_id, // Gli ID dei testi sia ita che lis servono perche' non deve essere creato un nuovo ID - bisogna riutilizzare quello che c'e'!!
        VersionIta: this.state.ita_edit_version, // Va aumentato di 1 sia nella INSERT sia in interfaccia
        TextIta: this.state.ita_edit, //"Provaaaa_manda_a_dashboard",
        NotesIta: "Provaaa_note_ita",
        IdTextLis: this.state.lis_id,
        VersionLis: this.state.lis_edit_version,
        TextLis: this.state.lis_edit, //"Provaaaa_manda_a_dashboard",
        NotesLis: "Provaaa_note_lis"
      } });
      this.setState({ dirty: false });
    };

    const handleClickOpenSnackBar = () => {
      // setOpen(true);
      this.setState({showSnackbar: true});
    };

    const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      // setOpen(false);
      this.setState({showSnackbar: false});
    };


    /*
              This is a success message!
            </SnackbarBody>
          </Snackbar>

          
var SnackbarBody = function SnackbarBody(props, context) {
  var action = props.action,
      contentStyle = props.contentStyle,
      message = props.message,
      open = props.open,
      onActionTouchTap = props.onActionTouchTap,
      style = props.style,
      other = (0, 


<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            
          </Snackbar>


          <Snackbar
        open
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={<span >asdsadsa</span>}
      />
      onClose={()=>{this.setState({dirty:false})}}


      message: _propTypes2.default.node.isRequired,
   * Fired when the action button is touchtapped.
   *
   * @param {object} event Action button event.
  onActionTouchTap: _propTypes2.default.func,
   * @ignore
   * Controls whether the `Snackbar` is opened or not.
  open: _propTypes2.default.bool.isRequired,
   * Override the inline-styles of the root element.
  style: _propTypes2.default.object,
   * @ignore
   * Width of the screen.
  width: _propTypes2.default.number.isRequired

  <Snackbar
action={handleClick}
open={true}
message="ergegeg">
<SnackbarBody message="dssdsd" open={true} width="100%" />
</Snackbar>

onRequestClose={() => {this.setState({showSnackbar: false})}}
style={{width: 400, float: 'right'}}


  handleChangeToolbarEd = (event, index, value) => {
    console.log('handleChangeToolbar - value: ', value);
    this.setState({value_ed});
  }

  handleChangeToolbarArea
*/
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Toolbar>
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle text="Selezione data" />
              <DatePicker value={this.state.pickDate} onChange={this.handleChangePicker_dashboard} />
              <ToolbarSeparator />
              <ToolbarTitle text="Selezione edizione" />
              <DropDownMenu value={this.state.edition_id} onChange={this.handleChangeToolbarEd}>
                <MenuItem value={1} primaryText="09:30" />
                <MenuItem value={2} primaryText="17:30" disabled={true}/>
                <MenuItem value={3} primaryText="18:30" />
              </DropDownMenu>
              <ToolbarTitle text="Selezione area" />  
              <DropDownMenu value={this.state.forecast_id} onChange={this.handleChangeToolbarArea}>
                <MenuItem value={1} primaryText="NORD" />
                <MenuItem value={2} primaryText="CENTRO E SARDEGNA" />
                <MenuItem value={3} primaryText="SUD E SICILIA" />
                <MenuItem value={4} primaryText="TEMPERATURE" />
                <MenuItem value={5} primaryText="VENTI" />
                <MenuItem value={6} primaryText="MARI" />
                <MenuItem value={7} primaryText="TUTTA ITALIA" />
              </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarTitle text="Opzioni" />
              <FontIcon className="muidocs-icon-custom-sort" />
              <ToolbarSeparator />
              <RaisedButton label="Crea Video" primary={true} />
              <IconMenu
                iconButtonElement={
                  <IconButton touch={true}>
                    <NavigationExpandMoreIcon />
                  </IconButton>
                }
              >
                <MenuItem primaryText="Download" />
                <MenuItem primaryText="More Info" />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>
          { /*
          <Toolbar> {/*  style={{ position: 'fixed'}} > * /}
            <ToolbarGroup firstChild={true}>
              <DatePicker value={this.state.pickDate} onChange={this.handleChangePicker_dashboard} />
              <DropDownMenu value={this.state.value_tab1} onChange={this.handleChangeToolbar}>
                <MenuItem value={0} primaryText={'NORD'} />
              </DropDownMenu>
            </ToolbarGroup>
            <MenuItem value={2} primaryText="CENTRO E SARDEGNA" />
                <MenuItem value={3} primaryText="SUD E SICILIA" />
                <MenuItem value={4} primaryText="TEMPERATURE" />
                <MenuItem value={5} primaryText="VENTI" />
                <MenuItem value={6} primaryText="MARI" />
                <MenuItem value={7} primaryText="SU TUTTA L'ITALIA 1" />
                <MenuItem value={8} primaryText="SU TUTTA L'ITALIA 2" />
          <ToolbarGroup>
            <ToolbarTitle text="Options" />
            <FontIcon className="muidocs-icon-custom-sort" />
            <ToolbarSeparator />
            <RaisedButton label="Create Broadcast" primary={true} />
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="Download" />
              <MenuItem primaryText="More Info" />
            </IconMenu>
          </ToolbarGroup>
|| this.state.testi === null || this.state.testi.timeframe.editions.length != 2
value={this.state.value_tab1} 
disabled={this.state.edition_id === 1}
disabled={this.state.edition_id === 3}
</Toolbar>
*/}
{/*
          <Tabs style={{width: '100%', float: 'left'}} value={this.state.value_tab} onChange={this.handleChangeEditionTab}>
            <Tab label={"Edizione 1 (09:00)"} value="a" ></Tab>
            <Tab label={"Edizione 2 (18:30)"} value="b" ></Tab>
          </Tabs>
*/  }
{/*
          <Tabs style={{width: '100%', float: 'left'}} value={this.state.value} onChange={this.handleChangeEditionTab}>
            <Tab label="NORD" value="a" disabled={this.state.value === 'a'}></Tab>
            <Tab label="CENTRO" value="b" disabled={this.state.value === 'b'}></Tab>
            <Tab label="SUD" value="c" disabled={this.state.testi === null || this.state.testi.timeframe.editions.length != 3}></Tab>
          </Tabs>

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
              <h3 style={globalStyles.navigation}>Scegliere una data dal picker<br />(dovrebbe essere automaticamente popolato con la data corrente)</h3>
              <div>
                <DatePicker onChange={this.onChangeDate} value={this.state.pickDate} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
              <h3 style={globalStyles.navigation}>Selezione area meteo <br />(dovrebbe essere automaticamente selezionato NORD all'avvio)</h3>
              <ul>
                <li onClick={(e) => this.handleChangeArea_dashboard(1, 1)} id={1}><a>Nord</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(2, 1)} id={2}><a>Centro</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(3, 1)} id={3}><a>Sud</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(4, 1)} id={4}><a>Temperature</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(5, 1)} id={5}><a>Venti</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(6, 1)} id={6}><a>Mari</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(7, 2)} id={7}><a>Su tutta Italia_1</a></li>
                <li onClick={(e) => this.handleChangeArea_dashboard(7, 3)} id={7}><a>Su tutta Italia_2</a></li>
              </ul>
            </div>
          </div>
<div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
              <h3 style={globalStyles.navigation}>Selezione toggle</h3>
      <Toggle
        label="toggle1"
        toggled={this.state.toggle1}
        onToggle={() => this.setState({toggle1: !this.state.toggle1})}
      />
      <Toggle
        label="toggle2"
        toggled={this.state.toggle2}
        onToggle={() => this.setState({toggle2: !this.state.toggle2})}
      />
     <FlatButton
       label={'UnCheck All Toggle'}
       onClick={this.uncheckAllToggle}
     />
                </div>
          </div>
  this.handleChangeEditionTab}
onChange={this.handleChangeEditionTab.bind(this)}
onChange={handleChangeEditionTab1}
onChange={() => this.handleChangeEditionTab}
*/}
{ /*
        <Tabs
              style={{width: '100%', float: 'left'}}
              value={value_tab}
              onChange={handleChangeEditionTab1}
          >
        <Tab label="Edizione 1" value="a" disabled={value_tab === "a"}>
          { /*<div>
            <h2 style={styles.headline}>Controllable Tab A</h2>
            <p>
              Tabs are also controllable if you want to programmatically pass them their values.
              This allows for more functionality in Tabs such as not
              having any Tab selected or assigning them different values.
            </p>
          </div>* /}
        </Tab>
        <Tab label="Edizione 3" value="b" disabled={value_tab === "b"}>
          { /*<div>
            <h2 style={styles.headline}>Controllable Tab B</h2>
            <p>
              Enter in two numbers
            </p>
             <TextField hintText="Number 1" onChange={this.setNum1} /><br/>
             <TextField hintText="Number 2" onChange={this.setNum2} />
             <br />* /}
          </div>
          <p> parseInt(this.state.num1) + parseInt(this.state.num2) </p>* /}
        </Tab>
      </Tabs>
*/}

          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
              <h3 style={globalStyles.navigation}>Testo ITA originale (versione 1):</h3>
              <label>{this.state.ita_orig}</label>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
              <h3 style={globalStyles.navigation}>Testo LIS originale (versione 1):</h3>
              <label>{this.state.lis_orig}</label>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15 ">
              <h3 style={globalStyles.navigation}>Testo ITA editato (versione {this.state.ita_edit_version}):</h3>
              <div>
                <TextareaAutosize cols={60} rows={10} maxRows={15} value={this.state.ita_edit} onChange={handleEditIta1} />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15 ">
              <h3 style={globalStyles.navigation}>Testo LIS editato (versione {this.state.lis_edit_version}):</h3>
              <div>
                <TextareaAutosize cols={60} rows={10} maxRows={15} value={this.state.lis_edit} onChange={handleEditLis1} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
              <h3 style={globalStyles.navigation}>Azioni:</h3>
              <div style={styles.buttons}>
                <RaisedButton label="Annulla" onClick={handleCancel} disabled={!dirty} />
                <RaisedButton label="Traduci" onClick={handleSave} disabled={!dirty} style={styles.saveButton} primary={false} />
                <RaisedButton label="Salva" onClick={handleSave} disabled={!dirty} style={styles.saveButton} primary={true} />
              </div>
            </div>
          </div>
          <div>
            <BottomNavigation className={styles.stickToBottom} selectedIndex={this.state.BottomNavigationSelectedIndex}>
              <BottomNavigationItem
                label="Recents"
                icon={recentsIcon}
                onClick={() => this.BottomNavigationSelect(0)}
              />
              <BottomNavigationItem
                label="Favorites"
                icon={favoritesIcon}
                onClick={() => this.BottomNavigationSelect(1)}
              />
              <BottomNavigationItem
                label="Nearby"
                icon={nearbyIcon}
                onClick={() => this.BottomNavigationSelect(2)}
              />
            </BottomNavigation>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Dashboard;
