uniform float iTime;
uniform vec2 iResolution;


void main(){
    vec2 uv;
    float epsilon = 0.008;
    float edge = 0.001;
    float time = iTime/2.;



    vec4 finalColour = vec4(0.);

    for (int i = 0 ; i < 10 ; i++) {
    uv = gl_FragCoord;
    uv.x/=iResolution.x;
    uv.y/=iResolution.y;
    uv.x+= ( 0.05 + 0.0255*i) *sin(time + 100.*i) - 0.5;
    uv.y+= ( 0.05 + 0.0255*i)*sin((time +100.*i) + 10.) - 0.5;

        finalColour +=  mix(vec4(0.7), vec4(0.), smoothstep(edge - epsilon, edge + epsilon, length(uv)));
    }
    // lookup the pixel in the texture
    // vec4 pixel = texture2D(texture, gl_TexCoord[0].xy);
    // vec4 pixel = texture2D(texture, gl_FragCoord.xy/800.0);
    // vec4 pixel = vec4(gl_FragCoord.x/800.0, gl_FragCoord.y/800.0, 0., 1.);
    // multiply it by the color
    gl_FragColor = finalColour;
    }
