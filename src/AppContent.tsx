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
          setError={this.props.setError}
          errorMsg={this.props.errorMsg}
          windowHeight={this.props.windowHeight}
          windowWidth={this.props.windowWidth}
        />
        <div id="map-buffer" style={{paddingTop:'57px',clear:'both',height:'5px'}} />
        <Map {... this.props} />        
      </div>
    );
  }
}

export default AppContent;
