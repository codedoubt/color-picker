////this file draw the canvas and hue slider 
///and make them draggable using draggable.min.js
///give output in input field
///have a callback back when color changes


//little jquery for the document
var $ = function (e) {
	if (e[0] == '#')
		return document.getElementById(e.slice(1));
	else if (e[0] == ".")
		return document.getElementsByClassName(e.slice(1));
	else
		return document.getElementsByTagName(e);
}

var ColorPicker = function (arg) {
	this.bound = arg.bound;
	this.boundHandle = arg.boundHandle;
	this.picker = arg.picker;
	this.pickHandle = arg.pickHandle;
	this.slider = arg.slider;
	this.slideHandle = arg.slideHandle;

	this.options = arg.options;
	this.output = arg.output;
	this.onchange = arg.onchange || function () {};
	this.pick = picker.getContext('2d');
	this.slide = slider.getContext('2d');

	log(this.bound, this.boundHandle, this.picker, this.pickHandle, this.slider, this.slideHandle, this.options, this.output, this.onchange, this.pick, this.slide);
	log(onchange.toString());
	//
	//making the whole picker draggable
	draggable(boundHandle, {
		attach: true,
		attachTo: '#' + this.bound.id,
	});
	//adding draggable to pickhandle or saturation and lightness handle
	draggable(pickHandle, {
		bound: true,
		boundTo: '#' + this.picker.id,
		offLeft: -5,
		offTop: -5,
		onmove: updateOnPick
	});
	//adding draggle to hue or slide handle
	draggable(slideHandle, {
		bound: true,
		boundTo: '#' + this.slider.id,
		dragY: false,
		offLeft: -10,
		offTop: -2,
		onmove: updateFillOnSlide
	});

	drawCanvas(null, picker);

	function drawCanvas(value, target) {
		this.pick.fillStyle = 'hsl(' + (value || 0) + ',100%,50%)';
		this.pick.rect(0, 0, target.width, target.height);
		this.pick.fill();

		//saturation gradient
		var sg = this.pick.createLinearGradient(0, 0, target.width, 0);
		//lightness/value gradient
		var vg = this.pick.createLinearGradient(0, 0, 0, target.height);
		sg.addColorStop(0, 'rgba(255,255,255,1)');
		sg.addColorStop(1, 'rgba(255,255,255,0)');
		vg.addColorStop(0, 'rgba(0,0,0,0)');
		vg.addColorStop(1, 'rgba(0,0,0,1)');
		this.pick.fillStyle = sg;
		this.pick.fillRect(0, 0, target.width, target.height);
		this.pick.fillStyle = vg;
		this.pick.fillRect(0, 0, target.width, target.height);
	}


	for (var i = 0; i <= 360; i++) {
		this.slide.fillStyle = 'hsl(' + i + ',100%,50%)';
		this.slide.fillRect(i * this.slider.width / 360, 0, 2, 20);
	}
	///variables for slider
	this.slider.addEventListener('click', function (e) {
		//22.5 is the left padding of the colorSlider
		var newX = e.pageX - bound.offsetLeft - 22.5;
		//this function update the position of color/hue Handle on click
		// 360 is hue parameter in hsl color
		updateColorHandlePosition((newX) * 360 / slider.width);

		//the function below update the output when button is clicked
		updateFillOnSlide(e);
	});

	this.picker.addEventListener('click', function (e) {
		//5 is the top and left offset of the pick handle
		//5 is also defined in draggable editor
		//if you change the value there change the value here to 
		// make user offset is proper
		var newX = e.pageX - bound.offsetLeft - 5;
		var newY = e.pageY - bound.offsetTop - boundHandle.offsetHeight - 5;

		//update the position of canvas handle when button is clicked
		updateCanvasHandlePosition(newX, newY);
		//the function below update the output when the button is clicked
		//this is a canvas color picker button
		updateOnPick(e);
	});

	////updating the colorof the picker
	var updateColorFill = function (value) {
		drawCanvas(value, this.picker);
	}

	//the function returns the color value from canvas/saturationAndLightness
	//the return value is an array
	//you have to provide positions from where the data has to be returned
	var getColorValue = function (posx, posy) {
		var value = this.pick.getImageData(posx, posy, 1, 1);
		var r = value.data[0];
		var g = value.data[1];
		var b = value.data[2];
		return [r, g, b];
	}


	options.addEventListener('change', changed);

	function changed() {
		var newOutput = output.value;
		var currentType = colorType(newOutput);
		updateOutput(changeToSelectedType(currentType, this.value, newOutput));
	}


	////////input field ***********

	function updateOutput(color) {
		this.output.value = '';
		this.output.value = color;
		onchange(color);
	}

	output.addEventListener('keyup', updatePicker);
	//update all the values and positions 
	function updatePicker() {
		var value = this.value; //getting the current value from input field

		//colorType function return the type of color it is hex,rgb,hsl
		var type = colorType(value);

		if (value) //detecting the value to change it in selection
			options.value = type;
		else //by default value is hex
			options.value = 'hex';

		try {
			var hsla = changeToSelectedType(type, 'hsl', value);
			var hsl = hsla.match(/[0-9]+[.]?[0-9]?[0-9]?/g).filter(function (x) {
				return x != '';
			});
			var h = hsl[0]; //hue
			var s = hsl[1]; //saturation
			var l = hsl[2]; //lightness


			updateColorFill(h); //update value when enter key is pressed for the value that is entered by user
			updateColorHandlePosition(h); // update value when key is pressed for the current value

			var x = s * picker.width / 100; //2.5  = 250/100 for changing the canvas x position acording to 250px
			var y = l * picker.width / 100; //same above

			//5px is the width/2 of the canvas handle
			//250px is the width of the canvas
			updateCanvasHandlePosition(x - 5, (picker.width - y - 5));

			//callback function when color value is changed
			onchange(value);
		} catch (e) {
			log('wrong input value');
		}


	}

	function updateColorHandlePosition(hue) {
		var newPos = Math.round(hue * 205 / 360) - 10;
		this.slideHandle.style.left = newPos + 'px';
	}


	function updateCanvasHandlePosition(newX, newY) {
		this.pickHandle.style.top = newY + "px";
		this.pickHandle.style.left = newX + 'px';
	}

	function updateFillOnSlide(e) {
		//22.5 is Left offset from ''bound''
		var newX = e.pageX - this.bound.offsetLeft - 22.5;
		if (newX < 0)
			newX = 0;
		if (newX > this.slider.width)
			newX = this.slider.width;
		log();
		drawCanvas(Math.round((newX) * 360 / this.slider.width), this.picker);

		//ToDo:
		//Update Output value Base On codition
		updateCanvasHandlePosition()
		var newY = this.pickHandle.offsetTop;
		var newX = this.pickHandle.offsetLeft;

		update_Output_On_Handle_Position_Change(newX, newY);

	}

	function updateOnPick(e) {
		var newX = e.pageX - this.bound.offsetLeft - 5;
		var newY = e.pageY - this.bound.offsetTop - this.boundHandle.offsetHeight - 5;

		update_Output_On_Handle_Position_Change(newX, newY);
	}

	function update_Output_On_Handle_Position_Change(newX, newY) {
		if (newX < 0)
			newX = 0;
		if (newY < 0)
			newY = 0;
		if (newX > 249.5)
			newX = 249.5;
		if (newY > 249.5)
			newY = 249.5;
		var value = getColorValue(newX, newY);
		var r = value[0];
		var g = value[1];
		var b = value[2];


		//updating value based on colorType
		var colorType = options.value;
		var newColorValue = changeToSelectedType('rgb', colorType, toRgbString(r, g, b))
		updateOutput(newColorValue);
	}



	///this is file is for color conversion algorithms
	///if you find any error update the algorithms

	//convert the color value to string rgb value
	function toRgbString(r, g, b) {
		return "rgb(" + Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b) + ")";
	}


	//convert the color value to hsl string value
	function toHslString(h, s, l) {
		return "hsl(" + Math.round(h) + ", " + s + "%, " + l + "%)";
	}

	///this function convert rgbTohex
	///return value is a string like #xyzpqr
	/// where x,y,z,p,q,r can be same
	function rgbToHex(r, g, b) {
		return '#' + [r, g, b].map(function (x) {
			var hex = x.toString(16)
			return hex.length === 1 ? '0' + hex : hex
		}).join('');
	}

	//this function convert hex color value to rgb
	//this function takes hex string as #xyzpqr where
	///x,y,z,p,q,r can be different
	///the return value is an array of type [r,g,b]
	function hexToRgb(hex) {
		return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
				return '#' + r + r + g + g + b + b
			})
			.substring(1).match(/.{2}/g)
			.map(function (x) {
				return parseInt(x, 16)
			})
	}

	///this function convert rgb value to hsl value
	///input is r,g,b
	///the return value is an array like [h,s,l]
	function rgbToHsl(r, g, b) {
		var min, max, i, l, s, maxcolor, h, rgb = [];
		rgb[0] = r / 255;
		rgb[1] = g / 255;
		rgb[2] = b / 255;
		min = rgb[0];
		max = rgb[0];
		maxcolor = 0;
		for (i = 0; i < rgb.length - 1; i++) {
			if (rgb[i + 1] <= min) {
				min = rgb[i + 1];
			}
			if (rgb[i + 1] >= max) {
				max = rgb[i + 1];
				maxcolor = i + 1;
			}
		}
		if (maxcolor == 0) {
			h = (rgb[1] - rgb[2]) / (max - min);
		}
		if (maxcolor == 1) {
			h = 2 + (rgb[2] - rgb[0]) / (max - min);
		}
		if (maxcolor == 2) {
			h = 4 + (rgb[0] - rgb[1]) / (max - min);
		}
		if (isNaN(h)) {
			h = 0;
		}
		h = h * 60;
		if (h < 0) {
			h = h + 360;
		}
		l = (min + max) / 2;
		if (min == max) {
			s = 0;
		} else {
			if (l < 0.5) {
				s = (max - min) / (max + min);
			} else {
				s = (max - min) / (2 - max - min);
			}
		}
		s = s;
		return [
         h,
         Math.round(s * 100),
         Math.round(l * 100)
    ];
	}

	////this function convert hsl value to rgb
	///input value is h,s,l where h = hue, s=saturation, l =lightness
	///return value is [r,g,b] where r=red, g=green,b = blue
	function hslToRgb(hue, sat, light) {
		sat /= 100;
		light /= 100;
		var t1, t2, r, g, b;
		hue = hue / 60;
		if (light <= 0.5) {
			t2 = light * (sat + 1);
		} else {
			t2 = light + sat - (light * sat);
		}
		t1 = light * 2 - t2;
		r = hueToRgb(t1, t2, hue + 2) * 255;
		g = hueToRgb(t1, t2, hue) * 255;
		b = hueToRgb(t1, t2, hue - 2) * 255;
		return [
         Math.round(r),
        Math.round(g),
        Math.round(b)
    ];
	}


	////this function convert hue value to rgb value
	////input value is decided by the function hslToRgb
	////this function is used in hslToRgb function only
	function hueToRgb(t1, t2, hue) {
		if (hue < 0) hue += 6;
		if (hue >= 6) hue -= 6;
		if (hue < 1) return (t2 - t1) * hue + t1;
		else if (hue < 3) return t2;
		else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
		else return t1;
	}

	///this function convert hex value to hsl value
	///the function input is a hex string like #xxxxxx
	///where x values can be different
	///return value will be [h,s,l]
	function hexToHsl(hex) {
		return rgbToHsl(hexToRgb(hex)[0], hexToRgb(hex)[1], hexToRgb(hex)[2]);
	}

	///this function hsl value to hex value
	///return value will be hex string like #xxxxxx
	///where x values can be different
	function hslToHex(h, s, l) {
		return rgbToHex(hslToRgb(h, s, l)[0], hslToRgb(h, s, l)[1], hslToRgb(h, s, l)[2]);
	}


	///this files check the color type is it hex ,rgb or hsl
	/// then there is another function change the type to the 
	/// selected index in select option


	///this function checks the type of color
	///Is it hex, rgb or hsl? And return as it a string
	function colorType(value) {
		if (value[0] == '#' && value.split('').map(function (e) {
				return "#012345679ABCDEFabcdef".indexOf(e) > -1
			}).filter(function (e) {
				e != true
			}).length <= 0 && value.length <= 7)
			return 'hex';
		else if (value.indexOf('rgb') > -1)
			return 'rgb';
		else if (value.indexOf('hsl') > -1)
			return 'hsl';
		else
			return undefined;
	}


	///take a color type like hex , rgb or hsl
	///convert it to other type
	///value is the current value of the 
	////value must be a string 
	function changeToSelectedType(from, to, value) {
		var h, s, l, r, g, b;
		switch (from) {
			case 'hex':
				h = hexToHsl(value)[0];
				s = hexToHsl(value)[1];
				l = hexToHsl(value)[2];
				r = hexToRgb(value)[0];
				g = hexToRgb(value)[1];
				b = hexToRgb(value)[2];
				switch (to) {
					case 'hsl':
						return toHslString(hexToHsl(value)[0], hexToHsl(value)[1], hexToHsl(value)[2]);
						break;
					case 'rgb':
						return toRgbString(hexToRgb(value)[0], hexToRgb(value)[1], hexToRgb(value)[2]);
						break;
					case 'hex':
						return value;
						break;
				}
				break;
			case 'rgb':
				var split = value.match(/[0-9]+[.]?[0-9]?[0-9]?/g).filter(function (r) {
					return r != ''
				});
				r = parseInt(split[0]);
				g = parseInt(split[1]);
				b = parseInt(split[2]);
				h = rgbToHsl(r, g, b)[0];
				s = rgbToHsl(r, g, b)[1];
				l = rgbToHsl(r, g, b)[2];
				switch (to) {
					case 'rgb':
						return value;
						break;
					case 'hex':
						return rgbToHex(r, g, b);
						break;
					case 'hsl':
						return toHslString(h, s, l);
						break;
				}
				break;

			case 'hsl':
				var split = value.match(/[0-9]+[.]?[0-9]?[0-9]?/g).filter(function (r) {
					return r != ''
				});
				h = parseInt(split[0]);
				s = parseInt(split[1]);
				l = parseInt(split[2]);
				r = hslToRgb(h, s, l)[0];
				g = hslToRgb(h, s, l)[1];
				b = hslToRgb(h, s, l)[2];
				switch (to) {
					case 'rgb':
						return toRgbString(r, g, b);
						break;
					case 'hex':
						return hslToHex(h, s, l);
						break;
					case 'hsl':
						return value;
						break;
				}
				break;
		}
	}

	///this files check the color type is it hex ,rgb or hsl
	/// then there is another function change the type to the 
	/// selected index in select option


	///this function checks the type of color
	///Is it hex, rgb or hsl? And return as it a string
	function colorType(value) {
		if (value[0] == '#' && value.split('').map(function (e) {
				return "#012345679ABCDEFabcdef".indexOf(e) > -1
			}).filter(function (e) {
				e != true
			}).length <= 0 && value.length <= 7)
			return 'hex';
		else if (value.indexOf('rgb') > -1)
			return 'rgb';
		else if (value.indexOf('hsl') > -1)
			return 'hsl';
		else
			return undefined;
	}


	///take a color type like hex , rgb or hsl
	///convert it to other type
	///value is the current value of the 
	////value must be a string 
	function changeToSelectedType(from, to, value) {
		var h, s, l, r, g, b;
		switch (from) {
			case 'hex':
				h = hexToHsl(value)[0];
				s = hexToHsl(value)[1];
				l = hexToHsl(value)[2];
				r = hexToRgb(value)[0];
				g = hexToRgb(value)[1];
				b = hexToRgb(value)[2];
				switch (to) {
					case 'hsl':
						return toHslString(hexToHsl(value)[0], hexToHsl(value)[1], hexToHsl(value)[2]);
						break;
					case 'rgb':
						return toRgbString(hexToRgb(value)[0], hexToRgb(value)[1], hexToRgb(value)[2]);
						break;
					case 'hex':
						return value;
						break;
				}
				break;
			case 'rgb':
				var split = value.match(/[0-9]+[.]?[0-9]?[0-9]?/g).filter(function (r) {
					return r != ''
				});
				r = parseInt(split[0]);
				g = parseInt(split[1]);
				b = parseInt(split[2]);
				h = rgbToHsl(r, g, b)[0];
				s = rgbToHsl(r, g, b)[1];
				l = rgbToHsl(r, g, b)[2];
				switch (to) {
					case 'rgb':
						return value;
						break;
					case 'hex':
						return rgbToHex(r, g, b);
						break;
					case 'hsl':
						return toHslString(h, s, l);
						break;
				}
				break;

			case 'hsl':
				var split = value.match(/[0-9]+[.]?[0-9]?[0-9]?/g).filter(function (r) {
					return r != ''
				});
				h = parseInt(split[0]);
				s = parseInt(split[1]);
				l = parseInt(split[2]);
				r = hslToRgb(h, s, l)[0];
				g = hslToRgb(h, s, l)[1];
				b = hslToRgb(h, s, l)[2];
				switch (to) {
					case 'rgb':
						return toRgbString(r, g, b);
						break;
					case 'hex':
						return hslToHex(h, s, l);
						break;
					case 'hsl':
						return value;
						break;
				}
				break;
		}
	}


}
