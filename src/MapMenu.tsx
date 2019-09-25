import React from 'react';
import {default as Button} from '@material-ui/core/Button';
import {default as Dialog} from '@material-ui/core/Dialog';
import {default as DialogActions} from '@material-ui/core/DialogActions';
import {default as DialogContent} from '@material-ui/core/DialogContent';
import {default as DialogContentText} from '@material-ui/core/DialogContentText';
import {default as DialogTitle} from '@material-ui/core/DialogTitle';
import {default as FormControl} from '@material-ui/core/FormControl';
import {default as FormControlLabel} from '@material-ui/core/FormControlLabel';
import {default as FormGroup} from '@material-ui/core/FormGroup';
import {default as FormHelperText} from '@material-ui/core/FormHelperText';
import {default as RadioGroup} from '@material-ui/core/RadioGroup';
import {default as Radio} from '@material-ui/core/Radio';
import CloseIcon from '@material-ui/icons/Close';
import {default as IconButton} from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {default as Switch} from '@material-ui/core/Switch';

enum Displayed {
  Settings,
  Help,
  Legend,
  Sources,
  Acknowledgements,
  NoDisplay
}

class MapMenu extends React.Component<any,any> {
  state = {
    anchorEl: null,
    zoom_bookmark: this.props.zoom_bookmarkBit === 'Z'?true:false,
    guide: this.props.guideBit === 'G'?true:false,
    open: false,
    overlay: 'C',
    display: Displayed.NoDisplay
  };

