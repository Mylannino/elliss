/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* global define: false, module: false */

(function (window) {

	'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

	function classReg(className) {
  	return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ('classList' in document.documentElement) {
  	hasClass = function (elem, c) {
    	return elem.classList.contains(c);
  };
  	addClass = function (elem, c) {
    	elem.classList.add(c);
  };
  	removeClass = function (elem, c) {
    	elem.classList.remove(c);
  };
}
	else {
  	hasClass = function (elem, c) {
    	return classReg(c).test(elem.className);
  };
  	addClass = function (elem, c) {
    	if (!hasClass(elem, c)) {
      	elem.className = elem.className + ' ' + c;
    }
  };
  	removeClass = function (elem, c) {
    	elem.className = elem.className.replace(classReg(c), ' ');
  };
}

	function toggleClass(elem, c) {
  	var fn = hasClass(elem, c) ? removeClass : addClass;
  	fn(elem, c);
}

	var classie = {
  // full names
  	hasClass: hasClass,
  	addClass: addClass,
  	removeClass: removeClass,
  	toggleClass: toggleClass,
  // short names
  	has: hasClass,
  	add: addClass,
  	remove: removeClass,
  	toggle: toggleClass
};

// transport
	if (typeof define === 'function' && define.amd) {
  // AMD
  	define(classie);
} else if (typeof exports === 'object') {
  // CommonJS
  	module.exports = classie;
} else {
  // browser global
  	window.classie = classie;
}

})(window);

// ============================================================
//
// The MIT License
//
// Copyright (C) 2014 Matthew Wagerfield - @wagerfield
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
// ============================================================

/**
 * Parallax.js
 * @author Matthew Wagerfield - @wagerfield
 * @description Creates a parallax effect between an array of layers,
 *              driving the motion from the gyroscope output of a smartdevice.
 *              If no gyroscope is available, the cursor position is used.
 */
(function (window, document, undefined) {

  // Strict Mode
  	'use strict';

  // Constants
  	var NAME = 'Parallax';
  	var MAGIC_NUMBER = 30;
  	var DEFAULTS = {
    	className: 'layer',
    	relativeInput: false,
    	clipRelativeInput: false,
    	calibrationThreshold: 100,
    	calibrationDelay: 500,
    	supportDelay: 500,
    	calibrateX: false,
    	calibrateY: true,
    	invertX: true,
    	invertY: true,
    	limitX: false,
    	limitY: false,
    	scalarX: 10.0,
    	scalarY: 10.0,
    	frictionX: 0.1,
    	frictionY: 0.1,
    	originX: 0.5,
    	originY: 0.5
  };

  	function Parallax(element, options) {

    // DOM Context
    	this.element = element;

    	var className = options.className || DEFAULTS.className;
    	this.layers = element.getElementsByClassName(className);

    // Data Extraction
    	var data = {
      	calibrateX: this.data(this.element, 'calibrate-x'),
      	calibrateY: this.data(this.element, 'calibrate-y'),
      	invertX: this.data(this.element, 'invert-x'),
      	invertY: this.data(this.element, 'invert-y'),
      	limitX: this.data(this.element, 'limit-x'),
      	limitY: this.data(this.element, 'limit-y'),
      	scalarX: this.data(this.element, 'scalar-x'),
      	scalarY: this.data(this.element, 'scalar-y'),
      	frictionX: this.data(this.element, 'friction-x'),
      	frictionY: this.data(this.element, 'friction-y'),
      	originX: this.data(this.element, 'origin-x'),
      	originY: this.data(this.element, 'origin-y')
    };

    // Delete Null Data Values
    	for (var key in data) {
      	if (data[key] === null) delete data[key];
    }

    // Compose Settings Object
    	this.extend(this, DEFAULTS, options, data);

    // States
    	this.calibrationTimer = null;
    	this.calibrationFlag = true;
    	this.enabled = false;
    	this.depths = [];
    	this.raf = null;

    // Element Bounds
    	this.bounds = null;
    	this.ex = 0;
    	this.ey = 0;
    	this.ew = 0;
    	this.eh = 0;

    // Element Center
    	this.ecx = 0;
    	this.ecy = 0;

    // Element Range
    	this.erx = 0;
    	this.ery = 0;

    // Calibration
    	this.cx = 0;
    	this.cy = 0;

    // Input
    	this.ix = 0;
    	this.iy = 0;

    // Motion
    	this.mx = 0;
    	this.my = 0;

    // Velocity
    	this.vx = 0;
    	this.vy = 0;

    // Callbacks
    	this.onMouseMove = this.onMouseMove.bind(this);
    	this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
    	this.onOrientationTimer = this.onOrientationTimer.bind(this);
    	this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
    	this.onAnimationFrame = this.onAnimationFrame.bind(this);
    	this.onWindowResize = this.onWindowResize.bind(this);

    // Initialise
    	this.initialise();
  }

  	Parallax.prototype.extend = function () {
    	if (arguments.length > 1) {
      	var master = arguments[0];
      	for (var i = 1, l = arguments.length; i < l; i++) {
        	var object = arguments[i];
        	for (var key in object) {
          	master[key] = object[key];
        }
      }
    }
  };

  	Parallax.prototype.data = function (element, name) {
    	return this.deserialize(element.getAttribute('data-' + name));
  };

  	Parallax.prototype.deserialize = function (value) {
    	if (value === "true") {
      	return true;
    } else if (value === "false") {
      	return false;
    } else if (value === "null") {
      	return null;
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
      	return parseFloat(value);
    } else {
      	return value;
    }
  };

  	Parallax.prototype.camelCase = function (value) {
    	return value.replace(/-+(.)?/g, function (match, character) {
      	return character ? character.toUpperCase() : '';
    });
  };

  	Parallax.prototype.transformSupport = function (value) {
    	var element = document.createElement('div');
    	var propertySupport = false;
    	var propertyValue = null;
    	var featureSupport = false;
    	var cssProperty = null;
    	var jsProperty = null;
    	for (var i = 0, l = this.vendors.length; i < l; i++) {
      	if (this.vendors[i] !== null) {
        	cssProperty = this.vendors[i][0] + 'transform';
        	jsProperty = this.vendors[i][1] + 'Transform';
      } else {
        	cssProperty = 'transform';
        	jsProperty = 'transform';
      }
      	if (element.style[jsProperty] !== undefined) {
        	propertySupport = true;
        	break;
      }
    }
    	switch (value) {
      	case '2D':
        		featureSupport = propertySupport;
        		break;
      	case '3D':
        		if (propertySupport) {
          	var body = document.body || document.createElement('body');
          	var documentElement = document.documentElement;
          	var documentOverflow = documentElement.style.overflow;
          	if (!document.body) {
            	documentElement.style.overflow = 'hidden';
            	documentElement.appendChild(body);
            	body.style.overflow = 'hidden';
            	body.style.background = '';
          }
          	body.appendChild(element);
          	element.style[jsProperty] = 'translate3d(1px,1px,1px)';
          	propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
          	featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none";
          	documentElement.style.overflow = documentOverflow;
          	body.removeChild(element);
        }
        		break;
    }
    	return featureSupport;
  };

  	Parallax.prototype.ww = null;
  	Parallax.prototype.wh = null;
  	Parallax.prototype.wcx = null;
  	Parallax.prototype.wcy = null;
  	Parallax.prototype.wrx = null;
  	Parallax.prototype.wry = null;
  	Parallax.prototype.portrait = null;
  	Parallax.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
  	Parallax.prototype.vendors = [null, ['-webkit-', 'webkit'], ['-moz-', 'Moz'], ['-o-', 'O'], ['-ms-', 'ms']];
  	Parallax.prototype.motionSupport = !!window.DeviceMotionEvent;
  	Parallax.prototype.orientationSupport = !!window.DeviceOrientationEvent;
  	Parallax.prototype.orientationStatus = 0;
  	Parallax.prototype.transform2DSupport = Parallax.prototype.transformSupport('2D');
  	Parallax.prototype.transform3DSupport = Parallax.prototype.transformSupport('3D');
  	Parallax.prototype.propertyCache = {};

  	Parallax.prototype.initialise = function () {

    // Configure Context Styles
    	if (this.transform3DSupport) this.accelerate(this.element);
    	var style = window.getComputedStyle(this.element);
    	if (style.getPropertyValue('position') === 'static') {
      	this.element.style.position = 'relative';
    }

    // Setup
    	this.updateLayers();
    	this.updateDimensions();
    	this.enable();
    	this.queueCalibration(this.calibrationDelay);
  };

  	Parallax.prototype.updateLayers = function () {

    // Cache Layer Elements
    // this.layers = this.element.getElementsByClassName('layer');
    	this.depths = [];

    // Configure Layer Styles
    	for (var i = 0, l = this.layers.length; i < l; i++) {
      	var layer = this.layers[i];
      	if (this.transform3DSupport) this.accelerate(layer);
      	layer.style.position = i ? 'absolute' : 'relative';
      	layer.style.display = 'block';
      	layer.style.left = 0;
      	layer.style.top = 0;

      // Cache Layer Depth
      	this.depths.push(this.data(layer, 'depth') || 0);
    }
  };

  	Parallax.prototype.updateDimensions = function () {
    	this.ww = window.innerWidth;
    	this.wh = window.innerHeight;
    	this.wcx = this.ww * this.originX;
    	this.wcy = this.wh * this.originY;
    	this.wrx = Math.max(this.wcx, this.ww - this.wcx);
    	this.wry = Math.max(this.wcy, this.wh - this.wcy);
  };

  	Parallax.prototype.updateBounds = function () {
    	this.bounds = this.element.getBoundingClientRect();
    	this.ex = this.bounds.left;
    	this.ey = this.bounds.top;
    	this.ew = this.bounds.width;
    	this.eh = this.bounds.height;
    	this.ecx = this.ew * this.originX;
    	this.ecy = this.eh * this.originY;
    	this.erx = Math.max(this.ecx, this.ew - this.ecx);
    	this.ery = Math.max(this.ecy, this.eh - this.ecy);
  };

  	Parallax.prototype.queueCalibration = function (delay) {
    	clearTimeout(this.calibrationTimer);
    	this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
  };

  	Parallax.prototype.enable = function () {
    	if (!this.enabled) {
      	this.enabled = true;
      	if (this.orientationSupport) {
        	this.portrait = null;
        	window.addEventListener('deviceorientation', this.onDeviceOrientation);
        	setTimeout(this.onOrientationTimer, this.supportDelay);
      } else {
        	this.cx = 0;
        	this.cy = 0;
        	this.portrait = false;
        	window.addEventListener('mousemove', this.onMouseMove);
      }
      	window.addEventListener('resize', this.onWindowResize);
      	this.raf = requestAnimationFrame(this.onAnimationFrame);
    }
  };

  	Parallax.prototype.disable = function () {
    	if (this.enabled) {
      	this.enabled = false;
      	if (this.orientationSupport) {
        	window.removeEventListener('deviceorientation', this.onDeviceOrientation);
      } else {
        	window.removeEventListener('mousemove', this.onMouseMove);
      }
      	window.removeEventListener('resize', this.onWindowResize);
      	cancelAnimationFrame(this.raf);
    }
  };

  	Parallax.prototype.calibrate = function (x, y) {
    	this.calibrateX = x === undefined ? this.calibrateX : x;
    	this.calibrateY = y === undefined ? this.calibrateY : y;
  };

  	Parallax.prototype.invert = function (x, y) {
    	this.invertX = x === undefined ? this.invertX : x;
    	this.invertY = y === undefined ? this.invertY : y;
  };

  	Parallax.prototype.friction = function (x, y) {
    	this.frictionX = x === undefined ? this.frictionX : x;
    	this.frictionY = y === undefined ? this.frictionY : y;
  };

  	Parallax.prototype.scalar = function (x, y) {
    	this.scalarX = x === undefined ? this.scalarX : x;
    	this.scalarY = y === undefined ? this.scalarY : y;
  };

  	Parallax.prototype.limit = function (x, y) {
    	this.limitX = x === undefined ? this.limitX : x;
    	this.limitY = y === undefined ? this.limitY : y;
  };

  	Parallax.prototype.origin = function (x, y) {
    	this.originX = x === undefined ? this.originX : x;
    	this.originY = y === undefined ? this.originY : y;
  };

  	Parallax.prototype.clamp = function (value, min, max) {
    	value = Math.max(value, min);
    	value = Math.min(value, max);
    	return value;
  };

  	Parallax.prototype.css = function (element, property, value) {
    	var jsProperty = this.propertyCache[property];
    	if (!jsProperty) {
      	for (var i = 0, l = this.vendors.length; i < l; i++) {
        	if (this.vendors[i] !== null) {
          	jsProperty = this.camelCase(this.vendors[i][1] + '-' + property);
        } else {
          	jsProperty = property;
        }
        	if (element.style[jsProperty] !== undefined) {
          	this.propertyCache[property] = jsProperty;
          	break;
        }
      }
    }
    	element.style[jsProperty] = value;
  };

  	Parallax.prototype.accelerate = function (element) {
    	this.css(element, 'transform', 'translate3d(0,0,0)');
    	this.css(element, 'transform-style', 'preserve-3d');
    	this.css(element, 'backface-visibility', 'hidden');
  };

  	Parallax.prototype.setPosition = function (element, x, y) {
    	x += 'px';
    	y += 'px';
    	if (this.transform3DSupport) {
      	this.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)');
    } else if (this.transform2DSupport) {
      	this.css(element, 'transform', 'translate(' + x + ',' + y + ')');
    } else {
      	element.style.left = x;
      	element.style.top = y;
    }
  };

  	Parallax.prototype.setShadowOpacity = function (elem, opacity) {
    	elem.style.opacity = opacity;
  };

  	Parallax.prototype.onOrientationTimer = function (event) {
    	if (this.orientationSupport && this.orientationStatus === 0) {
      	this.disable();
      	this.orientationSupport = false;
      	this.enable();
    }
  };

  	Parallax.prototype.onCalibrationTimer = function (event) {
    	this.calibrationFlag = true;
  };

  	Parallax.prototype.onWindowResize = function (event) {
    	this.updateDimensions();
  };

  	Parallax.prototype.onAnimationFrame = function () {
    	this.updateBounds();
    	var dx = this.ix - this.cx;
    	var dy = this.iy - this.cy;
    	if ((Math.abs(dx) > this.calibrationThreshold) || (Math.abs(dy) > this.calibrationThreshold)) {
      	this.queueCalibration(0);
    }
    	if (this.portrait) {
      	this.mx = this.calibrateX ? dy : this.iy;
      	this.my = this.calibrateY ? dx : this.ix;
    } else {
      	this.mx = this.calibrateX ? dx : this.ix;
      	this.my = this.calibrateY ? dy : this.iy;
    }
    	this.mx *= this.ew * (this.scalarX / 100);
    	this.my *= this.eh * (this.scalarY / 100);
    	if (!isNaN(parseFloat(this.limitX))) {
      	this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
    }
    	if (!isNaN(parseFloat(this.limitY))) {
      	this.my = this.clamp(this.my, -this.limitY, this.limitY);
    }
    	this.vx += (this.mx - this.vx) * this.frictionX;
    	this.vy += (this.my - this.vy) * this.frictionY;

    // BEGIN CHANGES
    	for (var i = 0, l = this.layers.length; i < l; i++) {
      	var layer = this.layers[i];
      	var depth = this.depths[i];
      	var xOffset = this.vx * depth * (this.invertX ? -1 : 1);
      	var yOffset = this.vy * depth * (this.invertY ? -1 : 1);

      // console.log( dy );
      	if (classie.has(layer, 'bee3D--shadow-wrapper')) {
        	yOffset = 0;

        // set opacity for shadow based on same y position
        	var opacity = 1 - ((dy < 0) ? 0 : (dy > 1) ? 1 : dy);
        	this.setShadowOpacity(layer, opacity);
      }

      	this.setPosition(layer, xOffset, yOffset);

    }
    	this.raf = requestAnimationFrame(this.onAnimationFrame);
  };

  	Parallax.prototype.onDeviceOrientation = function (event) {

    // Validate environment and event properties.
    	if (!this.desktop && event.beta !== null && event.gamma !== null) {

      // Set orientation status.
      	this.orientationStatus = 1;

      // Extract Rotation
      	var x = (event.beta || 0) / MAGIC_NUMBER; //  -90 :: 90
      	var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180

      // Detect Orientation Change
      	var portrait = this.wh > this.ww;
      	if (this.portrait !== portrait) {
        	this.portrait = portrait;
        	this.calibrationFlag = true;
      }

      // Set Calibration
      	if (this.calibrationFlag) {
        	this.calibrationFlag = false;
        	this.cx = x;
        	this.cy = y;
      }

      // Set Input
      	this.ix = x;
      	this.iy = y;
    }
  };

  	Parallax.prototype.onMouseMove = function (event) {

    // Cache mouse coordinates.
    	var clientX = event.clientX;
    	var clientY = event.clientY;

    // Calculate Mouse Input
    	if (!this.orientationSupport && this.relativeInput) {

      // Clip mouse coordinates inside element bounds.
      	if (this.clipRelativeInput) {
        	clientX = Math.max(clientX, this.ex);
        	clientX = Math.min(clientX, this.ex + this.ew);
        	clientY = Math.max(clientY, this.ey);
        	clientY = Math.min(clientY, this.ey + this.eh);
      }

      // Calculate input relative to the element.
      	this.ix = (clientX - this.ex - this.ecx) / this.erx;
      	this.iy = (clientY - this.ey - this.ecy) / this.ery;
    } else {

      // Calculate input relative to the window.
      	this.ix = (clientX - this.wcx) / this.wrx;
      	this.iy = (clientY - this.wcy) / this.wry;
    }
  };

  // Expose Parallax
  	window[NAME] = Parallax;

})(window, document);

