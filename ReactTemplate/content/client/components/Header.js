import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { white, pink500, grey200, grey500 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import {  } from 'material-ui/styles/colors';
import auth from '../auth';

const Header = props => {
  const { styles, onSidebarToggle, onDeliverableToggle, deliverable, servertime } = props;
  console.log('Header - props.deliverable: ', deliverable);
  const headerStyle = {
    appBar: {
      position: 'fixed', // prevent scrolling 'relative', //'fixed',
      top: 0,
      // overflow: 'hidden',
      height: 57, // '5%', // 57, //'5%', // 57,
      // maxHeight: '5%' // 57 // 56
    },
    menuButton: { marginLeft: 20 },
    iconsRightContainer: { marginLeft: 20 },
    paper: {
      display: 'inline',
      padding: '.5em 0'
    },
    button: { minWidth: '1em' },
    servertime: {
      fontSize: 18,
      color: white,
      fontWeight: 'bold' // typography.fontWeightLight
    }
    /*
    onSelect(id) {
      console.log('Header onSelect: ', id);
    }
    */
  };

  const onSelect_test = id => {
    console.log('Header onSelect: ', id);
  };

  const handleSignout = _ => auth.signOut();
  const handleClick = value => {
    onDeliverableToggle(value);
  };

  return (
    <div>
      <AppBar
        style={{ ...styles, ...headerStyle.appBar }}
        iconElementLeft={
          <div>
            <IconButton style={headerStyle.menuButton} onClick={onSidebarToggle}>
              <Menu color={white} />
            </IconButton>
          </div>
        }
        iconElementRight={
          <div style={headerStyle.iconsRightContainer}>
            <label style={headerStyle.servertime}>{servertime}</label>
            <IconMenu
              color={white}
              iconButtonElement={
                <IconButton>
                  <MoreVertIcon color={white} />
                </IconButton>
              }
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              {/* <MenuItem primaryText="Deliverable 1 (meteo)" onClick={handleSignout} /> */}
              {/* <MenuItem primaryText="Deliverable 2 (didattica)" onClick={handleSignout} /> */}
              <MenuItem primaryText="Logout" onClick={handleSignout} />
            </IconMenu>
          </div>
        }
      />
    </div>
  );
};

Header.propTypes = {
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func,
  onDeliverableToggle: PropTypes.func
};

export default Header;
