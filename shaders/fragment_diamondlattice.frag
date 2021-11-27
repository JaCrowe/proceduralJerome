#version 400
in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;
#define PERIOD 20.
#define PI 3.14159265359
#define S(a,b,t) smoothstep(a,b,t)


float DistLine(vec2 p, vec2 a, vec2 b){
	vec2 pa = p-a;
    vec2 ba = b-a;
    float t = clamp(dot(pa, ba)/dot(ba, ba),0., 1.);
    return length(pa-ba*t);
}


float Line(vec2 p, vec2 a, vec2 b){
	float d = DistLine(p,a,b);
    float m = S(.04,.02,d);
    
    return m;
}
 

float ellipseLength(vec2 uv, float e) {
    return sqrt(uv.x*uv.x*e + uv.y*uv.y);
}


mat2 rotMat2D(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}

void main(){
    float sin120 = 0.86602540378;
    vec2 aspect = vec2(i_resolution.x*3., i_resolution.y*2.*sin120);
    vec2 offset = vec2(cos(i_time));

    vec2 fragCoord = (0.5 - gl_FragCoord.xy + offset*aspect/100.0)/aspect;
    float effectivePeriod = PERIOD + sin(i_time);
    vec2 uv= fract(effectivePeriod*fragCoord + offset);
    uv.y-=0.5;
    uv.x*=3.;
    uv.x+=0.5;
    uv.y*=sin120*2.;


    // uv.y*=1.5;


    vec2 r1 = vec2(1.0, 0.);
    vec2 r2 = vec2(0.5, sin120);
    vec2 r3 = vec2(0.5, -sin120);
    
    // index/=iResolution;
    vec2 p0 = vec2(0., -sin120);
    vec2 p1 = vec2(0., sin120);
    vec2 p2 = vec2(1., -sin120);
    vec2 p3 = vec2(1., sin120);
    vec2 p4 = vec2(1.5, 0.);
    vec2 p5 = vec2(2.5, 0.);
    vec2 p6 = vec2(3., -sin120);
    vec2 p7 = vec2(3., sin120);

    bool inZone1 = (dot(uv - p2, rotMat2D(PI/2.)*r2) > 0 && uv.y < 0.);
    bool inZone2 = (dot(uv - p3, rotMat2D(-PI/2.)*r3) > 0 && uv.y > 0.);
    bool inZone3 = (dot(uv - p5, rotMat2D(PI/2.)*r2) > 0 && dot(uv - p5, rotMat2D(-PI/2.)*r3) > 0);
    if (inZone3) {
        inZone1 = false;
        inZone2 = false;
    }

    float lastTwoLines =  Line(uv, p5, p5 + r2) + Line(uv, p5, p5 + r3);
    float firstTwoLines = Line(uv, vec2(0, -sin120), vec2(1.0, -sin120)) + Line(uv, vec2(0, sin120), vec2(1.0, sin120)) ; 
    float secondTwoLines = Line(uv, vec2(0, -sin120), vec2(1.0, -sin120)) + Line(uv, vec2(0, sin120), vec2(1.0, sin120)) ; 
    float thirdTwoLines = Line(uv, vec2(1.0, -sin120), vec2(1.5, 0)) + Line(uv, vec2(1.0, sin120), vec2(1.5, 0));
    float anotherOne = Line(uv, vec2(1.5, 0.), vec2(2.5, 0.));
    float finalLine =Line(uv, p6 , p6 + r1) + Line(uv, p7 , p7 + r1);
    float intensity = lastTwoLines + firstTwoLines +thirdTwoLines + anotherOne + finalLine;
    
    float intensity1 = Line(uv, vec2(0, -sin120), vec2(0, sin120) ) + Line(uv, vec2(0, sin120), vec2(3., sin120) ) + Line(uv, vec2(0, -sin120), vec2(3., -sin120) ) + Line(uv, vec2(3., sin120), vec2(3., -sin120) );
    float finalIntensity = intensity;

    vec2 index = (floor(effectivePeriod*fragCoord + offset) + vec2(inZone3 ? 1.0 : 0., inZone1 ? -0.5 : inZone2 ? 0.5 : 0.))/PERIOD;
    vec2 indexDelta = floor(uv);

    float intensity_0 = 0.5 + 0.5*sin(length((index + 1.1*offset)/2.0)*20.0);
    float intensity_1 = 0.5 + 0.5*cos(length(index + 1.1*offset)*20.0);
    float intensity_2 = 0.5 + 0.5*cos(length(index + 1.1*offset)*20.0 + PI);

    vec4 cellColor = vec4( intensity_0, intensity_1,intensity_2, 1.0);

    vec4 color = mix(cellColor, vec4(0.), intensity);
    vec4 color1 = mix(vec4(0), vec4(0., 1., 0., 1.), intensity1);

    // gl_FragColor = color;
    o_color = color;
}
