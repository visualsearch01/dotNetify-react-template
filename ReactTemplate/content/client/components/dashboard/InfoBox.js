import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { white, grey800 } from 'material-ui/styles/colors';
import { typography } from 'material-ui/styles';

import DatePicker from 'react-date-picker';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const PopoverStyle = {
	top: '50px'
};

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      pickDate: new Date(), // .toISOString().split('T')[0],
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

    // <DatePicker onChange={this.onChangeDate1} value={this.state.pickDate} />

    return (
      <Paper>
        <span style={styles.iconSpan}>
          <Icon color={white} style={styles.icon} />
        </span>
        <div style={styles.content}>
          <span style={styles.text}>{Title}</span>
          <span style={styles.number}>{Value}</span>
          <DatePicker onChange={onChangeDate} value={this.state.pickDate} />

          <button type="submit" name={this.state.name} onClick={this.handleProfileDropDown.bind(this)}>Scegli area</button>
            <Popover
			          open={this.state.pop_open}
			          anchorEl={this.state.anchorEl}
			          className="popover_class"
			          style={PopoverStyle}
			          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
			          targetOrigin={{horizontal: 'left', vertical: 'top'}}
			          onRequestClose={this.handleRequestClose.bind(this)}
			          animation={PopoverAnimationVertical}
			        >
			          <Menu>
			            <MenuItem primaryText="Content" onClick={this.handleRequestClose.bind(this)} />
			            <MenuItem primaryText="My Profile" />
			            <MenuItem primaryText="Settings" />
			            <MenuItem primaryText="Logout" />
			          </Menu>
            </Popover>
        </div>
      </Paper>
    );
  }
}

InfoBox.propTypes = {
  Icon: PropTypes.any,
  Color: PropTypes.string,
  Title: PropTypes.string,
  Value: PropTypes.any,
  onChangeDate: PropTypes.func //.required
};

export default InfoBox;
