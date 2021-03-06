import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { blue300, indigo900, white, grey800 } from 'material-ui/styles/colors';
import { typography } from 'material-ui/styles';
import DatePicker from 'react-date-picker';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
// import MobileTearSheet from '../../../MobileTearSheet';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      pickDate: new Date(),
      name: '',
      pop_open: false,
      anchorEl: '',
    }
  }

  onChangeDate1 = date1 => {
    this.setState({ pickDate: date1 });
    console.log('onChangeDate1 - date1: ', date1);
    console.log('onChangeDate1 - date1.toISOString(): ', date1.toISOString());
    // this.handleFetch(date1);
    // onChange={this.handleFetch} value={this.state.pickDate} 
  };

  handleProfileDropDown(e) {
		e.preventDefault();
		this.setState({
			pop_open: !this.state.pop_open,
			anchorEl: e.currentTarget,
		});
	};

  handleRequestClose() {
    this.setState({
        pop_open: false,
    });
  };

  render() {
    const { Color, Title, Value, Icon, onChangeDate } = this.props;

    const styles = {
      content: {
        padding: '5px 10px',
        marginLeft: 90,
        height: 80
      },
      number: {
        display: 'block',
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 10,
        color: grey800
      },
      text: {
        fontSize: 18,
        fontWeight: typography.fontWeightLight,
        color: grey800
      },
      iconSpan: {
        float: 'left',
        height: 90,
        width: 90,
        textAlign: 'center',
        backgroundColor: Color
      },
      icon: {
        height: 48,
        width: 48,
        marginTop: 20,
        maxWidth: '100%'
      }
    };

    return (
      <Paper>
        <span style={styles.iconSpan}>
          <Icon color={white} style={styles.icon} />
        </span>
        <div style={styles.content}>
          <span style={styles.text}>{Title}</span>
          <span style={styles.number}>{Value}</span>
        </div>
      </Paper>
    );
  }
}

// export default 
class CircularProgressExampleDeterminate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      tess: 'Attendere, caricamento video'
    };
  }
  
  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    this.abortController.abort();
    // this.vm.$destroy();
    window.removeEventListener('beforeunload', this.handleLeavePage);
    // Component is attempting to connect to an already active 'Dashboard'.
    // If it's from a dismounted component, you must add vm.$destroy to componentWillUnmount().
  };
  
  componentDidMount() {
    console.log('CircularProgressExampleDeterminate - componentDidMount');
    window.addEventListener('beforeunload', this.handleLeavePage);
    this.timer = setTimeout(() => this.progress(5), 200); //1000);
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  };

  // Rendere il progress piu' veloce
  // - aumentare il valore fisso per cui vine emoltiplicato Math.Random
  // - stringere l'intervallo di aggiornamento al fondo (es. da 1000 a 200)
  progress(completed) {
    if (completed > 100) {
      this.setState({completed: 100});
      clearTimeout(this.timer);
      this.props.onCompleted();
    } else {
      this.setState({completed});
      const diff = Math.random() * 5; // 40;
      this.timer = setTimeout(() => {
        this.progress(completed + diff)
        this.setState({tess: this.state.tess += "."});
      // }, 200);
      }, 1000);
    }
  };

  render() {
    // const { tess, onCompleted, completed } = this.props;
    return (
      <div>
      {this.props.progress}
        <CircularProgress
          mode="determinate"
          value={this.state.completed}
          size={200}
          thickness={20}
        />
        {this.state.tess}
      </div>
    );
  };
}


const chipStyles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

function handleRequestDelete() {
  alert('You clicked the delete button.');
}

function handleTouchTap() {
  alert('You clicked the Chip.');
}

function handleListSelect1(value) {
  // alert('You clicked the List.......' + event);
  console.log('handleListSelect1: ', value);
}
/**
 * Examples of Chips, using an image [Avatar](/#/components/font-icon), [Font Icon](/#/components/font-icon) Avatar,
 * [SVG Icon](/#/components/svg-icon) Avatar, "Letter" (string) Avatar, and with custom colors.
 *
 * Chips with the `onRequestDelete` property defined will display a delete icon.
 */
