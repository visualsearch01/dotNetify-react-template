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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

const bstyle = {
  margin: 12,
};

/*
this.state = {
        count: this.props.count
      }
    }
  increment(){
    console.log("this.props.count");
    console.log(this.props.count);
    let count = this.state.count
    count.push("new element");
    this.setState({ count: count})
  }
  render() {

    return (
      <View style={styles.container}>
        <Text>{ this.state.count.length }</Text>
        <Button
          onPress={this.increment.bind(this)}
          title={ "Increase" }
        />
      </View>
*/

const Sidebar = props => {
  let { vm, logoTitle, open, userAvatarUrl, menus_del1, menus_del2, deliv } = props;
  console.log('Sidebar - props.deliv: ', deliv);
  console.log('Sidebar - props.menus_del1: ', menus_del1);
  const styles = {
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
        fontWeight: 300,
        textShadow: '1px 1px #444'
      }
    }
  };

// style={{ width: 300 }}
// style={styles.avatar.span}
// options={top100Films}
  /*
  <div>
        <Autocomplete
          id="combo-box-demo"
          dataSource={top100Films}
          dataSourceConfig={ {text: 'title', value: 'year'}  }
          getOptionLabel={option => option.title}
          style={styles.menuItem}
          renderInput={params => (
            <TextField {...params} label="Combo box" variant="outlined" style={styles.menuItem} />
          )}
        />
      </div>
          getOptionLabel={option => option.title}

  renderInput={params => (
            <TextField {...params} label="Combo box" variant="outlined" style={styles.avatar.span} />
          )}
  autoWidth={true}
  */

  const handleClickButton = _ => {
    menus_del1 = menus_del1.slice(1);
    console.log('Sidebar - sliced menus_del1: ', menus_del1); // I props di un componente non sono aggiornabili dal component stesso
  }

  const ConsoleLog = ({ children }) => {
    console.log('Sidebar ConsoleLog - children: ', children);
    return false;
  };
  return (
    <Drawer docked={true} open={open}>
      <ConsoleLog>{ menus_del1 }</ConsoleLog>
      <div style={styles.logo}>
        {/*logoTitle*/}
        <img heigth="57px" width="57px" src="dist/Rai _Logo RGB.png" />
        Progetto LIS
      </div>
      <div style={styles.avatar.div}>
        <Avatar src={userAvatarUrl} size={styles.avatar.size} style={styles.avatar.icon} />
        <span style={styles.avatar.span}>Nome utente: {props.username}</span>
        <span style={styles.avatar.span}>ID utente: {props.userid}</span>
      </div>
      <div>
        <Menu>
{ (Array.isArray(menus_del1) && menus_del1.length) ?
          <MenuItem
            primaryText="Meteo"
            checked={false}
            style={styles.menuItem}
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
          :
          null }
          <Divider />
{ (Array.isArray(menus_del2) && menus_del2.length) ?
          <MenuItem
            primaryText="Didattica"
            checked={false}
            style={styles.menuItem}
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
          :
          null }
        </Menu>
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool,
  menus_del1: PropTypes.array,
  menus_del2: PropTypes.array,
  username: PropTypes.string,
  userid: PropTypes.any,
  userAvatarUrl: PropTypes.string
};

export default Sidebar;
