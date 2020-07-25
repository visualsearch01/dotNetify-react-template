import React from 'react';
import PropTypes from 'prop-types';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import withWidth, { LARGE, SMALL } from 'material-ui/utils/withWidth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ThemeDefault from '../styles/theme-default';
import { blue600 } from 'material-ui/styles/colors';
import auth from '../auth';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

const Content = props => {
  console.log('Content deliverable_id: ', props.deliv_id);
  return (
    <div id="Content" style={props.styles} />
  );
};

Content.propTypes = {
  styles: PropTypes.object,
  deliv_id: PropTypes.number
};

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    var arg = { User: { Name: "AppLayout" } }; // Visibile in: vm.$vmArg.User.Name
    dotnetify.debug = true;
    this.vm = dotnetify.react.connect('AppLayout', this, {
      headers: {
        Authorization: 'Bearer ' + auth.getAccessToken()
      },
      exceptionHandler: ex => {
        // alert(ex.message);
        console.log('appLayout exceptionHandler: ', ex);
        auth.signOut();
      },
      vmArg: arg
    });
    
    this.vm.onRouteEnter = (path, template) => (template.Target = 'Content');

    this.state = {
      // Greetings: "",
      // ServerTime: "",
      rightSidebarOpen:   false,
      leftSidebarOpen:    props.width === LARGE,
      Menus_del1:         [],
      Menus_del2:         [],
      Menus_amm:          [],
      currentDate:        new Date().getDate(), //Current Date
      BottomNavigationSelectedIndex: 0,
      deliverable:        true // Per ora, pre rendere piu' facile il toggle, deliverable e' bool (false = 1 deliv, true 2 deliv)
    };
    console.log('AppLayout - this: ', this);
    console.log('AppLayout - dotnetify: ', dotnetify);
    // this.handleDeliverableToggle2 = this.handleDeliverableToggle2.bind(this);
    console.log('AppLayout userid da backend: ', props.userid);
    // console.log('AppLayout - Greetings: ', Greetings);
    console.log('AppLayout - this.state: ', this.state);
    // console.log('AppLayout - this.state.Greetings: ', this.state.Greetings);
    // console.log('AppLayout - this.state.ServerTime: ', this.state.ServerTime);
  }

  abortController = new AbortController();
  mySignal = this.abortController.signal;

  componentWillUnmount() {
    console.log('AppLayout - componentWillUnmount()');
    this.abortController.abort();
    this.vm.$destroy();
    // Component is attempting to connect to an already active 'Dashboard'.
    // If it's from a dismounted component, you must add vm.$destroy to componentWillUnmount().
  };
  /*
  componentDidMount() {
    console.log('AppLayout.js - componentDidMount');
  };

  componentWillUnmount() {
    this.vm.$destroy();
    console.log('AppLayout.js - componentWillUnmount');
  }
  

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
    // this.vm.$destroy();
  }
  */
  componentDidMount() {
    console.log('AppLayout.js - componentDidMount - this.state.Greetings: ', this.state.Greetings);
    console.log('AppLayout.js - componentDidMount');
    console.log('AppLayout.js - g_deliverable: ', g_deliverable);
    // window.addEventListener('beforeunload', this.handleLeavePage);
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  };

  componentWillReceiveProps(nextProps) {
    console.log('AppLayout.js - componentWillReceiveProps');
    if (this.props.width !== nextProps.width) {
      this.setState({ leftSidebarOpen: nextProps.width === LARGE });
    }
  };
  /*
  shouldComponentUpdate() {
    console.log('AppLayout.js - shouldComponentUpdate');
  };
  componentWillUpdate() {
    console.log('AppLayout.js - componentWillUpdate');
  };
  */
  setDeliverable(event) {
    this.setState({
        deliverable: false //event.target.value,
    });
  };

  BottomNavigationSelect = (index) => {
    console.log('BottomNavigationSelect - index: ', index);
    this.setState({BottomNavigationSelectedIndex: index});
  };
  
  handleSidebarToggle1 = () => this.setState({ leftSidebarOpen: !this.state.leftSidebarOpen });
  
  handleRightSidebarToggle = () => this.setState({rightSidebarOpen: !this.state.rightSidebarOpen});
  
  // const handleDeliverableToggle1 = id => this.handleDeliverableToggle2({ deliverable: id });
  handleDeliverableToggle1 = () => {
    // console.log('handleDeliverableToggle value: ', value);
    this.setState({ deliverable: !this.state.deliverable });
    g_deliverable = !g_deliverable;
    console.log('AppLayout.js - g_deliverable: ', g_deliverable);
  };

  handleDeliverableToggle2 = id => this.setState({ deliverable: id });

  render() {
    let { leftSidebarOpen, Menus_del1, Menus_del2, Menus_amm, UserAvatar, UserName, UserId, deliverable } = this.state;
    let userAvatarUrl = UserAvatar ? UserAvatar : null;

    g_username = UserName;
    g_userid = UserId;

    const paddingLeftSidebar = 236; // '10%'; //280; //300; // 236;
    const styles = {
      root: {
          color: "green",
          "&$selected": {
            color: "red"
          }
        },
        selected: {},
      header: { 
        paddingLeft: leftSidebarOpen ? paddingLeftSidebar : 0,
        // backgroundColor: blue600,
      },
      /*
      If the margin property has four values:

      margin: 25px 50px 75px 100px;
      top margin is 25px
      right margin is 50px
      bottom margin is 75px
      left margin is 100px
      */
      container: {
        // margin: 'auto',
        // border: '1px solid red',
        // margin: '80px 20px 20px 15px',
        // margin: '80px 20px 20px 15px',
        // margin: '80px 20px 0px 15px',
        margin: '70px 20px 10px 5px',
        // margin: '80px 20px 0px 20px',
        // height: '100%',
        // width: '90%',
        // top: '20px',        
        // paddingTop: '100px',
        paddingLeft: leftSidebarOpen && this.props.width !== SMALL ? paddingLeftSidebar : 0
      },
      stickToBottom: {
        // backgroundColor: 'black',
        root: {
          position: 'absolute',
          width: '100%',
          display: 'flex',
          bottom: 0,
          justifyContent: 'center',
          // backgroundColor: 'black',
          // backgroundColor: bottomNavigation.backgroundColor,
          // height: bottomNavigation.height
        },
        item: {
          flex: '1',
          align: 'right'
        }
      },
      stickToBottomItem: {
        root: {
          // transition: 'padding-top 0.3s',
          // paddingTop: selected ? 6 : 8,
          // paddingBottom: 10,
          // paddingLeft: 12,
          // paddingRight: 12,
          // minWidth: 80,
          // maxWidth: 168,
          align: 'right'
        },
        // label: {
          // fontSize: selected ? bottomNavigation.selectedFontSize : bottomNavigation.unselectedFontSize,
          // transition: 'color 0.3s, font-size 0.3s',
          // color: color
        // },
        icon: {
          display: 'block',
          /**
          * Used to ensure SVG icons are centered
          */
          width: '100%'
        },
        // iconColor: color
      }
    };
    /*
    const styles1 = {
      root: {
        color: "green"
      },
      selected: {
        color: "red"
      }
    };
    */
    const handleSidebarToggle0 = () => this.setState({ leftSidebarOpen: !this.state.leftSidebarOpen });
    const handleDeliverableToggle0 = () => {
      // console.log('handleDeliverableToggle value: ', value);
      // this.setState({ deliverable: !this.state.deliverable });
    };

    return ( true ? // this.state.deliverable == 1 ? {"LIS_d_" + (+deliverable)} // {this.state.Greetings}
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header
            styles={styles.header}
            onSidebarToggle={this.handleSidebarToggle1}
            onDeliverableToggle={this.handleDeliverableToggle1}
            deliverable={deliverable}
            servertime={this.state.ServerTime}
          />
          <Sidebar
            vm={this.vm}
            logoTitle={"Virtual LIS"}
            leftSidebarOpen={leftSidebarOpen}
            userAvatarUrl={userAvatarUrl}
            menus_del1={Menus_del1}
            menus_del2={Menus_del2}
            menus_amm={Menus_amm}
            username={UserName}
            userid={UserId}
            deliverable={deliverable}
          />
          <div id="Content" style={styles.container} />
        </div>
      </MuiThemeProvider>
      :
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <React.Fragment>
          Deliverable 2
          <Header styles={styles.header} onSidebarToggle={handleSidebarToggle} />
          <div id="Content" style={styles.container} /> {/* userid={UserId} */}
        </React.Fragment>
      </MuiThemeProvider>
    );
  };
};

AppLayout.propTypes = {
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
  UserId: PropTypes.number,
  menus_del1: PropTypes.array,
  menus_del2: PropTypes.array,
  menus_amm: PropTypes.array,
  width: PropTypes.number
};

export default withWidth()(AppLayout);
