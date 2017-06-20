var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'varying vec2 fragTexCoord;',
'',
'void main()',
'{',
' fragTexCoord = vertTexCoord;',
' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'',
'void main()',
'{',
' gl_FragColor = texture2D(sampler, fragTexCoord);',
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
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Viewport resize:
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // Clear color window:
  var background_color = [22/255, 44/255, 66/255];
  gl.clearColor(background_color[0], background_color[1], background_color[2], 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // We clear color and depth buffer

  gl.enable(gl.DEPTH_TEST); // Rasterizer
  gl.enable(gl.CULL_FACE);  // Enable culling
  gl.frontFace(gl.CCW);     // Define front face
  gl.cullFace(gl.BACK);     // Culling back face

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

  // Create cube:
  var cubeVertices =
  [ // X, Y, Z            U, V
      // Top
      -1.0, 1.0, -1.0,    0, 0,
      -1.0, 1.0, 1.0,     0, 1,
      1.0, 1.0, 1.0,      1, 1,
      1.0, 1.0, -1.0,     1, 0,

      // Left
      -1.0, 1.0, 1.0,     1, 1,
      -1.0, -1.0, 1.0,    0, 1,
      -1.0, -1.0, -1.0,   0, 0,
      -1.0, 1.0, -1.0,    1, 0,

      // Right
      1.0, 1.0, 1.0,      1, 1,
      1.0, -1.0, 1.0,     0, 1,
      1.0, -1.0, -1.0,    0, 0,
      1.0, 1.0, -1.0,     1, 0,

      // Front
      1.0, 1.0, 1.0,      1, 1,
      1.0, -1.0, 1.0,     1, 0,
      -1.0, -1.0, 1.0,    0, 0,
      -1.0, 1.0, 1.0,     0, 1,

      // Back
      1.0, 1.0, -1.0,     1, 1,
      1.0, -1.0, -1.0,    1, 0,
      -1.0, -1.0, -1.0,   0, 0,
      -1.0, 1.0, -1.0,    0, 1,

      // Bottom
      -1.0, -1.0, -1.0,   0, 0,
      -1.0, -1.0, 1.0,    0, 1,
      1.0, -1.0, 1.0,     1, 1,
      1.0, -1.0, -1.0,    1, 0
  ];

  // Cube indices for shared triangle faces:
  var cubeIndices =
  [
      // Top
  		0, 1, 2,
  		0, 2, 3,

  		// Left
  		5, 4, 6,
  		6, 4, 7,

  		// Right
  		8, 9, 10,
  		8, 10, 11,

  		// Front
  		13, 12, 14,
  		15, 14, 12,

  		// Back
  		16, 17, 18,
  		16, 18, 19,

  		// Bottom
  		21, 20, 22,
  		22, 20, 23
  ];

  // Create vertex buffer:
  var cubeVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

  // Create index buffer:
  var cubeIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

  // Locate position and color of vertices:
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute (vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, //
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    texCoordAttribLocation, // Attribute location
    2, // Number of elements per attribute (vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, //
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(texCoordAttribLocation);

  // Create texture:
  cubeTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // if (document.getElementById('option1').checked){
  //   gl.texImage2D(
  //     gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
  //     gl.UNSIGNED_BYTE,
  //     document.getElementById('texture1')
  //   );
  // } else{
  //   if (document.getElementById('option2').checked){
  //     gl.texImage2D(
  //       gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
  //       gl.UNSIGNED_BYTE,
  //       document.getElementById('texture2')
  //     );
  //   } else{
  //     gl.texImage2D(
  //       gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
  //       gl.UNSIGNED_BYTE,
  //       document.getElementById('texture3')
  //     );
  //   }
  // }
  var x = Array.prototype.filter.call(document.getElementsByName('options'), function(x) { return x.checked })[0];
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE,
    document.getElementById(x)
  );
  gl.bindTexture(gl.TEXTURE_2D, null);

  // Begin using program:
  gl.useProgram(program);

  // Locate matrices (World, View, Projection):
  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var matViewUniformLocation  = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation  = gl.getUniformLocation(program, 'mProj');

  // Setup World, View, Projection matrices:
  var worldMatrix = new Float32Array(16);
  var viewMatrix  = new Float32Array(16);
  var projMatrix  = new Float32Array(16);
  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [1, 1, 0]); // lookAt(out, eye, center, up) → {mat4}
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0); // perspective(out, fovy, aspect, near, far) → {mat4}

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  // MAIN RENDER LOOP:
  // Create variables:
  var identityMatrix  = new Float32Array(16);
  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);
  var zRotationMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  var angle = 0;

  var loop = function (){
    // Setup rotation:
    angle = performance.now() / 1000 / 6 * 2 * Math.PI; // Get time to define angle
    mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
    mat4.rotate(yRotationMatrix, identityMatrix, angle / 2, [0, 1, 0]);
    mat4.rotate(zRotationMatrix, identityMatrix, angle / 4, [0, 0, 1]);
    mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix, zRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    // Clear screen:
    gl.clearColor(background_color[0], background_color[1], background_color[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // We clear color and depth buffer

    // Bind texture:
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.activeTexture(gl.TEXTURE0);

    // Draw objects:
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };

  // Loop:
  requestAnimationFrame(loop);
};
