(function(globalScope,nameSpace){/*
 * Monkeypatches. Ook ook.
 */

//window.performance.now() polyfill
if (!window.performance)
{
    window.performance = {};
}

if (!window.performance.now)
{
    window.performance.now = function() {
	return Date.now();
    };
}

//Array extended methods
//Array.prototype.copy = function()
//{
//    return this.slice(0);
//};
//
//Array.prototype.copy2 = function()
//{
//    var length = this.length;
//    var arrayCopy = [];
//    for (var i = 0; i < length; i++)
//    {
//	if (this[i].isArray)
//	{
//	    arrayCopy[i] = this[i].copy2();
//	}
//    }
//    return arrayCopy.slice(0);
//};


/**
 * Array.mapQuick() - Array map function for arrays containing mutable objects.  When using shallow arrays containing numbers, strings, or bools, you will need to directly access the source array in your callback.  Modifies and returns original array without creating a new Array object.  Works faster than JavaScript's immutable Array.map().
 * @method
 * @param {Function} callback
 * @returns {Array}
 */
Array.prototype.mapQuick = function(callback)
{
    var length = this.length;
    for (var i = 0; i < length; i++)
    {
	callback(this[i], i);
    }
    return this;
};



Array.prototype.sortBy = function(sorter, order)
{
    var length = this.length;
    if (order === undefined)
    {
	order = 1;
    }

    for (var i = 0; i < length; i++)
    {
	if (this[i] instanceof Array)
	{
	    this[i].sortBy(sorter, order);
	}
    }

    this.sort(function(a, b) {
	var current = +a[sorter];
	var next = +b[sorter];
	return order * (current - next);
    });
};

Array.prototype.getRandomElement = function()
{
    return Math.floor(Math.random() * this.length);
};

Array.prototype.removeElement = function(element)
{
    alert(2);
    var targetIndex = this.indexOf(element);

    if (targetIndex !== -1)
    {
	alert("removed " + this[targetIndex]);
	this.splice(targetIndex, 1);
    }
    return this;
};

Array.prototype.draw = function(targetContext)
{
    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] && this[i].draw)
	{
	    this[i].draw(targetContext);
	}
    }
};

Array.prototype.update = function(dt)
{


    var length = this.length;

    for (var i = 0; i < length; i++)
    {
	if (this[i] && this[i].update)
	{
	    this[i].update(dt);
	}
    }
};

Array.prototype.handleClick = function(mouseX, mouseY, e)
{
    var length = this.length;

    for (var i = length - 1; i >= 0; i--)
    {

	if (this[i].handleClick && this[i].handleClick(mouseX, mouseY, e))
	{
	    return true;
	}
    }
};
/*
 Number.prototype.clamp = function(min, max) {
 return Math.min(Math.max(this, min), max);
 };

 Number.prototype.isBetween = function (min, max)
 {
 return (this === this.clamp(min,max));
 };

 */

//Math extended methods

Math.jordanCurve = function(x, y, vertices)
{

    var isInPoly = false;
    //var vertices = this.getVertices();
    var length = vertices.length;
    //alert(vertices);
    for (var i = 0, j = length - 1; i < length; j = i++)
    {
	if ((vertices[i][1] > y) !== (vertices[j][1] > y))
	{
	    if (x < ((vertices[j][0] - vertices[i][0]) * (y - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]))
	    {
		isInPoly = !isInPoly;
	    }

	}
    }
    return isInPoly;
};

Math.log10 = function(x)
{
    return (Math.log(x) / Math.LN10);
};

Math.degToRad = function(deg)
{
    return (deg * (Math.PI / 180));
};

Math.radToDeg = function(rad)
{
    return (rad * (180 / Math.PI));
};

Math.vectorX = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	    return speed;
	    break;
	case 180:
	    return -speed;
	    break;
	case 90:
	case -90:
	    return 0;
	    break;
	default:
	    return Math.cos(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.vectorY = function(speed, direction)
{
    switch (direction)
    {
	case 0:
	case 180:
	    return 0;
	    break;
	case 90:
	    return -speed;
	    break;
	case -90:
	    return speed;
	    break;
	default:
	    return Math.sin(Math.degToRad(direction)) * speed;
	    break;
    }
};

Math.Vector = function(magnitude, direction)
{
    this.magnitude = magnitude;
    this.direction = direction;
};

Math.Vector.prototype.addVector = function(vector)
{
    var d1 = Math.degToRad(this.direction);
    var d2 = Math.degToRad(vector.direction);

    var x1 = Math.cos(d1) * this.magnitude;
    var x2 = Math.cos(d2) * vector.magnitude;

    var y1 = -Math.sin(d1) * this.magnitude;
    var y2 = -Math.sin(d2) * vector.magnitude;

    var adj = x1 + x2;
    var opp = y1 + y2;

    var newDirection = Math.atan(opp / adj);
    var newMagnitude = Math.sqrt((Math.pow(adj, 2) + Math.pow(opp, 2)));

    this.magnitude = newMagnitude;
    this.direction = newDirection;
};

Math.rotatePoint = function(x,y,angle)
{

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var x1 = (cos * x) + (sin * y );
    var y1 = -(sin * x)+ (cos * y);
    return {x:x1,y:y1};
};;
/*
 * Ludix.js Game Engine Core
 */

var L = {};

/*
 * Core Structuring
 */


L.system = {};  // Namespace with system variables and functions
L.objects = {};  // Namespace with all game objects
L.game = {};  // Namespace holding game data
L.pipe = {};  // Namespace for holding 'global' objects



L.start = function() {

    //window.removeEventListener('load', L.start);
    var game = L.game;
    var system = L.system;

    game.settings();
    system.setup();
    game.resources();
    system.setLoadScreen();

    (function gameLoop() {
	var system = L.system;
	var thisScene = system.currentScene;
	//var game = L.game;

	var now = system.now = window.performance.now();
	var dt = system.dt = (system.now - system.then) / 1000;
	if (dt > 1 / system.frameCap)
	{
	    system.dt = 1 / system.frameCap;
	}
	system.then = now;
	thisScene.update(dt);
	thisScene.draw();
	requestAnimationFrame(gameLoop);
	//thisScene.draw();
    })();
};

L.log = function(message)
{
    if (console && console.log)
    {
	console.log(message);
    }
};

L.alert = function(message)
{
    if (window && window.alert)
    {
	window.alert(message);
    }
};

L.system = {};
L.system.orientation = 'landscape';
L.system.fullscreen = true;
L.system.canvasRatio = 1;
L.system.timeScale = 1;
L.system.frameCap = 30;
L.system.now, L.system.then = window.performance.now();
L.system.dt = 0;



L.system.resourcePath = "resources/";		    // Holds path to resource folder
L.system.soundPath = "sounds/";			    // Holds path to sound folder in resources folder
L.system.texturePath = "textures/";		    // Holds path to image folder in resources folder
L.system.expectedResources = 0;
L.system.loadedResources = 0;


L.system.width = 640;
L.system.height = 480;
L.system.canvasLocation = document.body;
Object.defineProperty(L.system, "centerX", {
    get: function()
    {
	return L.system.width / 2;
    }
});
Object.defineProperty(L.system, "centerY", {
    get: function()
    {
	return L.system.height / 2;
    }
});






L.system.layerAlpha = 1;
L.system.currentScene = {};
L.system.previousScene = {};
L.scenes = {};
/**********************************************************************
 *  Resources
 *
 */

L.texture = {};

L.load = {};

L.load.texture = function(file, textureName)
{
    L.system.expectedResources += 1;
    var thisTexture = new Image();
    var name = (textureName === undefined) ? file.substr(0, file.lastIndexOf(".")) : textureName;

    thisTexture.onload = function() {
	L.system.loadedResources += 1;
	console.log("Succesfully loaded texture " + file + ".");
	thisTexture.onload = undefined;
	thisTexture.error = undefined;
    };

    thisTexture.onerror = function() {
	L.alert("Something went wrong loading texture file " + file + ".");
    };

    thisTexture.src = L.system.resourcePath + L.system.texturePath + file;

    L.texture[name] = thisTexture;
    if (thisTexture.complete)
    {
	thisTexture.onload();
    }
    return thisTexture;
};



L.sound = {};
L.music = {};

window.addEventListener('load', L.start);



L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];;





