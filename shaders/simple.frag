#version 130
in vec4 v_color;
out vec4 o_color;
void main() {
    o_color = v_color;
    // o_color = vec4(1.0, 1.0, 1.0, 1.0);
};
