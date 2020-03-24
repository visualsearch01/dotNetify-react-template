import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blue600, grey900, orange600 } from 'material-ui/styles/colors';

const themeDefault = getMuiTheme({
  palette: {},
  appBar: {
    height: 57, //50, //57, //'5%', // 57,
    // position: 'fixed',
    color: blue600 // orange600
  },
  drawer: {
    width: 230, // '10%', // 230,
    color: grey900,
    // border: '1px solid #000000'
  },
  raisedButton: {
    primaryColor: blue600 //orange600 //blue600
  }
});

/*
export const defaultTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  },
  appBar: {
    height: 57,
    color: blue[600]
  },
  drawer: {
    width: 230,
    color: grey[900]
  },
  raisedButton: {
    primaryColor: blue[600]
  }
});
*/
export default themeDefault;