// export default 
class ChipExampleSimple extends React.Component {
  render() {
    return (
      <div style={chipStyles.wrapper}>
      {/*
      props.data.map((item, idx) => (
          <div key={idx}>
            <ListItem
              leftAvatar={<Avatar icon={<Wallpaper />} />}
              primaryText={item.PersonName}
              secondaryText={item.Status}
              rightIconButton={
                <IconMenu iconButtonElement={iconButtonElement}>
                  <MenuItem onClick={_ => handleMenuClick(item.Route)}>View</MenuItem>
                </IconMenu>
              }
            />
            <Divider inset={true} />
          </div>
        ))
       src={require( "../../../../../../../../source/Workspaces/SmallTFS/Images/1301300283_button_ok.png")}
       src={require( "../../../../../../../../source/Workspaces/SmallTFS/Images/1301300293_desktop.png")}
      */}

        <Chip
          style={chipStyles.chip}
        >
          Test Chip
        </Chip>
        <Chip
          onRequestDelete={handleRequestDelete}
          onClick={handleTouchTap}
          style={chipStyles.chip}
        >
          Deletable Text Chip
        </Chip>
        <Chip
          onClick={handleTouchTap}
          style={chipStyles.chip}
        >
          <Avatar />
          Image Avatar Chip
        </Chip>
        <Chip
          onRequestDelete={handleRequestDelete}
          onClick={handleTouchTap}
          style={chipStyles.chip}
        >
          <Avatar />
          Deletable Avatar Chip
        </Chip>
        <Chip
          onClick={handleTouchTap}
          style={chipStyles.chip}
        >
          <Avatar icon={<FontIcon className="material-icons">perm_identity</FontIcon>} />
          FontIcon Avatar Chip
        </Chip>
        <Chip
          onRequestDelete={handleRequestDelete}
          onClick={handleTouchTap}
          style={chipStyles.chip}
        >
          <Avatar color="#444" icon={<SvgIconFace />} />
          SvgIcon Avatar Chip
        </Chip>
        <Chip onClick={handleTouchTap} style={chipStyles.chip}>
          <Avatar size={32}>A</Avatar>
          Parola non trovata
        </Chip>
        <Chip
          backgroundColor={blue300}
          onRequestDelete={handleRequestDelete}
          onClick={handleTouchTap}
          style={chipStyles.chip}
        >
          <Avatar size={32} color={blue300} backgroundColor={indigo900}>
            MB
          </Avatar>
          Parola trovata
        </Chip>
      </div>
    );
  }
}


let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends React.Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
      // onChangeSign: PropTypes.func
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      },
        // this.props.onChangeSign(index)
      );
    };

    handleListSelect2 = (event) => {
      alert('You clicked the List -> event:' + event);
    }

    render() {
      // const { onChangeSign } = this.props;
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

const ListExampleSelectable = props => {
  return (
    <SelectableList defaultValue={3}>
      {/*<Subheader>Segni presenti a dizionario</Subheader>*/}
      {props.children.map((item, idx1) => (
      <ListItem
        style={{fontSize: 16}}
        key={idx1}
        value={item.Iniziale}
        primaryText={item.Iniziale}
        primaryTogglesNestedList={true}
        open={props.children.length == 36 ? null : true}
        nestedItems={
          item.Signs_object.map((item, idx2) => (
          <ListItem
            style={{fontSize: 16}}
            key={idx2}
            value={item}
            primaryText={item.name}
            onClick={(e) => props.onChangeSign(item)}
          />
          ))}
      />
      ))}
    </SelectableList>
  )
};

var handleChips_b = function(event) {
  if (event.target.value.indexOf('Nessun dato') !== -1) {
    console.log('Dashboard - handleChips - testo vuoto');
    // console.log('TablePage_1 - handleChips - else - testo pari a "Nessun dato.."');

    this.setState({
      allWordsFound: false,
      sign_json: {},
      chips: []
    },this.handleCloseDialog());
  } else {
    console.log('TablePage_1 - handleChips event.key: ', event.key);
    console.log('TablePage_1 - handleChips event.keyCode: ', event.keyCode);
    console.log('TablePage_1 - handleChips event.Code: ', event.code);
    let ret = {};
    try {
      if ([undefined,8,17,32,46].includes(event.keyCode)) { //  === 32) { // 27) { // Space
        console.log('TablePage_1 - handleChips keyCode 12 - Space pressed! ')
        let list = event.target.value.replace(/\s\s+/g, ' ').trim().split(' '); // replace("\s\s+","\s"
        
        ret.tot = event.target.value.replace(/\s\s+/g, ' ').trim();
        ret.tot_id = '';
        ret.it = [];
        ret.count = 0;
        
        let ar = [];
        let ar1 = [];
        // let tt = ['Test', 'Prova'];
        list.forEach((item, i) => {
          ar[i] = {Word: item, Found: this.state.sign_names.includes(item.toLowerCase())};
          if (this.state.sign_names.includes(item)) {
            ret.it.push(this.state.sign_array[item]);
            ret.count += 1;
            ar1.push(this.state.sign_array[item].id);
          }
        });
        ret.tot_id = ar1.join(',');
        console.log('TablePage_1 - handleChips - Check array at least one false value: ', !ar.some(function(k) {return k.Found === false}));
        console.log('TablePage_1 - handleChips - Tot JSON: ', ret);
        this.setState({
          allWordsFound: !ar.some(function(k) {return k.Found === false}),
          sign_json: ret,
          chips: ar
        });
      }
      else {
        console.log('TablePage_1 - handleChips - else - tasto premuto non impostato per aggiornare i chips');
      }
    } catch (error) {
      console.log('TablePage_1 - handleChips - catch - Error: ', error);
    }
  }
};

InfoBox.propTypes = {
  Icon: PropTypes.any,
  Color: PropTypes.string,
  Title: PropTypes.string,
  Value: PropTypes.any,
  onChangeDate: PropTypes.func //.required
};

CircularProgressExampleDeterminate.propTypes = {
  progress: PropTypes.number,
  onCompleted: PropTypes.func //.required
};

// export default InfoBox;

export {
  // export default 
  InfoBox, //;
  handleChips_b,
  // export const 
  CircularProgressExampleDeterminate, //;
  ChipExampleSimple,
  ListExampleSelectable
}
