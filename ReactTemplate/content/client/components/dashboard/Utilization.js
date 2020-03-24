import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import MemoryIcon from 'material-ui/svg-icons/hardware/memory';
import DiskIcon from 'material-ui/svg-icons/hardware/sim-card';
import NetworkIcon from 'material-ui/svg-icons/device/network-wifi';
import { cyan600, pink600, purple600, white } from 'material-ui/styles/colors';
import GlobalStyles from '../../styles/styles';
import { Player, ControlBar, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';

import Subheader from 'material-ui/Subheader';
import { typography } from 'material-ui/styles';
import RaisedButton from 'material-ui/RaisedButton';
import TextareaAutosize from 'react-textarea-autosize';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const Utilization = props => {
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
    legend: {
      paddingTop: 60
    },
    legendText: {
      fontSize: '12px'
    },
    pieChartDiv: {
      height: 290,
      textAlign: 'center'
    }
  };

  const labelStyles = [ { color: cyan600, icon: <MemoryIcon /> }, { color: pink600, icon: <DiskIcon /> }, { color: purple600, icon: <NetworkIcon /> } ];

  const data = {
    labels: props.label,
    datasets: [
      {
        data: props.data,
        backgroundColor: [ cyan600, pink600, purple600 ]
      }
    ]
  };

  const options = {
    legend: { display: false },
    layout: { padding: { left: 0, right: 10, top: 20, bottom: 10 } },
    maintainAspectRatio: false
  };

  return (
    <Paper style={styles.paper}>
      <Subheader style={styles.subheader}>Selezione edizione/orario</Subheader>
      <span style={GlobalStyles.title}>Test</span>
      <div className="row">
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
          <div style={styles.legend}>
            <List>
              {props.label.map((item, idx) => (
                <ListItem key={item} leftAvatar={<Avatar icon={labelStyles[idx].icon} backgroundColor={labelStyles[idx].color} />} onClick={props.onClicked}>
                  <span style={styles.legendText}>{item}</span>
                </ListItem>
              ))}
            </List>
            <RaisedButton label="09:30" onClick={props.onClicked} />
            <RaisedButton label="18:30" onClick={props.onClicked} />
          </div>
        </div>
        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
          <div style={styles.pieChartDiv}>
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>
    </Paper>
  );
};


// Il componente video preview e' functional - non ha bisogno di avere uno stato
const VideoPreview = props => {
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
    legend: {
      paddingTop: 0, // 60,
      border: '1px solid'
    },
    legendText: {
      fontSize: '12px'
    },
    pieChartDiv: {
      height: 290,
      textAlign: 'center'
    }
  };

  // const labelStyles = [ { color: cyan600, icon: <MemoryIcon /> }, { color: pink600, icon: <DiskIcon /> }, { color: purple600, icon: <NetworkIcon /> } ];
/*
  const datanew = {
    // labels: props.label,
    // label: props.label,
    // text: props.text,
    datasets: [
      {
        datanew: props.data,
        backgroundColor: [ cyan600, pink600, purple600 ]
      }
    ]
  };
*/
  const options = {
    legend: { display: false },
    layout: { padding: { left: 0, right: 10, top: 20, bottom: 10 } },
    maintainAspectRatio: false
  };

  const onClickp = id => {
    console.log(id);
  };

  // {/* Questo require dovrebbe essere quello che fa creare a webpack la cartella videos e ci mette dentro questo file*/}

  return (
    <Paper style={styles.paper}>
      <div>
        <Player preload={"none"} poster={props.Poster} >
          <source src={props.Src}/>
          <ControlBar disableCompletely={true} />
        </Player>
      </div>
      <div>
        <RaisedButton label="Pubblica" onClick={props.onPublish} />
      </div>
    </Paper>
  );
};

const CardExampleExpandable = props => (
  <Card>
    <CardHeader
      title={props.title}
      subtitle={props.subtitle}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      {props.text}
    </CardText>
  </Card>
);

Utilization.propTypes = {
  data: PropTypes.array
};
// export const Utilization;

VideoPreview.propTypes = {
  // datanew: PropTypes.array
  Poster: PropTypes.string,
  Src: PropTypes.string,
  onPublish: PropTypes.func //.required
};
/*
export default () => {
    return [Utilization, VideoPreview];
}
*/
export {
// export default 
Utilization, //;

// export const 
VideoPreview, //;
CardExampleExpandable
}

// And after, you can import your exports :
// import ConnectedUserList, { RealTimeApp } from "./moduleName"
