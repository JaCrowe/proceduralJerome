uniform float iTime;
uniform vec2 iResolution;
#define PERIOD 20.
#define PI 3.14159265359

float ellipseLength(vec2 uv, float e) {
    return sqrt(uv.x*uv.x*e + uv.y*uv.y);
}


mat2 rotMat2D(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}

void main(){

    vec2 uv= fract(PERIOD*(gl_FragCoord/iResolution));
    vec2 index = floor(PERIOD*(gl_FragCoord/iResolution-0.5));

    vec2 r1 = vec2(0, 1.0);
    vec2 r2 = rotMat2D(iTime/5.0 + (1.0 + cos(iTime/10.0))*length(index))*vec2(0.70710678118, 0.70710678118);
    
    // index/=iResolution;
    float intensity = dot(r2,normalize(uv));

    index*=rotMat2D(iTime/5.0 + (1.0 + cos(iTime/10.0)));

    vec4 color = mix(vec4(0), vec4(index.x, index.y, 1., 1.), intensity);
    // vec4 color = vec4(uv.x, uv.y, 1.0, 1.0);

    gl_FragColor = color;
    }
