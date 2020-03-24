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
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    dotnetify.debug = true;    
    this.vm = dotnetify.react.connect('AppLayout', this, {
      headers: {
        Authorization: 'Bearer ' + auth.getAccessToken() },
        exceptionHandler: _ => auth.signOut()
    });
    this.vm.onRouteEnter = (path, template) => (template.Target = 'Content');
    this.state = {
      Greetings: "",
      ServerTime: "",
      rightSidebarOpen: false,
      leftSidebarOpen: props.width === LARGE,
      Menus_del1: [],
      Menus_del2: [],
      currentDate: new Date().getDate(), //Current Date
      BottomNavigationSelectedIndex: 0,
      deliverable: true // Per ora, pre rendere piu' facile il toggle, deliverable e' bool (false = 1 deliv, true 2 deliv)
    };
    console.log('AppLayout - dotnetify: ', dotnetify);
    // this.handleDeliverableToggle2 = this.handleDeliverableToggle2.bind(this);
    console.log('AppLayout userid da backend: ', props.userid);
  }
  /*
  componentDidMount() {
    console.log('AppLayout.js - componentDidMount');
  };

  componentWillUnmount() {
    this.vm.$destroy();
    console.log('AppLayout.js - componentWillUnmount');
  }
  */

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
    // this.vm.$destroy();
  }

  componentDidMount() {
    console.log('Form - componentDidMount');
    window.addEventListener('beforeunload', this.handleLeavePage);
  };

  handleLeavePage(e) {
    this.vm.$destroy();
  }

  componentWillReceiveProps(nextProps) {
    console.log('AppLayout.js - componentWillReceiveProps');
    if (this.props.width !== nextProps.width) {
      this.setState({ leftSidebarOpen: nextProps.width === LARGE });
    }
  }
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
  }

  BottomNavigationSelect = (index) => {
    console.log('BottomNavigationSelect - index: ', index);
    this.setState({BottomNavigationSelectedIndex: index});
  }

  handleDeliverableToggle2 = id => this.setState({ deliverable: id });
  handleSidebarToggle1 = () => this.setState({ leftSidebarOpen: !this.state.leftSidebarOpen });
  // const handleDeliverableToggle1 = id => this.handleDeliverableToggle2({ deliverable: id });
  handleDeliverableToggle1 = () => {
    // console.log('handleDeliverableToggle value: ', value);
    console.log('AppLayout.js - deliver: ', deliver);
    this.setState({ deliverable: !this.state.deliverable });
    deliver = !deliver;
    console.log('AppLayout.js - deliver: ', deliver);
  }

  handleRightSidebarToggle = () => this.setState({rightSidebarOpen: !this.state.rightSidebarOpen});

  render() {
    let { leftSidebarOpen, Menus_del1, Menus_del2, UserAvatar, UserName, UserId, deliverable } = this.state;
    let userAvatarUrl = UserAvatar ? UserAvatar : null;
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
    }

    return ( true ? // this.state.deliverable == 1 ? 
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header styles={styles.header} onSidebarToggle={this.handleSidebarToggle1} onDeliverableToggle={this.handleDeliverableToggle1} deliv={deliverable} time={this.state.ServerTime} />
          { /*
          <div>
            <RaisedButton
              label="Toggle right Drawer"
              primary={true}
              onClick={this.handleRightSidebarToggle}
            />
          </div>
          */}
          <Sidebar vm={this.vm} logoTitle={"LIS_d_" + (+deliverable)} open={leftSidebarOpen} userAvatarUrl={userAvatarUrl} menus_del1={Menus_del1} menus_del2={Menus_del2} username={UserName} userid={UserId} deliv={deliverable} />
          <div id="Content" data_id={(+deliverable)} style={styles.container} />
          {/* cambia deliverable al click su QUALUNQUE COSA nel div : onClick={handleDeliverableToggle} */ }
          {/* non funziona : userid={UserId}
          
          A simple example of `BottomNavigation`, with three labels and icons
          provided. The selected `BottomNavigationItem` is determined by application
          state (for instance, by the URL).
          
          className={styles.stickToBottom}
          <BottomNavigation style={styles.stickToBottom.root} selectedIndex={this.state.BottomNavigationSelectedIndex}>
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
            <BottomNavigationItem
              label="RAI - 2020"
              icon={nearbyIcon}
              style={styles.stickToBottomItem.root}
            />
          </BottomNavigation>
          <Drawer width={200} openSecondary={true} open={this.state.rightSidebarOpen} >
            <AppBar title="AppBar" />
          </Drawer>
          */}
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
  }
}

AppLayout.propTypes = {
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
  UserId: PropTypes.number,
  menus_del1: PropTypes.array,
  menus_del2: PropTypes.array,
  width: PropTypes.number
};

export default withWidth()(AppLayout);