L.system.setup = function()
{
    var width = L.system.width;
    var height = L.system.height;
    var aspectRatio = L.system.aspectRatio = width / height;

    try {
	screen.lockOrientation(L.system.orientation);
    }
    catch (e)
    {
	L.log("Warning: Screen orientation could not be locked.");
    }



    L.system.renderCanvas[0] = document.createElement("canvas");
    L.system.renderCanvas[0].width = width;
    L.system.renderCanvas[0].height = height;
    L.system.canvasLocation.appendChild(L.system.renderCanvas[0]);
    L.system.renderContext[0] = L.system.renderCanvas[0].getContext("2d");
//    L.system.renderContext[0].imageSmoothingEnabled = false;
//    L.system.renderContext[0].webkitImageSmoothingEnabled = false;
//    L.system.renderContext[0].mozImageSmoothingEnabled = false;




    L.system.bufferCanvas[0] = document.createElement('canvas');
    L.system.bufferCanvas[0].width = width;
    L.system.bufferCanvas[0].height = height;
    L.system.bufferContext[0] = L.system.bufferCanvas[0].getContext("2d");
//    L.system.bufferContext[0].imageSmoothingEnabled = false;
//    L.system.bufferContext[0].webkitImageSmoothingEnabled = false;
//    L.system.bufferContext[0].mozImageSmoothingEnabled = false;


    L.system.fxCanvas[0] = document.createElement('canvas');
    L.system.fxCanvas[0].width = width;
    L.system.fxCanvas[0].height = height;
    L.system.fxContext[0] = L.system.fxCanvas[0].getContext("2d");

    L.system.pixelCanvas[0] = document.createElement('canvas');
    L.system.pixelCanvas[0].width = 1;
    L.system.pixelCanvas[0].height = 1;
    L.system.pixelContext[0] = L.system.pixelCanvas[0].getContext("2d");




    //L.system.canvasX = L.system.renderCanvas[0].offsetLeft;
    //L.system.canvasY = L.system.renderCanvas[0].offsetTop;
    Object.defineProperty(L.system, "canvasX", {
	get: function() {
	    return L.system.renderCanvas[0].offsetLeft;
	}
    });
    Object.defineProperty(L.system, "canvasY", {
	get: function() {
	    return L.system.renderCanvas[0].offsetTop;
	}
    });

    L.mouse.setupEventListeners();



    window.addEventListener("keydown", doKeyDown, true);
    function doKeyDown(event) {
	if (L.system.currentScene.doKeyDown !== undefined)
	{
	    L.system.currentScene.doKeyDown(event);
	}
    }

    window.addEventListener("keyup", doKeyUp, true);
    function doKeyUp(event) {
	if (L.system.currentScene.doKeyUp !== undefined)
	{
	    L.system.currentScene.doKeyUp(event);
	}
    }

    if (L.system.fullscreen) {
	//var CSSOptions = "margin: 0px; padding: 0px; border-width: 0px;	overflow:hidden;";
	//document.body.style = CSSOptions;
	//document.getElementsByTagName("html")[0].style = CSSOptions;
	//L.system.renderCanvas[0].style = "margin:0px auto; transition-property: all; transition-duration: 1s; transition-timing-function: ease;" + CSSOptions;
	L.display.autoResize();
	window.addEventListener('resize', L.display.autoResize, true);
    }


};

L.system.setLoadScreen = function()
{
    var system = L.system;
    var width = system.width;
    var height = system.height;
    var objects = L.objects;
    var mainColour = "#eeeeee";

    var loadScreen = new objects.Scene();
    loadScreen.bgFill = "#000000";
    var text = new objects.Textbox("Ludix", width / 2, height / 2 - 75);
    text.alignment = "center";
    text.backgroundFill = "";
    text.textFill = mainColour;
    text.fontSize = 50;
    text.autoSize();

    var iMake = new objects.Textbox("https://github.com/Loycifer/Ludix.js", width / 2, height / 2);
    iMake.alignment = "center";

    iMake.textFill = mainColour;
    iMake.backgroundFill = "";
    iMake.fontSize = 20;
    iMake.visible = false;
    iMake.autoSize();
    loadScreen.layers["background"].addObject(text);
    var screenTimer = {
	state: "loading",
	timer: 4
    };
    screenTimer.update = function(dt)
    {
	var timer = this.timer;
	switch (this.state)
	{
	    case "loading":
		if (system.expectedResources === system.loadedResources)
		{
		    //L.game.main();
		    this.state = "ready";
		    iMake.visible = true;
		}
		break;
	    case "ready":
		if (timer <= 0)
		{
		    this.timer = 3;
		    this.state = "fadeOut";
		}
		if (progressBar.alpha > 0)
		{
		    progressBar.alpha -= 0.5 * dt;
		}
		if (progressBar.alpha < 0)
		{
		    progressBar.alpha = 0;
		}
		if (lineObject.alpha > 0)
		{
		    lineObject.alpha -= 0.5 * dt;
		}
		if (lineObject.alpha < 0)
		{
		    lineObject.alpha = 0;
		}
		this.timer -= 1 * dt;
		break;
	    case "fadeOut":
		if (timer <= 0)
		{
		    L.game.main();
		}
		if (text.alpha > 0)
		{
		    text.alpha -= 1 * dt;
		}
		if (text.alpha < 0)
		{
		    text.alpha = 0;
		}
		if (iMake.alpha > 0)
		{
		    iMake.alpha -= 1 * dt;
		}
		if (iMake.alpha < 0)
		{
		    iMake.alpha = 0;
		}
		this.timer -= 1 * dt;
		break;
	    default:
		break;
	}

    };
    var progressBar = {
	alpha: 1
    };
    progressBar.draw = function(layer)
    {
	var left = width * 0.25;

	var ratio = system.loadedResources / system.expectedResources;
	layer.globalAlpha = this.alpha;
	layer.beginPath();
	layer.lineWidth = 3;
	layer.strokeStyle = mainColour;
	layer.fillStyle = mainColour;
	layer.rect(left, height / 2, left * 2, 30);
	layer.stroke();
	layer.fillRect(left + 4, height / 2 + 4, ratio * (left * 2 - 8), 30 - 8);
    };
    progressBar.update = function(dt)
    {

    };

    var lineObject = {
	alpha: 1
    };
    lineObject.draw = function(layer)
    {
	if (this.alpha > 0)
	{
	layer.globalAlpha = this.alpha;
	layer.lineWidth = 1;
	layer.strokeStyle = "#000000";
	layer.beginPath();
	for (var i = 0.5, h = height, w = width; i < h; i += 2)
	{
	    layer.moveTo(0, i);
	    layer.lineTo(w, i);
	}
	layer.stroke();
    }
    };
    loadScreen.layers["background"].addObject(progressBar);
    loadScreen.layers["background"].addObject(iMake);
    loadScreen.layers["background"].addObject(screenTimer);
    loadScreen.layers["background"].addObject(lineObject);
    loadScreen.setScene();
};
;

