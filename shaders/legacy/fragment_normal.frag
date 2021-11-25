uniform sampler2D texture;
uniform vec2 iResolution;
void main(){
    vec2 uv = gl_FragCoord/iResolution;
    // lookup the pixel in the texture
    // vec4 pixel = texture2D(texture, gl_TexCoord[0].xy);


    vec2 x0 = vec2(uv.x - 1.0/iResolution.x, uv.y);
    vec2 x1 = vec2(uv.x + 1.0/iResolution.x, uv.y);
    vec2 y0 = vec2(uv.x, uv.y - 1.0/iResolution.y);
    vec2 y1 = vec2(uv.x, uv.y + 1.0/iResolution.y);

    float dhx = length(texture2D(texture, x1)) - length(texture2D(texture, x0));
    float dhy = length(texture2D(texture, y1)) - length(texture2D(texture, y0));

    vec3 color = normalize(vec3(dhx, dhy, 0.01));

    // vec4 pixel = texture2D(texture, uv);
    // vec4 pixel = vec4(gl_FragCoord.x/800.0, gl_FragCoord.y/800.0, 0., 1.);
    // multiply it by the color
    gl_FragColor = vec4(color, 1.0);
    }
