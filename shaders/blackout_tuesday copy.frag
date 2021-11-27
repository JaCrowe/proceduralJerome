#version 440
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;

#define PERIOD 15.
#define PHASE 10.

mat2 freakySmear(vec2 uv, float i_time_prime) {
    float uvL = length(uv);
    return mat2(
        cos(uv.y + i_time_prime),
        -sin(uv.x + i_time_prime),
        cos(uv.y + i_time_prime),
        -sin(uv.x + i_time_prime)
    );
}

vec3 dotColor(vec2 uv, int index, float offset, float factor, float time){
    uv.x += (0.2*(index % 10)) ;
    uv.y += (0.2*(floor(index / 10.))) ;

    // float time_eff = mod(time, PERIOD);
    float time_eff = time;
    
    vec2 pixelTemp;
    float i_time_prime;
    float temp_intensity;
    vec3 color;

    float edge = min(0.002, time_eff*0.01);
    // float girth = 0.015;
    // float girth = 0.005 + pow(max(i_time - 5., 0.)*0.1, 3);
    float girth = min(time_eff*0.1, 0.05) + pow(max(time_eff - 3., 0.)*0.1, 3);

    // float offset = 1.0*isFlip;
    // float factor = (1.0 - 2.0*isFlip);

    for (int i = 0 ; i < 3 ; i++) {
        i_time_prime = time_eff + 0.05*i;
        // pixelTemp = freakySmear(uv, i_time_prime)* uv;
        pixelTemp = uv;

        temp_intensity = smoothstep(girth, girth + edge, length(pixelTemp));
        color[i] = offset + factor*temp_intensity; 
    }
    return color;
}

void main() {



    vec2 uv = gl_FragCoord.xy/i_resolution.xy - 0.5;
    vec3 color = vec3(0.);
    vec3 color2 = vec3(0.);

    for (int i = 0 ; i < 1 ; i++) {
        color = dotColor(uv, i, 1., -1., i_time) - dotColor(uv, i, 1., -1., i_time - 10.);
        // color2 += dotColor(uv, i, 0., 1., i_time - 10.);
    }

    // color *= min(1., 15. - i_time);
    vec3 finalColor = color;
    // vec3 finalColor = min(
    //     // To fade in
    //     vec3(i_time*2.), 
    //     // To hack mixing in the nested bloops
    //     min(
    //         color, 
    //         mix(
    //             vec3(1.0), 
    //             color2, 
    //             step(10., i_time)
    //         )
    //     )
    // );
    o_color = vec4(finalColor.x, finalColor.y, finalColor.z, 1.);

    // o_color = vec4(color.x, color.y, color.z, 1.);
}