L.mouse = {};
L.mouse.x = 0;
L.mouse.y = 0;
L.mouse.buttons = [];
L.mouse.buttons[0] = {
    name: 'left',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.buttons[1] = {
    name: 'middle',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.buttons[2] = {
    name: 'right',
    isDown: false,
    lastDown: {
	x: 0,
	y: 0
    }
};
L.mouse.touchEnabled = false;
L.mouse.reset = function()
{
  for (var i = 0; i < 3; i++)
  {
      var currentButton = this.buttons[i];
      currentButton.isDown = false;
      currentButton.lastDown.x = 0;
      currentButton.lastDown.y = 0;
  }
};

L.system.handleClick = function(e)
{
var mouseX = 0;
var mouseY = 0;
var type = e.type;
    if (e.targetTouches) {

	mouseX = (e.targetTouches[0].pageX - L.system.canvasX) / L.system.canvasRatio;
	mouseY = (e.targetTouches[0].pageY - L.system.canvasY) / L.system.canvasRatio;
	var targetButton = L.mouse.buttons[0];
	if (type === 'touchstart')
	{
	    targetButton.isDown = true;
	    targetButton.lastDown.x = mouseX;
	    targetButton.lastDown.y = mouseY;
	}
	if (type === 'touchend')
	{
	    targetButton.isDown = false;
	}
    } else
    {

	var targetButton = L.mouse.buttons[e.button];
	mouseX = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	mouseY = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
	if (type === 'mousedown')
	{
	    targetButton.isDown = true;
	    targetButton.lastDown.x = mouseX;
	    targetButton.lastDown.y = mouseY;
	}
	if (type === 'mouseup')
	{
	    targetButton.isDown = false;
	}

    }

    if (L.system.currentScene.handleClick && targetButton.name === 'left')
    {
	L.system.currentScene.handleClick(mouseX, mouseY, e);
    }

    e.preventDefault();
};

L.system.setMouseCoords = function(e)
{
    if (e.type !== 'touchmove')
    {
	L.mouse.x = (e.pageX - L.system.canvasX) / L.system.canvasRatio;
	L.mouse.y = (e.pageY - L.system.canvasY) / L.system.canvasRatio;
    } else {
	L.mouse.x = (e.targetTouches[0].pageX - L.system.canvasX) / L.system.canvasRatio;
	L.mouse.y = (e.targetTouches[0].pageY - L.system.canvasY) / L.system.canvasRatio;
    }

};

L.mouse.setupEventListeners = function()
{
    if ('ontouchstart' in document.documentElement)
    {
	L.mouse.touchEnabled = true;
	L.system.renderCanvas[0].addEventListener
	(
	'touchstart',
	L.system.handleClick
	);

	L.system.renderCanvas[0].addEventListener
	(
	'touchmove',
	L.system.setMouseCoords
	);

	L.system.renderCanvas[0].addEventListener
	(
	'touchend',
	L.system.handleClick
	);

    } else {
	L.system.renderCanvas[0].addEventListener
	(
	'mousedown',
	L.system.handleClick
	);

	L.system.renderCanvas[0].addEventListener
	(
	'mousemove',
	L.system.setMouseCoords
	);

	L.system.renderCanvas[0].addEventListener
	(
	'mouseup',
	L.system.handleClick
	);
    }
};
;

L.display = {
    get width() {
	return L.system.renderCanvas[0].style.offsetWidth;
    },
    set width(x) {
	L.system.renderCanvas[0].style.width = x;
    },
    get height() {
	return L.system.renderCanvas[0].style.height;
    },
    set height(x) {
	L.system.renderCanvas[0].style.height = x;
    }
};

L.display.autoResize = function()
{
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var canvasWidth = L.system.width;
    var canvasHeight = L.system.height;
    var windowAspect = windowWidth / windowHeight;

    if (windowAspect >= L.system.aspectRatio)
    {
	L.system.canvasRatio = windowHeight / canvasHeight;
	//L.system.renderCanvas[0].style.width = (windowWidth * (windowHeight * L.system.aspectRatio)) + "px";
	//L.system.renderCanvas[0].style.height = (windowHeight) + "px";
	//document.body.style.height = L.system.renderCanvas[0].style.height;
    }
    else if (windowAspect < L.system.aspectRatio)
    {
	L.system.canvasRatio = windowWidth / canvasWidth;
	//L.system.renderCanvas[0].style.width = (windowWidth) + "px";
	//L.system.renderCanvas[0].style.height = (windowHeight / L.system.aspectRatio) + "px";
	//document.body.style.width = L.system.renderCanvas[0].style.width;
    }
    L.system.renderCanvas[0].style.width = canvasWidth * L.system.canvasRatio + "px";
    L.system.renderCanvas[0].style.height = canvasHeight * L.system.canvasRatio + "px";
    document.body.style.width = "100%";//L.system.renderCanvas[0].style.width;
    //document.body.style.height = canvasHeight * L.system.canvasRatio - 0 + "px";
    document.body.style.height = Math.floor(windowHeight) + "px";
};
;


L.system.checkAudio = function() // Checks for client-supported audio type
{
    var dummyAudio = document.createElement('audio');

    if (dummyAudio.canPlayType('audio/ogg'))
    {
	L.system.audioType = ".ogg";
	L.log("Using .ogg files");
    }
    else if (dummyAudio.canPlayType('audio/mp4'))
    {
	L.system.audioType = ".m4a";
	L.log("Using .m4a files");
    }
    else if (dummyAudio.canPlayType('audio/wav'))
    {
	L.system.audioType = ".wav";
	L.log("Using .wav files");
    }
    else
    {
	L.alert("Your browser doesn't support .wav, .ogg, or .m4a audio files.");
    }
};

L.system.checkAudio();
L.audio = {};
L.audio.context = {};

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    L.audio.context = new AudioContext();
    L.audio.compressor = L.audio.context.createDynamicsCompressor();
    L.audio.compressor.connect(L.audio.context.destination);
    L.audio.masterGain = L.audio.context.createGain();
    L.audio.masterGain.connect(L.audio.compressor);
    L.audio.masterGain.gain.value = 1;
    L.audio.soundFX = L.audio.context.createGain();
    L.audio.soundFX.connect(L.audio.masterGain);

//mix.connect(compressor);


    setupWebAudio();

}
catch (e) {
    alert('Web Audio API is not supported in this browser');
}

function setupWebAudio() {
    L.load.audio = function(file, audioName)
    {

	L.system.expectedResources += 1;
	var request = new XMLHttpRequest();
	var name = (audioName === undefined) ? file.substr(0, file.lastIndexOf(".")) : audioName;
	request.open('GET', (L.system.resourcePath + L.system.soundPath + file + L.system.audioType), true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {

	    L.audio.context.decodeAudioData(request.response, function(audioBuffer) {

		L.sound[name] = audioBuffer;
		L.system.loadedResources += 1;
		L.log("Loaded audio file " + file);


	    }, (function() {
		L.alert("There was a problem loading " + file + ".");
	    }));
	};
	request.send();

    };

    L.objects.soundFX = function(audioBuffer)
    {
	if (audioBuffer === undefined)
	{
	    alert("Error accessing soundbuffer " + audioBuffer);
	}
	this.buffer = audioBuffer;
	// tell the source which sound to play

    };

    L.objects.soundFX.prototype.play = function(gain, panX, panY, panZ)
    {
	var source = L.audio.context.createBufferSource();
	source.buffer = L.sound[this.buffer];

	var pannerNode = L.audio.context.createPanner();
	var gainNode = L.audio.context.createGain();
	pannerNode.connect(L.audio.soundFX);
	pannerNode.panningModel = "equalpower";
	pannerNode.setPosition(0, 0, 0);
	gainNode.connect(pannerNode);

	source.connect(gainNode);
	source.start(0);
	L.log("playing sound");

    };
};

L.objects.Sprite = function(textureName, options)
{
    //var L = window.L;

    this.animations =
    {
	idle: []
    };

    this.animations.idle[0] =
    {
	img: L.texture[textureName],
	length: 1000
    };

    if (this.animations.idle[0].img)
    {
	L.log("Created Sprite from texture \'" + textureName + "\'.");
    }

    this.texture = L.texture[textureName];


    if (this.texture && this.texture.width > 0)
    {
	this.width = this.texture.width;
	this.height = this.texture.height;
	L.log("Setting Sprite dimensions to " + this.width + " by " + this.height + ".");
    }
    this.handle = {
	x: 0,
	y: 0
    };
    this.offset = {
	x: 0,
	y: 0
    };
    this.scale = {
	x: 1,
	y: 1
    };
    for (var propertyName in options)
    {
	if (options.hasOwnProperty(propertyName)) {
	    L.log("Adding property " + propertyName + " to Sprite object with with value " + JSON.stringify(options[propertyName]) + ".");
	    this[propertyName] = options[propertyName];
	}
    }

    Object.defineProperty(this, "center", {
	get: function() {
	    return {
		x: this.width / 2,
		y: this.height / 2
	    };
	}.bind(this)
    });





    this.nudeTop = 0;
    this.nudeLeft = 0;
    this.nudeRight = this.nudeLeft + this.width;
    this.nudeBottom = this.nudeTop + this.height;
    this.nudeTopLeft = [this.nudeLeft, this.nudeTop];
    this.nudeTopRight = [this.nudeRight, this.nudeTop];
    this.nudeBottomLeft = [this.nudeLeft, this.nudeBottom];
    this.nudeBottomRight = [this.nudeRight, this.nudeBottom];
    this.nudeVertices = [this.nudeTopLeft, this.nudeTopRight, this.nudeBottomRight, this.nudeBottomLeft];
    this.vertices = new Array(this.nudeVertices.length);

    this.rotationAccel = 0;

    this.accelDirection = 0;
    this.nextX = this.x;
    this.nextY = this.y;
    this.nextSpeedX = this.speedX;
    this.nextSpeedY = this.speedY;
    this.wrapX = true;
    this.wrapY = false;
    this.boundingType = "rect";


    this.blendMode = "";
    this.onClick = function() {

    };
    this.currentAnimation = "idle";
    this.currentFrame = 0;
    this.animationTimer;
    this.updateCommands = {};
    this.drawCommands = {};

//Predictive physics experimentation
    this.gravity = 0;
    this.g = 1000;
    this.direction = -Math.PI / 2;
    this.v = 0;
    this.y0 = 500 - this.y;
    this.energy = this.y0;
    this.time = 0;
    this.bounces = 0;
    this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;




};

//Sprite Properties

L.objects.Sprite.prototype.x = 0;
L.objects.Sprite.prototype.y = 0;
L.objects.Sprite.prototype.z = 0;
L.objects.Sprite.prototype.width = 0;
L.objects.Sprite.prototype.height = 0;

//L.objects.Sprite.prototype.scale = 1;
L.objects.Sprite.prototype.angle = 0;
L.objects.Sprite.prototype.rotation = 0;
L.objects.Sprite.prototype.alpha = 1;
L.objects.Sprite.prototype.speedX = 0;
L.objects.Sprite.prototype.speedY = 0;
L.objects.Sprite.prototype.accelX = 0;
L.objects.Sprite.prototype.accelY = 0;
L.objects.Sprite.prototype.visible = true;
L.objects.Sprite.prototype.isClickable = true;


//Sprite methods
L.objects.Sprite.prototype.setHandleXY = function(x, y)
{
    this.handle = {
	x: x,
	y: y
    };
};
L.objects.Sprite.prototype.setScale = function(x)
{
    this.scale = {
	x: x,
	y: x
    };
};
L.objects.Sprite.prototype.multiplyScale = function(x)
{
    this.scale = {
	x: x * this.scale.x,
	y: x * this.scale.y
    };
};

L.objects.Sprite.prototype.flipHorizontal = function()
{
    this.scale.x *= -1;
};
L.objects.Sprite.prototype.flipVertical = function()
{
    this.scale.y *= -1;
};
L.objects.Sprite.prototype.getWorldX = function()
{
    return this.x;
};
L.objects.Sprite.prototype.getWorldY = function()
{
    return this.y;
};
L.objects.Sprite.prototype.getScreenX = function()
{
    var currentScene = L.system.currentScene;
    return this.x - (currentScene.camera.x * currentScene.activeLayer.scrollRateX);
};
L.objects.Sprite.prototype.getScreenY = function()
{
    var currentScene = L.system.currentScene;
    return this.y - (currentScene.camera.y * currentScene.activeLayer.scrollRateY);
};

L.objects.Sprite.prototype.autoDraw = function(layer)
{
    if (!this.visible || (this.alpha) <= 0.0) {
	return;
    }
    var angle = this.angle;
    var screenX = this.getScreenX();
    var screenY = this.getScreenY();
    var scale = this.scale;
    //var unscale = 1/this.scale;
    layer.globalAlpha = this.alpha;

    if (true)
    {
	layer.save();
	layer.translate(screenX, screenY);
	layer.scale(scale.x, scale.y);
	layer.rotate(-angle);


	layer.drawImage(this.animations[this.currentAnimation][this.currentFrame].img, -this.handle.x, -this.handle.y);
	layer.restore();
    } else {
	// layer.scale(1/this.scale,1/this.scale);
	layer.drawImage(this.animations[this.currentAnimation][this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);
	//layer.scale(this.scale,this.scale);
    }
};
L.objects.Sprite.prototype.draw = L.objects.Sprite.prototype.autoDraw;

L.objects.Sprite.prototype.autoDrawCustom = function(layer, options) // do not use
{
    layer.globalAlpha = (options && options.opacity !== undefined) ? options.opacity : this.alpha;
    if (this.alpha > 0.0 && this.visible)
    {
	if (this.angle !== 0)
	{
	    layer.save();
	    layer.translate(this.x, this.y);
	    layer.rotate(-this.angle);

	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, -this.handle.x, -this.handle.y);
	    layer.restore();
	} else {

	    layer.drawImage((options && options.texture !== undefined) ? options.texture : this.animations.idle[this.currentFrame].img, this.x - this.handle.x, this.y - this.handle.y);

	}
    }
};
L.objects.Sprite.prototype.drawBoundingBox = function(layer)
{
    layer.beginPath();
    this.getVertices();
    layer.moveTo(this.vertices[3][0], this.vertices[3][1]);
    for (var i = 0; i < 4; i++)
    {
	layer.lineTo(this.vertices[i][0], this.vertices[i][1]);
    }
    layer.closePath();
    layer.strokeStyle = "#FFFFFF";
    layer.lineWidth = 2;
    layer.stroke();
};
L.objects.Sprite.prototype.update2 = function(dt)
{
    this.autoUpdate(dt);
};
L.objects.Sprite.prototype.autoUpdate = function(dt)
{
    var timeScale = L.system.timeScale;
    this.speedX += this.accelX * dt * timeScale;
    this.speedY += this.accelY * dt * timeScale;
    this.x += this.speedX * dt * timeScale;
    this.y += this.speedY * dt * timeScale;
    this.rotation += this.rotationAccel * dt * timeScale;
    this.angle += this.rotation * dt * timeScale;
};

L.objects.Sprite.prototype.handleClick = function(mouseX, mouseY, e)
{
    if (this.isClickable)
    {
	var scale = this.scale;
	var screenX = this.getScreenX();
	var screenY = this.getScreenY();
	if (this.angle === 0)
	{
	    var left = screenX + this.offset.x - (scale.x * this.handle.x);
	    var right = left + (scale.x * this.width);
	    var top = screenY + this.offset.y - (scale.y * this.handle.y);
	    var bottom = top + (scale.y * this.height);

	    if (left > right)
	    {
		var temp = left;
		left = right;
		right = temp;
	    }

	    if (top > bottom)
	    {
		var temp = top;
		top = bottom;
		bottom = temp;
	    }

	    if (
	    mouseX >= left &&
	    mouseX <= right &&
	    mouseY >= top &&
	    mouseY <= bottom
	    )
	    {
		if (this.isClickedPrecise(mouseX, mouseY))
		{
		    if (e.type === "mousedown")
		    {
			this.onClick(mouseX, mouseY, e);

			return true;
		    }
		}
	    }
	}
	else if (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices()))
	{

	    if (this.isClickedPrecise(mouseX, mouseY))
	    {

		this.onClick();

		return true;
	    }
	}
    }
};

L.objects.Sprite.prototype.isClickedPrecise = function(mouseX, mouseY)
{

    var layer = L.system.pixelContext[0];
    layer.clearRect(-1, -1, 3, 3);
    layer.save();
    layer.translate(-mouseX, -mouseY);
    this.autoDraw(layer);
    layer.restore();
    var pixelData = layer.getImageData(0, 0, 1, 1).data;
    return (pixelData[3] !== 0);
};

/*
 L.objects.Sprite.prototype.addBone = function(textureName, options)
 {
 if (this.bones === undefined)
 {
 this.bones = [];
 }
 var newBone = new Bone(textureName, options);
 newBone.parent = this;
 this.bones.push(newBone);
 };
 */
L.objects.Sprite.prototype.getSpeedX = function()
{
    return Math.vectorX(this.speed, this.direction);
};

L.objects.Sprite.prototype.getSpeedY = function()
{
    return Math.vectorY(this.speed, this.direction);
};

L.objects.Sprite.prototype.applyForce = function(speed, direction)
{
    var x1 = this.getSpeedX();
    var y1 = this.getSpeedY();
// var d1 = this.direction;

    var x2 = Math.vectorX(speed, direction); // * L.system.dt* L.system.timeScale;
    var y2 = Math.vectorY(speed, direction); // * L.system.dt * L.system.timeScale;
//var d2 = direction;


    var adj = x1 + x2;
    var opp = y1 + y2;
    var length = Math.pow((Math.pow(adj, 2) + Math.pow(opp, 2)), 1 / 2);
    var angle = Math.radToDeg(Math.atan2(-opp, adj));
//alert(length);
    this.direction = angle;
    this.speed = length;
};

L.objects.Sprite.prototype.moveTo = function(coords)
{
    this.x = coords.x;
    this.y = coords.y;
};
L.objects.Sprite.prototype.moveToX = function(x)
{
    this.x = x;
};
L.objects.Sprite.prototype.move = function(coords)
{
    this.x += coords.x;
    this.y += coords.y;
};
L.objects.Sprite.prototype.moveX = function(x)
{
    this.move({
	x: x,
	y: 0
    });
};
L.objects.Sprite.prototype.moveY = function(y)
{
    this.move({
	x: 0,
	y: y
    });
};

L.objects.Sprite.prototype.centerHandle = function()
{
    this.handle = {
	x: this.center.x,
	y: this.center.y
    };
};

L.objects.Sprite.prototype.pushProperties = function(obj, propertiesArray)
{
    var arrayLength = propertiesArray.length;
    for (var i = 0; i < arrayLength; i++)
    {
	obj[propertiesArray[i]] = this[propertiesArray[i]];
    }
};

L.objects.Sprite.prototype.pushPosition = function(obj)
{
    obj.x = this.x;
    obj.y = this.y;
    obj.offset = {
	x: this.offset.x,
	y: this.offset.y
    };
};

L.objects.Sprite.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.getScreenX() + this.offset.x;
    var yTransform = this.getScreenY() + this.offset.y;
    var length = this.nudeVertices.length;
    var angle = this.angle;
    var scale = this.scale;
    if (angle !== 0)
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [
		(this.nudeVertices[i][0] - this.handle.x) * Math.cos(-angle) - (this.nudeVertices[i][1] - this.handle.y) * Math.sin(-angle),
		(this.nudeVertices[i][0] - this.handle.x) * Math.sin(-angle) + (this.nudeVertices[i][1] - this.handle.y) * Math.cos(-angle)
	    ];
	}
    }
    else
    {
	for (var i = 0; i < length; i++)
	{
	    this.vertices[i] = [this.nudeVertices[i][0] - this.handle.x, this.nudeVertices[i][1] - this.handle.y];
	}
    }

    this.vertices.mapQuick(function(entry) {
	entry[0] = (entry[0] * scale.x) + xTransform;
	entry[1] = (entry[1] * scale.y) + yTransform;
    });
    return this.vertices;
};
L.Frame = function(textureName, length)
{
    this.img = L.texture[textureName];
    this.length = length;
};
L.Animation = function(frames)
{

};

