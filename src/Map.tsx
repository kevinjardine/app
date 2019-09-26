// import InfoBox from './InfoBox';

import * as React from 'react';
import {default as Dialog} from '@material-ui/core/Dialog';
import {default as DialogActions} from '@material-ui/core/DialogActions';
import {default as DialogContent} from '@material-ui/core/DialogContent';
import {default as DialogContentText} from '@material-ui/core/DialogContentText';
import {default as DialogTitle} from '@material-ui/core/DialogTitle';
import {default as IconButton} from '@material-ui/core/IconButton';
import {default as CloseIcon} from '@material-ui/icons/Close';
import axios from 'axios';
// import {default as d3} from 'd3';
import * as d3 from 'd3';
import markerImg from "./marker.png";
import { image } from 'd3';

// const dataUrlPrefix = 'http://localhost:3000';
// const dataUrlPrefix = 'http://gruze.org/galaxymap/poster2/poster2a';
let dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/main_no_guides_png';
const posterUrl = 'http://localhost:3000';
// const posterUrl = 'http://galaxymap.org/app_beta3';
const scaleWidth = 1024;

// declare var d3: any;
declare var OpenSeadragon: any;

class Map extends React.Component<any,any> {
    constructor(props:any) {
		super(props);
		
        this.state = {
            showStarInfo: false,
            starData: {},
            viewer: false
		};
    }

    // public componentWillMount() {
    //     const {glon,glat,distance} = this.props;
    //     const cosl = Math.cos(glon*Math.PI/180)
    //     const sinl = Math.sin(glon*Math.PI/180)
    //     const cosb = Math.cos(glat*Math.PI/180)
    //     const sinb = Math.sin(glat*Math.PI/180)
    //     const x = distance*cosb*cosl
    //     const y = distance*cosb*sinl
    //     const z = distance*sinb;
	// }
	
	public componentDidMount() {
		
		//const tileSet = this.props.ionizingBit+this.props.guideBit+this.props.dustBit;
		//const tileSource = dataUrlPrefix+"/tiles3/poster_"+tileSet+".dzi";
		//this.props.setBookmark('eagle');
		
		const viewer = OpenSeadragon({
			autoHideControls: true,
			blendTime: 1,
			controlsFadeDelay: 3000,
			id: "openseadragon1",
			maxZoomPixelRatio: 1.5,
			visibilityRatio: 0.4,
			minZoomImageRatio: 0.7,
			prefixUrl: "images/",
			showFullPageControl: true,			
			showRotationControl: false
			
			// tileSources: {
			// 	tileSource,
			// 	width: scaleWidth,
			// 	x: 0,
			// 	y: 0,
			// }
		});		
		this.setState({viewer:viewer});
		//this.props.setSearchDone(true);
	}

	// public componentDidUpdate() {
	// 	this.props.setSearchDone(true);
	// }

