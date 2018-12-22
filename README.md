# color-picker 
This is an online color picker you can use this in your projects. This is developed using another two libraries ```draggable.min.js``` and ```colorType.min.js```. It is very simple and easy to use this in your projects.
You can see it live at https://codedoubt.github.io/color-picker/

![Color-Picker](/imgs/color-picker.JPG) ![Color-Picker](/imgs/color-picker-rgb.JPG)


### Three type of color outputs

![Hex](/imgs/hex.JPG) ![RGB](/imgs/rgb.JPG) ![HSL](/imgs/hsl.JPG)

# How To Use It
## Step #1
add these files to your document
```html
<!-- add this file in your head  -->
<link rel="stylesheet" href="css/colorPicker.css">
<!-- append these files in your body tag -->
<script src="scripts/min.js/draggable.min.js"></script>
<script src="scripts/min.js/colorType.min.js"></script>
<script src="scripts/min.js/colorPicker.min.js"></script>
```
## Step #2
add the following code in your body tag , where you want to use the color-picker
```html
<div id="picker" style="display: none">
  <p id="drag">Color Picker<span onclick="this.parentNode.parentNode.style.display='none'">X</span></p>
  <div id="colorPicker">
    <div class="group group1">
      <div id="pick">
        <canvas id="huePicker" width="250" height="250"></canvas>
        <div class="handle"></div>
      </div>
      <div id="hue">
        <canvas id="slider" width="205" height="20"></canvas>
        <div class="handle"></div>
      </div>
    </div>
    <div class="group group2">
      <select name="colorOption" id="colorOption">
        <option value="hex" selected>HEX</option>
        <option value="rgb">RGB</option>
        <option value="hsl">HSL</option>
      </select>
      <input id="output" type="text" value="#ffffff">
    </div>
  </div>
</div>
```

## Step #3
append the following ```script``` tag after the above three ```script``` tags
```html
<script>
////these are not jquery tags
///this document uses its own lil_query
///to shorten the code
/// lil_query is included in draggable.min.js
var slider = $('#slider'); 
var picker = $('#huePicker');
var pickHandle = $('.handle')[0];
var slideHandle = $('.handle')[1];
var outputOptions = $("#colorOption");
var output = $('#output');
var bound = $('#picker');
var boundHandle = $('#drag');
var values = {
	picker: picker,
	pickHandle: pickHandle,
	slider: slider,
	slideHandle: slideHandle,
	bound: bound,
	boundHandle: boundHandle,
	output: output,
	options: outputOptions
}

function cb(value) {
	$('#on').style.background = value;
}
$('#on').addEventListener('click', function() {
	$('#picker').style.display = '';
	values.onchange = cb;///onchange is a callback function which get fired when color got change
	 //use this to update the color to the element you want
});
ColorPicker(values);
</script>
```
