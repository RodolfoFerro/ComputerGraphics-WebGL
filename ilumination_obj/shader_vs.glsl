precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

void main()
{
  fragTexCoord = vertTexCoord;
  fragNormal   = (mWorld * vec4(vertNormal, 0.0)).xyz * vec3(1.0, 1.0, -1.0);

  gl_Position  = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