/**
 * Request Animation Frame Polyfill.
 * @author Tino Zijdel
 * @author Paul Irish
 * @see https://gist.github.com/paulirish/1579671
 */
(function () {

  	var lastTime = 0;
  	var vendors = ['ms', 'moz', 'webkit', 'o'];

  	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    	window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    	window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  	if (!window.requestAnimationFrame) {
    	window.requestAnimationFrame = function (callback, element) {
      	var currTime = new Date().getTime();
      	var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      	var id = window.setTimeout(function () { callback(currTime + timeToCall); },
        timeToCall);
      	lastTime = currTime + timeToCall;
      	return id;
    };
  }

  	if (!window.cancelAnimationFrame) {
    	window.cancelAnimationFrame = function (id) {
      	clearTimeout(id);
    };
  }

}());

var Bee3D=function(){"use strict";function e(){}function t(e){return Boolean(e)&&e.constructor===Object}function n(e,t,n){t.split(" ").forEach(function(t){e.addEventListener(t,n)})}function i(e,t,n){t.split(" ").forEach(function(t){e.removeEventListener(t,n)})}function o(e){var n;e=e||{};for(var i=1;i<arguments.length;i++){n=Object(arguments[i]);for(var a in n)e[a]=t(n[a])?o(e[a],n[a]):n[a]}return e}function a(){if(l.XMLHttpRequest)return new l.XMLHttpRequest;try{return new l.ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(e){}throw new Error("no xmlhttp request able to be created")}function s(e,t,n){e[t]=e[t]||n}function r(e,t){this.options=o({},u,t),this.init(e)}var l=window,c=document,u={wrapper:c.body,selector:".bee3D--slide",effect:"coverflow",focus:0,listeners:{keys:!1,touches:!1,clicks:!1,scroll:!1,drag:!1},navigation:{enabled:!1,next:".bee3D--nav__next",prev:".bee3D--nav__prev"},ajax:{enabled:!1,path:null,when:2,maxFetches:null,builder:function(e){return"<p>"+e.content+"</p>"}},autoplay:{enabled:!1,speed:5e3,pauseHover:!1},loop:{enabled:!1,continuous:!1,offset:2},sync:{enabled:!1,targets:[]},parallax:{enabled:!1,className:"bee3D--parallax",friction:.7,settings:{relativeInput:!0,clipRelativeInput:!0,calibrateX:!0,calibrateY:!0,scalarX:4,scalarY:5,frictionX:.1,frictionY:.1}},shadows:{enabled:!1,template:['<div class="bee3D--shadow-wrapper">','<div class="bee3D--shadow">',"<span></span>","</div>","</div>"].join("")},onInit:e,onChange:e,onDestroy:e},f=function(e,t){"string"==typeof e&&(e={url:e});var n=e.headers||{},i=e.body,o=e.method||(i?"POST":"GET"),r=e.withCredentials||!1,l=a();l.onreadystatechange=function(){4===l.readyState&&t(l.status,l.responseText,l)},i&&(s(n,"X-Requested-With","XMLHttpRequest"),s(n,"Content-Type","application/x-www-form-urlencoded")),l.open(o,e.url,!0),l.withCredentials=r;for(var c in n)n.hasOwnProperty(c)&&l.setRequestHeader(c,n[c]);l.send(i)},d=function(){var e=this,t=e.options.ajax,n=t.when,i=t.path,o=t.maxFetches,a=t.builder,s=e.el.slides,r=s.length,l=e.options.selector.substring(1),u=function(t){e.el.parent.appendChild(t),e.el.slides.push(t)},d=function(n){var i=n.map(function(e){var t=c.createElement("section");return t.className=l,t.innerHTML='<div class="bee3D--inner">'+a(e)+"</div>",u(t),t});return r=e.el.slides.length,e.slideEvents(i),t.maxFetches&&o--,e.el.touch()},h=function(){f(i,function(e,t){return 200===e?d(JSON.parse(t).data):void 0})},p=function(e){if(r-n===e.index){if(!t.maxFetches)return h();if(o&&o>0)return h()}};this.el.on("activate",p)},h=function(){var e=this,t=function(){e.timer=setTimeout(function(){e.el.next()},e.options.autoplay.speed)},n=function(){clearTimeout(e.timer)},i=function(){n(),t()};t(),e.el.on("resumeAutoplay",t),e.el.on("pauseAutoplay",n),e.el.on("resetAutoplay",i),e.el.on("activate",i),e.options.autoplay.pauseHover&&e.el.on("activate",function(t){e.listenToHover(t.slide)}),e.el.on("destroy",function(){n()})},p=function(e){for(var t=this,o=function(){var n=e.indexOf(this);return t.el.slide(n)},a=0;a<e.length;a++)e[a].style.pointerEvents="auto",e[a].style.cursor="pointer",n(e[a],"click",o);this.el.on("activate",function(e){i(e.slide,"click",o)}),this.el.on("deactivate",function(e){n(e.slide,"click",o)}),this.el.on("destroy",function(){e.forEach(function(e){e.removeAttribute("style"),i(e,"click",o)})})},v=function(){var e=this.el;e.on("prev",function(t){0===t.index&&e.slide(e.slides.length-1)}),e.on("next",function(t){t.index===e.slides.length-1&&e.slide(0)})},m=function(){var e,t,o=this,a=this.el.parent,s=function(n){e=n.x,t=0},r=function(n){n.preventDefault(),t=n.x-e},l=function(){Math.abs(t)>50&&o.el[t>0?"prev":"next"]()};classie.add(a,"draggable"),n(a,"mousedown",s),n(a,"mousemove",r),n(a,"mouseup",l),this.el.on("destroy",function(){classie.remove(a,"draggable"),i(a,"mousedown",s),i(a,"mousemove",r),i(a,"mouseup",l)})},b=function(){var e=this,t=this.el.parent,o=function(t){var n=t.wheelDelta||-t.detail;return n<0?e.el.next():e.el.prev()};n(t,"mousewheel DOMMouseScroll",o),this.el.on("destroy",function(){i(t,"mousewheel DOMMouseScroll",o)})},y=function(){var e=this,t=e.options,i=e.el.parent,o=function(i,o){n(i,"click",function(t){return t.preventDefault(),o?e.el.next():e.el.prev()}),t.autoplay.enabled&&t.autoplay.pauseHover&&e.listenToHover(i)},a=i.querySelector(t.navigation.prev),s=i.querySelector(t.navigation.next);s&&o(s,!0),a&&o(a,!1)},x=function(e){if(l.Parallax){for(var t=this,n=t.options,i=n.shadows.enabled,o=n.parallax.className,a=n.parallax.friction,s=n.parallax.settings,r=function(e){classie.add(e,o),e.setAttribute("data-depth",a)},c=0;c<e.length;c++){var u=e[c];r(u.firstElementChild),i&&r(u.lastChild)}s.className=o,t._parallax=new Parallax(t.el.parent,n.parallax.settings),t.el.parent.style.transformStyle="initial",t.el.on("destroy",function(){t.el.parent.removeAttribute("style"),t._parallax.disable();var e=t._parallax.layers;t._parallax=t._parallax.layers=t._parallax.element=void 0;for(var n=e.length-1;n>=0;n--){var i=e[n];classie.remove(i,o),i.removeAttribute("data-depth"),i.removeAttribute("style")}})}},g=function(e){var t=this.options.shadows.template;e.forEach(function(e){e.innerHTML+=t}),this.el.on("destroy",function(){e.forEach(function(e){e.removeChild(e.lastChild)})})},w=function(){var e=this.options.sync.targets,t=function(t){for(var n=t.index,i=0;i<e.length;i++)l[e[i]].el.slide(n)};this.el.on("activate",t)},D=function(e){return function(t){var o="vertical"!==e,a=function(e){(34===e.which||32===e.which||o&&39===e.which||!o&&40===e.which)&&t.next(),(33===e.which||o&&37===e.which||!o&&38===e.which)&&t.prev()};n(c,"keydown",a),t.on("destroy",function(){i(c,"keydown",a)})}},_=function(e){var t="bee3D--",n=e.loop.continuous,i=e.loop.offset;return function(o){var a=o.slides.length,s=function(e,n){classie.add(e,t+n)},r=function(e,n){e.className=e.className.replace(new RegExp(t+n+"(\\s|$)","g")," ").trim()},l=function(e,t){var l=o.slide(),c=t-l,u=c>0?"after":"before";if(n){var f=a-i-1;c>=f&&(u="before",c=a-c),c<=-f&&(u="after",c=a+c)}["before(-\\d+)?","after(-\\d+)?","slide__active","slide__inactive"].map(r.bind(null,e)),t!==l&&["slide__inactive",u,u+"-"+Math.abs(c)].map(s.bind(null,e))};s(o.parent,"parent"),".bee3D--slide"!==!e.slideSelector&&o.slides.forEach(function(e){s(e,"slide")}),o.on("activate",function(e){o.slides.map(l),s(e.slide,"slide__active"),r(e.slide,"slide__inactive")})}},E=function(){return function(e){function t(e){s=e.touches[0].pageX,r=e.touches[0].pageY,l=0}function o(e){var t=e.touches[0];if(Math.abs(s-t.pageX)>Math.abs(r-t.pageY))return l=t.pageX-s,!1}function a(){Math.abs(l)>50&&e[l>0?"prev":"next"]()}var s,r,l,c=e.parent;n(c,"touchstart",t),n(c,"touchmove",o),n(c,"touchend",a),e.on("destroy",function(){i(c,"touchstart",t),i(c,"touchmove",o),i(c,"touchend",a)})}},M=function(e){return function(t){t.on("activate",function(n){if(t.initialized)return e(n)})}},k=function(e){var t=[].slice.call(e),n=t[-1],i={},o=function(){return t.indexOf(n)},a=function(e,n){return n=n||{},n.index=t.indexOf(e),n.slide=e,n},s=function(e,t){return(i[e]||[]).reduce(function(e,n){return e&&n(t)!==!1},!0)},r=function(e){return s("activate",a(n,e))},l=function(e,i){t[e]&&(s("deactivate",a(n,i)),n=t[e],r(i))},c=function(e,n){var i=o();if(i!==e)return arguments.length?(s("slide",a(t[e],n)),void l(e,n)):i},u=function(e,i){var o=t.indexOf(n)+e;s(e>0?"next":"prev",a(n,i)),l(o,i)},f=function(e,t){return i[e]=(i[e]||[]).concat(t),function(){i[e]=i[e].filter(function(e){return e!==t})}};return{on:f,fire:s,touch:r,slide:c,next:u.bind(null,1),prev:u.bind(null,-1),slides:t}},H=function(e){function t(){a.el.fire("pauseAutoplay")}function o(){a.el.fire("resetAutoplay")}var a=this;n(e,"mouseover",t),n(e,"mouseout",o),a.el.on("destroy",function(){i(e,"mouseover",o),i(e,"mouseout",t)})},S=function(){var e=this.el.parent,t=this.el.slides,n=new RegExp("bee3D-(.*)","g");e.className=e.className.replace(n,"");for(var i=".bee3D--slide"===this.options.selector,o=0;o<t.length;o++)t[o].className=i?"bee3D--slide":t[o].className.replace(n,"");this.el.fire("destroy");var a=this.options.onDestroy;this.options=u,this.plugins(),a()};return r.prototype={init:function(e){var t=this.options,n=e.querySelectorAll(t.selector);this.el=k(n),this.el.parent=e,this.plugins(),this.el.slide(this.options.focus),classie.add(this.el.parent,"bee3D--effect__"+this.options.effect),this.events(),this.slideEvents(),this.options.onInit(),this.el.initialized=!0},plugins:function(){var e=this,t=e.options,n=[_(t),M(t.onChange)];t.listeners.keys&&n.push(D()),t.listeners.touches&&n.push(E()),(n||[]).forEach(function(t){t(e.el)})},events:function(){var e=this.options;e.sync.enabled&&this.sync(),e.ajax.enabled&&this.ajax(),e.loop.enabled&&this.loop(),e.autoplay.enabled&&this.autoplay(),e.navigation.enabled&&this.navigation(),e.listeners.scroll&&this.mouseScroll(),e.listeners.drag&&this.mouseDrag()},slideEvents:function(e){var t=this.options;e||(e=this.el.slides),t.shadows.enabled&&this.shadows(e),t.parallax.enabled&&this.parallax(e),t.listeners.clicks&&this.clickInactives(e)},sync:w,ajax:d,loop:v,shadows:g,autoplay:h,navigation:y,parallax:x,clickInactives:p,mouseScroll:b,mouseDrag:m,destroy:S,listenToHover:H},r}();
/*!
 * Datepicker for Bootstrap v1.8.0 (https://github.com/uxsolutions/bootstrap-datepicker)
 *
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a,b){function c(){return new Date(Date.UTC.apply(Date,arguments))}function d(){var a=new Date;return c(a.getFullYear(),a.getMonth(),a.getDate())}function e(a,b){return a.getUTCFullYear()===b.getUTCFullYear()&&a.getUTCMonth()===b.getUTCMonth()&&a.getUTCDate()===b.getUTCDate()}function f(c,d){return function(){return d!==b&&a.fn.datepicker.deprecated(d),this[c].apply(this,arguments)}}function g(a){return a&&!isNaN(a.getTime())}function h(b,c){function d(a,b){return b.toLowerCase()}var e,f=a(b).data(),g={},h=new RegExp("^"+c.toLowerCase()+"([A-Z])");c=new RegExp("^"+c.toLowerCase());for(var i in f)c.test(i)&&(e=i.replace(h,d),g[e]=f[i]);return g}function i(b){var c={};if(q[b]||(b=b.split("-")[0],q[b])){var d=q[b];return a.each(p,function(a,b){b in d&&(c[b]=d[b])}),c}}var j=function(){var b={get:function(a){return this.slice(a)[0]},contains:function(a){for(var b=a&&a.valueOf(),c=0,d=this.length;c<d;c++)if(0<=this[c].valueOf()-b&&this[c].valueOf()-b<864e5)return c;return-1},remove:function(a){this.splice(a,1)},replace:function(b){b&&(a.isArray(b)||(b=[b]),this.clear(),this.push.apply(this,b))},clear:function(){this.length=0},copy:function(){var a=new j;return a.replace(this),a}};return function(){var c=[];return c.push.apply(c,arguments),a.extend(c,b),c}}(),k=function(b,c){a.data(b,"datepicker",this),this._process_options(c),this.dates=new j,this.viewDate=this.o.defaultViewDate,this.focusDate=null,this.element=a(b),this.isInput=this.element.is("input"),this.inputField=this.isInput?this.element:this.element.find("input"),this.component=!!this.element.hasClass("date")&&this.element.find(".add-on, .input-group-addon, .btn"),this.component&&0===this.component.length&&(this.component=!1),this.isInline=!this.component&&this.element.is("div"),this.picker=a(r.template),this._check_template(this.o.templates.leftArrow)&&this.picker.find(".prev").html(this.o.templates.leftArrow),this._check_template(this.o.templates.rightArrow)&&this.picker.find(".next").html(this.o.templates.rightArrow),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&this.picker.addClass("datepicker-rtl"),this.o.calendarWeeks&&this.picker.find(".datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan",function(a,b){return Number(b)+1}),this._process_options({startDate:this._o.startDate,endDate:this._o.endDate,daysOfWeekDisabled:this.o.daysOfWeekDisabled,daysOfWeekHighlighted:this.o.daysOfWeekHighlighted,datesDisabled:this.o.datesDisabled}),this._allow_update=!1,this.setViewMode(this.o.startView),this._allow_update=!0,this.fillDow(),this.fillMonths(),this.update(),this.isInline&&this.show()};k.prototype={constructor:k,_resolveViewName:function(b){return a.each(r.viewModes,function(c,d){if(b===c||a.inArray(b,d.names)!==-1)return b=c,!1}),b},_resolveDaysOfWeek:function(b){return a.isArray(b)||(b=b.split(/[,\s]*/)),a.map(b,Number)},_check_template:function(c){try{if(c===b||""===c)return!1;if((c.match(/[<>]/g)||[]).length<=0)return!0;var d=a(c);return d.length>0}catch(a){return!1}},_process_options:function(b){this._o=a.extend({},this._o,b);var e=this.o=a.extend({},this._o),f=e.language;q[f]||(f=f.split("-")[0],q[f]||(f=o.language)),e.language=f,e.startView=this._resolveViewName(e.startView),e.minViewMode=this._resolveViewName(e.minViewMode),e.maxViewMode=this._resolveViewName(e.maxViewMode),e.startView=Math.max(this.o.minViewMode,Math.min(this.o.maxViewMode,e.startView)),e.multidate!==!0&&(e.multidate=Number(e.multidate)||!1,e.multidate!==!1&&(e.multidate=Math.max(0,e.multidate))),e.multidateSeparator=String(e.multidateSeparator),e.weekStart%=7,e.weekEnd=(e.weekStart+6)%7;var g=r.parseFormat(e.format);e.startDate!==-(1/0)&&(e.startDate?e.startDate instanceof Date?e.startDate=this._local_to_utc(this._zero_time(e.startDate)):e.startDate=r.parseDate(e.startDate,g,e.language,e.assumeNearbyYear):e.startDate=-(1/0)),e.endDate!==1/0&&(e.endDate?e.endDate instanceof Date?e.endDate=this._local_to_utc(this._zero_time(e.endDate)):e.endDate=r.parseDate(e.endDate,g,e.language,e.assumeNearbyYear):e.endDate=1/0),e.daysOfWeekDisabled=this._resolveDaysOfWeek(e.daysOfWeekDisabled||[]),e.daysOfWeekHighlighted=this._resolveDaysOfWeek(e.daysOfWeekHighlighted||[]),e.datesDisabled=e.datesDisabled||[],a.isArray(e.datesDisabled)||(e.datesDisabled=e.datesDisabled.split(",")),e.datesDisabled=a.map(e.datesDisabled,function(a){return r.parseDate(a,g,e.language,e.assumeNearbyYear)});var h=String(e.orientation).toLowerCase().split(/\s+/g),i=e.orientation.toLowerCase();if(h=a.grep(h,function(a){return/^auto|left|right|top|bottom$/.test(a)}),e.orientation={x:"auto",y:"auto"},i&&"auto"!==i)if(1===h.length)switch(h[0]){case"top":case"bottom":e.orientation.y=h[0];break;case"left":case"right":e.orientation.x=h[0]}else i=a.grep(h,function(a){return/^left|right$/.test(a)}),e.orientation.x=i[0]||"auto",i=a.grep(h,function(a){return/^top|bottom$/.test(a)}),e.orientation.y=i[0]||"auto";else;if(e.defaultViewDate instanceof Date||"string"==typeof e.defaultViewDate)e.defaultViewDate=r.parseDate(e.defaultViewDate,g,e.language,e.assumeNearbyYear);else if(e.defaultViewDate){var j=e.defaultViewDate.year||(new Date).getFullYear(),k=e.defaultViewDate.month||0,l=e.defaultViewDate.day||1;e.defaultViewDate=c(j,k,l)}else e.defaultViewDate=d()},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(d=b,e=a[f][1]):3===a[f].length&&(d=a[f][1],e=a[f][2]),c.on(e,d)},_unapplyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(e=b,d=a[f][1]):3===a[f].length&&(e=a[f][1],d=a[f][2]),c.off(d,e)},_buildEvents:function(){var b={keyup:a.proxy(function(b){a.inArray(b.keyCode,[27,37,39,38,40,32,13,9])===-1&&this.update()},this),keydown:a.proxy(this.keydown,this),paste:a.proxy(this.paste,this)};this.o.showOnFocus===!0&&(b.focus=a.proxy(this.show,this)),this.isInput?this._events=[[this.element,b]]:this.component&&this.inputField.length?this._events=[[this.inputField,b],[this.component,{click:a.proxy(this.show,this)}]]:this._events=[[this.element,{click:a.proxy(this.show,this),keydown:a.proxy(this.keydown,this)}]],this._events.push([this.element,"*",{blur:a.proxy(function(a){this._focused_from=a.target},this)}],[this.element,{blur:a.proxy(function(a){this._focused_from=a.target},this)}]),this.o.immediateUpdates&&this._events.push([this.element,{"changeYear changeMonth":a.proxy(function(a){this.update(a.date)},this)}]),this._secondaryEvents=[[this.picker,{click:a.proxy(this.click,this)}],[this.picker,".prev, .next",{click:a.proxy(this.navArrowsClick,this)}],[this.picker,".day:not(.disabled)",{click:a.proxy(this.dayCellClick,this)}],[a(window),{resize:a.proxy(this.place,this)}],[a(document),{"mousedown touchstart":a.proxy(function(a){this.element.is(a.target)||this.element.find(a.target).length||this.picker.is(a.target)||this.picker.find(a.target).length||this.isInline||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(b,c){var d=c||this.dates.get(-1),e=this._utc_to_local(d);this.element.trigger({type:b,date:e,viewMode:this.viewMode,dates:a.map(this.dates,this._utc_to_local),format:a.proxy(function(a,b){0===arguments.length?(a=this.dates.length-1,b=this.o.format):"string"==typeof a&&(b=a,a=this.dates.length-1),b=b||this.o.format;var c=this.dates.get(a);return r.formatDate(c,b,this.o.language)},this)})},show:function(){if(!(this.inputField.prop("disabled")||this.inputField.prop("readonly")&&this.o.enableOnReadonly===!1))return this.isInline||this.picker.appendTo(this.o.container),this.place(),this.picker.show(),this._attachSecondaryEvents(),this._trigger("show"),(window.navigator.msMaxTouchPoints||"ontouchstart"in document)&&this.o.disableTouchKeyboard&&a(this.element).blur(),this},hide:function(){return this.isInline||!this.picker.is(":visible")?this:(this.focusDate=null,this.picker.hide().detach(),this._detachSecondaryEvents(),this.setViewMode(this.o.startView),this.o.forceParse&&this.inputField.val()&&this.setValue(),this._trigger("hide"),this)},destroy:function(){return this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date,this},paste:function(b){var c;if(b.originalEvent.clipboardData&&b.originalEvent.clipboardData.types&&a.inArray("text/plain",b.originalEvent.clipboardData.types)!==-1)c=b.originalEvent.clipboardData.getData("text/plain");else{if(!window.clipboardData)return;c=window.clipboardData.getData("Text")}this.setDate(c),this.update(),b.preventDefault()},_utc_to_local:function(a){if(!a)return a;var b=new Date(a.getTime()+6e4*a.getTimezoneOffset());return b.getTimezoneOffset()!==a.getTimezoneOffset()&&(b=new Date(a.getTime()+6e4*b.getTimezoneOffset())),b},_local_to_utc:function(a){return a&&new Date(a.getTime()-6e4*a.getTimezoneOffset())},_zero_time:function(a){return a&&new Date(a.getFullYear(),a.getMonth(),a.getDate())},_zero_utc_time:function(a){return a&&c(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate())},getDates:function(){return a.map(this.dates,this._utc_to_local)},getUTCDates:function(){return a.map(this.dates,function(a){return new Date(a)})},getDate:function(){return this._utc_to_local(this.getUTCDate())},getUTCDate:function(){var a=this.dates.get(-1);return a!==b?new Date(a):null},clearDates:function(){this.inputField.val(""),this.update(),this._trigger("changeDate"),this.o.autoclose&&this.hide()},setDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;return this.update.apply(this,b),this._trigger("changeDate"),this.setValue(),this},setUTCDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;return this.setDates.apply(this,a.map(b,this._utc_to_local)),this},setDate:f("setDates"),setUTCDate:f("setUTCDates"),remove:f("destroy","Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead"),setValue:function(){var a=this.getFormattedDate();return this.inputField.val(a),this},getFormattedDate:function(c){c===b&&(c=this.o.format);var d=this.o.language;return a.map(this.dates,function(a){return r.formatDate(a,c,d)}).join(this.o.multidateSeparator)},getStartDate:function(){return this.o.startDate},setStartDate:function(a){return this._process_options({startDate:a}),this.update(),this.updateNavArrows(),this},getEndDate:function(){return this.o.endDate},setEndDate:function(a){return this._process_options({endDate:a}),this.update(),this.updateNavArrows(),this},setDaysOfWeekDisabled:function(a){return this._process_options({daysOfWeekDisabled:a}),this.update(),this},setDaysOfWeekHighlighted:function(a){return this._process_options({daysOfWeekHighlighted:a}),this.update(),this},setDatesDisabled:function(a){return this._process_options({datesDisabled:a}),this.update(),this},place:function(){if(this.isInline)return this;var b=this.picker.outerWidth(),c=this.picker.outerHeight(),d=10,e=a(this.o.container),f=e.width(),g="body"===this.o.container?a(document).scrollTop():e.scrollTop(),h=e.offset(),i=[0];this.element.parents().each(function(){var b=a(this).css("z-index");"auto"!==b&&0!==Number(b)&&i.push(Number(b))});var j=Math.max.apply(Math,i)+this.o.zIndexOffset,k=this.component?this.component.parent().offset():this.element.offset(),l=this.component?this.component.outerHeight(!0):this.element.outerHeight(!1),m=this.component?this.component.outerWidth(!0):this.element.outerWidth(!1),n=k.left-h.left,o=k.top-h.top;"body"!==this.o.container&&(o+=g),this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"),"auto"!==this.o.orientation.x?(this.picker.addClass("datepicker-orient-"+this.o.orientation.x),"right"===this.o.orientation.x&&(n-=b-m)):k.left<0?(this.picker.addClass("datepicker-orient-left"),n-=k.left-d):n+b>f?(this.picker.addClass("datepicker-orient-right"),n+=m-b):this.o.rtl?this.picker.addClass("datepicker-orient-right"):this.picker.addClass("datepicker-orient-left");var p,q=this.o.orientation.y;if("auto"===q&&(p=-g+o-c,q=p<0?"bottom":"top"),this.picker.addClass("datepicker-orient-"+q),"top"===q?o-=c+parseInt(this.picker.css("padding-top")):o+=l,this.o.rtl){var r=f-(n+m);this.picker.css({top:o,right:r,zIndex:j})}else this.picker.css({top:o,left:n,zIndex:j});return this},_allow_update:!0,update:function(){if(!this._allow_update)return this;var b=this.dates.copy(),c=[],d=!1;return arguments.length?(a.each(arguments,a.proxy(function(a,b){b instanceof Date&&(b=this._local_to_utc(b)),c.push(b)},this)),d=!0):(c=this.isInput?this.element.val():this.element.data("date")||this.inputField.val(),c=c&&this.o.multidate?c.split(this.o.multidateSeparator):[c],delete this.element.data().date),c=a.map(c,a.proxy(function(a){return r.parseDate(a,this.o.format,this.o.language,this.o.assumeNearbyYear)},this)),c=a.grep(c,a.proxy(function(a){return!this.dateWithinRange(a)||!a},this),!0),this.dates.replace(c),this.o.updateViewDate&&(this.dates.length?this.viewDate=new Date(this.dates.get(-1)):this.viewDate<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.viewDate>this.o.endDate?this.viewDate=new Date(this.o.endDate):this.viewDate=this.o.defaultViewDate),d?(this.setValue(),this.element.change()):this.dates.length&&String(b)!==String(this.dates)&&d&&(this._trigger("changeDate"),this.element.change()),!this.dates.length&&b.length&&(this._trigger("clearDate"),this.element.change()),this.fill(),this},fillDow:function(){if(this.o.showWeekDays){var b=this.o.weekStart,c="<tr>";for(this.o.calendarWeeks&&(c+='<th class="cw">&#160;</th>');b<this.o.weekStart+7;)c+='<th class="dow',a.inArray(b,this.o.daysOfWeekDisabled)!==-1&&(c+=" disabled"),c+='">'+q[this.o.language].daysMin[b++%7]+"</th>";c+="</tr>",this.picker.find(".datepicker-days thead").append(c)}},fillMonths:function(){for(var a,b=this._utc_to_local(this.viewDate),c="",d=0;d<12;d++)a=b&&b.getMonth()===d?" focused":"",c+='<span class="month'+a+'">'+q[this.o.language].monthsShort[d]+"</span>";this.picker.find(".datepicker-months td").html(c)},setRange:function(b){b&&b.length?this.range=a.map(b,function(a){return a.valueOf()}):delete this.range,this.fill()},getClassNames:function(b){var c=[],f=this.viewDate.getUTCFullYear(),g=this.viewDate.getUTCMonth(),h=d();return b.getUTCFullYear()<f||b.getUTCFullYear()===f&&b.getUTCMonth()<g?c.push("old"):(b.getUTCFullYear()>f||b.getUTCFullYear()===f&&b.getUTCMonth()>g)&&c.push("new"),this.focusDate&&b.valueOf()===this.focusDate.valueOf()&&c.push("focused"),this.o.todayHighlight&&e(b,h)&&c.push("today"),this.dates.contains(b)!==-1&&c.push("active"),this.dateWithinRange(b)||c.push("disabled"),this.dateIsDisabled(b)&&c.push("disabled","disabled-date"),a.inArray(b.getUTCDay(),this.o.daysOfWeekHighlighted)!==-1&&c.push("highlighted"),this.range&&(b>this.range[0]&&b<this.range[this.range.length-1]&&c.push("range"),a.inArray(b.valueOf(),this.range)!==-1&&c.push("selected"),b.valueOf()===this.range[0]&&c.push("range-start"),b.valueOf()===this.range[this.range.length-1]&&c.push("range-end")),c},_fill_yearsView:function(c,d,e,f,g,h,i){for(var j,k,l,m="",n=e/10,o=this.picker.find(c),p=Math.floor(f/e)*e,q=p+9*n,r=Math.floor(this.viewDate.getFullYear()/n)*n,s=a.map(this.dates,function(a){return Math.floor(a.getUTCFullYear()/n)*n}),t=p-n;t<=q+n;t+=n)j=[d],k=null,t===p-n?j.push("old"):t===q+n&&j.push("new"),a.inArray(t,s)!==-1&&j.push("active"),(t<g||t>h)&&j.push("disabled"),t===r&&j.push("focused"),i!==a.noop&&(l=i(new Date(t,0,1)),l===b?l={}:"boolean"==typeof l?l={enabled:l}:"string"==typeof l&&(l={classes:l}),l.enabled===!1&&j.push("disabled"),l.classes&&(j=j.concat(l.classes.split(/\s+/))),l.tooltip&&(k=l.tooltip)),m+='<span class="'+j.join(" ")+'"'+(k?' title="'+k+'"':"")+">"+t+"</span>";o.find(".datepicker-switch").text(p+"-"+q),o.find("td").html(m)},fill:function(){var d,e,f=new Date(this.viewDate),g=f.getUTCFullYear(),h=f.getUTCMonth(),i=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),j=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),k=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,l=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0,m=q[this.o.language].today||q.en.today||"",n=q[this.o.language].clear||q.en.clear||"",o=q[this.o.language].titleFormat||q.en.titleFormat;if(!isNaN(g)&&!isNaN(h)){this.picker.find(".datepicker-days .datepicker-switch").text(r.formatDate(f,o,this.o.language)),this.picker.find("tfoot .today").text(m).css("display",this.o.todayBtn===!0||"linked"===this.o.todayBtn?"table-cell":"none"),this.picker.find("tfoot .clear").text(n).css("display",this.o.clearBtn===!0?"table-cell":"none"),this.picker.find("thead .datepicker-title").text(this.o.title).css("display","string"==typeof this.o.title&&""!==this.o.title?"table-cell":"none"),this.updateNavArrows(),this.fillMonths();var p=c(g,h,0),s=p.getUTCDate();p.setUTCDate(s-(p.getUTCDay()-this.o.weekStart+7)%7);var t=new Date(p);p.getUTCFullYear()<100&&t.setUTCFullYear(p.getUTCFullYear()),t.setUTCDate(t.getUTCDate()+42),t=t.valueOf();for(var u,v,w=[];p.valueOf()<t;){if(u=p.getUTCDay(),u===this.o.weekStart&&(w.push("<tr>"),this.o.calendarWeeks)){var x=new Date(+p+(this.o.weekStart-u-7)%7*864e5),y=new Date(Number(x)+(11-x.getUTCDay())%7*864e5),z=new Date(Number(z=c(y.getUTCFullYear(),0,1))+(11-z.getUTCDay())%7*864e5),A=(y-z)/864e5/7+1;w.push('<td class="cw">'+A+"</td>")}v=this.getClassNames(p),v.push("day");var B=p.getUTCDate();this.o.beforeShowDay!==a.noop&&(e=this.o.beforeShowDay(this._utc_to_local(p)),e===b?e={}:"boolean"==typeof e?e={enabled:e}:"string"==typeof e&&(e={classes:e}),e.enabled===!1&&v.push("disabled"),e.classes&&(v=v.concat(e.classes.split(/\s+/))),e.tooltip&&(d=e.tooltip),e.content&&(B=e.content)),v=a.isFunction(a.uniqueSort)?a.uniqueSort(v):a.unique(v),w.push('<td class="'+v.join(" ")+'"'+(d?' title="'+d+'"':"")+' data-date="'+p.getTime().toString()+'">'+B+"</td>"),d=null,u===this.o.weekEnd&&w.push("</tr>"),p.setUTCDate(p.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").html(w.join(""));var C=q[this.o.language].monthsTitle||q.en.monthsTitle||"Months",D=this.picker.find(".datepicker-months").find(".datepicker-switch").text(this.o.maxViewMode<2?C:g).end().find("tbody span").removeClass("active");if(a.each(this.dates,function(a,b){b.getUTCFullYear()===g&&D.eq(b.getUTCMonth()).addClass("active")}),(g<i||g>k)&&D.addClass("disabled"),g===i&&D.slice(0,j).addClass("disabled"),g===k&&D.slice(l+1).addClass("disabled"),this.o.beforeShowMonth!==a.noop){var E=this;a.each(D,function(c,d){var e=new Date(g,c,1),f=E.o.beforeShowMonth(e);f===b?f={}:"boolean"==typeof f?f={enabled:f}:"string"==typeof f&&(f={classes:f}),f.enabled!==!1||a(d).hasClass("disabled")||a(d).addClass("disabled"),f.classes&&a(d).addClass(f.classes),f.tooltip&&a(d).prop("title",f.tooltip)})}this._fill_yearsView(".datepicker-years","year",10,g,i,k,this.o.beforeShowYear),this._fill_yearsView(".datepicker-decades","decade",100,g,i,k,this.o.beforeShowDecade),this._fill_yearsView(".datepicker-centuries","century",1e3,g,i,k,this.o.beforeShowCentury)}},updateNavArrows:function(){if(this._allow_update){var a,b,c=new Date(this.viewDate),d=c.getUTCFullYear(),e=c.getUTCMonth(),f=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),g=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),h=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,i=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0,j=1;switch(this.viewMode){case 4:j*=10;case 3:j*=10;case 2:j*=10;case 1:a=Math.floor(d/j)*j<f,b=Math.floor(d/j)*j+j>h;break;case 0:a=d<=f&&e<g,b=d>=h&&e>i}this.picker.find(".prev").toggleClass("disabled",a),this.picker.find(".next").toggleClass("disabled",b)}},click:function(b){b.preventDefault(),b.stopPropagation();var e,f,g,h;e=a(b.target),e.hasClass("datepicker-switch")&&this.viewMode!==this.o.maxViewMode&&this.setViewMode(this.viewMode+1),e.hasClass("today")&&!e.hasClass("day")&&(this.setViewMode(0),this._setDate(d(),"linked"===this.o.todayBtn?null:"view")),e.hasClass("clear")&&this.clearDates(),e.hasClass("disabled")||(e.hasClass("month")||e.hasClass("year")||e.hasClass("decade")||e.hasClass("century"))&&(this.viewDate.setUTCDate(1),f=1,1===this.viewMode?(h=e.parent().find("span").index(e),g=this.viewDate.getUTCFullYear(),this.viewDate.setUTCMonth(h)):(h=0,g=Number(e.text()),this.viewDate.setUTCFullYear(g)),this._trigger(r.viewModes[this.viewMode-1].e,this.viewDate),this.viewMode===this.o.minViewMode?this._setDate(c(g,h,f)):(this.setViewMode(this.viewMode-1),this.fill())),this.picker.is(":visible")&&this._focused_from&&this._focused_from.focus(),delete this._focused_from},dayCellClick:function(b){var c=a(b.currentTarget),d=c.data("date"),e=new Date(d);this.o.updateViewDate&&(e.getUTCFullYear()!==this.viewDate.getUTCFullYear()&&this._trigger("changeYear",this.viewDate),e.getUTCMonth()!==this.viewDate.getUTCMonth()&&this._trigger("changeMonth",this.viewDate)),this._setDate(e)},navArrowsClick:function(b){var c=a(b.currentTarget),d=c.hasClass("prev")?-1:1;0!==this.viewMode&&(d*=12*r.viewModes[this.viewMode].navStep),this.viewDate=this.moveMonth(this.viewDate,d),this._trigger(r.viewModes[this.viewMode].e,this.viewDate),this.fill()},_toggle_multidate:function(a){var b=this.dates.contains(a);if(a||this.dates.clear(),b!==-1?(this.o.multidate===!0||this.o.multidate>1||this.o.toggleActive)&&this.dates.remove(b):this.o.multidate===!1?(this.dates.clear(),this.dates.push(a)):this.dates.push(a),"number"==typeof this.o.multidate)for(;this.dates.length>this.o.multidate;)this.dates.remove(0)},_setDate:function(a,b){b&&"date"!==b||this._toggle_multidate(a&&new Date(a)),(!b&&this.o.updateViewDate||"view"===b)&&(this.viewDate=a&&new Date(a)),this.fill(),this.setValue(),b&&"view"===b||this._trigger("changeDate"),this.inputField.trigger("change"),!this.o.autoclose||b&&"date"!==b||this.hide()},moveDay:function(a,b){var c=new Date(a);return c.setUTCDate(a.getUTCDate()+b),c},moveWeek:function(a,b){return this.moveDay(a,7*b)},moveMonth:function(a,b){if(!g(a))return this.o.defaultViewDate;if(!b)return a;var c,d,e=new Date(a.valueOf()),f=e.getUTCDate(),h=e.getUTCMonth(),i=Math.abs(b);if(b=b>0?1:-1,1===i)d=b===-1?function(){return e.getUTCMonth()===h}:function(){return e.getUTCMonth()!==c},c=h+b,e.setUTCMonth(c),c=(c+12)%12;else{for(var j=0;j<i;j++)e=this.moveMonth(e,b);c=e.getUTCMonth(),e.setUTCDate(f),d=function(){return c!==e.getUTCMonth()}}for(;d();)e.setUTCDate(--f),e.setUTCMonth(c);return e},moveYear:function(a,b){return this.moveMonth(a,12*b)},moveAvailableDate:function(a,b,c){do{if(a=this[c](a,b),!this.dateWithinRange(a))return!1;c="moveDay"}while(this.dateIsDisabled(a));return a},weekOfDateIsDisabled:function(b){return a.inArray(b.getUTCDay(),this.o.daysOfWeekDisabled)!==-1},dateIsDisabled:function(b){return this.weekOfDateIsDisabled(b)||a.grep(this.o.datesDisabled,function(a){return e(b,a)}).length>0},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(!this.picker.is(":visible"))return void(40!==a.keyCode&&27!==a.keyCode||(this.show(),a.stopPropagation()));var b,c,d=!1,e=this.focusDate||this.viewDate;switch(a.keyCode){case 27:this.focusDate?(this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill()):this.hide(),a.preventDefault(),a.stopPropagation();break;case 37:case 38:case 39:case 40:if(!this.o.keyboardNavigation||7===this.o.daysOfWeekDisabled.length)break;b=37===a.keyCode||38===a.keyCode?-1:1,0===this.viewMode?a.ctrlKey?(c=this.moveAvailableDate(e,b,"moveYear"),c&&this._trigger("changeYear",this.viewDate)):a.shiftKey?(c=this.moveAvailableDate(e,b,"moveMonth"),c&&this._trigger("changeMonth",this.viewDate)):37===a.keyCode||39===a.keyCode?c=this.moveAvailableDate(e,b,"moveDay"):this.weekOfDateIsDisabled(e)||(c=this.moveAvailableDate(e,b,"moveWeek")):1===this.viewMode?(38!==a.keyCode&&40!==a.keyCode||(b*=4),c=this.moveAvailableDate(e,b,"moveMonth")):2===this.viewMode&&(38!==a.keyCode&&40!==a.keyCode||(b*=4),c=this.moveAvailableDate(e,b,"moveYear")),c&&(this.focusDate=this.viewDate=c,this.setValue(),this.fill(),a.preventDefault());break;case 13:if(!this.o.forceParse)break;e=this.focusDate||this.dates.get(-1)||this.viewDate,this.o.keyboardNavigation&&(this._toggle_multidate(e),d=!0),this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.setValue(),this.fill(),this.picker.is(":visible")&&(a.preventDefault(),a.stopPropagation(),this.o.autoclose&&this.hide());break;case 9:this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill(),this.hide()}d&&(this.dates.length?this._trigger("changeDate"):this._trigger("clearDate"),this.inputField.trigger("change"))},setViewMode:function(a){this.viewMode=a,this.picker.children("div").hide().filter(".datepicker-"+r.viewModes[this.viewMode].clsName).show(),this.updateNavArrows(),this._trigger("changeViewMode",new Date(this.viewDate))}};var l=function(b,c){a.data(b,"datepicker",this),this.element=a(b),this.inputs=a.map(c.inputs,function(a){return a.jquery?a[0]:a}),delete c.inputs,this.keepEmptyValues=c.keepEmptyValues,delete c.keepEmptyValues,n.call(a(this.inputs),c).on("changeDate",a.proxy(this.dateUpdated,this)),this.pickers=a.map(this.inputs,function(b){return a.data(b,"datepicker")}),this.updateDates()};l.prototype={updateDates:function(){this.dates=a.map(this.pickers,function(a){return a.getUTCDate()}),this.updateRanges()},updateRanges:function(){var b=a.map(this.dates,function(a){return a.valueOf()});a.each(this.pickers,function(a,c){c.setRange(b)})},clearDates:function(){a.each(this.pickers,function(a,b){b.clearDates()})},dateUpdated:function(c){if(!this.updating){this.updating=!0;var d=a.data(c.target,"datepicker");if(d!==b){var e=d.getUTCDate(),f=this.keepEmptyValues,g=a.inArray(c.target,this.inputs),h=g-1,i=g+1,j=this.inputs.length;if(g!==-1){if(a.each(this.pickers,function(a,b){b.getUTCDate()||b!==d&&f||b.setUTCDate(e)}),e<this.dates[h])for(;h>=0&&e<this.dates[h];)this.pickers[h--].setUTCDate(e);else if(e>this.dates[i])for(;i<j&&e>this.dates[i];)this.pickers[i++].setUTCDate(e);this.updateDates(),delete this.updating}}}},destroy:function(){a.map(this.pickers,function(a){a.destroy()}),a(this.inputs).off("changeDate",this.dateUpdated),delete this.element.data().datepicker},remove:f("destroy","Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead")};var m=a.fn.datepicker,n=function(c){var d=Array.apply(null,arguments);d.shift();var e;if(this.each(function(){var b=a(this),f=b.data("datepicker"),g="object"==typeof c&&c;if(!f){var j=h(this,"date"),m=a.extend({},o,j,g),n=i(m.language),p=a.extend({},o,n,j,g);b.hasClass("input-daterange")||p.inputs?(a.extend(p,{inputs:p.inputs||b.find("input").toArray()}),f=new l(this,p)):f=new k(this,p),b.data("datepicker",f)}"string"==typeof c&&"function"==typeof f[c]&&(e=f[c].apply(f,d))}),e===b||e instanceof k||e instanceof l)return this;if(this.length>1)throw new Error("Using only allowed for the collection of a single element ("+c+" function)");return e};a.fn.datepicker=n;var o=a.fn.datepicker.defaults={assumeNearbyYear:!1,autoclose:!1,beforeShowDay:a.noop,beforeShowMonth:a.noop,beforeShowYear:a.noop,beforeShowDecade:a.noop,beforeShowCentury:a.noop,calendarWeeks:!1,clearBtn:!1,toggleActive:!1,daysOfWeekDisabled:[],daysOfWeekHighlighted:[],datesDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keepEmptyValues:!1,keyboardNavigation:!0,language:"en",minViewMode:0,maxViewMode:4,multidate:!1,multidateSeparator:",",orientation:"auto",rtl:!1,startDate:-(1/0),startView:0,todayBtn:!1,todayHighlight:!1,updateViewDate:!0,weekStart:0,disableTouchKeyboard:!1,enableOnReadonly:!0,showOnFocus:!0,zIndexOffset:10,container:"body",immediateUpdates:!1,title:"",templates:{leftArrow:"&#x00AB;",rightArrow:"&#x00BB;"},showWeekDays:!0},p=a.fn.datepicker.locale_opts=["format","rtl","weekStart"];a.fn.datepicker.Constructor=k;var q=a.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear",titleFormat:"MM yyyy"}},r={viewModes:[{names:["days","month"],clsName:"days",e:"changeMonth"},{names:["months","year"],clsName:"months",e:"changeYear",navStep:1},{names:["years","decade"],clsName:"years",e:"changeDecade",navStep:10},{names:["decades","century"],clsName:"decades",e:"changeCentury",navStep:100},{names:["centuries","millennium"],clsName:"centuries",e:"changeMillennium",navStep:1e3}],validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,parseFormat:function(a){if("function"==typeof a.toValue&&"function"==typeof a.toDisplay)return a;var b=a.replace(this.validParts,"\0").split("\0"),c=a.match(this.validParts);if(!b||!b.length||!c||0===c.length)throw new Error("Invalid date format.");return{separators:b,parts:c}},parseDate:function(c,e,f,g){function h(a,b){return b===!0&&(b=10),a<100&&(a+=2e3,a>(new Date).getFullYear()+b&&(a-=100)),a}function i(){var a=this.slice(0,j[n].length),b=j[n].slice(0,a.length);return a.toLowerCase()===b.toLowerCase()}if(!c)return b;if(c instanceof Date)return c;if("string"==typeof e&&(e=r.parseFormat(e)),e.toValue)return e.toValue(c,e,f);var j,l,m,n,o,p={d:"moveDay",m:"moveMonth",w:"moveWeek",y:"moveYear"},s={yesterday:"-1d",today:"+0d",tomorrow:"+1d"};if(c in s&&(c=s[c]),/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(c)){for(j=c.match(/([\-+]\d+)([dmwy])/gi),c=new Date,n=0;n<j.length;n++)l=j[n].match(/([\-+]\d+)([dmwy])/i),m=Number(l[1]),o=p[l[2].toLowerCase()],c=k.prototype[o](c,m);return k.prototype._zero_utc_time(c)}j=c&&c.match(this.nonpunctuation)||[];var t,u,v={},w=["yyyy","yy","M","MM","m","mm","d","dd"],x={yyyy:function(a,b){return a.setUTCFullYear(g?h(b,g):b)},m:function(a,b){if(isNaN(a))return a;for(b-=1;b<0;)b+=12;for(b%=12,a.setUTCMonth(b);a.getUTCMonth()!==b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};x.yy=x.yyyy,x.M=x.MM=x.mm=x.m,x.dd=x.d,c=d();var y=e.parts.slice();if(j.length!==y.length&&(y=a(y).filter(function(b,c){return a.inArray(c,w)!==-1}).toArray()),j.length===y.length){var z;for(n=0,z=y.length;n<z;n++){if(t=parseInt(j[n],10),l=y[n],isNaN(t))switch(l){case"MM":u=a(q[f].months).filter(i),t=a.inArray(u[0],q[f].months)+1;break;case"M":u=a(q[f].monthsShort).filter(i),t=a.inArray(u[0],q[f].monthsShort)+1}v[l]=t}var A,B;for(n=0;n<w.length;n++)B=w[n],B in v&&!isNaN(v[B])&&(A=new Date(c),x[B](A,v[B]),isNaN(A)||(c=A))}return c},formatDate:function(b,c,d){if(!b)return"";if("string"==typeof c&&(c=r.parseFormat(c)),c.toDisplay)return c.toDisplay(b,c,d);var e={d:b.getUTCDate(),D:q[d].daysShort[b.getUTCDay()],DD:q[d].days[b.getUTCDay()],m:b.getUTCMonth()+1,M:q[d].monthsShort[b.getUTCMonth()],MM:q[d].months[b.getUTCMonth()],yy:b.getUTCFullYear().toString().substring(2),yyyy:b.getUTCFullYear()};e.dd=(e.d<10?"0":"")+e.d,e.mm=(e.m<10?"0":"")+e.m,b=[];for(var f=a.extend([],c.separators),g=0,h=c.parts.length;g<=h;g++)f.length&&b.push(f.shift()),b.push(e[c.parts[g]]);return b.join("")},headTemplate:'<thead><tr><th colspan="7" class="datepicker-title"></th></tr><tr><th class="prev">'+o.templates.leftArrow+'</th><th colspan="5" class="datepicker-switch"></th><th class="next">'+o.templates.rightArrow+"</th></tr></thead>",
contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};r.template='<div class="datepicker"><div class="datepicker-days"><table class="table-condensed">'+r.headTemplate+"<tbody></tbody>"+r.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-decades"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-centuries"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+"</table></div></div>",a.fn.datepicker.DPGlobal=r,a.fn.datepicker.noConflict=function(){return a.fn.datepicker=m,this},a.fn.datepicker.version="1.8.0",a.fn.datepicker.deprecated=function(a){var b=window.console;b&&b.warn&&b.warn("DEPRECATED: "+a)},a(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(b){var c=a(this);c.data("datepicker")||(b.preventDefault(),n.call(c,"show"))}),a(function(){n.call(a('[data-provide="datepicker-inline"]'))})});
!function(a){a.fn.datepicker.dates.nl={days:["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],daysShort:["zo","ma","di","wo","do","vr","za"],daysMin:["zo","ma","di","wo","do","vr","za"],months:["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],monthsShort:["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],today:"Vandaag",monthsTitle:"Maanden",clear:"Wissen",weekStart:1,format:"dd-mm-yyyy"}}(jQuery);