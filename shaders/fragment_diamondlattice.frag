#version 440
in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;
#define PERIOD 15.
#define PI 3.14159265359
#define S(a,b,t) smoothstep(a,b,t)

// Returns the distance a point is to a line
// p - point to be evaluated
// a - first point of the line
// b - second point of the line
float DistLine(vec2 p, vec2 a, vec2 b){
	vec2 pa = p-a;
    vec2 ba = b-a;
    float t = clamp(
        dot(pa, ba)/dot(ba, ba),
        0., 
        1.
    );
    return length(pa-ba*t);
}

// Returns a float, 1 if we're in the line, 0 if 
// we're out and somewhere between for the edge
// p - point to be evaluated
// a - first point of the line
// b - second point of the line
float Line(vec2 p, vec2 a, vec2 b){
	float d = DistLine(p,a,b);
    float m = S(.04,.02,d);
    
    return m;
}

// Returns a float, 1 if we're in the dot, 0 if 
// we're out and somewhere between for the edge
// p - point to be evaluated
// a - point of the dot
float Dot(vec2 p, vec2 a){
    return 0.;// 1.0 - clamp(length(a - p), 0., 1.);
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

    // --- Various time and space transforms

    float normal_time = i_time*2.*PI;

    float sin120 = 0.86602540378;

    vec2 aspect = vec2(
        i_resolution.x*3., 
        i_resolution.y*2.*sin120
    );

    // Switch out comment to enable/disable "camera drift" 
    vec2 offset = vec2(cos(normal_time));
    // vec2 offset = vec2(0.);

    vec2 fragCoord = (0.5 - gl_FragCoord.xy + offset*aspect/100.0)/aspect;

    // Switch out comment to enable/disable "camera zoomies" 
    float effectivePeriod = PERIOD + 2.*sin(normal_time);
    // float effectivePeriod = PERIOD;
    
    vec2 uv= fract(
        effectivePeriod*fragCoord
         + offset
    );
    
    uv.y-=0.5;
    uv.x*=3.;
    uv.x+=0.5;
    uv.y*=sin120*2.;

    // --- Setting the points of the hexagon (why 8 wtf)

    vec2 r1 = vec2(1.0, 0.);
    vec2 r2 = vec2(0.5, sin120);
    vec2 r3 = vec2(0.5, -sin120);

    vec2 p0 = vec2(0., -sin120);
    vec2 p1 = vec2(0., sin120);
    vec2 p2 = vec2(1., -sin120);
    vec2 p3 = vec2(1., sin120);
    vec2 p4 = vec2(1.5, 0.);
    vec2 p5 = vec2(2.5, 0.);
    vec2 p6 = vec2(3., -sin120);
    vec2 p7 = vec2(3., sin120);

    // colouring points
    vec3 dotColour = vec3(0., 0., 1.0);
    vec3 dotColours = Dot(uv, p0) * dotColour;

    // --- Drawing the lines of the hexagon

    float lastTwoLines =  Line(uv, p5, p5 + r2) + Line(uv, p5, p5 + r3);
    float firstTwoLines = Line(uv, vec2(0, -sin120), vec2(1.0, -sin120)) + Line(uv, vec2(0, sin120), vec2(1.0, sin120)) ; 
    float secondTwoLines = Line(uv, vec2(0, -sin120), vec2(1.0, -sin120)) + Line(uv, vec2(0, sin120), vec2(1.0, sin120)) ; 
    float thirdTwoLines = Line(uv, vec2(1.0, -sin120), vec2(1.5, 0)) + Line(uv, vec2(1.0, sin120), vec2(1.5, 0));
    float anotherOne = Line(uv, vec2(1.5, 0.), vec2(2.5, 0.));
    float finalLine =Line(uv, p6 , p6 + r1) + Line(uv, p7 , p7 + r1);

    float intensity = 0 
        + lastTwoLines
        + firstTwoLines 
        + thirdTwoLines
        + anotherOne
        + finalLine;

    // --- The part where the cell colour is determined

    // --- Determining cell index
    bool inZone1 = (dot(uv - p2, rotMat2D(PI/2.)*r2) > 0 && uv.y < 0.);
    bool inZone2 = (dot(uv - p3, rotMat2D(-PI/2.)*r3) > 0 && uv.y > 0.);
    bool inZone3 = (dot(uv - p5, rotMat2D(PI/2.)*r2) > 0 && dot(uv - p5, rotMat2D(-PI/2.)*r3) > 0);

    if (inZone3) {
        inZone1 = false;
        inZone2 = false;
    }

    vec2 index = (
        floor(effectivePeriod*fragCoord + offset) 
        + vec2(inZone3 ? 1.0 : 0., inZone1 ? -0.5 : inZone2 ? 0.5 : 0.)
    )/PERIOD;

    vec2 indexDelta = floor(uv);

    // --- Colouring cell based off index

    float intensity_0 = 0.5 + 0.5*sin(length((index + 1.1*offset)/2.0)*20.0);
    float intensity_1 = 0.5 + 0.5*cos(length(index + 1.1*offset)*20.0);
    float intensity_2 = 0.5 + 0.5*cos(length(index + 1.1*offset)*20.0 + PI);

    vec4 cellColor = vec4( intensity_0, intensity_1,intensity_2, 1.0);

    vec4 color = mix(cellColor, vec4(0.), intensity);
    // Debug colour showing lines
    vec4 debugLinesColour = vec4(vec3(intensity), 0.);
    vec4 debugDotColour = vec4(dotColours, 1.);


    // I gotta keep it 55th street - I have no clue what I was doing here in 2019
    // float intensity1 = Line(
    //     uv, 
    //     vec2(0, -sin120), 
    //     vec2(0, sin120) 
    // ) + Line(
    //     uv, 
    //     vec2(0, sin120), 
    //     vec2(3., sin120)) 
    //         + Line(uv, vec2(0, -sin120), 
    //     vec2(3., -sin120)) 
    //         + Line(uv, vec2(3., sin120), 
    //     vec2(3., -sin120)
    // );
    
    // float finalIntensity = intensity;
    // vec4 color1 = mix(vec4(0), vec4(0., 1., 0., 1.), intensity1);

    o_color = color;
}
