#version 400
#define Z_MAX 0.7
#define Z_MIN -0.7
#define N_MARCHING_STEPS 64
#define N_LIGHT_MARCHING_STEPS 16
#define STEP_LENGTH (Z_MAX - Z_MIN)/N_MARCHING_STEPS

in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;

// --- \/ Morgan noise functions and lisence

// By Morgan McGuire @morgan3d, http://graphicscodex.com
// Reuse permitted under the BSD license.

// All noise functions are designed for values on integer scale.
// They are tuned to avoid visible periodicity for both positive and
// negative coordinates within a few orders of magnitude.

#define NUM_NOISE_OCTAVES 5

// Precision-adjusted variations of https://www.shadertoy.com/view/4djSRW
float hash(float p) { p = fract(p * 0.011); p *= p + 7.5; p *= p + p; return fract(p); }
float hash(vec2 p) {vec3 p3 = fract(vec3(p.xyx) * 0.13); p3 += dot(p3, p3.yzx + 3.333); return fract((p3.x + p3.y) * p3.z); }

float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);

    vec3 i = floor(x);
    vec3 f = fract(x);
 
    // For performance, compute the base input to a 1D hash from the integer part of the argument and the 
    // incremental change to the 1D based on the 3D -> 1D wrapping
    float n = dot(i, step);

    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

float fbm(vec3 x) {
	float v = 0.0;
	float a = 0.5;
	vec3 shift = vec3(100);
	for (int i = 0; i < NUM_NOISE_OCTAVES; ++i) {
		v += a * noise(x);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}
// --- /\ Morgan McGuire zone

// --- Helpers

mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

// --- Ray casting functions

float sphereDensity(vec3 position) {
    return 1.0 - length(position)*2.;
    // return smoothstep(
    //         0.5, 
    //         0.49, 
    //         length(position)
    //     );
}

float fbmDensity(vec3 position) {
    // vec3 scaledPosition = vec3(position.x + i_time, position.y, position.z*0.05);
    vec3 scaledPosition = vec3(
        position.x + i_time, 
        position.y, 
        position.z*0.5 + i_time);
    // return fbm(10.0*rotationMatrix(vec3(1.0, 0., 1.), i_time)*scaledPosition);
    return fbm(10.0*scaledPosition);
}

float raySample(vec3 ray) {
    return fbmDensity(ray)*sphereDensity(ray);
}

// --- The main show!

void main() {
    vec2 coord =   gl_FragCoord.xy/i_resolution.xy - 0.5;

    float density = 0.0;
    float absorption = 200.0;
    float intensity = 1.0;


    vec3 sunDirection = vec3(1.0, 0., 1.0);
    vec3 color = vec3(0.);


    for (int i = 0 ; i < N_MARCHING_STEPS ; i++) {
        
        // Take care of the density part
        density += 3.*raySample(
            vec3(
                coord.x,
                coord.y, 
                Z_MIN + STEP_LENGTH*float(i) 
        ))/float(N_MARCHING_STEPS);

        if (density > 0.) {
            intensity *= 1.-density*absorption;
            if (intensity < 0.01) {
                break;
            }

            color+=vec3(intensity);
        }

        // float intensityLighting = 0.0;
        // // Take care of the lighting part
        // for (int j = 0 ; j < N_LIGHT_MARCHING_STEPS ; j++) {
        //     densityLighting
        // }
    }

    o_color = vec4(color, 1.0);
}
