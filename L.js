/*
 * L ('ɛrɥ) Game Engine Core
 */

var L = {};

L.start = function() {

    window.removeEventListener('load', L.start);
    var game = new L_Game();

    game.settings();
    L.system.setup();
    game.resources();
    game.initialise();

    (function gameLoop() {
	L.system.now = window.performance.now();
	L.system.dt = (L.system.now - L.system.then) / 1000;
	if (L.system.dt > 1 / L.system.frameCap)
	{
	    L.system.dt = 1 / L.system.frameCap;
	}
	L.system.then = L.system.now;

	game.update(L.system.dt);

	requestAnimationFrame(gameLoop);
	game.draw();
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
L.system.mouseX = 0;
L.system.mouseY = 0;
L.system.now, L.system.then = window.performance.now();
L.system.dt = 0;
L.system.checkAudio = function() // Checks for client-supported audio type
{
    var dummyAudio = document.createElement('audio');
    if (dummyAudio.canPlayType('audio/wav'))
    {
	L.system.audioType = ".wav";
	L.log("Using .wav files");
    }
    else if (dummyAudio.canPlayType('audio/mp4'))
    {
	L.system.audioType = ".m4a";
	L.log("Using .m4a files");
    }
    else
    {
	L.alert("Your browser doesn't support .wav or .m4a files.");
    }

};


L.system.checkAudio();


L.system.resourcePath = "resources/";		    // Holds path to resource folder
L.system.soundPath = "sounds/";			    // Holds path to sound files
L.system.texturePath = "textures/";		    // Holds path to image files
L.system.expectedResources = 0;
L.system.loadedResources = 0;


L.system.width = 640;
L.system.height = 480;
L.system.canvasLocation = document.body;






L.system.layerAlpha = 1;
L.system.currentScene = {};
L.scenes = {};
/**********************************************************************
 *  Resources
 *
 */

L.texture = {};
L.load = {};
L.load.texture = function(name, file)
{
    L.system.expectedResources += 1;
    var thisTexture = new Image();

    thisTexture.onload = function() {
	L.system.loadedResources += 1;
    };
    thisTexture.onerror = function(e) {
	L.alert("Something went wrong loading " + name);
    };

    thisTexture.src = L.system.resourcePath + L.system.texturePath + file;

    L.texture[name] = thisTexture;
    //alert("hi");
};



L.sound = {};
L.music = {};







/*TODO
 * Texture2D
 * Sprites
 * Audio
 * Bone Movement
 * Control Mapper
 * Clickables
 * Stage
 * Layers
 * Textbox
 * Rotation
 *
 *
 *
 *
 */


//window.onload = L.start;
window.addEventListener('load', L.start);




//window.onunload = function() {
//  L = null;
//};

/*
 var arraytest = [1,2,3,4,5,6,7,8,9,0,[1,2,3,4,5,6,7,8,9,0]];
 var targetarray = [];
 var starttime = window.performance.now();
 for (var i = 0; i < 1000; i++)
 {
 targetarray = arraytest.copy();
 }
 var time1 = window.performance.now() - starttime;

 var starttime = window.performance.now();
 for (var i = 0; i < 1000; i++)
 {
 targetarray = arraytest.copy2();
 }
 var time2 = window.performance.now() - starttime;

 alert(time1+","+time2);
 */

L.system.renderCanvas = [];
L.system.renderContext = [];
L.system.bufferCanvas = [];
L.system.bufferContext = [];
L.system.fxCanvas = [];
L.system.fxContext = [];
L.system.pixelCanvas = [];
L.system.pixelContext = [];