precision mediump float;

struct DirectionalLight{
  vec3 direction;
  vec3 color;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform sampler2D sampler;
uniform DirectionalLight sun;
uniform vec3 ambientLightIntensity;

void main()
{
  // Light intensities and directions:
  vec3 surfaceNormal = normalize(fragNormal);
  vec3 normSunDir    = normalize(sun.direction);

  // Texture color associated:
  vec4 texel = texture2D(sampler, fragTexCoord);

  // Phong's Light Model:
  vec3 lightIntensity = ambientLightIntensity +
        sun.color * max(dot(fragNormal, normSunDir), 0.0);

  // gl_FragColor = texture2D(sampler, fragTexCoord);
  gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}
