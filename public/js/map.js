const scaleWidth = 1024;
let urlParams = [];
let tileSet = '';
let viewer = false;
	//var posterUrl = 'http://localhost/poster/index.html';
let ionizingBit = 'N';
let guideBit = 'N';
let dustBit = 'N';
let distanceEstimator = 'bj';
	
(window.onpopstate = function () {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
})();
	
	if ('tileset' in urlParams) {
		tileSet = urlParams['tileset'];
		tileSource = dataUrlPrefix+"/tiles3/poster_"+tileSet+".dzi";
		console.log(tileSet);
		
		if (tileSet.indexOf('S') != -1) {
			ionizingBit = 'S';
		}
		if (tileSet.indexOf('G') != -1) {
			guideBit = 'G';
		}
		if (tileSet.indexOf('D') != -1) {
			dustBit = 'D';
		}
		
	} else {
		tileSet = 'SGD';
		ionizingBit = 'S';
		guideBit = 'G';
		dustBit = 'D';
	}
	if ('distanceEstimator' in urlParams) {
		distanceEstimator = urlParams['distanceEstimator'];
	} else {
		distanceEstimator = 'bj';
	}
	
	tileSource = dataUrlPrefix+"/tiles3/poster_"+tileSet+".dzi";
	if (ionizingBit == 'S') {
		document.getElementById("label-ionizing").checked = true;
	} else {
		document.getElementById("label-ionizing").checked = false;
	} 
	if (guideBit == 'G') {
		document.getElementById("label-guides").checked = true;
	} else {
		document.getElementById("label-guides").checked = false;
	}
	if (dustBit == 'D') {
		document.getElementById("label-dust").checked = true;
	} else {
		document.getElementById("label-dust").checked = false;
	} 
	
	if (distanceEstimator == 'bj') {
		document.getElementById("label-distance").checked = true;
	} else {
		document.getElementById("label-distance").checked = false;
	} 
	
	$('#label-ionizing-wrapper').on('click touchstart',function() {$('#label-ionizing').prop('checked',!$('#label-ionizing').prop("checked"))});
	$('#label-guides-wrapper').on('click touchstart',function() {$('#label-guides').prop('checked',!$('#label-guides').prop("checked"));});
	$('#label-dust-wrapper').on('click touchstart',function() {$('#label-dust').prop('checked',!$('#label-dust').prop("checked"));});
	$('#label-distance-wrapper').on('click touchstart',function() {$('#label-distance').prop('checked',!$('#label-distance').prop("checked"));});
	
	// deal with really annoying iOS behaviour
	
	$('#label-search').on('touchstart',function() {$(this).focus(); viewer.autoHideControls = false;});
	
	$('#label-search').on('keyup', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 10 || code == 13) {
			e.preventDefault();
			handleSearch();
		}
	});
	
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	
	var handleSearch = function() {
		console.log('in handleSearch');
		var bookmarkUrl = posterUrl;
		tileSet = '';
		ionizingBit = 'N';
		guideBit = 'N';
		dustBit = 'N';
		distanceEstimator = 'bj';
		searchBit = document.getElementById("label-search").value.trim();
		console.log('search',searchBit);
		if (document.getElementById("label-ionizing").checked) {
			ionizingBit = 'S';
		} 
		if (document.getElementById("label-guides").checked) {
			guideBit = 'G';
		} 
		if (document.getElementById("label-dust").checked) {
			dustBit = 'D';
		}
		
		tileSet = ionizingBit+guideBit+dustBit;
		
		console.log(tileSet);
		
		if (document.getElementById("label-distance").checked) {
			distanceEstimator = 'bj';
		} else {
			distanceEstimator = 'plx';
		}
				
		var vp = viewer.viewport.getCenter(true);

		var xg = vp.x;
		var yg = vp.y;
		var zoom = viewer.viewport.getZoom();
		
		if (searchBit) {
			// if the id is just a number, assume it is a DR source id
			if (/^\d+$/.test(searchBit)) {
				searchBit = 'Gaia DR2 '+searchBit;
			}
			bookmarkUrl += '?search='+encodeURIComponent(searchBit)+'&tileset='+tileSet+'&distanceEstimator='+distanceEstimator;
		} else {
			bookmarkUrl += '?xg='+xg.toFixed(12)+'&yg='+yg.toFixed(12)+'&zoom='+zoom+'&tileset='+tileSet+'&distanceEstimator='+distanceEstimator;
		}
		
		window.location.href = bookmarkUrl;
		
		/* console.log('tile set: '+display);
		console.log('display: '+$('#tgas-display-options').val());
		console.log('labels: '+label);
		console.log('dust: '+($('[name="dust"]').prop('checked')?'true':'false'));*/
	}	
	
	//$('#label-ionizing').on('click touchstart',function() {$('#label-ionizing').prop('checked',!$('#label-ionizing').prop("checked"))});
	//$('#label-guides').on('click touchstart',function() {$('#label-guides').prop('checked',!$('#label-guides').prop("checked"));});
	//$('#label-dust').on('click touchstart',function() {$('#label-dust').prop('checked',!$('#label-dust').prop("checked"));});
	
	$('#gaia-search-bookmark-link').on('touchstart',function() {window.location.href = $(this).attr('href');});
	
	$('#gaia-display-submit').on('click touchstart',handleSearch);
	
	var updateCoords = function(p,convert) {
		var vp;
		//console.log(p);
		if (convert) {
			vp = viewer.viewport.pointFromPixel(p);
		} else {
			vp = p;
		}
		//console.log(vp);
		var x = ((3000/443.5)*(vp.x - (scaleWidth*0.50031)));
		var y = ((3000/444)*(vp.y - (scaleWidth*0.59838)));
		var r = Math.sqrt(x*x+y*y);
		if (r <= 3000) {
			var l = (180/Math.PI)*Math.atan2(x,y)-90;
			if (l < 0) {
				l+= 360;
			}
			//console.log(r);
			$('#gaiadistance').html(r.toFixed(2));
			//$('#gaiadistance').html(navigator.userAgent);	
			$('#gaialongitude').html(l.toFixed(2));
		}
	};
	
	var updateBookmark = function() {
		var vp = viewer.viewport.getCenter(true);
		var xg = vp.x;
		var yg = vp.y;
		
		var zoom = viewer.viewport.getZoom();
		//console.log(xg,yg,zoom);
		
		var bookmarkUrl = posterUrl+'?xg='+xg.toFixed(12)+'&yg='+yg.toFixed(12)+'&zoom='+zoom+'&tileset='+tileSet;

		document.getElementById("gaia-search-bookmark-link").href = bookmarkUrl;	
	}
	
	function slew(glon,glat,distance,distancePlus,distanceMinus,label) {
	
		r = 0.14436*distance/1000;
		rMinus = 0.14436*distanceMinus/1000;
		rPlus = 0.14436*distancePlus/1000;
		cosl = Math.cos(glon*Math.PI/180);
		sinl = Math.sin(glon*Math.PI/180);
		cosb = Math.cos(glat*Math.PI/180);
		sinb = Math.sin(glat*Math.PI/180);
		x = (r*cosb*cosl+0.50031)*scaleWidth;
		y = (-r*cosb*sinl+0.59838)*scaleWidth;
		xMinus = (rMinus*cosb*cosl+0.50031)*scaleWidth;
		yMinus = (-rMinus*cosb*sinl+0.59838)*scaleWidth;
		xPlus = (rPlus*cosb*cosl+0.50031)*scaleWidth;
		yPlus = (-rPlus*cosb*sinl+0.59838)*scaleWidth;
		
		viewer.addOverlay({
			id: 'reticle',
			//x: 0.5003-0.14436,
			//x: 0.50039-0.14436,
			//y: 0.59839,
			x: x,
			y: y,
			placement: 'CENTER',
			checkResize: false
		});
		
		//The data for our line
		 var lineData = [ { "x": xMinus,   "y": yMinus},  { "x": xPlus,  "y": yPlus}];
		 
		 //This is the accessor function we talked about above
		 var lineFunction = d3.svg.line()
								  .x(function(d) { return d.x; })
								  .y(function(d) { return d.y; })
								 .interpolate("linear");

		var overlay = viewer.svgOverlay();

		var d3Line = d3.select(overlay.node()).append("path")
			.attr("d", lineFunction(lineData))
			.attr("stroke", "#aaeeff")
			.attr("stroke-width", 0.5)
			.attr("stroke-opacity", 0.8)
			.attr("stroke-linecap", "round")
			.attr("fill", "none");
		
		var d3Text = d3.select(overlay.node()).append("text")
			.attr("x", x)             
			.attr("y", y+6.5)
			.attr("text-anchor", "middle")
			.style("font-weight", "bold")			
			.style("font-size", "0.1em")
			.style("font-family", "Helvetica, Arial, sans-serif")
			.style("fill", "#99FF00")
			.attr("fill-opacity", 0.0)
			.text(label);

		var bbox = d3Text.node().getBBox();
		
		console.log('bb',bbox);
		
		var d3Rectangle = d3.select(overlay.node()).append("rect")
			.attr("x", bbox.x-0.7)
			.attr("y", bbox.y-0.7)
			.attr("width", bbox.width+1.8)
			.attr("height", bbox.height+1.9)
			.style("fill", "#FFFFFF")
			.style("fill-opacity",0.85)
			.style("stroke", "#999999")
			.style("stroke-width",0.2);
			
		var d3Text2 = d3.select(overlay.node()).append("text")
			.attr("x", x)             
			.attr("y", y+6.5)
			.attr("text-anchor", "middle")
			.style("font-weight", "bold")			
			.style("font-size", "0.1em")
			.style("font-family", "Helvetica, Arial, sans-serif")
			.style("fill", "#006600")
			.text(label);
		
		//viewer.viewport.zoomTo(7.6,new OpenSeadragon.Point(x,y), false);
		setTimeout(function () {
			bounds = new OpenSeadragon.Rect(x-0.0001,y-0.0001,0.0002,0.0002,0);
			//console.log(viewer.viewport.getBounds(true));
			//console.log(bounds);
			//viewer.viewport.goHome(true);
			withSlowOSDAnimation(viewer.viewport, function() {
				viewer.viewport.fitBoundsWithConstraints(bounds,false);
				//viewer.viewport.panTo(new OpenSeadragon.Point(x,y), false).zoomTo(12/scaleWidth,false);
			});
			}, 1500);
	
	}
	
	// temporarily set OpenSeadragon animation params
	// to a very slow animate, then restore.
	function withSlowOSDAnimation(viewport, f) {
	
		//var speed = 20;
		var panSpeed = 7;
		var zoomSpeed = 7;

		// save old ones
		var oldValues = {};
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
		f()

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
	
	var makeStarDocBox = function(glon,glat,plx,distance,distancePlus,distanceMinus,name,other_names,source_id,spectrum,mag) {
		var cosl = Math.cos(glon*Math.PI/180)
		var sinl = Math.sin(glon*Math.PI/180)
		var cosb = Math.cos(glat*Math.PI/180)
		var sinb = Math.sin(glat*Math.PI/180)
		var x = distance*cosb*cosl
        var y = distance*cosb*sinl
		var z = distance*sinb;
		var r = Math.sqrt(x*x+y*y+z*z);
		console.log('coords',x,y,z,r);
		var label = name;
		var id = 'info';
		if (name === 'Sun') {
			html = '<div class="star-info">'
			html += '<div class="star-info-item"><div class="star-info-label">'+'also</div><div class="star-info-value">'+other_names+'</div></div>';
			html += '<div style="clear:both; height:5px;"></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'spec. type</div><div class="star-info-value">'+spectrum+'</div></div>';
			html += '<div class="star-info-item"><div class="star-info-label">'+'abs. mag.</div><div class="star-info-value">'+mag+'</div></div>';
			html += '<div style="clear:both; height:5px;"></div>';
			html += '<div class="star-info-item">Orbited by four rocky planets and four gas giants. The third planet, Earth, is mostly harmless.</div>'
		} else {
			var lyDistance = 3.26156*distance;
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
				html += '<div class="star-info-item"><div class="star-info-label">'+'abs. mag.</div><div class="star-info-value">'+(Math.round(100*mag)/100)+'</div></div>';
			}
								
			html += '<div class="star-info-item"><div class="star-info-label">SIMBAD</div>';
			html += '<div class="star-info-value"><a target="_blank" href="http://simbad.u-strasbg.fr/simbad/sim-id?Ident='+encodeURIComponent(name)+'">'+name+'</a></div></div>';
			
			if (source_id) {
				var gaiaLink = 'http://vizier.cfa.harvard.edu/viz-bin/VizieR?-source=I/345/gaia2&-out.form=Detailed+results&Source='+source_id;
				html += '<div style="clear:both; height:5px;"></div>';
				html += '<div class="star-info-item"><div class="star-info-label">Gaia DR2</div>';
				html += '<div class="star-info-value"><a target="_blank" href="'+gaiaLink+'">'+source_id+'</a></div></div>';
			}
			
			html += '</div>';
		}
				
				
		var div = $('<div>').attr('id',id+'_box').attr('title',label).html(html);
		$('body').append(div);
		$( "#"+id+'_box' ).dialog({
			width:220, 
			position: {
				my: "left top",
				at: "center-120 center-320",
				of: $(window)
			}, 
			close:function() {$(this).remove();$('#'+id+'_box').remove();}
		});
	}
	
	viewer = OpenSeadragon({
        id: "openseadragon1",
        prefixUrl: "images/",
		blendTime: 1,
		autoHideControls: true,
		controlsFadeDelay: 3000,
		maxZoomPixelRatio: 1.2,
		showRotationControl: false,
		showFullPageControl: true,
		tileSources: {
			width: scaleWidth,
			y: 0,
			x: 0,
			tileSource: tileSource
		}
    });
	
	viewer.addHandler('open', function(o) {
		var x, y, zoom, vp, p, d;
		viewer.viewport.panTo(new OpenSeadragon.Point(0.50045*scaleWidth,0.59838*scaleWidth),true);
	
		if (('xg' in urlParams) && ('yg' in urlParams)) {
			x = parseFloat(urlParams['xg']);
			y = parseFloat(urlParams['yg']);
			if ('zoom' in urlParams) {
				zoom = urlParams['zoom'];
				console.log('open',x,y,zoom);
				p = new OpenSeadragon.Point(x,y);
				console.log('point',p);
				viewer.viewport.panTo(p,true);
				vp = viewer.viewport.getCenter(true);
				console.log('center',vp.x,vp.y);
				viewer.viewport.zoomTo(zoom,null,true)
			}
		} else if ('search' in urlParams) {
			var searchName = urlParams['search'].trim();
			var searchNameLC = searchName.toLowerCase();
			
			if (searchNameLC == 'sun' || searchNameLC == 'sol') {
				viewer.addOnceHandler('animation-finish', function(event) {
					makeStarDocBox(0,0,1000,0,0,0,'Sun','Sol','','G2V',4.83);
				});
				setTimeout(function() {slew(0,0,0,0,0,'');},1000);		
			} else {
				var mainName = '';
				var hip_id = '';
				var hd_id;
				simbadURL = 'http://simbad.u-strasbg.fr/simbad/sim-script?submit=submit+script';
				simbadURL += '&script=format+object+f1+%22%25IDLIST%28SA%28+%7C+%29%3B1%2C*%2CHIP%2CHD%2C';
				simbadURL += 'Gaia%20DR2%2CNAME%29%3B%25SP%28S%29%3B%25COO%28d%3B%3BGAL%29%3B%25FLUXLIST%28V%3BF%29%3B%25plx%22%0D%0A%0D%0Aquery+';
				simbadURL += encodeURIComponent(searchName);
				$.get(simbadURL, function(response) {
					var parallax;
					var error;
					var glon;
					var glat;
					var plx;
					var plxSource;
					var errRatio;
					var distance;
					var distanceMinus;
					var distancePlus;
					var n;
					var source_id = '';
					var names = [];
					var starNames = [];
					console.log(response);
					var status = response.split('\n').slice(-5)[0].slice(0,6);
					console.log(status);
					if (status == '::data') {
						d = response.split('\n').slice(-3)[0].split(';');
						var name = d[0].split('|');
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
						combinedNames = names.concat(starNames);
						if (hd_id) {
							combinedNames.push('HD '+hd_id);
						}
						otherNames = [];
						for (var i =0; i < combinedNames.length; i++) {
							name = combinedNames[i];
							if (name != mainName) {
								otherNames.push(name.replace(' ','&nbsp;'));
							}
						}
						
						otherNames = otherNames.join(' | ');
						console.log(mainName,source_id,hip_id,names);
						var spectrum = d[1].trim();
						var coo = d[2].split(' ')[0];
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
								if (source_id != '' && distanceEstimator == 'bj') {
									bjURL = 'http://gruze.org:3003/ari?format=json&query=';
									bjURL += 'select%20*%20from%20gaiadr2_complements.geometric_distance%20where%20source_id%20%3D%20';
									bjURL += source_id;
									$.getJSON(bjURL, function(json) {
										if (json['data'].length > 0) {
											var d = json['data'][0];
											console.log('bj',json);
											distance = Math.round(parseFloat(d[1]));
											distancePlus = Math.round(parseFloat(d[2]));
											distanceMinus = Math.round(parseFloat(d[3]));
											if (distance < 3000) {
												if (relMag != '~') {
													mag = parseFloat(relMag)- 5*(Math.log10(distance) - 1);
												} else {
													mag = '~';
												}
												viewer.addOnceHandler('animation-finish', function(event) {
													makeStarDocBox(glon,glat,parallax,distance,distancePlus,distanceMinus,mainName,otherNames,source_id,spectrum,mag);
												});
												slew(glon,glat,distance,distancePlus,distanceMinus,searchName);
												
												$('#error').append('Slew using B-J distance successful.');
											} else {
												$('#error').append('Cannot display stars with a distance greater than 3000 pc.');
											}
										} else {
											$('#error').append('Cannot find Bailer-Jones distance.');
										}
									});
								} else if (errRatio < 0.2) {
									distance = Math.round(1000/parallax);
									distanceMinus = Math.round(1000/(parallax-error));
									distancePlus = Math.round(1000/(parallax+error));
									if (distance < 3000) {
										if (relMag != '~') {
											mag = parseFloat(relMag)- 5*(Math.log10(distance) - 1);
										} else {
											mag = '~';
										}
										viewer.addOnceHandler('animation-finish', function(event) {
											makeStarDocBox(glon,glat,parallax,distance,distancePlus,distanceMinus,mainName,otherNames,source_id,spectrum,mag);
										});
										slew(glon,glat,distance,distancePlus,distanceMinus,searchName);
										$('#error').append('Slew successful.');
									} else {
										$('#error').append('Cannot display stars with a distance greater than 3000 pc.');
									}
										
								} else {
									distance = '~';
									$('#error').append('Cannot display stars with high parallax error.');
								}
							} else {
								error = '~';
								errRatio = '~';
								distance = '~';
								$('#error').append('Cannot determine parallax error.');
							}
						} else {
							parallax = '~';
							error = '~';
							errRatio = '~';
							distance = '~';
							$('#error').append('Cannot determine parallax.');
						}
						console.log(name[0],spectrum,glon,glat,parallax,error,errRatio,plxSource,distance,distancePlus,distanceMinus);
					} else {
						// SIMBAD knows nothing about this id
						// if this is a Gaia DR2 id, try Vizier
						if (urlParams['search'].startsWith('Gaia DR2 ')) {
							source_id = urlParams['search'].slice(9);
							console.log('source_id',source_id);
							var vizierURL = 'http://vizier.u-strasbg.fr/viz-bin/asu-txt?-source=I%2F345%2Fgaia2&-out.add=_Glon%2C_Glat'
							vizierURL += '&-out=_Glon%20_Glat%20Plx%20e_Plx&-out.meta=-huD&Source='+source_id;
							$.get(vizierURL, function(response) {
								//console.log(response);
								d = response.split('\n').slice(-4)[0];
								if (d[0] == '#') {
									console.log('error');
									$('#error').append('Cannot find a star with this Gaia DR2 ID.');
								} else {
									console.log(d);
									d = d.split(' ');
									var d2 = [];
									for (var i=0;i<d.length;i++) {
										if (d[i] != '') {
											d2.push(d[i]);
										}
									}
									console.log(d2);
									glon = parseFloat(d2[0]);
									glat = parseFloat(d2[1]);
									parallax = parseFloat(d2[2]);
									error = parseFloat(d2[3]);
									errRatio = error/parallax;
									if (distanceEstimator == 'bj') {
										bjURL = 'http://gruze.org:3003/ari?format=json&query=';
										bjURL += 'select%20*%20from%20gaiadr2_complements.geometric_distance%20where%20source_id%20%3D%20';
										bjURL += source_id;
										$.getJSON(bjURL, function(json) {
											if (json['data'].length > 0) {
												var d = json['data'][0];
												console.log('bj',json);
												distance = Math.round(parseFloat(d[1]));
												distancePlus = Math.round(parseFloat(d[2]));
												distanceMinus = Math.round(parseFloat(d[3]));
												if (distance < 3000) {
													slew(glon,glat,distance,distancePlus,distanceMinus,searchName);
													$('#error').append('Slew using B-J distance successful.');
												} else {
													$('#error').append('Cannot display stars with a distance greater than 3000 pc.');
												}
											} else {
												$('#error').append('Cannot find Bailer-Jones distance.');
											}
										});
									} else if (errRatio > 0 && errRatio < 0.2) {
										distance = Math.round(1000/parallax);
										distanceMinus = Math.round(1000/(parallax-error));
										distancePlus = Math.round(1000/(parallax+error));
										if (distance < 3000) {
											slew(glon,glat,distance,distancePlus,distanceMinus,searchName);
											$('#error').append('Slew successful.');
										} else {
											$('#error').append('Cannot display stars with a distance greater than 3000 pc.');
										}
									} else {
										distance = '~';
										$('#error').append('Cannot display stars with high parallax error.');
									}
									console.log(glon,glat,parallax,error,distance,distancePlus,distanceMinus);
								}
							});
						} else {
							$('#error').append('Cannot find a star with this ID.');
						}
					
					}
				});
			}
		} else {
			p = new OpenSeadragon.Point(0.5*scaleWidth,0.5*scaleWidth);
			console.log('point',p);
			viewer.viewport.panTo(p,true);		
		}
		
		var tracker = new OpenSeadragon.MouseTracker({
            element: viewer.container,
            moveHandler: function(event) {
				updateBookmark();
				updateCoords(event.position,true);
                //updateZoom(event.position); 
				//updateCoords(event.position,true);
            }			
        });  

        tracker.setTracking(true);
		
		//viewer.addControl(document.getElementById('reticle-container'),{autoFade: true, anchor: OpenSeadragon.ControlAnchor.NONE});

        viewer.addHandler('animation', function(event) {
			p = event.eventSource.viewport.getCenter(false);
			updateBookmark();
			updateCoords(p,false);
			//updateZoom(p);
			//updateCoords(p,false);
		});
		
		viewer.addHandler('canvas-double-click', function(o) {viewer.viewport.panTo(viewer.viewport.pointFromPixel(o.position));});
		var e = document.getElementById('gaia-search');
		viewer.addControl(e,{anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT});
		if (!isMobile) {
			// ugly but this really only works for a mouse
			// so hide for mobile devices
			viewer.addControl($('#gaiacontrols')[0],{anchor: OpenSeadragon.ControlAnchor.BOTTOM_LEFT});			
		}
		
    });
	