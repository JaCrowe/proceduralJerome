#version 440
in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;
#define PI 3.14159265359
#define PERIOD 12.

// https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
vec2 sdLine( in vec2 p, in vec2 a, in vec2 b)
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp(dot(pa,ba)/(dot(ba,ba)),0.0, 1.0);
    return pa-ba*h;
}
float sdLineLength( in vec2 p, in vec2 a, in vec2 b)
{
    return length(sdLine(p,a,b));
}

void main(){
    float pi_time = i_time*2.*PI;

    // float x0 = 0.35;// 0.25  + 0.25*sin(4.*pi_time);
    // float x1 = 0.65;//  - 0.25*sin(4.*pi_time);

    float x0 =  0.25  + 0.2499*sin(4.*pi_time);
    float x1 = 0.75 - 0.2499*sin(4.*pi_time);

    vec2 r0_1 = vec2(0.0, 0.5);

    vec2 r0 = vec2(x0, 0.5);
    vec2 r1 = vec2(x1, 0.0);
    vec2 r1_1 = vec2(1.0, 0.0);
    vec2 r2 = vec2(x1, 1.0);
    vec2 r2_1 = vec2(1.0, 1.0);

    vec2 uv = PERIOD*(gl_FragCoord.xy/i_resolution.xy) + vec2(0.01*sin(6.*pi_time), i_time)*PERIOD;

    // Index and fract feed into each other - index is used to know if this is odd or even
    // and whether the cell should be offset or not
    // vec2 offsetUV = uv + vec2(i_time)*PERIOD;
    vec2 indexUVProto = floor(uv);
    vec2 columnOffset = + vec2(0., mod(indexUVProto,2.0)/2.0);
    vec2 indexUV = floor(uv + columnOffset);
    vec2 fractUV = fract(uv + columnOffset); 


    // Correct indexUV
    // first calclute shortest vector to line
    // "bottom" line
    vec2 sd_1 = sdLine(fractUV , r0, r1);
    // "top" line
    vec2 sd_2 = sdLine(fractUV , r0, r2);
    vec2 sd_3 = sdLine(fractUV , r0_1, r0);

    // black out the area we want to target
    float sd_1_debug_intensity = 1.0 - max(
        // First line, give angled section
        0.5 + 0.5*sign(sd_1.x),
        // Sign of sd_2, gives halfway point
        0.5 + 0.5*sign(sd_2.y)
    );
    vec3 sd_1_debug_color = vec3(
        sd_1_debug_intensity
    );

    // black out the area we want to target
    float sd_2_debug_intensity = 1.0 - max(
        // First line, give angled section
        0.5 + 0.5*sign(sd_2.x),
        // Sign of sd_2, gives halfway point
        0.5 + 0.5*sign(-sd_1.y)
    );
    vec3 sd_2_debug_color = vec3(
        sd_2_debug_intensity
    );

    indexUV.x -= max(sd_1_debug_intensity, sd_2_debug_intensity);
    indexUV.y += sd_2_debug_intensity * (0.5 - 0.5*sign(columnOffset.y - 0.25));
    indexUV.y -= sd_1_debug_intensity * (0.5 + 0.5*sign(columnOffset.y - 0.25));

    // We draw the cell walls with the shortest distance function of the point
    // to the line which is finally put into the smoothstep function

    // Regular 2 lines
    float intensity = min(sdLineLength(fractUV, r0, r1) ,sdLineLength(fractUV, r0, r2));
    // First line
    intensity = min(intensity, sdLineLength(fractUV, r0_1, r0));
    // Botom
    intensity = min(intensity, sdLineLength(fractUV, r1_1, r1));
    // Top
    intensity = min(intensity, sdLineLength(fractUV, r2_1, r2));


    float english_edge = 0.0 + 0.01*(0.5 - 0.5*cos(pi_time));
    // float english_edge = 0.0;
    float english_margin = (0.003 + 0.0005*sin(2.*pi_time))*PERIOD; 

    // Line it up
    intensity = 1.0 - smoothstep(
        english_edge + english_margin,
        english_edge + 0.0,
        intensity
    );// + cos(6.*pi_time)*intensity;

    vec3 cell_color = vec3(
        0.5 + 0.5*sin(indexUV.x + pi_time*5. + sin(indexUV.y)),
        0.5 + 0.5*sin(indexUV.y - pi_time*2.0),
        1.0
    );

    vec3 cell_color_1 = vec3(
        mod(indexUV.x, 2.),
        // 0.5,
        mod(indexUV.y, 2.),

        // 0.5 + 0.5*sin(indexUV.y - pi_time*2.0),
        0.75 + 0.25*mod(indexUV.y + indexUV.x, 2.)
    );

    vec3 color_mix = mix(
        vec3(0.), 
        cell_color_1, 
        intensity
    );

    o_color = vec4(color_mix, 1.0);
}