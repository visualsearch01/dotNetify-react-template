import React from 'react';
import PropTypes from 'prop-types';
import dotnetify from 'dotnetify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import withWidth, { LARGE, SMALL } from 'material-ui/utils/withWidth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ThemeDefault from '../styles/theme-default';
import auth from '../auth';

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.vm = dotnetify.react.connect('AppLayout', this, {
      headers: { Authorization: 'Bearer ' + auth.getAccessToken() },
      exceptionHandler: _ => auth.signOut()
    });
    this.vm.onRouteEnter = (path, template) => (template.Target = 'Content');
    this.state = {
      sidebarOpen: props.width === LARGE,
      Menus: [],
      deliverable: true
    };
    // this.handleDeliverableToggle2 = this.handleDeliverableToggle2.bind(this);
    console.log('AppLayout userid da backend: ', props.userid);
  }

  componentWillUnmount() {
    this.vm.$destroy();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({ sidebarOpen: nextProps.width === LARGE });
    }
  }

  setDeliverable(event) {
    this.setState({
        deliverable: false //event.target.value,
    });
  }

  // handleDeliverableToggle2 = id => this.setState({ deliverable: id });
  
  render() {
    let { sidebarOpen, Menus, UserAvatar, UserName, IdUser, deliverable } = this.state;
    let userAvatarUrl = UserAvatar ? UserAvatar : null;

    const paddingLeftSidebar = 236;
    const styles = {
      header: { paddingLeft: sidebarOpen ? paddingLeftSidebar : 0 },
      container: {
        margin: '80px 20px 20px 15px',
        paddingLeft: sidebarOpen && this.props.width !== SMALL ? paddingLeftSidebar : 0
      }
    };

    const handleSidebarToggle = () => this.setState({ sidebarOpen: !this.state.sidebarOpen });
    const handleDeliverableToggle = () => {
      // console.log('handleDeliverableToggle value: ', value);
      this.setState({ deliverable: !this.state.deliverable });
    }
    // const handleDeliverableToggle1 = id => this.handleDeliverableToggle2({ deliverable: id });

    return ( true ? // this.state.deliverable == 1 ? 
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header styles={styles.header} onSidebarToggle={handleSidebarToggle} onDeliverableToggle={handleDeliverableToggle} deliv={deliverable} />
          <Sidebar vm={this.vm} logoTitle={"LIS_d_" + (+deliverable)} open={sidebarOpen} userAvatarUrl={userAvatarUrl} menus={Menus} username={UserName} userid={IdUser} />
          <div id="Content" style={styles.container} />
          {/* cambia deliverable al click su QUALUNQUE COSA nel div : onClick={handleDeliverableToggle} */ }
          {/* non funziona : userid={IdUser} */}
        </div>
      </MuiThemeProvider>
      :
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          Deliverable 2
          <Header styles={styles.header} onSidebarToggle={handleSidebarToggle} />
          
          <div id="Content" style={styles.container} /> {/* userid={IdUser} */}
        </div>
      </MuiThemeProvider>
    );
    
  }
}

AppLayout.propTypes = {
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
  IdUser: PropTypes.number,
  menus: PropTypes.array,
  width: PropTypes.number
};

export default withWidth()(AppLayout);
