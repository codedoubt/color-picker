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

function ColorPicker(arg) {
	var bound = arg.bound;
	var boundHandle = arg.boundHandle;
	var picker = arg.picker;
	var pickHandle = arg.pickHandle;
	var slider = arg.slider;
	var slideHandle = arg.slideHandle;

	var options = arg.options;
	var output = arg.output;
	var onchange = arg.onchange || function () {};
	var pick = picker.getContext('2d');
	var slide = slider.getContext('2d');


	//
	//making the whole picker draggable
	draggable(boundHandle, {
		attach: true,
		attachTo: '#' + bound.id,
	});
	//adding draggable to pickhandle or saturation and lightness handle
	draggable(pickHandle, {
		bound: true,
		boundTo: '#' + picker.id,
		offLeft: -5,
		offTop: -5,
		onmove: updateOnPick
	});
	//adding draggle to hue or slide handle
	draggable(slideHandle, {
		bound: true,
		boundTo: '#' + slider.id,
		dragY: false,
		offLeft: -10,
		offTop: -2,
		onmove: updateFillOnSlide
	});

	drawCanvas(null, picker);

	function drawCanvas(value, target) {
		pick.fillStyle = 'hsl(' + (value || 0) + ',100%,50%)';
		pick.rect(0, 0, target.width, target.height);
		pick.fill();

		//saturation gradient
		var sg = pick.createLinearGradient(0, 0, target.width, 0);
		//lightness/value gradient
		var vg = pick.createLinearGradient(0, 0, 0, target.height);
		sg.addColorStop(0, 'rgba(255,255,255,1)');
		sg.addColorStop(1, 'rgba(255,255,255,0)');
		vg.addColorStop(0, 'rgba(0,0,0,0)');
		vg.addColorStop(1, 'rgba(0,0,0,1)');
		pick.fillStyle = sg;
		pick.fillRect(0, 0, target.width, target.height);
		pick.fillStyle = vg;
		pick.fillRect(0, 0, target.width, target.height);
	}


	for (var i = 0; i <= 360; i++) {
		slide.fillStyle = 'hsl(' + i + ',100%,50%)';
		slide.fillRect(i * slider.width / 360, 0, 2, 20);
	}
	///variables for slider
	slider.addEventListener('click', function (e) {
		//22.5 is the left padding of the colorSlider
		var newX = e.pageX - bound.offsetLeft - 22.5;
		log(slider.offsetLeft);
		//this function update the position of color/hue Handle on click
		// 360 is hue parameter in hsl color
		updateColorHandlePosition((newX) * 360 / slider.width);

		//the function below update the output when button is clicked
		updateFillOnSlide(e);
	});

	picker.addEventListener('click', function (e) {
		//5 is the top and left offset of the pick handle
		//5 is also defined in draggable editor
		//if you change the value there change the value here to 
		// make user offset is proper
		var newX = e.clientX - bound.offsetLeft - 5;
		var newY = e.clientY - bound.offsetTop - boundHandle.offsetHeight - 5;

		//update the position of canvas handle when button is clicked
		updateCanvasHandlePosition(newX, newY);
		//the function below update the output when the button is clicked
		//this is a canvas color picker button
		updateOnPick(e);
	});

	////updating the colorof the picker
	var updateColorFill = function (value) {
		drawCanvas(value, picker);
	}

	//the function returns the color value from canvas/saturationAndLightness
	//the return value is an array
	//you have to provide positions from where the data has to be returned
	var getColorValue = function (posx, posy) {
		var value = pick.getImageData(posx, posy, 1, 1);
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
		output.value = '';
		output.value = color;
		cb(color);
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
		slideHandle.style.left = newPos + 'px';
	}


	function updateCanvasHandlePosition(newX, newY) {
		pickHandle.style.top = newY + "px";
		pickHandle.style.left = newX + 'px';
	}

	function updateFillOnSlide(e) {
		//22.5 is Left offset from ''bound''
		var newX = e.pageX - bound.offsetLeft - 22.5;
		if (newX < 0)
			newX = 0;
		if (newX > slider.width)
			newX = slider.width;
		log();
		drawCanvas(Math.round((newX) * 360 / slider.width), picker);

		//ToDo:
		//Update Output value Base On codition
		updateCanvasHandlePosition()
		var newY = pickHandle.offsetTop;
		var newX = pickHandle.offsetLeft;

		update_Output_On_Handle_Position_Change(newX, newY);

	}

	function updateOnPick(e) {
		var newX = e.clientX - bound.offsetLeft - 5;
		var newY = e.clientY - bound.offsetTop - boundHandle.offsetHeight - 5;

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

}
