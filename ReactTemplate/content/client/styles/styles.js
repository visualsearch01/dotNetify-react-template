import { typography } from 'material-ui/styles';
import { grey600 } from 'material-ui/styles/colors';

const styles = {
  navigation: {
    fontSize: 15,
    fontWeight: typography.fontWeightLight,
    color: grey600,
    paddingBottom: 5,
    display: 'block'
  },
  title: {
    fontSize: 20,
    fontWeight: typography.fontWeightLight,
    marginBottom: 5
  },
  paper: {
    padding: 5,
    height: 743
  },
  clear: {
    clear: 'both'
  },
  datepicker: {
    minWidth: '0.54em',
    height: '100%',
    position: 'relative',
    padding: '0 1px',
    border: 0,
    background: 'none',
    fontSize: 82,
    color: 'white',
    fontWeight: 'bold',
    boxSizing: 'content-box',
    '-moz-appearance': 'textfield'
  }
};

export default styles;