L.objects.Sprite.prototype.experimentalUpdate = function(dt)
{
//alert(this.landingTime);
    var L = L;
    this.time += dt * L.system.timeScale;
    var Math = Math;
    if (this.time >= this.landingTime)
    {

	if (this.energy < 1)
	{
	    this.energy = 0;
	}
//this.energy *= 1.01;
	this.direction = Math.PI / 2;
	this.y0 = 0;
	this.v = Math.sqrt((this.g * 2 * this.energy) / (Math.pow(Math.sin(this.direction), 2)));
	this.time -= this.landingTime;
	this.landingTime = (this.v * Math.sin(this.direction) + Math.sqrt(Math.pow((this.v * Math.sin(this.direction)), 2) + (2 * this.g * this.y0))) / this.g;
    }


    if (this.landingTime < dt * L.system.timeScale)
    {
	this.y = 500;
    } else {
	this.y = 500 - this.y0 - (this.v * Math.sin(this.direction) * this.time - (this.g * this.time * this.time / 2));
    }
    if (this.y >= 500) {
	this.y = 500;
    }

    this.nextY = this.y;
    this.nextSpeedX += this.accelX * dt * L.system.timeScale;
//  this.nextSpeedY += this.accelY * dt * L.system.timeScale;

    this.nextX += this.nextSpeedX * L.system.dt * L.system.timeScale;
//   this.nextY += this.nextSpeedY * L.system.dt * L.system.timeScale;


    if (this.nextX >= 800)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 799;
    }
    if (this.nextX <= 49)
    {
	this.nextSpeedX = -this.speedX;
	this.speedX = -this.speedX;
	this.nextX = 50;
    }
