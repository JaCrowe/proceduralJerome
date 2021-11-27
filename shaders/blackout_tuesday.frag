#version 440
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;

mat2 freakySmear(vec2 uv, float i_time_prime) {
    float uvL = length(uv);
    return mat2(
        sin(uv.y + uvL + i_time_prime),
        -sin(uv.x + i_time_prime),
        sin(uv.x + uvL + i_time_prime/10.0),
        -sin(uv.y + i_time_prime/10.0)
    );
}

vec3 dotColor(vec2 uv, int index){
    uv.x += (0.2*(index % 10)) ;
    uv.y += (0.2*(floor(index / 10.))) ;

    vec2 pixelTemp;
    float i_time_prime;
    vec3 color;

    float edge = min(0.002, i_time*0.01);
    // float girth = 0.015;
    // float girth = 0.005 + pow(max(i_time - 5., 0.)*0.1, 3);
    float girth = min(i_time*0.1, 0.05) + pow(max(i_time - 3., 0.)*0.1, 3);

    for (int i = 0 ; i < 3 ; i++) {
        i_time_prime = i_time + 0.05*i;
        pixelTemp = freakySmear(uv, i_time_prime)* uv;

        color[i] = 1.0 - smoothstep(girth, girth + edge, length(pixelTemp));
    }
    return color;
}

void main() {

    vec2 uv = gl_FragCoord.xy/i_resolution.xy - 0.5;
    vec3 color = vec3(0.);

    for (int i = 0 ; i < 1 ; i++) {
        color += dotColor(uv, i);
    }

    color *= min(1., 15. - i_time);

    o_color = vec4(color.x, color.y, color.z, 1.);
}