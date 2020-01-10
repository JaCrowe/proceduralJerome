uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D meowTex;
#define PERIOD 1.

float ellipseLength(vec2 uv, float e) {
    return sqrt(uv.x*uv.x*e + uv.y*uv.y);
}


mat2 rotMat2D(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}

void main(){
    float time = 16.0 +  pow(0.2 + iTime, 4.0);// log(1.0 + iTime*10.0)*10.0;

// gl_FragCoord/iResolution

    float realPeriod = PERIOD +time;
    vec2 uv= fract(realPeriod*(gl_FragCoord/iResolution-0.5));
    uv-=0.5; 

    vec4 meowPixel = texture2D(meowTex, (realPeriod/2.0 + floor(realPeriod*(gl_FragCoord/iResolution - 0.5)))/realPeriod);


    float epsilon = 0.006*realPeriod/5.0;
    float edge = 0.45;//  + 0.05*sin(time);

    float myRotation =  length(realPeriod*(gl_FragCoord/iResolution - 0.5)); // 0.0;
    float myRotationFloored =  length(floor(realPeriod*(gl_FragCoord/iResolution - 0.5)) ); // 0.0;


    // float intensity = mix(1.0, 0.0, smoothstep(edge - epsilon, edge + epsilon, length(uv)));


    uv*=rotMat2D(myRotationFloored + time/40.0);
    // float intensity = mix(1.0, 0.0, smoothstep(edge - epsilon, edge + epsilon, ellipseLength(uv, 0.5)));
    float intensity = mix(1.0, 0.0, smoothstep(edge - epsilon, edge + epsilon, length(uv)));
    
    // float lineGirth = 60.;
    // float sinintensity = mix(1.0, 0.0, smoothstep(- epsilon*lineGirth,epsilon*lineGirth, sign(sin(length(uv)*60.0 + time))));
    // sinintensity*= mix(1.0, 0.0, smoothstep(0.5 - epsilon, 0.5 + epsilon, length(uv)));
    // float sinintensity = mix(1.0, 0.0, smoothstep(edge + fract(time) - epsilon, edge + fract(time) + epsilon, uv.x ));
    float sinintensity = 0.0;
    vec3 tileColor = meowPixel.xyz;// vec3(gl_FragCoord/iResolution, 1.0);


    gl_FragColor = vec4(max(intensity, sinintensity)*tileColor, 1.);
    }