//    this.y = (this.nextY);
    this.x = (this.nextX);
//   this.speedY = (this.nextSpeedY);
    this.speedX = (this.nextSpeedX);
//  }

//  this.x += 1;
// this.y += 1;


};;


L.objects.Layer = function(name)
{
    this.name = name;
    this.sorted = false;
    this.sortBy = ["z"];
    this.sortOrder = [1];
    this.objects = [];
    this.targetContext = L.system.bufferContext[0];
    this.layerAlpha = 1;
    this.isClickable = true;
    this.scrollRateX = 1;
    this.scrollRateY = 1;
};

L.objects.Layer.prototype.draw = function()
{
    this.autoDraw();
};

L.objects.Layer.prototype.autoDraw = function()
{
    this.objects.draw(this.targetContext);

};

L.objects.Layer.prototype.update = function(dt)
{

    this.autoUpdate(dt);
};

L.objects.Layer.prototype.autoUpdate = function(dt)
{


    this.objects.update(dt);

    if (this.sorted)
    {
	length = this.sortBy.length;
	for (var i = 0; i < length; i++)
	{
	    this.objects.sortBy(this.sortBy[i], this.sortOrder[i]);
	}
    }

};


L.objects.Layer.prototype.handleClick = function(mouseX, mouseY, e)
{

    if (this.isClickable)
    {
	this.objects.handleClick(mouseX, mouseY, e);
    }
};

L.objects.Layer.prototype.addObject = function(object, scene)
{
    this.objects.push(object);
};
/**
 * @deprecated May be rewritten
 *
 */
L.objects.Layer.prototype.addObjects = function()
{
    var objectsLength = arguments.length;
    for (var i = 0; i < objectsLength; i++)
    {
	this.addObject(arguments[i]);
    }
};

;
/**
 *
 * @namespace {L}
 */



/**
 * L.objects.Scene
 * @class
 * @param {String} name - The name of the scene
 * @return {Scene}
 */
L.objects.Scene = function(name)
{

    this.name = name;

    L.scenes[name] = this;
    this.layers = {
	"background": new L.objects.Layer("background")
    };
    this.layerOrder = ["background"];
    this.bgFill = "blueviolet";
    this.motionBlur = 1;
    this.keymap = {};

    this.activeLayer = {};
    this.camera = {
	x: 0,
	y: 0,
	angle: 0,
	zoom: 1
    };
};

/**
 * @method
 * @memberOf L.objects.Scene
 * @param {float} dt
 * @returns {L.objects.Scene}
 */
L.objects.Scene.prototype.update = function(dt)
{
    this.autoUpdate(dt);
    return this;
};

L.objects.Scene.prototype.doKeyDown = function(event)
{
    if (this.keymap.doKeyDown !== undefined)
    {
	this.keymap.doKeyDown(event);
    }
};

L.objects.Scene.prototype.doKeyUp = function(event)
{
    if (this.keymap.doKeyUp !== undefined)
    {
	this.keymap.doKeyUp(event);
    }
};
/**
 * @method
 * @memberOf L.objects.Scene
 * @param {float} dt - Delta time
 * @returns {Scene} Scene
 */
