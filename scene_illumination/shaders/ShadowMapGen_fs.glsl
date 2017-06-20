precision mediump float;

uniform vec3 pointLightPosition;
uniform vec2 shadowClipNearFar;

varying vec3 fPos;

void main()
{
	vec3 color, reflectedColor, colorMax;
	vec3 fromLightToFrag = (fPos - pointLightPosition);

	float lightFragDist =
		(length(fromLightToFrag) - shadowClipNearFar.x)
		/
		(shadowClipNearFar.y - shadowClipNearFar.x);

	color = fromLightToFrag;
	reflectedColor = vec3(0.0, 0.45, 0.4);
	colorMax = (reflectedColor*lightFragDist + vec3(0.7)) / 1.7;

	gl_FragColor = vec4(colorMax, 1.0);
}
