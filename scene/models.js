'use strict';

// Define Model variable:
var Model = function (gl, vertices, indices, normals, color) {
  // Create buffers;
	this.vbo = gl.createBuffer();
	this.ibo = gl.createBuffer();
	this.nbo = gl.createBuffer();
	this.nPoints = indices.length;

  // Create world matrix and set color:
	this.world = mat4.create();
	this.color = color;

  // Bind buffers:
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

// Create shader program:
var CreateShaderProgram = function (gl, vsText, fsText) {
  // Create vertex shader from file:
	var vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vsText);
	gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
		return {
			error: 'Error compiling vertex shader: ' + gl.getShaderInfoLog(vs)
		};
	}

  // Create fragment shader from file:
	var fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fsText);
	gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
		return {
			error: 'Error compiling fragment shader: ' + gl.getShaderInfoLog(fs)
		};
	}

  // Create program:
	var program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return {
			error: 'Error linking program: ' + gl.getProgramInfoLog(program)
		};
	}
  // Validate program:
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		return {
			error: 'Error validating program: ' + gl.getProgramInfoLog(program)
		};
	}
	return program;
};

// Create camera view:
var Camera = function (position, lookAt, up) {
  // Create possible possitions (others will be inverses):
	this.forward = vec3.create();
	this.up = vec3.create();
	this.right = vec3.create();

	this.position = position;

  // Set possible moves:
	vec3.subtract(this.forward, lookAt, this.position);
	vec3.cross(this.right, this.forward, up);
	vec3.cross(this.up, this.right, this.forward);

  // Normalize values:
	vec3.normalize(this.forward, this.forward);
	vec3.normalize(this.right, this.right);
	vec3.normalize(this.up, this.up);
};

// Create LookAt matrix:
Camera.prototype.GetViewMatrix = function (out) {
	var lookAt = vec3.create();
	vec3.add(lookAt, this.position, this.forward);
	mat4.lookAt(out, this.position, lookAt, this.up);
	return out;
};

// Create RightRotation matrix:
Camera.prototype.rotateRight = function (rad) {
	var rightMatrix = mat4.create();
	mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 0, 1));
	vec3.transformMat4(this.forward, this.forward, rightMatrix);
	this._realign();
};

// Create Realign matrix:
Camera.prototype._realign = function() {
	vec3.cross(this.right, this.forward, this.up);
	vec3.cross(this.up, this.right, this.forward);

	vec3.normalize(this.forward, this.forward);
	vec3.normalize(this.right, this.right);
	vec3.normalize(this.up, this.up);
};

// Moving functions (FORWARD):
Camera.prototype.moveForward = function (dist) {
	vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
};

// Moving functions (RIGHT):
Camera.prototype.moveRight = function (dist) {
	vec3.scaleAndAdd(this.position, this.position, this.right, dist);
};

// Moving functions (UP):
Camera.prototype.moveUp = function (dist) {
	vec3.scaleAndAdd(this.position, this.position, this.up, dist);
};
