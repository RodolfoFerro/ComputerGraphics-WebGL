var gl;
var model;

// OnLoad function:
var InitWebGL = function (){
  // Load vertex shader:
  loadTextResource('./meshes_obj/shader_vs.glsl', function (vsErr, vsText){
    if (vsErr){
      alert('Fatal error getting vertex shader (check details in console).');
      console.error(vsErr);
    } else{
      // Load fragment shader:
      loadTextResource('./meshes_obj/shader_fs.glsl', function (fsErr, fsText){
        if (fsErr){
          alert('Fatal error getting fragment shader (check details in console).');
          console.error(fsErr);
        } else{
          // Load Susan JSON file with object models:
          loadJSONResource('./meshes_obj/dark_fighter_6.json', function (modelErr, modelObj){
            if (modelErr){
              alert('Fatal error getting object model (check details in console).');
              console.error(modelErr);
            } else{
              // Load Susan object texture :
              loadImage('./meshes_obj/dark_fighter_6_color.png', function (imgErr, img){
                if (imgErr){
                  alert('Fatal error loading object texture (check details in console).');
                  console.error(imgErr);
                } else{
                  // Run WebGL after loading shaders and model:
                  RunWebGL(vsText, fsText, img, modelObj);
                }
              });
            }
          });
        }
      });
    }
  });
};

// Run function:
var RunWebGL = function (vertexShaderText, fragmentShaderText, SusanImage, SusanModel){

  // Loading message:
  console.log("Successfuly loaded.");
  model = SusanModel;

  // Get canvas and set context:
  var canvas = document.getElementById('webgl-canvas');
  gl = canvas.getContext('webgl');

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

  // Create Susan model:
  var susanVertices = SusanModel.meshes[0].vertices;

  // Susan model indices for shared triangle faces:
  var susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);

  // Susan model texture coordinates:
  var susanTexCoords = SusanModel.meshes[0].texturecoords[0];

  // Create vertex buffer:
  var susanPosVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

  // Create texture buffer:
  var susanTexCoordVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);

  // Create index buffer:
  var susanIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
  // Locate position and color of vertices:
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute (vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, //
    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.enableVertexAttribArray(positionAttribLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
  var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
  gl.vertexAttribPointer(
    texCoordAttribLocation, // Attribute location
    2, // Number of elements per attribute (vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, //
    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.enableVertexAttribArray(texCoordAttribLocation);

  // Create texture:
  susanTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, susanTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE,
    SusanImage
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
  mat4.lookAt(viewMatrix, [0, 0, -100], [0, 0, 0], [1, 1, 0]); // lookAt(out, eye, center, up) → {mat4}
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
    gl.bindTexture(gl.TEXTURE_2D, susanTexture);
    gl.activeTexture(gl.TEXTURE0);

    // Draw objects:
    gl.drawElements(gl.TRIANGLES, susanIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };

  // Loop:
  requestAnimationFrame(loop);
};