L.objects.Scene.prototype.autoUpdate = function(dt)
{
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)

    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.update(dt);
    }
    return this;
};

L.objects.Scene.prototype.autoDraw = function()
{
    var system = L.system;
    var layer = system.bufferContext[0];
    var renderContext = system.renderContext[0];
    var width = system.width;
    var height = system.height;
    layer.fillStyle = this.bgFill;
    layer.fillRect(0, 0, width, height);
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)
    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.draw();
    }
    layer.globalAlpha = 1;
    renderContext.globalAlpha = this.motionBlur;
    renderContext.drawImage(system.bufferCanvas[0], 0, 0, width, height);
};

L.objects.Scene.prototype.draw = L.objects.Scene.prototype.autoDraw;

L.objects.Scene.prototype.addLayer = function(name)
{
    var newLayer = new L.objects.Layer(name);
    this.layers[name] = newLayer;
    this.layerOrder.push(name);
    return newLayer;

};

L.objects.Scene.prototype.addLayerObject = function(layer)
{

    this.layers[layer.name] = layer;
    this.layerOrder.push(layer.name);

};

/**
 L.objects.Scene.prototype.addObject = function(object)
 {
 this.layers["background"].addObject(object);
 };

 L.objects.Scene.prototype.addObjects = function(objects)
 {
 var arrayLength = arguments.length;
 for (var i = 0; i < arrayLength; i++)
 {
 this.layers["background"].addObject(arguments[i]);
 }
 };
 **/
/**
 *
 * @param {Object} object
 * @param {Layer} layer
 * @returns {Layer}
 */
L.objects.Scene.prototype.addObjectToLayer = function(object, layer)
{
    this.layers[layer].addObject(object);
    return this;
};

L.objects.Scene.prototype.handleClick = function(mouseX, mouseY, e)
{
    var layerOrder = this.layerOrder;
    var length = layerOrder.length;
    for (var i = 0; i < length; i++)
    {
	var currentLayer = this.layers[layerOrder[i]];
	this.activeLayer = currentLayer;
	currentLayer.handleClick(mouseX, mouseY, e);
    }
};


L.objects.Scene.prototype.transition = {};

L.objects.Scene.prototype.transition.fadeToColor = function(nextScene, fadeOut, pause, fadeIn, color, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, color, callback);
};

L.objects.Scene.prototype.transition.fadeToBlack = function(nextScene, fadeOut, pause, fadeIn, callback)
{

    L.transitions.fadeToColor.play(L.system.currentScene, nextScene, fadeOut, pause, fadeIn, "#000000", callback);
};

L.objects.Scene.prototype.transition.instant = function(nextScene, callback)
{

    L.transitions.instant.play(L.system.currentScene, nextScene, callback);
};

/**
 * @method
 * @returns {L.objects.Scene}
 */
L.objects.Scene.prototype.setScene = function()
{
    var system = L.system;
    system.previousScene = system.currentScene;
    system.currentScene = this;
    return this;
};;

L.objects.Textbox = function(text, x, y, width, height, wordwrap)
{


    this.width = (width === undefined) ? 200 : width;
    this.height = height;

    this.words = (text === undefined) ? [] : text.split(" ");
    this.textArray = [];
    Object.defineProperty(this, "text", {
	set: function(text)
	{
	    this.words = text.split(" ");
	    // this.autoSizeX();
	    this.wrapText();
	}.bind(this),
	get: function() {
	    return this.words.join(" ");
	}.bind(this)
    });



    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
    this.alpha = 1;
    this.font = "Times";
    this.fontSize = 30;
    this.lineSpacing = 1;

    this.handle = {};
    this.handle.x = 0;
    this.handle.y = 0;

    this.angle = 0;

    this.speedX = 0;
    this.speedY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.rotation = 0;

    this.textFill = "#000000";
    this.wrap = true;
    this.alignment = "left";
    this.alignmentY = "top";



    this.backgroundFill = "#FFFFFF";
    this.borderFill = "";
    this.borderWidth = 0;

    this.marginLeft = 5;
    this.marginTop = 5;
    this.marginRight = 5;
    this.marginBottom = 5;

this.visible = true;
    this.isClickable = true;
};

L.objects.Textbox.prototype.draw = function(layer)
{
    this.autoDraw(layer);

};

L.objects.Textbox.prototype.autoDraw = function(layer)
{
if (!this.visible){return;}
    layer.globalAlpha = this.alpha;
    var drawBox = (this.backgroundFill !== "" && this.borderWodth >0);
    layer.textAlign = "left";//this.alignment;
    layer.font = this.fontSize + "px " + this.font;
    if (!this.height)
    {
	this.height = this.fontSize;
    }
    var arrayLength = this.textArray.length;
    if (this.angle !== 0)
    {
	var radians = this.angle;
	layer.save();
	layer.translate(this.x, this.y);
	layer.rotate(-radians);

if (drawBox){

	layer.beginPath();

	layer.rect(-this.handle.x, -this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom + (this.fontSize * (arrayLength - 1) * this.lineSpacing));
	if (this.backgroundFill !== "")
	{
	    layer.fillStyle = this.backgroundFill;
	    layer.fill();
	}
	if (this.borderWidth > 0)
	{
	    layer.strokeStyle = this.borderFill;
	    layer.lineWidth = this.borderWidth;
	    layer.stroke();
	}}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";
	for (var i = 0; i < arrayLength; i++)
	{
	    layer.fillText(this.textArray[i], this.marginLeft - this.handle.x, this.marginTop + this.fontSize - this.handle.y + (this.fontSize * i * this.lineSpacing));
	}



	//layer.fillText(this.text, 0, 0);
	layer.restore();
    } else {
if (drawBox)
{
	layer.beginPath();
	layer.rect(this.x - this.handle.x, this.y - this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom + (this.fontSize * (arrayLength - 1) * this.lineSpacing));
	if (this.backgroundFill !== "")
	{
	    layer.fillStyle = this.backgroundFill;
	    layer.fill();
	}
	if (this.borderWidth > 0)
	{
	    layer.strokeStyle = this.borderFill;
	    layer.lineWidth = this.borderWidth;
	    layer.stroke();
	}
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";

	for (var i = 0; i < arrayLength; i++)
	    layer.fillText(this.textArray[i], this.x + this.marginLeft - this.handle.x, this.y + this.marginTop + this.fontSize - this.handle.y + (this.fontSize * i * this.lineSpacing));
    }
};


L.objects.Textbox.prototype.update = function(dt)
{
    this.autoUpdate(dt);
};

L.objects.Textbox.prototype.autoUpdate = function(dt)
{

};

L.objects.Textbox.prototype.autoSize = function()
{
    this.autoSizeX();
    this.autoSizeY();
    this.wrapText();
};

L.objects.Textbox.prototype.autoSizeX = function()
{
    this.width = this.getTextWidth();
    this.realign();
};

L.objects.Textbox.prototype.autoSizeY = function()
{
    this.height = this.fontSize;
};

L.objects.Textbox.prototype.wrapText = function()
{
    var arrayLength = this.words.length;
    this.textArray = [];
    var currentLineNumber = 0;
    var currentLineText = "";
    var textBoxWidth = this.width;
    for (var i = 0; i < arrayLength; i++)
    {
	var currentLineWidth = this.getTextWidth(currentLineText);
	if (currentLineWidth === 0)
	{
	    currentLineText = this.words[i];
	}
	else if (this.getTextWidth(currentLineText + " " + this.words[i]) <= textBoxWidth)
	{
	    currentLineText += " " + this.words[i];
	}
	else
	{
	    this.textArray[currentLineNumber] = currentLineText;
	    currentLineNumber++;
	    currentLineText = this.words[i];
	    //  alert(this.words[i]);
	}

    }
    this.textArray[currentLineNumber] = currentLineText;
};

L.objects.Textbox.prototype.getTextWidth = function(text)
{
    var buffer = L.system.bufferContext[0];
    buffer.font = this.fontSize + "px " + this.font;
    if (text === "")
    {
	return 0;
    }
    var metrics = buffer.measureText(text ? text : this.text);
    return metrics.width;
};

L.objects.Textbox.prototype.getTotalWidth = function()
{
    return (this.width + this.marginLeft + this.marginRight);
};

L.objects.Textbox.prototype.getTotalHeight = function()
{
    return (this.height + this.marginTop + this.marginBottom);
};

L.objects.Textbox.prototype.realign = function()
{
    this[this.alignment]();
    this[this.alignmentY]();
};

L.objects.Textbox.prototype.center = function()
{
    this.handle.x = (this.getTotalWidth() / 2);
    this.alignment = "center";
    return this;
};

L.objects.Textbox.prototype.centerY = function()
{
    this.handle.y = (this.getTotalHeight() / 2);
    this.alignmentY = "centerY";
    return this;
};

L.objects.Textbox.prototype.top = function()
{
    this.handle.y = 0;
    this.alignmentY = "top";
    return this;
};

L.objects.Textbox.prototype.bottom = function()
{
    this.handle.y = this.getTotalHeight();
    this.alignmentY = "bottom";
    return this;
};

L.objects.Textbox.prototype.left = function()
{
    this.handle.x = 0;
    this.alignment = "left";
    return this;
};

L.objects.Textbox.prototype.right = function()
{
    this.handle.x = this.getTotalWidth();
    this.alignment = "right";
    return this;
};

L.objects.Textbox.prototype.setMargins = function()
{
    switch (arguments.length)
    {
	case 1:
	    this.marginLeft = this.marginTop = this.marginRight = this.marginBottom = arguments[0];
	    break;
	case 2:
	    this.marginTop = this.marginBottom = arguments[0];
	    this.marginLeft = this.marginRight = arguments[1];
	    break;
	case 3:
	    this.marginTop = arguments[0];
	    this.marginRight = this.marginLeft = arguments[1];
	    this.marginBottom = arguments[2];
	    break;
	case 4:
	    this.marginTop = arguments[0];
	    this.marginRight = arguments[1];
	    this.marginBottom = arguments[2];
	    this.marginLeft = arguments[3];
	    break;
	default:
	    alert("Textbox.setMargins() called with wrong number of arguments.");
	    break;

    }
    this.realign();
    return this;
};

L.objects.Textbox.prototype.handleClick = function(mouseX, mouseY)
{
    if (this.isClickable)
    {
	if ((this.angle === 0 &&
	mouseX >= this.x - this.handle.x &&
	mouseX <= this.x + this.width + this.marginLeft + this.marginRight - this.handle.x &&
	mouseY >= this.y - this.handle.y &&
	mouseY <= this.y + this.height + this.marginTop + this.marginBottom - this.handle.y + (this.fontSize * (this.textArray.length - 1) * this.lineSpacing)
	) || (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices())))
	{
	    this.onClick();

	    return true;

	}
    }
};

