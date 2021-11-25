uniform vec2 iResolution;
uniform sampler2D normalTexture;
uniform sampler2D imageTexture;
uniform float iTime;

void main() {
    vec2 uv = gl_FragCoord.xy/iResolution;
    vec4 normalPixel = texture2D(normalTexture, uv);
    uv+=((0.6 - 0.4*cos(iTime))*10.*vec2(normalPixel.x, normalPixel.y)/iResolution);
    vec4 color = texture2D(imageTexture, uv);

    gl_FragColor = vec4(color);
};
