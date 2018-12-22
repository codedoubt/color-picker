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
    return '#' + [r, g, b].map(function(x){
        var hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('');
}

//this function convert hex color value to rgb
//this function takes hex string as #xyzpqr where
///x,y,z,p,q,r can be different
///the return value is an array of type [r,g,b]
function hexToRgb(hex) {
    return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b){return '#' + r + r + g + g + b + b})
        .substring(1).match(/.{2}/g)
        .map(function(x){return  parseInt(x, 16)})
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
