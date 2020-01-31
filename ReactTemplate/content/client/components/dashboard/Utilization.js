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
import { Player, ControlBar } from 'video-react';

import Subheader from 'material-ui/Subheader';
import { typography } from 'material-ui/styles';
import RaisedButton from 'material-ui/RaisedButton';
import TextareaAutosize from 'react-textarea-autosize';

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
          {/*<div style={styles.pieChartDiv}>*/}
            {/*<Doughnut data={data} options={options} /> */}
            <Player
              playsInline
              fluid={false}
              poster="https://parer.ibc.regione.emilia-romagna.it/notizie/a-bologna-la-presentazione-del-volume-201carchivio-concetti-e-parole201d-di-federico-valacchi/@@images/8e7b8c07-7e1f-4d18-8c31-d511790f352b.jpeg"
              src="http://flashedu.rai.it/ieduportale/italiano/3_bologna_parole.mp4">
                <ControlBar disableCompletely={true} />
            </Player>
          {/*</div>*/}
        </div>

      </div>
      
    </Paper>
  );
};



const NewUtilization_new = props => {
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
      paddingTop: 60,
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

  const labelStyles = [ { color: cyan600, icon: <MemoryIcon /> }, { color: pink600, icon: <DiskIcon /> }, { color: purple600, icon: <NetworkIcon /> } ];

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


  const options = {
    legend: { display: false },
    layout: { padding: { left: 0, right: 10, top: 20, bottom: 10 } },
    maintainAspectRatio: false
  };

  const onClickp = id => {
    console.log(id);
  };

  return (
    <Paper style={styles.paper}>
      <Subheader style={styles.subheader}>{props.label}</Subheader>
      {/* <span style={GlobalStyles.title}>Test</span> */}
      <div className="row">
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
          <div style={styles.legend}>
            {props.text_orig}
{/*
            <RaisedButton label="09:30" onClick={props.onClicked} />
            <RaisedButton label="18:30" onClick={props.onClicked} />
*/}
          </div>
        </div>
        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
          {/*<div style={styles.pieChartDiv}>*/}
            {/*<Doughnut data={data} options={options} /> */}
          {/*</div>*/}
          {/*<div style={styles.pieChartDiv}>*/}
          <div style={styles.legend}>
            {/*props.label  cols="145" rows="40" maxRows={15}   */}
            <TextareaAutosize cols={80} rows={10} maxRows={15} value={props.text_edit} onChange={props.onChanged} />
          </div>
        </div>
      </div>
    </Paper>
  );
};




Utilization.propTypes = {
  data: PropTypes.array
};
// export const Utilization;

NewUtilization_new.propTypes = {
  datanew: PropTypes.array
};
/*
export default () => {
    return [Utilization, NewUtilization_new];
}
*/

export {
// export default 
Utilization, //;

// export const 
NewUtilization_new //;
}

// And after, you can import your exports :
// import ConnectedUserList, { RealTimeApp } from "./moduleName"
