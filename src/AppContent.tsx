import * as React from 'react';
import Map from './Map';
import SearchAppBar from './SearchAppBar';

import './App.css';

class AppContent extends React.Component<any,any> {
  constructor(props:any) {
    super(props);
  }

  public render() {
    console.log('props in AppContent',this.props);
    return (
      <div className="AppContent">
        <SearchAppBar
          guideBit={this.props.guideBit}
          zoom_bookmarkBit={this.props.zoom_bookmarkBit}
          search={this.props.search}
          setSearch={this.props.setSearch}
          setSearchDone={this.props.setSearchDone}
          setOptions={this.props.setOptions}
          windowHeight={this.props.windowHeight}
          windowWidth={this.props.windowWidth}
        />
        <div id="map-buffer" style={{paddingTop:'50px',clear:'both',height:'5px'}} />
        <p id="error" />
        <a id="gaia-search-bookmark-link" style={{display:'none'}} href="">None</a>
        <Map {... this.props} />        
      </div>
    );
  }
}

export default AppContent;
