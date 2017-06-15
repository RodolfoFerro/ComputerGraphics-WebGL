var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'',
'void main()',
'{',
' gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitWebGL = function (){

  // Loading message:
  console.log("Successfuly loaded.");

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
  // canvas.width  = window.innerWidth;
  // canvas.height = window.innerHeight;

  // Viewport resize:
  // gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // Clear color window:
  var background_color = [22/255, 44/255, 66/255];
  gl.clearColor(background_color[0], background_color[1], background_color[2], 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // We clear color and depth buffer

  // Create shaders:
  var vertexShader   = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Set sources of shaders:
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  // Compile shaders:
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  // Attach shaders, link and validate program:
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }

  // Create buffer:
  var triangleVertices =
  [ // X, Y       // R, G, B
    0.0, 0.5,     1.0, 0.0, 0.0,
    -0.5, -0.5,   0.0, 1.0, 0.0,
    0.5, -0.5,    1.0, 0.0, 1.0
  ];

  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  // Locate position and color of vertices:
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation    = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    2, // Number of elements per attribute (vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, //
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute (vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, //
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  // MAIN RENDER LOOP:
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
