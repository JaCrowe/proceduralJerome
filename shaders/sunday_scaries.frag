#version 440
in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;
#define PERIOD 1.4
#define PI 3.14159265359
#define smoothstep_width 0.01


float smoothstep_c(float threshold, float x){
    return smoothstep(
        threshold - smoothstep_width,
        threshold + smoothstep_width,
        x
    );
}

float maskSloppyStripes(vec2 uv, float time){
    return smoothstep_c(
        0.4, 
        pow(
            sin(uv.y*4.
                + time
                + 0.15*sin(
                    (uv.x + sin(time))*(1.0/(max(abs(uv.y/PERIOD), 0.15))
                    )
                )
            ),
            2.
        )
    );
}

float maskSpiral(vec2 uv, float time) {
    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    return smoothstep_c(
        0.3 + (0.5 + 0.2*sin(time))*sin(time*4.0),
        sin(r*PERIOD*20.0 + theta + time)
    );
}

void main(){

    // --- Various time and space transforms

    float normal_time = i_time*2.*PI;
    vec2 uv = PERIOD*(gl_FragCoord.xy/i_resolution - 0.5);
    // uv.y = uv.y + normal_time;

    float diffraction = maskSpiral(uv, normal_time);


    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    vec3 color_nice = vec3(
        0.5 + 0.5*sin(r/500.0),
        0.5 + 0.5*cos(theta + normal_time),
        0.5 + 0.5*sin(uv.y + 1.2 + normal_time)
    );


    float sloppyMask = maskSloppyStripes(uv, normal_time);

    vec3 color_boring = vec3(
       0.2+diffraction*0.8
    );


    vec3 color_sloppy = vec3(
        maskSpiral(uv, normal_time), 
        maskSpiral(uv, normal_time + 0.1), 
        maskSpiral(uv, normal_time - 0.1)
    );

    vec3 color = mix(
        color_nice, 
        color_boring, 
        1.0 - sloppyMask
    );


    // o_color = vec4(mask, mask, mask, 1.);
    o_color = vec4(
        color,
        1.
    );
}