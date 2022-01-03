#version 400
#define Z_MAX 0.7
#define Z_MIN -0.7
#define N_MARCHING_STEPS 28
#define STEP_LENGTH (Z_MAX - Z_MIN)/N_MARCHING_STEPS

in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;

float sphereDensity(vec3 position) {
    return length(position) > 0.4 ? 0.0 : 0.1;  
}

float raySample(vec3 ray) {
    return sphereDensity(ray);
}


void main() {
    vec2 coord =   gl_FragCoord.xy/i_resolution.xy - 0.5;

    float intensity = 0.0;

    for (int i = 0 ; i < N_MARCHING_STEPS ; i++) {
        intensity += raySample(
            vec3(
                coord, 
                Z_MIN + float(i)*STEP_LENGTH
            )
        );
    }

    o_color = vec4(vec2(intensity), 1.0, 1.0);
}
