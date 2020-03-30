#define t iTime
#define sat(a) clamp(a, 0., 1.)

uniform vec2 iResolution;
uniform float iTime;

float scene(vec3 p) {
    // the sphere
	float s = length(p-vec3(0,.3,0)) - 1.;

    // the ocean is just a plane with different levels of noise going opposite directions and with different scale
    // of course this breaks continuity so we compensate by undershooting our marching
  	float pl = p.y +
  	0.10 * texture(iChannel0, sin( t*.008)+p.xz*.50).r +
  	0.25 * texture(iChannel0, sin(-t*.004)+p.xz*.15).r +
  	1.00 * texture(iChannel0, sin( t*.020)+p.xz*.05).r;
  	return min(s,pl);
}

// returns distance, iteration count and if it hit (1) or not (0)
vec3 march(in vec3 ro, in vec3 rd) {
  	float d = 0.;
  	vec3 p = ro;
  	float li=0.;
  	for(float i=0.; i<200.; i++) {
    	float h = scene(p)*.6; // undershoot the march by almost half
    	if(abs(h)<.001) return vec3(d,i,1);
    	if(d>100.) return vec3(d,i,0);
    	d+=h;
    	p+=rd*h;
        li = i;
  	}
  	return vec3(d, li, 0);
}

vec3 wrecked_normals(vec3 p) {
    // normals epsilons are way overshot, this is what gives the ocean smoothness
  	vec2 e=vec2(.3,0);
  	return normalize(scene(p)-vec3(scene(p-e.xyy),scene(p-e.yxy),scene(p-e.yyx)));
}

vec3 getcam(vec2 uv, vec3 o, vec3 tg, float z) {
  	vec3 f = normalize(tg-o);
  	vec3 s = normalize(cross(vec3(0,1,0), f));
  	vec3 u = normalize(cross(f,s));
  	return normalize(f*z+uv.x*s+uv.y*u);
}

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
void main()
{
    vec2 uv = ((fragCoord/iResolution.xy)-0.5) / vec2(iResolution.y / iResolution.x, 1);
    
    vec3 eye = vec3(0,1,-2);
    // animate camera
  	eye.xz += 5.*vec2(sin(t*.025), cos(t*.025));
  	vec3 target = vec3(0);
  	vec3 dir = getcam(uv,eye,target,.75);
  
  	vec3 lp = 3.*vec3(1,2,2);
  
  	vec3 col = vec3(0);
  	vec3 m = march(eye, dir);
  	if(m.z == 1.) {
    	vec3 p = eye+dir*m.x;
    	vec3 n = wrecked_normals(p);
    	vec3 ld = normalize(lp-p);
    	float diff = sat(max(0., dot(n,ld)));
    	float spec = sat(pow(max(0., dot(dir,reflect(ld,n))), 100.));
    	float fres = sat(pow(max(0., 1.-dot(-dir,n)), 2.));
    	col = sat(vec3(diff+spec)*fres*cos(dir)*vec3(.8, .7, 1.1));
  	} else {
    	col = cos(dir)*vec3(.8, .7, 1.1)*smoothstep(0.,.1,dir.y);
  	}
    // all the look comes from that shaped iteration glow
  	col += pow(m.y/50., 2.);
    
    // fragColor = vec4(col,1.0);
    gl_FragColor = vec4(col,1.0);
}