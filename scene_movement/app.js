'use strict';

var Demo;

function InitWebGL(){
  // Get canvas and set context:
  var canvas = document.getElementById('webgl-canvas');
  var gl = canvas.getContext('webgl');

  // Load experimental-webgl if not gl:
  if (!gl) {
    console.log("WebGL not supported. Loading back Experimental-WebGL.");
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert("Your browser does not support WebGL.");
  }

  // Canvas size:
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Viewport resize:
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // Create light scene:
  Demo = new LightMapDemoScene(gl);
  Demo.Load(function (demoLoadError) {
		if (demoLoadError) {
		  alert('Could not load the light scene, see console for more details');
			console.error(demoLoadError);
		} else {
			Demo.Begin();
		}
	});
};
