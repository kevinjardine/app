import {default as AppBar}  from '@material-ui/core/AppBar';

// import {default as FormLabel} from '@material-ui/core/FormLabel';
import {default as IconButton} from '@material-ui/core/IconButton';
import {default as Input} from '@material-ui/core/Input';

import {default as Toolbar} from '@material-ui/core/Toolbar';
import {default as Typography} from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import SearchIcon from '@material-ui/icons/Search';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Tooltip from '@material-ui/core/Tooltip';
import copy from 'copy-to-clipboard';
import MapMenu from './MapMenu';

import * as React from 'react';

const styles:any = (theme:any) => ({
  grow: {
    flexGrow: 1,
  },
  inputInput: {
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      '&:focus': {
        width: 200,
      },
      width: 120,
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  root: {
    width: '100%',
  },
  search: {
    '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    backgroundColor: fade(theme.palette.common.white, 0.15),
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    width: theme.spacing.unit * 9,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

class SearchInput extends React.Component<any,any> {

  constructor(props:any) {
    super(props);
    this.state = {
      search: ''
    };
  }

  public setSearch = (e:any) => {
    console.log('in setSearch',e.target.value);
    this.setState({ search: e.target.value});
  }

  public keyPress = (e:any) => {
    if(e.keyCode === 13) {
      let searchBit = this.state.search;
      if (/^\d+$/.test(searchBit)) {
				searchBit = 'Gaia DR2 '+searchBit;
			}
      this.props.updateSearch(searchBit);
      e.target.value = "";
    }
  }

  public handleFocus = () => {
    this.props.setSearchDone(true);
  }

  public render() {
    const { classes, keyPress } = this.props;
    let thisE:any = document.getElementById("searchField");
    return (
    <Input
      id="searchField"
      type="search"
      placeholder="Search…"
      disableUnderline={true}
      autoComplete="off"
      classes={{
        input: classes.inputInput,
        root: classes.inputRoot,
      }}
      onChange={this.setSearch}
      onKeyDown={this.keyPress}
      onFocus={this.handleFocus}
    />
    )
  }
}

class SearchAppBar extends React.Component<any,any> {
  constructor(props:any) {
      super(props);
      console.log('props in SearchAppBar',props);
  }

  public componentDidMount() {
    //this.props.setSearchDone(true);
  }

  public updateSearch = (s:any) => {
    console.log('in updateSearch',s);
    //this.setState({ search: s});
    const e_xg:any = document.getElementById("gaia-xg");

        if (e_xg) {
            e_xg.value = "";
		}

		const e_yg:any = document.getElementById("gaia-yg");

        if (e_yg) {
            e_yg.value = "";
		}

		const e_zoom:any = document.getElementById("gaia-zoom");

        if (e_zoom) {
            e_zoom.value = "";
		}
    this.props.setSearch(s);
    this.props.setSearchDone(false);
  }

  public updateBookmark = (e:any) => {
    //this.setState({ bookmark: true});
    const bookmarkElement:any = document.getElementById('gaia-search-bookmark-link');
    copy(bookmarkElement.href);
  }  

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <MapMenu {... this.props} />            
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <SearchInput classes ={classes} updateSearch={this.updateSearch} setSearchDone={this.props.setSearchDone}/>
            </div>
            <Tooltip title="Copy view URL">
            <IconButton onClick={this.updateBookmark} style={{position:"relative", left:"10px"}}>
                <BookmarkIcon />
            </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(SearchAppBar);
