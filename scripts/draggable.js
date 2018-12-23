//little jquery for the document
var $ = function(e) {
    if (e[0] == '#')
        return document.getElementById(e.slice(1));
    else if (e[0] == ".")
        return document.getElementsByClassName(e.slice(1));
    else
        return document.getElementsByTagName(e);
}
var log = console.log;
function draggable(id, arg) {
	///getting element id
	id.addEventListener('mousedown', mouseDown);
	//to drag the element in x direction
	var dragX = (typeof arg.dragX == 'undefined') ? true : false;
	//to drag the element in y direction
	var dragY = (typeof arg.dragY == 'undefined') ? true : false;
	//check if the element is to be 
	//bound in other element
	var bound = arg.bound;
	//id of element which the current dragg is to bound
	var boundTo = arg.boundTo;

	//attach two elements two together to be dragged together
	var attach = arg.attach;
	//id of other element to be dragged with the current element
	var attachTo = arg.attachTo;
	//execute these function on move
	//if element is to be dragged out of the boundry
	//it can be used in color slider etc...
	var offLeft = arg.offLeft;
	var offTop = arg.offTop;

	////adding a callback function to execute it
	////when mouse is moving
	var onmove = arg.onmove || function () {};
	
	if (!offLeft) offLeft = 0;
	if (!offTop) offTop = 0;
	id.style.left = offLeft + "px";
	id.style.top = offTop + "px";

	function mouseDown(e) {
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);
		document.addEventListener('mouseleave', mouseLeave);


		if (attach) {
			////if attach is true
			if (dragX) {
				////if dragX is true on both elements
				////by default true
				var x = e.pageX - $(attachTo).offsetLeft;
			}
			if (dragY) {
				////is dragX is true on both elements
				////by default ture
				var y = e.pageY - $(attachTo).offsetTop;
			}
		} else {
			if (dragX) {
				////if drag on is true on current element
				////by default true
				var x = e.pageX - id.offsetLeft;
			}
			if (dragY) {
				////if drag is true on current element
				////by default true
				var y = e.pageY - id.offsetTop;
			}
		}

		//fire this function when element is being dragged
		function mouseMove(e) {
			if (bound) {
				///setting the maximum offset from the top
				if (offTop < 0) {
					//if value is negative 
					//move it outside the boundry
					var maxOffTop = (offTop || 0) + $(boundTo).offsetHeight;
					maxOffTop = Math.ceil(maxOffTop);
				} else {
					var maxOffTop = (-3 * offTop || 0) + $(boundTo).offsetHeight;
					maxOffTop = Math.ceil(maxOffTop);
				}

				//setting the maximum offset from left
				if (offLeft < 0) {
					//if value is negative 
					//move it outside the boundry
					var maxOffLeft = (offLeft || 0) + $(boundTo).offsetWidth;
					maxOffLeft = Math.ceil(maxOffLeft);
				} else {
					var maxOffLeft = (-3 * offLeft || 0) + $(boundTo).offsetWidth;
					maxOffLeft = Math.ceil(maxOffLeft);
				}

				//bounding the element in
				if (id.offsetLeft >= offLeft && id.offsetLeft <= maxOffLeft) {
					var value = e.pageX - x;
					if (value <= offLeft) //if less than the specific bound value set it to min
						value = offLeft;
					else if (value >= maxOffLeft) //if greater than the specific bound value set it to max
						value = maxOffLeft;
					id.style.left = value + "px";
				}

				if (id.offsetTop >= offTop && id.offsetTop <= maxOffTop) {
					var value = e.pageY - y;
					if (value <= offTop)
						value = offTop;
					else if (value >= maxOffTop)
						value = maxOffTop;
					id.style.top = value + "px";
				}
			onmove(e);
			}
			if (attach) {
				id.style.left = offLeft + "px";
				id.style.top = offTop + "px";
				$(attachTo).style.left = (e.pageX - x) + "px";
				$(attachTo).style.top = (e.pageY - y) + "px";
			onmove(e);
			}

			if (!attach && !bound) {
				id.style.left = (e.pageX - x) + "px";
				id.style.top = (e.pageY - y) + "px";
			onmove(e);
			}
		}

		function mouseUp() {
			document.removeEventListener('mousemove', mouseMove);
		}

		function mouseLeave() {
			document.removeEventListener('mousemove', mouseMove);
		}
	}
}
