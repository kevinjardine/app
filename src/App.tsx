import { createMuiTheme,MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';

import AppContent from './AppContent';

import './App.css';
// import Description from './Description';
// import Header from './Header';

// import logo from './logo.svg';

class App extends React.Component<any,any> {
  constructor(props:any) {
    super(props);
    this.state = {
      zoom_bookmarkBit: 'N',
      guideBit: 'G',
      overlay: 'C',
      search: '',
      searchSource: '',
      searchDone: true,
      windowHeight: 0,
      windowWidth: 0,
      x: false,
      y: false,
      w: false,
      h: false,
      bookmark: 'nothinghere',
      errorMsg: ''
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  public setSearch = (search: string, source: string) => {
    console.log('setSearch',search);
    this.setState({search});
    this.setState({searchSource:source});
  }

  public setSearchDone = (searchDone: boolean) => {
    console.log('setSearchDone',searchDone);
    this.setState({searchDone});
  }

  public setError = (errorMsg: string) => {
    this.setState({errorMsg});
    this.setSearch('','');
    const searchElement = document.getElementById("searchField");
		if (searchElement) {
			searchElement.blur();
		}
  }

  public setBookmark = (bookmark: string) => {
    this.setState({bookmark});
  }

  public updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  public setOptions = (guideBit:string,zoom_bookmarkBit:string,overlay:string) => {
    console.log('call to setOptions',guideBit,zoom_bookmarkBit,overlay);
    this.setState({guideBit,zoom_bookmarkBit,overlay});
    this.setSearchDone(true);
  }

  public componentWillMount() {
    this.setUrlParams();
  }

  public componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    //this.setUrlParams();
  }
  
  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  public render() {
    // const {distanceEstimator,dustBit,guideBit,ionizingBit,search} = this.state;
    console.log('state',this.state);
    const myTheme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        type: 'dark',
      },
    });
    return (
      <MuiThemeProvider theme={myTheme}>
        <div className="App">      
          <AppContent {... this.state} 
            setSearch = {this.setSearch} 
            setSearchDone={this.setSearchDone} 
            setOptions = {this.setOptions} 
            setBookmark = {this.setBookmark}
            setError = {this.setError} />
        </div>
      </MuiThemeProvider>
    );
  }

  private decode = (s:string) => {
    const pl = /\+/g;  // Regex for replacing addition symbol with a space
    return decodeURIComponent(s.replace(pl, " ")); 
  }

  private setUrlParams = () => {
   
    const search = /([^&=]+)=?([^&]*)/g;
    const query  = window.location.search.substring(1);
    const urlParams:any = {};

    console.log('in setUrlParams',query);
    
    while (true) {
      const match:any = search.exec(query);
      
      if (!match) {
        break;
      }
      
      urlParams[this.decode(match[1])] = this.decode(match[2]);    
    }
    if ('tileset' in urlParams) {
      const tileSet = urlParams.tileset;      
      
      if (tileSet.indexOf('G') !== -1) {
        this.setState({guideBit:'G'});
      } else {
        this.setState({guideBit:'N'});
      }
      if (tileSet.indexOf('Z') !== -1) {
        this.setState({zoom_bookmarkBit:'Z'});
      }
      if (tileSet.indexOf('E') !== -1) {
        this.setState({overlay:'E'});
      } else if (tileSet.indexOf('M') !== -1) {
        this.setState({overlay:'M'});
      } else if (tileSet.indexOf('C') !== -1) {
        this.setState({overlay:'C'});
      } else {
        this.setState({overlay:'N'});
      }
      
    } else {
      this.setState({guideBit:'G'});
      this.setState({zoom_bookmarkBit:'Z'});
      this.setState({overlay:'C'});
    }

    if ('search' in urlParams) {
      this.setState({search:urlParams.search.trim()});
      this.setState({searchDone:false});
      this.setState({searchSource:'url'});
      if (('x' in urlParams) && ('y' in urlParams)) {
        this.setState({x:parseFloat(urlParams.x)});
        this.setState({y:parseFloat(urlParams.y)});
        this.setState({w:parseFloat(urlParams.w)});
        this.setState({h:parseFloat(urlParams.h)});
      }
    } else if (('x' in urlParams) && ('y' in urlParams)) {
      this.setState({searchDone:true});
      this.setState({search:''});
      this.setState({searchSource:''});
			// this.setState({x:parseFloat(urlParams.xg)});
      // this.setState({y:parseFloat(urlParams.yg)});
      this.setState({x:parseFloat(urlParams.x)});
      this.setState({y:parseFloat(urlParams.y)});
      this.setState({w:parseFloat(urlParams.w)});
      this.setState({h:parseFloat(urlParams.h)});
		}
  }
}

export default App;
