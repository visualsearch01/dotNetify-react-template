import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { pink500, grey200, grey500 } from 'material-ui/styles/colors';
/*
<Typography variant="h6" className={classes.title}>
      News1
    </Typography>
    <Typography variant="h6" className={classes.title}>
      News2
    </Typography>
    <Typography variant="h6" className={classes.title}>
      News3
    </Typography>
    <FlatButton style={styles.button} label={page} disabled={props.select == page} onClick={() => props.onSelect(page)} />
    <FloatingActionButton onClick={handleAdd} style={styles.addButton} backgroundColor={pink500} mini={true}>
  <ContentAdd />
</FloatingActionButton>
*/

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { white } from 'material-ui/styles/colors';
import auth from '../auth';

const Header = props => {
  const { styles, onSidebarToggle, onDeliverableToggle, deliv, time } = props;
  console.log('Header - props.deliv: ', deliv);
  const style = {
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
    /*
    onSelect(id) {
      console.log('Header onSelect: ', id);
    }
    */
  };

  const onSelect_test = id => {
    console.log('Header onSelect: ', id);
  }

  const handleSignout = _ => auth.signOut();
  const handleClick = value => {
    onDeliverableToggle(value);
  }

  return (
    <div>
      <AppBar
        style={{ ...styles, ...style.appBar }}
        iconElementLeft={
          <div>
            <IconButton style={style.menuButton} onClick={onSidebarToggle}>
              <Menu color={white} />
            </IconButton>
            {/*
            <label>Selezione deliverable</label>
            <FlatButton style={styles.button} label={"Bottone di test"} disabled={false} onClick={() => onSelect_test(2)} />
            <FlatButton style={styles.button} label={"1-Meteo"} disabled={deliv} primary={!deliv} value={1} onClick={onDeliverableToggle} />
            <FlatButton style={styles.button} label={"2-Didattica"} disabled={!deliv} primary={deliv} value={2} onClick={onDeliverableToggle} />
            <FloatingActionButton onClick={handleSignout} style={styles.addButton} backgroundColor={pink500} mini={true}>Test2</FloatingActionButton>
            <FloatingActionButton onClick={handleSignout} style={styles.addButton} backgroundColor={pink500} mini={false}>Test3</FloatingActionButton>
            new Date().toString() /*.toLocaleString()*/  /*.getUTCDate()*/   /* toISOString().split('T')[0]
            */}
          </div>
        }
        iconElementRight={
          <div style={style.iconsRightContainer}>
            <label>Data {/*time*/}</label>
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
