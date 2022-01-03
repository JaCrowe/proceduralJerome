#version 400
#define Z_MAX 0.7
#define Z_MIN -0.7
#define N_MARCHING_STEPS 64
#define STEP_LENGTH (Z_MAX - Z_MIN)/N_MARCHING_STEPS

in vec4 v_color;
out vec4 o_color;
uniform float i_time;
uniform vec2 i_resolution;

// --- Morgan noise functions and lisence, guess I'm BSD compliant here lol
// By Morgan McGuire @morgan3d, http://graphicscodex.com
// Reuse permitted under the BSD license.

// All noise functions are designed for values on integer scale.
// They are tuned to avoid visible periodicity for both positive and
// negative coordinates within a few orders of magnitude.

// For a single octave
//#define NOISE noise

// For multiple octaves
#define NOISE fbm
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
// --- /\


// --- Ray casting functions

float sphereDensity(vec3 position) {
    vec3 scaledPosition = vec3(vec2(position), position.z*0.05);
    return 
        smoothstep(0.4, 0.3, length(scaledPosition))*fbm(scaledPosition*15.0);
}

float raySample(vec3 ray) {
    return sphereDensity(ray);
}

// --- The main show!

void main() {
    vec2 coord =   gl_FragCoord.xy/i_resolution.xy - 0.5;

    float intensity = 0.0;

    for (int i = 0 ; i < N_MARCHING_STEPS ; i++) {
        intensity += raySample(
            vec3(
                coord.x,
                coord.y, 
                Z_MIN + float(i)*STEP_LENGTH
            )
        )/float(N_MARCHING_STEPS);
    }

    o_color = vec4(vec3(intensity), 1.0);
}