L.objects.Textbox.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.x;// + this.offset.x;
    var yTransform = this.y;// + this.offset.y;
    var top = 0 - this.handle.y;
    var left = 0 - this.handle.x;
    var right = left + this.width + this.marginLeft + this.marginRight;
    var bottom = top + this.height + this.marginTop + this.marginBottom + (this.fontSize * (this.textArray.length - 1) * this.lineSpacing);
    var vertices = [[left, top], [right, top], [right, bottom], [left, bottom]];
    if (this.angle !== 0)
    {
	var length = vertices.length;

	for (var i = 0; i < length; i++)
	{
	    vertices[i] = [
		vertices[i][0] * Math.cos(-this.angle) - vertices[i][1] * Math.sin(-this.angle),
		vertices[i][0] * Math.sin(-this.angle) + vertices[i][1] * Math.cos(-this.angle)
	    ];
	}
    }


    vertices.mapQuick(function(entry) {
	entry[0] += xTransform;
	entry[1] += yTransform;
    });


    return vertices;

};;

L.transitions = {};

L.transitions.instant = {};

L.transitions.instant.play = function(lastScene, nextScene, callback)
{
    if (lastScene.exit) {
	lastScene.exit();
    }
    if (callback) {
	callback(nextScene);
    }

    L.system.currentScene = nextScene;
};




L.transitions.fadeToColor =
{
    lastScene: {},
    nextScreen: {},
    timer: 0,
    state: "start"
};
L.transitions.fadeToColor.play = function(lastScene, nextScene, fadeOut, pause, fadeIn, color, callback)
{
    this.lastScene = lastScene;
    this.nextScene = nextScene;
    this.camera = lastScene.camera;
    this.currentScene = lastScene;
    this.activeLayer = lastScene.activeLayer;
    this.fadeOut = fadeOut;
    this.pause = pause;
    this.fadeIn = fadeIn;
    this.timer = fadeOut;
    this.state = "start";
    this.color = color || "#000000";
    this.callback = callback || function() {
    };
    L.system.currentScene = this;


};

L.transitions.fadeToColor.update = function(dt)
{
    switch (this.state)
    {
	case "start":
	    this.timer = this.fadeOut;
	    this.lastScene.update(dt);
	    this.state = "fadeOut";
	    break;
	case "fadeOut":
	    this.timer -= dt;
	    this.lastScene.update(dt);
	    if (this.timer <= 0)
	    {
		this.timer = this.pause;
		this.callback(this.nextScene);
		this.state = "pause";
	    }
	    break;
	case "pause":
	    this.timer -= dt;
	    if (this.timer <= 0)
	    {
		this.camera = this.nextScene.camera;
		this.timer = this.fadeIn;
		this.state = "fadeIn";
	    }
	    break;
	case "fadeIn":
	    this.timer -= dt;
	    this.nextScene.update(dt);
	    if (this.timer <= 0)
	    {
		L.system.currentScene = this.nextScene;
	    }
	    break;
	default:
	    alert("Hey!");
	    break;
    }
};

L.transitions.fadeToColor.draw = function()
{
    switch (this.state)
    {
	case "start":
	case "fadeOut":
	    this.lastScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1 - this.timer / this.fadeOut;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "pause":
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = 1;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	case "fadeIn":
	    this.nextScene.draw();
	    L.system.renderContext[0].fillStyle = this.color;
	    L.system.renderContext[0].globalAlpha = this.timer / this.fadeIn;
	    L.system.renderContext[0].fillRect(0, 0, L.system.width, L.system.height);
	    break;
	default:
	    alert("hey!");
	    break;

    }
};;

L.input = {};

L.input.keyCodeFromString = function(string)
{
    var upString = string.toUpperCase().replace(" ", "");
    if (upString.match(/^[A-Z0-9]$/))
    {
	return upString.charCodeAt(0);
    }

    if (upString.indexOf("NUMPAD") === 0)
    {
	return 96 + parseInt(upString.charAt(upString.length - 1));
    }

    if (upString.indexOf("F") === 0)
    {
	return 111 + parseInt(upString.replace("F", ""));
    }

    switch (upString)
    {
	case "MULTIPLY":
	    return 106;
	    break;

	case "ADD":
	    return 107;
	    break;

	case "ENTER":
	    return 13;
	    break;

	case "SUBTRACT":
	    return 109;
	    break;

	case "DECIMAL":
	    return 110;
	    break;

	case "DIVIDE":
	    return 111;
	    break;

	case "BACKSPACE":
	case "BACK":
	    return 8;
	    break;

	case "TAB":
	    return 9;
	    break;

	case "SHIFT":
	    return 16;
	    break;

	case "CONTROL":
	case "CTRL":
	    return 17;
	    break;

	case "CAPS":
	case "CAPSLOCK":
	    return 20;
	    break;

	case "ESC":
	case "ESCAPE":
	    return 27;
	    break;

	case "SPACE":
	case "SPACEBAR":
	    return 32;
	    break;

	case "PGUP":
	case "PAGEUP":
	    return 33;
	    break;

	case "PGDN":
	case "PAGEDOWN":
	    return 34;
	    break;

	case "END":
	    return 35;
	    break;

	case "HOME":
	    return 36;
	    break;

	case "LEFT":
	case "LEFTARROW":
	    return 37;
	    break;

	case "UP":
	case "UPARROW":
	    return 38;
	    break;

	case "RIGHT":
	case "RIGHTARROW":
	    return 39;
	    break;

	case "DOWN":
	case "DOWNARROW":
	    return 40;
	    break;

	case "INSERT":
	    return 45;
	    break;

	case "DELETE":
	    return 46;
	    break;

	case "NUMLOCK":
	    return 144;
	    break;

	case "SCRLK":
	case "SCROLLLOCK":
	    return 145;
	    break;

	case "PAUSE":
	case "PAUSEBREAK":
	    return 19;
	    break;

	case ";":
	case ":":
	    return 186;
	    break;

	case "=":
	case "+":
	    return 187;
	    break;

	case "-":
	case "_":
	    return 198;
	    break;

	case "/":
	case "?":
	    return 191;
	    break;

	case "~":
	case "`":
	    return 192;
	    break;

	case "[":
	case "{":
	    return 219;
	    break;

	case "\\":
	case "|":
	case "BACKSLASH":
	    return 220;
	    break;

	case "]":
	case "}":
	    return 221;
	    break;

	case "'":
	case '"':
	case "QUOTE":
	case "QUOTES":
	    return 222;
	    break;

	case ",":
	case "<":
	    return 188;
	    break;

	case ".":
	case ">":
	    return 190;
	    break;

	default:
	    alert("'" + string + "' is not a valid key identifier.");
	    break;
    }
};

