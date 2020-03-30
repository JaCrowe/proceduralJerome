uniform sampler2D texture;
uniform vec2 iResolution;
void main(){
    vec2 uv = gl_FragCoord;
    uv.x/=iResolution.x;
    uv.y/=iResolution.y;
    // lookup the pixel in the texture
    // vec4 pixel = texture2D(texture, gl_TexCoord[0].xy);
    vec4 pixel = texture2D(texture, gl_FragCoord.xy/800.0);
    // vec4 pixel = vec4(gl_FragCoord.x/800.0, gl_FragCoord.y/800.0, 0., 1.);
    // multiply it by the color
    gl_FragColor = pixel;
    }
