import React from 'react';
import PropTypes from 'prop-types';
import { RouteLink } from 'dotnetify';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { spacing, typography } from 'material-ui/styles';
import { white, blue600 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Autocomplete from 'material-ui/Autocomplete';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

// Using url-loader, described here (SurviveJS - Loading Images), you can then use in your code :
import LogoImg from "images/Rai _Logo RGB.png"; //'YOUR_PATH/logo.png';
import UserImg from "images/rai_crits_1.png"; //'YOUR_PATH/logo.png';
// and
// <img src={LogoImg}/>

const Sidebar = props => {
  let { vm, menus_del1, menus_del2, menus_amm } = props;
  console.log('Sidebar - props.deliverable: ', props.deliverable);
  console.log('Sidebar - props.userid: ', props.userid);
  // console.log('Sidebar - props.menus_del1: ', menus_del1);
  // console.log('Sidebar - props.menus_del2: ', menus_del2);
  // console.log('Sidebar - props.menus_amm: ', menus_amm);
  const sidebarStyle = {
    logo: {
      cursor: 'pointer',
      fontSize: 22,
      display: 'flex',
      color: typography.textFullWhite,
      lineHeight: `${spacing.desktopKeylineIncrement}px`,
      fontWeight: typography.fontWeightLight,
      backgroundColor: blue600,
      // padding: 10,
      // textAlign: 'rigth',
      float: 'rigth',
      height: 57 //56
    },
    menudiv: {
      cursor: 'pointer',
      fontSize: 22,
      display: 'flex',
      float: 'rigth',
      padding: '15px 0 20px 15px'
    },
    menuItem: {
      color: white,
      fontSize: 12,
      width: '90%'
    },
    menuSelectedItem: {
      color: blue600,
      fontSize: 16,
      width: '90%'
    },
    autocomplete: {
      root: {
        display: 'inline-block',
        position: 'relative',
        width: '20px',
        backgroundColor: 'white'
      },
      menu: {
        width: '100%'
      },
      list: {
        display: 'block',
        width: '100%' // fullWidth ? '100%' : 256 // 225 //
      },
      innerDiv: {
        overflow: 'hidden'
      }
    },
    avatar: {
      size: 50,
      div: {
        padding: '15px 0 20px 15px',
        backgroundImage: 'url(' + require('../images/material_bg.png') + ')',
        height: 45
      },
      icon: {
        float: 'left',
        display: 'block',
        marginRight: 15,
        boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)'
      },
      span: {
        paddingTop: 4,
        display: 'block',
        color: 'white',
        fontSize: 18,
        textShadow: '1px 1px #444'
      }
    }
  };

  const RenderConsoleLog = ({ children }) => {
    console.log('Sidebar RenderConsoleLog - children: ', children);
    return false;
  };
  
  return (
    <Drawer docked={true} open={props.leftSidebarOpen}>
      <RenderConsoleLog>{props.menus_del1}</RenderConsoleLog>
      <div style={sidebarStyle.logo}>
        <img heigth="57px" width="57px" src={LogoImg} />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.logoTitle}
      </div>
      <div style={sidebarStyle.avatar.div}>
        <Avatar src={UserImg} size={sidebarStyle.avatar.size} style={sidebarStyle.avatar.icon} />
        <span style={sidebarStyle.avatar.span}>{props.username}</span>
        {/*<span style={sidebarStyle.avatar.span}>ID utente: {props.userid}</span>*/}
      </div>
      <div style={sidebarStyle.menudiv}>
        <Menu>
          { [2,3].includes(props.userid) && ( typeof (menus_del1) !== "undefined" && Array.isArray(menus_del1) && menus_del1.length) ?
          <React.Fragment>
            <MenuItem
              primaryText="Meteo"
              checked={false}
              style={sidebarStyle.menuItem}
              rightIcon={<ArrowDropRight />}
              menuItems={
                menus_del1.map((menu, index) => (
                  <MenuItem
                    button
                    selected={index === 0}
                    key={index}
                    primaryText={menu.Title}
                    leftIcon={<FontIcon className="material-icons">{menu.Icon}</FontIcon>}
                    containerElement={<RouteLink vm={vm} route={menu.Route} />}
                  />
                ))
              }
            />
            <Divider />
          </React.Fragment>
          :
          null }
          { ([2].includes(props.userid) || props.userid >= 4) && ( typeof (menus_del2) !== "undefined" && Array.isArray(menus_del2) && menus_del2.length) ?
          <React.Fragment>
            <MenuItem
              primaryText="Didattica"
              checked={false}
              style={sidebarStyle.menuItem}
              rightIcon={<ArrowDropRight />}
              menuItems={
                menus_del2.map((menu, index) => (
                  <MenuItem
                    button 
                    selected={index === 0}
                    key={index}
                    primaryText={menu.Title}
                    leftIcon={<FontIcon className="material-icons">{menu.Icon}</FontIcon>}
                    containerElement={<RouteLink vm={vm} route={menu.Route} />}
                  />
                ))
              }
            />
            <Divider />
          </React.Fragment>
          :
          null }
          { [2].includes(props.userid) && ( typeof (menus_amm) !== "undefined" && Array.isArray(menus_amm) && menus_amm.length) ?
          <React.Fragment>
            <MenuItem
              primaryText="Amministrazione"
              checked={false}
              style={sidebarStyle.menuItem}
              rightIcon={<ArrowDropRight />}
              menuItems={
                menus_amm.map((menu, index) => (
                  <MenuItem
                    button 
                    selected={index === 0}
                    key={index}
                    primaryText={menu.Title}
                    leftIcon={<FontIcon className="material-icons">{menu.Icon}</FontIcon>}
                    containerElement={<RouteLink vm={vm} route={menu.Route} />}
                  />
                ))
              }
            />
            <Divider />
          </React.Fragment>
          :
          null }
        </Menu>
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  leftSidebarOpen: PropTypes.bool,
  menus_del1: PropTypes.array,
  menus_del2: PropTypes.array,
  menus_amm: PropTypes.array,
  username: PropTypes.string,
  userid: PropTypes.any,
  userAvatarUrl: PropTypes.string
};

export default Sidebar;
