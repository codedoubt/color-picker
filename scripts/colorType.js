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
	var h,s,l,r,g,b;
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
