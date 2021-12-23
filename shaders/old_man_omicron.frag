#version 400
in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;

void main() {
    
    o_color = vec4(
        gl_FragCoord.y/i_resolution.y,
        gl_FragCoord.x/i_resolution.x,
        1.0,
        1.0
    );
    // vec4(v_color.xyz*(0.5 + 0.5*cos(i_time)), 1.0);
}