    public render() {
		if (this.props.guideBit == 'N') {
			if (this.props.overlay == 'M') {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_MN';
			} else if (this.props.overlay == 'E') {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_EN';
			} else if (this.props.overlay == 'C') {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_CN';
			} else {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_NN';
			}
		} else {
			if (this.props.overlay == 'M') {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_MG';
			} else if (this.props.overlay == 'E') {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_EG';
			} else if (this.props.overlay == 'C') {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_CG';
			} else {
				dataUrlPrefix = 'http://gruze.org/galaxymap/app_beta/tiles_NG';
			}
		}
		const tileSource = dataUrlPrefix+".dzi";
		console.log('tileSource',tileSource);
		const react_self = this;
		const errorElement = document.getElementById('error') as HTMLElement;
		if (errorElement) {
			errorElement.innerHTML = '';
		}
		console.log('props in Map.tsx',this.props,this.state);
		
		const viewer = this.state.viewer;
		if (viewer) {
			viewer.open({
				tileSource,
				width: scaleWidth,
				x: 0,
				y: 0,
			});
			let p:any = viewer.viewport.getCenter(true);
			// viewer.addOverlay({
			// 	element: this.newPushOverlay(),
			// 	placement: 'CENTER',
			// 	id: 'overlay-parent',
			// 	// x: 0.5003-0.14436,
			// 	// x: 0.50039-0.14436,
			// 	// y: 0.59839,
			// 	x: p.x,
			// 	y: p.y			
			// });
			viewer.addOnceHandler('open', () => {

				// var x, y, zoom, vp, p, d;
				let props = this.props;
				console.log('viewer open event triggered',props);
				//viewer.viewport.panTo(new OpenSeadragon.Point(0.50045*scaleWidth,0.72*scaleWidth),true);
				// viewer.viewport.panTo(new OpenSeadragon.Point(0.50045*scaleWidth,0.4*scaleWidth),true);

				const e_x:any = document.getElementById("gaia-x");
				let x = "";

				if (e_x) {
					x = e_x.value;
					console.log('x',x);
				}

				if (x == "") {
					viewer.viewport.panTo(new OpenSeadragon.Point(0.50045*scaleWidth,0.4*scaleWidth),true);
					//viewer.viewport.zoomTo(0.000001,null,true)
					//viewer.viewport.zoomTo(0.0001, null, true);
    				//viewer.viewport.applyConstraints();
				}

				if (x != "" && (props.searchDone || props.search == "")) {

					console.log("in top of if in Map.tsx");

					if (props.search == "") {
						console.log("clearing star overlay");
						this.clearOverlayElements();
					}

					const xn = parseFloat(x);

					const e_y:any = document.getElementById("gaia-y");

					const yn = parseFloat(e_y.value);

					const e_w:any = document.getElementById("gaia-w");

					const wn = parseFloat(e_w.value);

					const e_h:any = document.getElementById("gaia-h");

					const hn = parseFloat(e_h.value);

					console.log('found non-empty values', xn,yn,wn,hn);

					const bounds = new OpenSeadragon.Rect(xn,yn,wn,hn);

					viewer.viewport.fitBounds(bounds,true);
		
				} else if (props.search && !props.searchDone) {
					console.log('search',props.search);
					const searchName = props.search;
					const searchNameLC = searchName.toLowerCase();
					//props.setSearch('');
					
					if (searchNameLC === 'sun' || searchNameLC === 'sol') {
						viewer.addOnceHandler('animation-finish', () => {
							// TODO: get this to work with the child dialog
							react_self.makeStarDocBox(0,0,1000,0,0,0,'Sun','Sol','','G2V','4.83');
						});
						setTimeout(() => {react_self.slew(0,0,0,0,0,searchName,'G2V');},1000);		
					} else {
						// try object_lookup (HII regions and star clusters)
						let lookupURL = 'http://gruze.org:3004/query?object='+encodeURIComponent(searchNameLC);
						console.log('getting '+lookupURL);
						axios.get(lookupURL)
						.then(lookup_response => {
							if (lookup_response.data) {
								console.log('lookup_response',lookup_response);
								const j:any = lookup_response.data;
								const xg = parseFloat(j.x);
								const yg = parseFloat(j.y);
								const radius = parseFloat(j.r);
								react_self.zoomToObject(xg,yg,radius);
							} else {
								let mainName = '';
								let hip_id = '';
								let hd_id:string;
								let simbadURL = 'http://simbad.u-strasbg.fr/simbad/sim-script?submit=submit+script';
								simbadURL += '&script=format+object+f1+%22%25IDLIST%28SA%28+%7C+%29%3B1%2C*%2CHIP%2CHD%2C';
								simbadURL += 'Gaia%20DR2%2CNAME%29%3B%25SP%28S%29%3B%25COO%28d%3B%3BGAL%29%3B%25FLUXLIST%28V%3BF%29%3B%25plx%22%0D%0A%0D%0Aquery+';
								simbadURL += encodeURIComponent(searchNameLC);
								console.log('getting '+simbadURL);
								axios.get(simbadURL)
								.then(response => {
									let parallax:any;
									let error:any;
									let glon:number;
									let glat:number;
									let relMag:any;
									let mag:any;
									let plx;
									let plxSource;
									let errRatio;
									let distance:any;
									let distanceMinus:any;
									let distancePlus:any;
									let n;
									let source_id = '';
									let names = [];
									let starNames = [];
									let response_data = (response.data as any).toString();
									console.log(response_data);
									let status = response_data.split('\n').slice(-5)[0].slice(0,6);
									console.log(status);
									if (status == '::data') {
										let d:any = response_data.split('\n').slice(-3)[0].split(';');
										let name = d[0].split('|');
										mainName = name[0].trim();
										if (mainName.startsWith('* ')) {
											mainName = mainName.slice(2);
										}
										for (var i = 0; i < name.length; i++) {
											n = name[i].trim()
											if (n.startsWith('NAME ')) {
												names.push(n.slice(5));
											} else if (n.startsWith('Gaia DR2 ')) {
												source_id = n.slice(9);
											} else if (n.startsWith('HIP ')) {
												hip_id = n.slice(4);
											} else if (n.startsWith('HD ')) {
												hd_id = n.slice(3);
											} else if (n.startsWith('* ')) {
												starNames.push(n.slice(2));
											}
										}
										let combinedNames = names.concat(starNames);
										if (hd_id) {
											combinedNames.push('HD '+hd_id);
										}
										let otherNames:any = [];
										for (var i =0; i < combinedNames.length; i++) {
											name = combinedNames[i];
											if (name != mainName) {
												otherNames.push(name.replace(' ','&nbsp;'));
											}
										}
										
										let otherNamesJoin = otherNames.join(' | ');
										console.log(mainName,source_id,hip_id,names);
										let spectrum = d[1].trim();
										let coo = d[2].split(' ')[0];
										if (coo.split('+').length == 2) {
											coo = coo.split('+')
											glat = parseFloat(coo[1]);
										} else {
											coo = coo.split('-');
											glat = -parseFloat(coo[1]);
										}
										glon = parseFloat(coo[0])
										distanceMinus = '~';
										distancePlus = '~';
										relMag = d[3].trim();
										console.log('relMag',relMag);
										plx = d[4].split(' ');
										console.log(plx);
										plxSource = plx[3].trim();
										if (plx[0].trim() != '~') {
											parallax = parseFloat(plx[0].trim())
											if (plx[1].trim().slice(1,-1) != '~') {
												error = parseFloat(plx[1].trim().slice(1,-1))
												errRatio = error/parallax;
												if (source_id != '') {
													let bjURL = 'http://gruze.org:3003/ari?format=json&query=';
													bjURL += 'select%20*%20from%20gaiadr2_complements.geometric_distance%20where%20source_id%20%3D%20';
													bjURL += source_id;
													axios.get(bjURL)
													.then(json => {
														let json_data:any = Array(json.data);
														if (json_data.length > 0) {
															var d:any = json_data[0].data[0];
															console.log('bj',json);
															console.log('d.data',d);
															distance = Math.round(parseFloat(d[1]));
															distancePlus = Math.round(parseFloat(d[2]));
															distanceMinus = Math.round(parseFloat(d[3]));
															if (distance < 4500) {
																if (relMag != '~') {
																	mag = parseFloat(relMag)- 5*(Math.log10(distance) - 1);
																} else {
																	mag = '~';
																}
																viewer.addOnceHandler('animation-finish', function() {
																	react_self.makeStarDocBox(glon,glat,parallax,distance,distancePlus,distanceMinus,mainName,otherNamesJoin,source_id,spectrum,mag);
																});
																react_self.slew(glon,glat,distance,distancePlus,distanceMinus,searchName,spectrum);
																
																//errorElement.append('Slew using B-J distance successful.');
															} else {
																errorElement.append('Cannot display objects with a distance greater than 5000 pc.');
															}
														} else {
															errorElement.append('Cannot find Bailer-Jones distance.');
														}
													});
												} else {
													// use result from SIMBAD
													distance = Math.round(1000/parallax);
													distanceMinus = Math.round(1000/(parallax-error));
													distancePlus = Math.round(1000/(parallax+error));
													react_self.slew(glon,glat,distance,distancePlus,distanceMinus,searchName,spectrum);
												}
											} else {
												error = '~';
												errRatio = '~';
												distance = '~';
												errorElement.append('Cannot determine parallax error.');
											}
										} else {
											parallax = '~';
											error = '~';
											errRatio = '~';
											distance = '~';
											errorElement.append('Cannot determine parallax.');
										}
										console.log(name[0],spectrum,glon,glat,parallax,error,errRatio,plxSource,distance,distancePlus,distanceMinus);
									} else {
										// SIMBAD knows nothing about this id
										// if this is a Gaia DR2 id, try Vizier
										if (searchName.startsWith('Gaia DR2 ')) {
											source_id = searchName.slice(9);
											console.log('source_id',source_id);
											let vizierURL = 'http://vizier.u-strasbg.fr/viz-bin/asu-txt?-source=I%2F345%2Fgaia2&-out.add=_Glon%2C_Glat'
											vizierURL += '&-out=_Glon%20_Glat%20Plx%20e_Plx&-out.meta=-huD&Source='+source_id;
											axios.get(vizierURL)
											.then(response => {
												let response_data:any = response.data;
												response_data = response_data.toString();
												//console.log(response);
												let d = response_data.split('\n').slice(-4)[0];
												if (d[0] == '#') {
													console.log('error');
													errorElement.append('Cannot find a star with this Gaia DR2 ID.');
												} else {
													console.log(d);
													let ds = d.split(' ');
													let d2 = [];
													for (var i=0;i<ds.length;i++) {
														if (ds[i] != '') {
															d2.push(ds[i]);
														}
													}
													console.log(d2);
													glon = parseFloat(d2[0]);
													glat = parseFloat(d2[1]);
													parallax = parseFloat(d2[2]);
													error = parseFloat(d2[3]);
													errRatio = error/parallax;
													let bjURL = 'http://gruze.org:3003/ari?format=json&query=';
													bjURL += 'select%20*%20from%20gaiadr2_complements.geometric_distance%20where%20source_id%20%3D%20';
													bjURL += source_id;
													axios.get(bjURL)
													.then(jsonResponse => {
														let json_data = JSON.parse(JSON.stringify(jsonResponse));
														if (json_data.length > 0) {
															let d = json_data[0];
															console.log('bj',json_data);
															distance = Math.round(parseFloat(d[1]));
															distancePlus = Math.round(parseFloat(d[2]));
															distanceMinus = Math.round(parseFloat(d[3]));
															if (distance < 5000) {
																react_self.slew(glon,glat,distance,distancePlus,distanceMinus,searchName,'');
																//errorElement.append('Slew using B-J distance successful.');
															} else {
																errorElement.append('Cannot display stars with a distance greater than 5000 pc.');
															}
														} else {
															errorElement.append('Cannot find Bailer-Jones distance.');
														}
													});
												
													console.log(glon,glat,parallax,error,distance,distancePlus,distanceMinus);
												}
											});
										} else {
											errorElement.innerHTML = '<span>Cannot find an object with this ID.</span>';
										}
									
									}
								});
							}
						});
					}
				} else if (props.x !== false) {
					
					const bounds = new OpenSeadragon.Rect(props.x,props.y,props.w,props.h);

					viewer.viewport.fitBounds(bounds,true);
				} else {
					const p = new OpenSeadragon.Point(0.50205*scaleWidth,0.48190*scaleWidth);
					console.log('point',p);
					viewer.viewport.panTo(p,true);	
				}
				
				// const tracker = new OpenSeadragon.MouseTracker({
				// 	element: viewer.container,
				// 	moveHandler: (event:any) => {
				// 		this.updateBookmark();
				// 		//this.updateCoords(event.position,true);
				// 		// updateZoom(event.position); 
				// 		// updateCoords(event.position,true);
				// 	}			
				// });  
		
				// tracker.setTracking(true);
					
				viewer.addHandler('animation', (event:any) => {
					const p = event.eventSource.viewport.getCenter(false);
					const px = p.x;
					const py = p.y;
					this.updateBookmarkBounds();
					this.updateCoords(px,py);
					// updateZoom(p);
					// updateCoords(p,false);
				});
				
				viewer.addHandler('canvas-double-click', (o:any) => {viewer.viewport.panTo(viewer.viewport.pointFromPixel(o.position));});
				const e = document.getElementById('gaia-search');
				if (e) {
					viewer.addControl(e,{anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT});
				}
				viewer.addControl(document.getElementById('reticle-container'),{autoFade: true, anchor: OpenSeadragon.ControlAnchor.NONE});
				const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
				//if (!isMobile) {
					// ugly but this really only works for a mouse
					// so hide for mobile devices
					const ec = document.getElementById('gaiacontrols');
					if (ec) {
						viewer.addControl(ec,{anchor: OpenSeadragon.ControlAnchor.BOTTOM_LEFT});
					}		
				//}
				
			});
		}
        return (
			<div id="map-wrapper">
            	<div id="openseadragon1" style={{verticalAlign:'top', width: this.props.windowWidth+'px',height: (document.fullscreenElement?this.props.windowHeight:this.props.windowHeight-95)+'px'}} />
				<div style={{display:'none'}}>
					<div id="gaiacontrols">
						<div id="gaiacontrols-text">Longitude: <span id="gaialongitude">0</span>&deg;
							<br />Galactic plane distance: <span id="gaiadistance">0</span> pc
						</div>
					</div>
					<div id="reticle-container" draggable={false}>
						<div id="reticle"></div>
					</div>
				</div>
			</div>
        );
	}
	private makeStarDocBox = 
		(
			glon:number,
			glat:number,
			plx:number,
			distance:number,
			distancePlus:number,
			distanceMinus:number,
			name:string,
			other_names:string,
			source_id:string,
			spectrum:string,
			mag:string
		) => {
		let html = '';
		const cosl = Math.cos(glon*Math.PI/180)
		const sinl = Math.sin(glon*Math.PI/180)
		const cosb = Math.cos(glat*Math.PI/180)
		const sinb = Math.sin(glat*Math.PI/180)
		const x = distance*cosb*cosl
        const y = distance*cosb*sinl
		const z = distance*sinb;
		const r = Math.sqrt(x*x+y*y+z*z);
		console.log('coords',x,y,z,r);
		const label = name;
		const id = 'info';
		if (name === 'Sun') {
			html = '<div class="star-info">'
			html += '<div class="star-info-item"><div class="star-info-label">'+'also</div><div class="star-info-value">'+other_names+'</div></div>';
			html += '<div style="clear:both; height:5px;"></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'spec. type</div><div class="star-info-value">'+spectrum+'</div></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'abs. mag.</div><div class="star-info-value">'+mag+'</div></div>';
			html += '<div style="clear:both; height:5px;"></div>';
			html += '<div class="star-info-item">Orbited by four rocky planets and four gas giants. The third planet, Earth, is mostly harmless.</div>'
		} else {
			const lyDistance = 3.26156*distance;
			html = '<div class="star-info">'
			html += '<div class="star-info-item"><div class="star-info-label">'+'also</div><div class="star-info-value">'+other_names+'</div></div>';
			html += '<div style="clear:both; height:5px;"></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'(l,b)</div><div class="star-info-value">('+(Math.round(glon*100)/100)+'&deg;, '+(Math.round(glat*100)/100)+'&deg;)</div></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'parallax</div><div class="star-info-value">'+plx+' mas'+'</div></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'distance</div><div class="star-info-value">'+Math.round(distance)+' pc ('+Math.round(lyDistance)+' ly)</div></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'z</div><div class="star-info-value">'+Math.round(z)+' pc</div></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'spec. type</div><div class="star-info-value">'+spectrum+'</div></div>';
			if (mag == '~') {
				html += '<div class="star-info-item"><div class="star-info-label">'+'abs. mag.</div><div class="star-info-value">~</div></div>';
			} else {
				html += '<div class="star-info-item"><div class="star-info-label">'+'abs. mag.</div><div class="star-info-value">'+(Math.round(100*parseFloat(mag))/100)+'</div></div>';
			}
								
			html += '<div class="star-info-item"><div class="star-info-label">SIMBAD</div>';
			html += '<div class="star-info-value"><a target="_blank" href="http://simbad.u-strasbg.fr/simbad/sim-id?Ident='+encodeURIComponent(name)+'">'+name+'</a></div></div>';
			
			if (source_id) {
				const gaiaLink = 'http://vizier.cfa.harvard.edu/viz-bin/VizieR?-source=I/345/gaia2&-out.form=Detailed+results&Source='+source_id;
				html += '<div style="clear:both; height:5px;"></div>';
				html += '<div class="star-info-item"><div class="star-info-label">Gaia DR2</div>';
				html += '<div class="star-info-value"><a target="_blank" href="'+gaiaLink+'">'+source_id+'</a></div></div>';
			}
			
			html += '</div>';
		}

		const dialog =  <Dialog
			open={this.state.open}
			onClose={this.handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle disableTypography={true} style={{alignItems:"center",display:"flex",height:"20px",
			justifyContent: "space-between"}}>
			<h2 style={{color:"white"}}>Map display</h2>
			<IconButton onClick={this.handleClose} style={{position:"relative", left:"10px"}}>
				<CloseIcon />
			</IconButton>
		</DialogTitle>
			<DialogContent>
			<DialogContentText>
				Choose objects to display
			</DialogContentText>
			content goes handle
			</DialogContent> 
		</Dialog>		
	}

    private updateCoords = (px:number,py:number) => {
		const viewer = this.state.viewer;
		let vp:any;
		// console.log(p);
		// if (convert) {
		// 	vp = viewer.viewport.pointFromPixel(p);
		// } else {
		// 	vp = p;
		// }
		// console.log(vp);

		let x = px - (scaleWidth*0.50205);
		x *= 11.079;
		let y = py - (scaleWidth*0.48190);
		y *= 11.079;
		const r = Math.sqrt(x*x+y*y);
		//if (r <= 5000) {
			let l = (180/Math.PI)*Math.atan2(x,y)-90;
			if (l < 0) {
				l+= 360;
			}
			// console.log(r);
			let e = document.getElementById('gaiadistance');
			if (e) {
				//e.innerHTML = '('+x+','+y+')';
				e.innerHTML = r.toFixed(2);
			}
			e = document.getElementById('gaialongitude');
			if (e) {	
				e.innerHTML = l.toFixed(2);
			}
		//}
	};
	
	private updateBookmark = () => {
		const viewer = this.state.viewer;
		const vp = viewer.viewport.getCenter(true);
		const xg = vp.x;
		const yg = vp.y;
		
		const zoom = viewer.viewport.getZoom();
		// console.log(xg,yg,zoom);
		
		let bookmarkUrl = posterUrl+'?xg='+xg.toFixed(12)+'&yg='+yg.toFixed(12)+'&zoom='+zoom+'&tileset='+this.props.guideBit+this.props.zoom_bookmarkBit+this.props.overlay;
		if (this.props.search) {
			bookmarkUrl += '&search='+this.props.search;
		}
		
		const e_xg:any = document.getElementById("gaia-xg");

        if (e_xg) {
			e_xg.value = xg;
			//console.log('in updateBookmark, xg: ',e_xg.value);
		}

		const e_yg:any = document.getElementById("gaia-yg");

        if (e_yg) {
            e_yg.value = yg;
		}

		const e_zoom:any = document.getElementById("gaia-zoom");

        if (e_zoom) {
            e_zoom.value = zoom;
		}

        const e:any = document.getElementById("gaia-search-bookmark-link");

        if (e) {
            e.href = bookmarkUrl;
		}
		//this.props.setBookmark(bookmarkUrl);
	}

	private updateBookmarkBounds = () => {
		const viewer = this.state.viewer;
		const bounds = viewer.viewport.getBounds(true);
		const x = bounds.x;
		const y = bounds.y;
		const h = bounds.height;
		const w = bounds.width;
		
		const zoom = viewer.viewport.getZoom();
		// console.log(xg,yg,zoom);
		
		let bookmarkUrl = posterUrl+'?x='+x.toFixed(12)+'&y='+y.toFixed(12)+'&w='+w.toFixed(12)+'&h='+h.toFixed(12)+'&tileset='+this.props.guideBit+this.props.zoom_bookmarkBit+this.props.overlay;
		if (this.props.search) {
			bookmarkUrl += '&search='+this.props.search;
		}
		
		const e_x:any = document.getElementById("gaia-x");

        if (e_x) {
			e_x.value = x;
		}

		const e_y:any = document.getElementById("gaia-y");

        if (e_y) {
            e_y.value = y;
		}

		const e_w:any = document.getElementById("gaia-w");

		if (e_w) {
			e_w.value = w;
			//console.log('in updateBookmark, xg: ',e_xg.value);
		}

		const e_h:any = document.getElementById("gaia-h");

        if (e_h) {
            e_h.value = h;
		}

        const e:any = document.getElementById("gaia-search-bookmark-link");

        if (e) {
            e.href = bookmarkUrl;
		}
		//this.props.setBookmark(bookmarkUrl);
	}

	private handleClose = () => {
	}

	private handleSearch = () => {
		console.log('in handleSearch');

		const viewer = this.state.viewer;
		const vp = viewer.viewport.getCenter(true);

		const xg = vp.x;
		const yg = vp.y;
		const zoom = viewer.viewport.getZoom();
		let search = this.props.search;

		let bookmarkUrl = posterUrl;

		if (search) {
			search = search.trim();
		
			if (search) {
				// if the id is just a number, assume it is a DR source id
				if (/^\d+$/.test(search)) {
					search = 'Gaia DR2 '+search;
				}
				bookmarkUrl += '?search='+encodeURIComponent(search);
			} else {
				bookmarkUrl += '?xg='+xg.toFixed(12)+'&yg='+yg.toFixed(12)+'&zoom='+zoom;
			}
			
			window.location.href = bookmarkUrl;
		}
	}

	private hideKeyboard = () => {
		//this set timeout needed for case when hideKeyborad
		//is called inside of 'onfocus' event handler
		setTimeout(function() {
	  
		  //creating temp field
		  var field = document.createElement('input');
		  field.setAttribute('type', 'text');
		  //hiding temp field from peoples eyes
		  //-webkit-user-modify is nessesary for Android 4.x
		  field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
		  document.body.appendChild(field);
	  
		  //adding onfocus event handler for out temp field
		  field.onfocus = function(){
			//this timeout of 200ms is nessasary for Android 2.3.x
			setTimeout(function() {
	  
			  field.setAttribute('style', 'display:none;');
			  setTimeout(function() {
				document.body.removeChild(field);
				document.body.focus();
			  }, 14);
	  
			}, 200);
		  };
		  //focusing it
		  field.focus();
	  
		}, 50);
	  }

	private clearOverlayElements = () => {
		let elemPath = document.getElementById('overlay-path') as HTMLElement;
		let elemRect = document.getElementById('overlay-rect') as HTMLElement;
		let elemText = document.getElementById('overlay-text') as HTMLElement;
		let elemExtraText = document.getElementById('overlay-extratext') as HTMLElement;
		let elemCircle = document.getElementById('overlay-circle') as HTMLElement;
		let elemParent = document.getElementById('overlay-parent') as HTMLElement;
		if (elemPath && elemPath.parentNode) {
			elemPath.parentNode.removeChild(elemPath);
		}
		if (elemRect && elemRect.parentNode) {
			elemRect.parentNode.removeChild(elemRect);
		}
		if (elemText && elemText.parentNode) {
			elemText.parentNode.removeChild(elemText);
		}
		if (elemExtraText && elemExtraText.parentNode) {
			elemExtraText.parentNode.removeChild(elemExtraText);
		}
		if (elemCircle && elemCircle.parentNode) {
			elemCircle.parentNode.removeChild(elemCircle);
		}
		if (elemParent && elemParent.parentNode) {
			elemParent.parentNode.removeChild(elemParent);
		}
	}
	
	private slew = (glon:number,glat:number,distance:number,distancePlus:number,distanceMinus:number,label:string,spectrum:string) => {
		// const x = ((10.043)*(vp.x - (scaleWidth*0.504525)));
		// const y = ((10.047)*(vp.y - (scaleWidth*0.54628)));
		let bounds;
		
		const props = this.props;

		const searchElement = document.getElementById("searchField");
		if (searchElement) {
			searchElement.blur();
		}

		const xFactor = 0.50205;
		const yFactor = 0.4819;
		const xScale = 11.079;
		const yScale = 11.079;

		const viewer = this.state.viewer;
		const viewport = viewer.viewport;
		const r = distance/1000;
		const rMinus = distanceMinus/1000;
		const rPlus = distancePlus/1000;
		const cosl = Math.cos(glon*Math.PI/180);
		const sinl = Math.sin(glon*Math.PI/180);
		const cosb = Math.cos(glat*Math.PI/180);
		const sinb = Math.sin(glat*Math.PI/180);
		//const x = ((10.043)*(r*cosb*cosl - (scaleWidth*0.504525)));
		const x = (r*cosb*cosl/xScale+xFactor)*scaleWidth;
		//const y = ((10.047)*(r*cosb*sinl - (scaleWidth*0.54628)));
		const y = (-r*cosb*sinl/yScale+yFactor)*scaleWidth;

		const zg = distance*sinb;
		const xMinus = (rMinus*cosb*cosl/xScale+xFactor)*scaleWidth;
		const yMinus = (-rMinus*cosb*sinl/yScale+yFactor)*scaleWidth;
		//const xMinus = ((10.043)*(rMinus*cosb*cosl - (scaleWidth*0.504525)));
		//const yMinus = ((10.047)*(rMinus*cosb*sinl - (scaleWidth*0.54628)));
		const xPlus = (rPlus*cosb*cosl/xScale+xFactor)*scaleWidth;
		const yPlus = (-rPlus*cosb*sinl/yScale+yFactor)*scaleWidth;
		//const xPlus = ((10.043)*(rPlus*cosb*cosl - (scaleWidth*0.504525)));
		//const yPlus = ((10.047)*(rPlus*cosb*sinl - (scaleWidth*0.54628)));
		const reticleElement = document.getElementById('reticle') as HTMLElement;
		let overlay:any;
		let sign:string;

		// viewer.removeOverlay({
        //     element: reticleElement			
		// });

		this.clearOverlayElements();
		
		viewer.addOverlay({
            element: this.newPushOverlay(),
			placement: 'CENTER',
			id: 'overlay-parent',
			// x: 0.5003-0.14436,
			// x: 0.50039-0.14436,
			// y: 0.59839,
			x,
			y			
		});
		
		// The data for our line
		 //const lineData = [ { "x": xMinus,   "y": yMinus},  { "x": xPlus,  "y": yPlus}];
		 type Data = [number, number];
		 const lineData:Data[] = [[xMinus, yMinus],  [xPlus,yPlus]];
		 
		 // This is the accessor function we talked about above
		 var lineFunction:any = d3.line()
		 .x(function(d) { return d[0]; })
		 .y(function(d) { return d[1]; })
		 .curve(d3.curveLinear);   

		overlay = viewer.svgOverlay();

		d3.select(overlay.node()).append("path")
			.attr('id','overlay-path')
			.attr("d", lineFunction(lineData))
			.attr("stroke", "#eeeeee")
			.attr("stroke-width", 0.5)
			.attr("stroke-opacity", 0.6)
			.attr("stroke-linecap", "round")
			.attr("fill", "none");
		
		const d3Text:any = d3.select(overlay.node()).append("text")
			.attr('id','overlay-text')
			.attr("x", x)             
			.attr("y", y+3)
			.attr("text-anchor", "middle")
			.style("font-weight", "bold")			
			.style("font-size", "0.05em")
			.style("font-family", "Helvetica, Arial, sans-serif")
			.style("fill", "#000000")
			// .attr("fill-opacity", 0.0)
			// .attr("stroke-opacity", 0.0)
			.text(label);

		const bbox = d3Text.node().getBBox();
		const padding = 2;
		
		console.log('bb',bbox);
		
		d3.select(overlay.node()).insert("rect","text")
			.attr('id','overlay-rect')
			.attr("x", bbox.x-padding)
			.attr("y", bbox.y-padding*0.1)
			.attr("width", bbox.width+(padding*1.9))
			.attr("height", bbox.height+(padding*0.65))
			.style("fill", "#FFFFFF")
			.style("fill-opacity",0.85)
			.style("stroke", "#006000")
			.style("stroke-width",0.2);
			
		// let searchText:any = d3.select(overlay.node()).append("text")
		// 	.attr('id','overlay-text')
		// 	.attr("x", x)             
		// 	.attr("y", bbox.y+3.25*bbh)
		// 	.attr("text-anchor", "middle")
		// 	.style("font-weight", "bold")			
		// 	.style("font-size", "0.05em")
		// 	.style("font-family", "Helvetica, Arial, sans-serif")
		// 	.style("fill", "#000000")
		// 	.text(label);

		if (zg > 0) {
			sign = '+';
		} else {
			sign = '';
		}
		let extraText = '('+spectrum+'; '+distance.toFixed(0)+' pc) ['+sign+zg.toFixed(0)+']';

		let extraTextBit:any = d3.select(overlay.node()).append("text")
			.attr('id','overlay-extratext')
			.attr("x", x)             
			.attr("y", y+3.75)
			.attr("text-anchor", "middle")
			.style("font-weight", "normal")			
			.style("font-size", "0.03em")
			.style("font-family", "Helvetica, Arial, sans-serif")
			.style("fill", "#000000")
			.text(extraText);

			// var bbox = searchText.node().getBBox();
			// var padding = 0.5;
			// var rect = d3.select(overlay.node()).insert("rect", "text")
			// 	.attr("x", bbox.x - padding)
			// 	.attr("y", bbox.y - padding)
			// 	.attr("width", bbox.width + (padding*2))
			// 	.attr("height", bbox.height + (padding*2))
			// 	.style("fill", "red");

		console.log("in slew",this.props,this.state);

		if (props.zoom_bookmarkBit == 'N') {

			//const bounds = new OpenSeadragon.Rect(x-0.0001,y-0.0001,0.0002,0.0002,0);
			if (props.searchSource == 'url' && props.x !== false) {					
				bounds = new OpenSeadragon.Rect(props.x,props.y,props.w,props.h);
			} else {
				bounds = new OpenSeadragon.Rect(x-0.0001,y-0.0001,0.0002,0.0002,0);
			}			

			viewport.fitBoundsWithConstraints(bounds,true);
		} else {
		
			// viewer.viewport.zoomTo(7.6,new OpenSeadragon.Point(x,y), false);
			setTimeout(() => {
				let bounds: any;
				if (props.searchSource == 'url' && props.x !== false) {					
					bounds = new OpenSeadragon.Rect(props.x,props.y,props.w,props.h);
				} else {
					bounds = new OpenSeadragon.Rect(x-0.0001,y-0.0001,0.0002,0.0002,0);
				}
				// console.log(viewer.viewport.getBounds(true));
				// console.log(bounds);
				// viewer.viewport.goHome(true);
				
				this.withSlowOSDAnimation(viewport, () => {
					viewport.fitBoundsWithConstraints(bounds,false);
					// viewer.viewport.panTo(new OpenSeadragon.Point(x,y), false).zoomTo(12/scaleWidth,false);
				});
			}, 1500);
		}
	
	}

	private zoomToObject = (xg:number,yg:number,radius:number) => {
		// const x = ((10.043)*(vp.x - (scaleWidth*0.504525)));
		// const y = ((10.047)*(vp.y - (scaleWidth*0.54628)));
		let bounds;		
		const props = this.props;
		const viewer = this.state.viewer;
		const viewport = viewer.viewport;

		const searchElement = document.getElementById("searchField");
		if (searchElement) {
			searchElement.blur();
		}
		// const xFactor = 0.50068;
		// const yFactor = 0.53575;
		// // const xScale = 12.724;
		// const xScale = 11.720;
		// const yScale = 11.717;
		// const xFactor = 210.45;
		// const yFactor = 224;
		// const xScale = 1;
		// const yScale = 1;

		const xFactor = 0.50205*scaleWidth;
		const yFactor = 0.4819*scaleWidth;
		// const xScale = 11.717;
		// const yScale = 11.717;
		const xScale = 11.079;
		const yScale = 11.079;

		//const x = ((10.043)*(r*cosb*cosl - (scaleWidth*0.504525)));
		const x = (xg/xScale+xFactor);
		//const x = scaleWidth*(xFactor+(0)/(scaleWidth*xScale));
		//const xr = scaleWidth*(xFactorReticule+xg/(scaleWidth*xScale));
		//const y = ((10.047)*(r*cosb*sinl - (scaleWidth*0.54628)));
		const y = (-yg/yScale+yFactor);
		//const y = scaleWidth*(yFactor-(-2000)/(scaleWidth*yScale));
		//const yr = scaleWidth*(yFactorReticule-yg/(scaleWidth*yScale));

		console.log('xg yg',xg,yg);

		console.log('x y',x,y);

		let overlay:any;

		// viewer.removeOverlay({
        //     element: reticleElement			
		// });

		this.clearOverlayElements();

		// viewer.addOverlay({
        //     element: this.newPushOverlay(),
		// 	placement: 'CENTER',
		// 	id: 'overlay-parent',
		// 	// x: 0.5003-0.14436,
		// 	// x: 0.50039-0.14436,
		// 	// y: 0.59839,
		// 	x,
		// 	y,			
		// });

		overlay = viewer.svgOverlay();
	
		d3.select(overlay.node()).append("circle")
			.attr('id','overlay-circle')
			.attr("cx", x+0.085)
			.attr("cy", y-0.05)
			.attr("r", radius/11.8)
			.style('fill','none')
			.style("stroke", "#00FF00")
			.attr("stroke-opacity", 0.6)
			.style("stroke-width",0.22);
		
		// viewer.viewport.zoomTo(7.6,new OpenSeadragon.Point(x,y), false);
		if (props.zoom_bookmarkBit == 'N') {

			//const bounds = new OpenSeadragon.Rect(x-0.0001,y-0.0001,0.0002,0.0002,0);
			if (props.searchSource == 'url' && props.x !== false) {					
				bounds = new OpenSeadragon.Rect(props.x,props.y,props.w,props.h);
			} else {
				bounds = new OpenSeadragon.Rect(x-0.1*radius,y-0.1*radius,0.2*radius,0.2*radius);
			}			

			viewport.fitBoundsWithConstraints(bounds,true);
		} else {
			setTimeout(() => {
				let bounds: any;
				if (props.searchSource == 'url' && props.x !== false) {					
					bounds = new OpenSeadragon.Rect(props.x,props.y,props.w,props.h);
				} else {
					bounds = new OpenSeadragon.Rect(x-0.1*radius,y-0.1*radius,0.2*radius,0.2*radius);
				}
				// console.log(viewer.viewport.getBounds(true));
				// console.log(bounds);
				// viewer.viewport.goHome(true);
				this.withSlowOSDAnimation(viewport, () => {
					viewport.fitBoundsWithConstraints(bounds,false);
					// viewer.viewport.panTo(new OpenSeadragon.Point(x,y), false).zoomTo(12/scaleWidth,false);
				});
			}, 1500);
		}	
	}

	private newPushOverlay = () => {
        var img = document.createElement("img");
        img.src = markerImg;
		img.width = 35;
		img.height = 35;
		img.id = 'overlay-reticle';
        return img
    }
	
	// temporarily set OpenSeadragon animation params
	// to a very slow animate, then restore.
	private withSlowOSDAnimation = (viewport:any, f:any) => {
	
		// var speed = 20;
		const panSpeed = 7;
		const zoomSpeed = 7;

		// save old ones
		const oldValues:any = {};
		oldValues.centerSpringXAnimationTime = viewport.centerSpringX.animationTime;
		oldValues.centerSpringYAnimationTime = viewport.centerSpringY.animationTime;
		oldValues.zoomSpringAnimationTime = viewport.zoomSpring.animationTime;
		
		oldValues.centerSpringXSpringStiffness = viewport.centerSpringX.springStiffness;
		oldValues.centerSpringYSpringStiffness = viewport.centerSpringY.springStiffness;
		oldValues.zoomSpringSpringStiffness = viewport.zoomSpring.springStiffness;
		
		oldValues.zoomSpringExponential = viewport.zoomSpring.exponential;
		oldValues.centerSpringXExponential = viewport.centerSpringX.exponential;
		oldValues.centerSpringYExponential = viewport.centerSpringY.exponential;

		// set our new ones
		viewport.centerSpringX.animationTime = panSpeed;
		  viewport.centerSpringY.animationTime = panSpeed;
		  viewport.zoomSpring.animationTime = zoomSpeed;
		  
		viewport.centerSpringX.springStiffness =
		  viewport.centerSpringY.springStiffness =
		  viewport.zoomSpring.springStiffness =
		  0;
		  
		viewport.zoomSpring.exponential = false;
		viewport.centerSpringX.exponential = false;
		viewport.centerSpringY.exponential = false;

		// callback
		f();

		// restore values
		viewport.centerSpringX.animationTime = oldValues.centerSpringXAnimationTime;
		viewport.centerSpringY.animationTime = oldValues.centerSpringYAnimationTime;
		viewport.zoomSpring.animationTime = oldValues.zoomSpringAnimationTime;
		
		viewport.centerSpringX.springStiffness = oldValues.centerSpringXSpringStiffness;
		viewport.centerSpringY.springStiffness = oldValues.centerSpringYSpringStiffness;
		viewport.zoomSpring.springStiffness = oldValues.zoomSpringSpringStiffness;
		
		viewport.zoomSpring.exponential = oldValues.zoomSpringExponential;
		viewport.centerSpringX.exponential = oldValues.centerSpringXExponential;
		viewport.centerSpringY.exponential = oldValues.centerSpringYExponential;
	}
}

export default Map;
