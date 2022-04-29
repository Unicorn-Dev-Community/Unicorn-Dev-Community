// From: http://stackoverflow.com/a/901144/1471902
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&]*)|&|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// From: http://stackoverflow.com/a/13542669/1471902
function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function showModal(color) {
	updateColorInModal(color, false);
	document.querySelector('.wrapper').classList.add("modal-active");
}

function hideModal() {
	document.querySelector('.wrapper').classList.remove("modal-active");
}

function getColorProps(hex) {
	var name = ntc.name(hex)
	name.push(hex)
	return name
}

var hex = getParameterByName('color');
var color = '';
if (hex && hex.indexOf('#') === -1) {
	hex = '#' + hex;
}

if (hex) {
	color = getColorProps(hex)
}
var palette = []

hideModal()
if (color && color[3].length) {
	showModal(color)
}

var paletteChildren = document.querySelectorAll('.color-palette__child');
var paletteChild = document.querySelector('.color-palette__child')
var marker = document.querySelector('.palette-marker')

if (color) {
	moveMarker(2, ntc.hsl(hex));
}

for (var i = 0; i < paletteChildren.length; i++) {
	paletteChildren[i].addEventListener('click', function(e) {
		var self = this;
		var parent = self.parentNode;
		var index = Array.prototype.indexOf.call(parent.children, self);	
		
		updateColorInModal(getColorProps(palette[index]), true)
		moveMarker(index, ntc.hsl(palette[index]))
	}, false)
}

function updateColorInModal(color, isCalledFromPalette) {
	var colorPreview = document.querySelector('.color-preview'),
		colorName = document.querySelector('.color-name'),
		colorFamily = document.querySelector('.color-family'),
		copyHex = document.querySelector('.copy__item--hex .copy__value'),
		copyRgb = document.querySelector('.copy__item--rgb .copy__value'),
		rgb = ntc.rgb(color[color.length -1])

	colorPreview.style.backgroundColor = color[color.length -1]
	colorName.innerText = color[1]
	colorFamily.innerText = 'aka ' + color[3]
	copyHex.innerText = color[color.length -1].toUpperCase()
	copyRgb.innerText = rgb[0] + ', ' + rgb[1] + ', ' + rgb[2]

	document.querySelector('.copy__item--hex').setAttribute('data-clipboard-text', color[color.length -1].toUpperCase())
	document.querySelector('.copy__item--rgb').setAttribute('data-clipboard-text', 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')')

	if (!isCalledFromPalette) {
		palette = []
		palette.push(shadeColor(hex, 0.4))
		palette.push(shadeColor(hex, 0.2))
		palette.push(shadeColor(hex, 0))
		palette.push(shadeColor(hex, -0.2))
		palette.push(shadeColor(hex, -0.4))

		for (var i = 0; i < palette.length; i++) {
			document.querySelector('.color-palette__child--' + (i + 1)).style.backgroundColor = palette[i];
		}
	}
}

function moveMarker(index, hsl) {
	var xTranslation = (paletteChild.offsetWidth * (index + 1)) - (paletteChild.offsetWidth / 2) - 3;
	var yTranslation = (paletteChild.offsetHeight / 2) - 3;
	marker.style.transform = 'translate3d(' + xTranslation + 'px, ' + yTranslation + 'px, 0)'

	var lightness = hsl[2]/255 * 100;
	if (lightness > 60) {
		marker.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
	}
	else {
		marker.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
	}
}

var backTop = document.querySelector('.modal__content').getBoundingClientRect().top;
var closeBtn = document.querySelector('.modal__close');

closeBtn.style.top = backTop/2 - 24 + 'px'
closeBtn.addEventListener('click', function (e) {
	hideModal()
}, false)

var clipboard = new Clipboard('.copy__item');
clipboard.on('success', event => {
    if (event.text) {
        showMessage(event.trigger);
    }
});

function showMessage(elem) {
	elem.querySelector('.copy__message').classList.add('copy__message--animate')
	timeout = setTimeout(function() {
		elem.querySelector('.copy__message').classList.remove('copy__message--animate')
	}, 1000)
}