  handleClick = (event:any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClose2 = () => {
    this.setState({ display: Displayed.NoDisplay });
  };

  public handleClickOpen = () => {
    this.setState({ open: true });
  };

  public handleChange = (name: string) => (event: any) => {
    this.setState({ [name]: event.target.checked });
  };

  public handleDisplay = (kind: Displayed) => {
    this.setState({ display: kind });
    this.handleClose();
  };

  public handleSet = () => {
    const guide = this.state.guide?'G':'N';
    const zoom_bookmark = this.state.zoom_bookmark?'Z':'N';
    this.props.setOptions(guide,zoom_bookmark,this.state.overlay);
    this.handleClose2();
  };

  public handleOverlayChange = (event: any) => {
    this.setState({ overlay: event.target.value });
    console.log('radio', event.target.value);
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <IconButton 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="Open drawer"
            onClick={this.handleClick}
        >
            <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
            <MenuItem onClick={() => this.handleDisplay(Displayed.Settings)}>Settings</MenuItem>
            <MenuItem onClick={() => this.handleDisplay(Displayed.Help)}>Help</MenuItem>
            <MenuItem onClick={() => this.handleDisplay(Displayed.Legend)}>Legend</MenuItem>
            <MenuItem onClick={() => this.handleDisplay(Displayed.Sources)}>Sources</MenuItem>
            <MenuItem onClick={() => this.handleDisplay(Displayed.Acknowledgements)}>Acknowledgements</MenuItem>
        </Menu>
        <Dialog
          open={this.state.display == Displayed.Settings}
          onClose={this.handleClose2}
          aria-labelledby="form-dialog-title"
        >
        <DialogTitle disableTypography={true} style={{alignItems:"center",display:"flex",height:"20px",
        justifyContent: "space-between"}}>
            <h2 style={{color:"white"}}>Map display</h2>
            <IconButton onClick={this.handleClose2} style={{position:"relative", left:"10px"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
            Choose options
        </DialogContentText>
        <FormHelperText>General</FormHelperText>
        <FormControl component={"fieldset" as "div"}>                  
            <FormGroup>
            <FormControlLabel
                control={
                <Switch
                    checked={this.state.guide}
                    onChange={this.handleChange('guide')}
                    value="guide"
                />
                }
                label="Show guide lines"
            />
            <FormControlLabel
                control={
                <Switch
                    checked={this.state.zoom_bookmark}
                    onChange={this.handleChange('zoom_bookmark')}
                    value="zoom_bookmark"
                />
                }
                label="Add zoom animation to bookmarks"
            />
            </FormGroup>
            <FormControl component={"fieldset" as "div"}>
            <FormHelperText>Overlays</FormHelperText>
            <RadioGroup aria-label="overlay" name="overlay1" defaultValue={this.state.overlay} onChange={this.handleOverlayChange}>
                <FormControlLabel value="N" control={<Radio />} label="None" />
                <FormControlLabel value="C" control={<Radio />} label="Clusters and dust clouds" />
                <FormControlLabel value="M" control={<Radio />} label="Masers" />
                <FormControlLabel value="E" control={<Radio />} label="Exoplanet stars (d > 100 pc)" />
            </RadioGroup>
            </FormControl>
            <FormHelperText>Click on "Set" to redisplay map</FormHelperText>
        </FormControl>
        </DialogContent>
        <DialogActions>
        <Button onClick={this.handleClose2} color="default">
            Cancel
        </Button>
        <Button onClick={this.handleSet} color="default">
            Set
        </Button>
        </DialogActions>
    </Dialog>
    <Dialog
          open={this.state.display == Displayed.Help}
          onClose={this.handleClose2}
          aria-labelledby="form-dialog-title"
        >
        <DialogTitle disableTypography={true} style={{alignItems:"center",display:"flex",height:"20px",
        justifyContent: "space-between"}}>
            <h2 style={{color:"white"}}>Help</h2>
            <IconButton onClick={this.handleClose2} style={{position:"relative", left:"10px"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Help would go here.
          </DialogContentText>
        </DialogContent>
    </Dialog>
    <Dialog
          open={this.state.display == Displayed.Legend}
          onClose={this.handleClose2}
          aria-labelledby="form-dialog-title"
        >
        <DialogTitle disableTypography={true} style={{alignItems:"center",display:"flex",height:"20px",
        justifyContent: "space-between"}}>
            <h2 style={{color:"white"}}>Legend</h2>
            <IconButton onClick={this.handleClose2} style={{position:"relative", left:"10px"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <div id="legend"></div>
        </DialogContent>
    </Dialog>
    <Dialog
          open={this.state.display == Displayed.Sources}
          onClose={this.handleClose2}
          aria-labelledby="form-dialog-title"
        >
        <DialogTitle disableTypography={true} style={{alignItems:"center",display:"flex",height:"20px",
        justifyContent: "space-between"}}>
            <h2 style={{color:"white"}}>Sources</h2>
            <IconButton onClick={this.handleClose2} style={{position:"relative", left:"10px"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
<h3>Star density</h3>
<p>The upper main sequence star selection uses colours and distances derived from 2MASS and
Gaia DR2 data for about 600 thousand stars as described in:</p>

<p>Poggio, E., R. Drimmel, M. G. Lattanzi, R. L. Smart, A. Spagna, R. Andrae, 
C. A. L. Bailer-Jones et al. 
"The Galactic warp revealed by Gaia DR2 kinematics" <i>Monthly Notices of the 
Royal Astronomical Society: Letters</i> 481, no. 1 (2018): L21-L25.</p>
<p>(Thank you to Eloisa Poggio for providing the latest version of this data set on 30 August 2019.)</p>
<p>This was merged with StarHorse data for an additional 200 thousand stars with
(BPRP0 &lt; -0.1) and (SH_GAIAFLAG == '000') and (SH_OUTFLAG == '00000')
from:</p>
<p>Anders, F., et al. "Photo-astrometric distances, extinctions, and astrophysical parameters
  for Gaia DR2 stars brighter than G = 18." <i>arXiv preprint arXiv:1904.11302</i> (2019).</p>
<p>A gap in the map of nearby hot stars is filled in using a database of about 10 thousand OB stars within 1 kpc using SIMBAD colours
and Bailer-Jones distances derived from Gaia DR2.</p>
<h3>OB associations</h3>
<p>OB association positions computed from the median distance to the member stars given in
the data set first described in:</p>
<p>Humphreys, R. M. "Studies of luminous stars in nearby galaxies. I. Supergiants and O stars in the Milky Way"
<i>Astrophysical Journal, Suppl. Ser.</i>, Vol. 38, p. 309 - 350</p>
<h3>HII regions</h3>
<p>HII region positions computed from the median distance to known ionizing stars or clusters.</p>
<h3>Star clusters</h3>
<p>Cantat-Gaudin, Tristan, C. Jordi, A. Vallenari, A. Bragaglia, L. Balaguer-Núñez, C. Soubiran, D. Bossini et al. 
"A Gaia DR2 view of the open cluster population in the Milky Way" <i>Astronomy &amp; Astrophysics</i> 618 (2018): A93.</p>
<p>Cantat-Gaudin, T., et al. "Gaia DR2 unravels incompleteness of nearby cluster population: new open clusters 
  in the direction of Perseus." <i>Astronomy &amp; Astrophysics</i> 624 (2019): A126.</p>
<h3>Dust</h3>
<p>Lallement, R., et al. "Gaia-2MASS 3D maps of Galactic interstellar dust within 3 kpc." <i>Astronomy &amp; Astrophysics</i> 625 (2019): A135.</p>
          </DialogContentText>
        </DialogContent>
    </Dialog>
    <Dialog
          open={this.state.display == Displayed.Acknowledgements}
          onClose={this.handleClose2}
          aria-labelledby="form-dialog-title"
        >
        <DialogTitle disableTypography={true} style={{alignItems:"center",display:"flex",height:"20px",
        justifyContent: "space-between"}}>
            <h2 style={{color:"white"}}>Acknowledgements</h2>
            <IconButton onClick={this.handleClose2} style={{position:"relative", left:"10px"}}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
<p>This work has made use of data from the European Space Agency (ESA) <a style={{color:'white'}} href="http://www.cosmos.esa.int/gaia">Gaia</a> mission, 
processed by the Gaia Data Processing and Analysis
Consortium (<a style={{color:'white'}} href="http://www.cosmos.esa.int/web/gaia/dpac/consortium">DPAC</a>).</p>
<p>Funding for the DPAC has been provided by national institutions, in particular the 
institutions participating in the Gaia Multilateral Agreement.</p>
<p>This work has made use of the SIMBAD database, operated at CDS, Strasbourg, France.</p>
<p>I'd like to thank Eloisa Poggio and Ron Drimmel, who supplied the main hot star data for the map;
  Stefan Payne-Wardenaar, a Blender expert who advised on density rendering; and Anthony Brown, the chair of the Gaia Data Processing and Analysis
Consortium, who encouraged me to take on this mapping project before the release of Gaia DR2. </p>
<p>I'd also like to thank the Kickstarter supporters who funded the powerful  <a style={{color:'white'}} href="https://twitter.com/galaxy_map/status/1103986630539517958?s=20">Bok Machine</a> workstation used to compute the maps, including the major funders:
  Bob Benjamin, Robert Brandon, Colby Gutierrez-Kraybill, Richard Hendricks, and Greg Whitten.</p>
<p>-- Kevin Jardine, cartographer</p>
          </DialogContentText>
        </DialogContent>
    </Dialog>
    </div>
    );
  }
}

export default MapMenu;
