precision mediump float;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform sampler2D sampler;

void main()
{
  // gl_FragColor = texture2D(sampler, fragTexCoord);
  gl_FragColor = vec4(fragNormal, 1.0);
}
