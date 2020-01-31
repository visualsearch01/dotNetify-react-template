import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey400, cyan600, white } from 'material-ui/styles/colors';
import { typography } from 'material-ui/styles';
import Wallpaper from 'material-ui/svg-icons/device/wallpaper';

import RaisedButton from 'material-ui/RaisedButton';
// import Dashboard from '../../views/Dashboard';

function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

const RecentActivities = props => {
  const styles = {
    subheader: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      backgroundColor: cyan600,
      color: white
    },
    paper: {
      minHeight: 344,
      padding: 10
    },
    click(id){
      console.log(id)
    }
  };

  // const handleSig = _ => props.click(this.props.id);

  const iconButtonElement = (
    <IconButton touch={true} tooltipPosition="bottom-left">
      <MoreVertIcon color={grey400} />
    </IconButton>
  );

  const handleMenuClick = route => {
    // Dashboard.handleFetch("2010-01-08");
    console.log('Route onclick: ', route);
    props.vm.$routeTo(route);
  };

  function handleClickButton(id, gg) {
    console.log(id, gg);
  };

  return (
    <Paper style={styles.paper}>
      <List>
        <Subheader style={styles.subheader}>Selezione area</Subheader>
        { /* props.data.map((item, idx) => (
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
        )) */}
      </List>
      <RaisedButton label="NORD" id={1} color={cyan600} onClick={props.onClicked} />
      <RaisedButton label="CENTRO E SARDEGNA" id={2} onClick={props.onClicked} />
      <RaisedButton label="SUD E SICILIA" id={3} onClick={props.onClicked} />
      <RaisedButton label="TEMPERATURE" id={4} onClick={props.onClicked} />
      <RaisedButton label="VENTI" id={5} onClick={props.onClicked} />
      <RaisedButton label="MARI" id={6} onClick={props.onClicked} />
      <RaisedButton label="SU TUTTA L'ITALIA +2" id={7} onClick={props.onClicked} />
      <RaisedButton label="SU TUTTA L'ITALIA +3" id={7} onClick={props.onClicked} />

      <RaisedButton onClick={(e) => handleClickButton(5, 1)} id={1} label={'hello'} />
      { /* <a href="#" onClick={handleClickButtonf}>ggg</a> */ }
      { /*
            Passing Arguments to Event Handlers
      Inside a loop, it is common to want to pass an extra parameter to an event handler. For example, if id is the row ID, either of the following would work:
      */ }
      { /*
      <RaisedButton label={'hello12'} id={14} onClick={(e) => this.handleClickButton(id, e)} />
      <RaisedButton label={'hello4'} id={16} onClick={this.onCl ickp.bind(this, id)} />
      */ }
      { /* <RaisedButton label={'hello4'} id={16} onClick={this.click} /> */ }
    </Paper>
  );
};

RecentActivities.propTypes = {
  data: PropTypes.array
};

export default RecentActivities;