L.input.Keymap = function()
{
    this.bindings = {};
};

L.input.Keymap.prototype.doKeyDown = function(event)
{
    var keyCode = event.keyCode;
    var bindings = this.bindings;
    if (bindings[keyCode] && bindings[keyCode]["keydown"])
    {
	bindings[keyCode]["keydown"]();
    }
};

L.input.Keymap.prototype.doKeyUp = function(event)
{
    var keyCode = event.keyCode;
    var bindings = this.bindings;
    if (bindings[keyCode] && bindings[keyCode]["keyup"])
    {
	bindings[keyCode]["keyup"]();
    }
};

L.input.Keymap.prototype.bindKey = function(key, event, callback)
{
    this.bindKeyCode(L.input.keyCodeFromString(key), event, callback);
};

L.input.Keymap.prototype.bindKeyCode = function(keyCode, event, callback)
{
    if (!this.bindings[keyCode])
    {
	this.bindings[keyCode] = {};
    }
    this.bindings[keyCode][event] = callback;
};;
//IN PROGRESS



L.objects.Bone = function(textureName, options) {
    L.objects.Sprite.call(this, textureName, options);
    this.inheritPosition = true;
    this.inheritAngle = true;
    this.inheritScale = true;
    this.joint = {
	x: 0,
	y: 0
    };
    this.relAngle = 0;
    this.children = [];


};
L.objects.Bone.prototype = new L.objects.Sprite;
L.objects.Bone.constructor = L.objects.Bone;

L.objects.Bone.prototype.draw = function(layer)
{
    this.autoDraw(layer);
};

L.objects.Bone.prototype.updateBone = function(dt)
{
    var parent = this.parent;
    // this.sceneMap = parent.sceneMap;
    if (this.inheritScale)
    {
	var parentScale = parent.scale;
	this.scale = {
	    x: parentScale.x,
	    y: parentScale.y
	};
    }
    if (this.inheritPosition)
    {
	var parentX = parent.x;
	var parentY = parent.y;
	var scale = this.parent.scale;
	//var jointX = scale.x * (this.joint.x - parent.handle.x);
	//var jointY = scale.y * (this.joint.y - parent.handle.y);
	var jointX = (this.joint.x - parent.handle.x);
	var jointY = (this.joint.y - parent.handle.y);
	if (parent.angle === 0)
	{
	    this.x = parentX + scale.x * (this.joint.x - parent.handle.x);
	    this.y = parentY + scale.y * (this.joint.y - parent.handle.y);
	}
	else
	{
	    var newPosition = Math.rotatePoint(jointX, jointY, this.parent.angle);
	    this.x = newPosition.x * scale.x + parentX;
	    this.y = newPosition.y * scale.y + parentY;
	}
    }
    if (this.inheritAngle)
    {
	this.angle = this.relAngle + parent.angle;

    }
    var numberOfChildren = this.children.length;
    for (var i = 0; i < numberOfChildren; i++)
    {
	this.children[i].updateBone(dt);
	this.children[i].update(dt);
    }
};





L.objects.Skeleton = function(textureName, options)
{
    L.objects.Sprite.call(this, textureName, options);


    this.children = [];
    this.bones = {};
    this.drawOrder = [this];

};

L.objects.Skeleton.prototype = new L.objects.Sprite;
L.objects.Skeleton.constructor = L.objects.Skeleton;

L.objects.Skeleton.prototype.handleClick = function(mouseX, mouseY, e)
{
    var numberOfBones = this.drawOrder.length;


    for (var i = numberOfBones - 1; i >= 0; i--)
    {
	var currentBone = this.drawOrder[i];
	var clickResult;
	if (this !== currentBone)

	{
	    clickResult = currentBone.handleClick(mouseX, mouseY, e);

	}
	else
	{
	    clickResult = L.objects.Sprite.prototype.handleClick.call(this.drawOrder[i], mouseX, mouseY, e);
	}
	if (clickResult)
	{
	    return true;
	}
    }
};
L.objects.Skeleton.prototype.addBone = function(textureName, boneName)
{

    var newBone = new L.objects.Bone(textureName);
    newBone.name = boneName;
    newBone.master = this;
    newBone.parent = this;
    this.children.push(newBone);
    this.bones[boneName] = newBone;
    this.drawOrder.push(newBone);
    return newBone;

};

L.objects.Bone.prototype.addBone = function(textureName, boneName)
{

    var newBone = new L.objects.Bone(textureName);
    newBone.name = boneName;
    newBone.master = this.master;
    newBone.parent = this;
    this.children.push(newBone);
    this.master.bones[boneName] = newBone;
    this.master.drawOrder.push(newBone);
    return newBone;

};

L.objects.Skeleton.prototype.draw = function(layer)
{
    var numberOfLimbs = this.drawOrder.length;
    for (var i = 0; i < numberOfLimbs; i++)
    {
	var currentSprite = this.drawOrder[i];
	if (this === currentSprite)
	{
	    this.autoDraw(layer);
	    this.drawBoundingBox(layer);
	}
	else
	{
	    this.drawOrder[i].draw(layer);
	}
    }
};

L.objects.Skeleton.prototype.update = function(dt)
{
    this.updateBones(dt);
};

L.objects.Skeleton.prototype.updateBones = function(dt)
{
    var numberOfChildren = this.children.length;

    for (var i = 0; i < numberOfChildren; i++)
    {
	var currentBone = this.children[i];
	currentBone.updateBone(dt);
	currentBone.update(dt);

    }
};
;

L.objects.Timeline = function()
{
    this.paused = true;
    this.timer = 0;
    this.eventList = [];
    this.nextEvent = 0;
    this.preserveEvents = true;
    this.autoSort = true;
};

L.objects.Timeline.prototype.update = function(dt)
{
    if (!this.paused)
    {
	var eventListLength = this.eventList.length;
	this.timer += dt;
	while ((this.nextEvent < eventListLength) && (this.timer >= this.eventList[this.nextEvent][0]))
	{
	    this.eventList[this.currentEvent][1]();
	    this.nextEvent++;
	}
    }
};

L.objects.Timeline.prototype.addEvent = function(time, callback)
{
    var eventListLength = this.eventList.length;
    for (var i = 0; i < eventListLength; i++)
    {
	if (time > this.eventList[i][0])
	{
	    this.eventList.splice(i+1,0,[time, callback]);
	}
    }
    this.eventlist.push([time, callback]);

};

L.objects.Timeline.prototype.play = function()
{
  this.paused = false;
};

L.objects.Timeline.prototype.pause = function()
{
  this.paused = true;
};

L.objects.Timeline.prototype.togglePause = function()
{
  this.paused = !this.paused;
};
;globalScope[nameSpace] = L;})(window,'L');