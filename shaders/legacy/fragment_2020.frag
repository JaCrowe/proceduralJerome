// Stolen from https://www.shadertoy.com/view/wtcGDl
#version 120
#define SURF_DIST 0.001
#define MAX_STEPS 64

uniform vec2 iResolution;
uniform float iTime;

float PI = 3.1415926535897932384626433832795;

// Many functions are directly taken from IQ's site : http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
// So many thanks for this, IQ

float opSmoothUnion( float d1, float d2, float k ) 
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

float opSmoothSubtraction( float d1, float d2, float k ) 
{
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); 
}

mat2x2 rot(float angle)
{
    return mat2x2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float sdTorus( vec3 p, vec2 t)
{
  vec2 q = vec2(length(p.xy)-t.x,p.z);
  return length(q)-t.y;
}

float sdVerticalCapsule( vec3 p, float h, float r, float angle )
{
  p.xy = p.xy*rot(angle);
  
  p.y -= clamp( p.y, 0.0, h );
  return length( p ) - r;
}

float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb, float angle)
{
  p.xy = p.xy*rot(angle);
  p.x = abs(p.x);
  float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
  return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
  return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

float sdLine(vec2 pos, float r)
{
    return length(pos)-r;
}

float sdZero(vec3 p)
{
  return sdLink(p+ vec3(0,0.125,0), 1.125, 1.0, 0.5);  
}

float sdTwo(vec3 p)
{
  float dist;
  float an = 1.57*1.25;
  vec2 c = vec2(sin(an),cos(an));
  dist = sdCappedTorus(p + vec3(0,-1.45,0), c, 1.0, 0.5, 0.39);  
  dist = opSmoothUnion(dist, sdVerticalCapsule(p + vec3(1,1.75,0), 2.5, 0.5, 1.57),0.05);
  dist = opSmoothUnion(dist, sdVerticalCapsule(p + vec3(1,1,0), 2.25, 0.5, 1.57*0.5),0.05);
  dist = opSmoothUnion(dist, sdVerticalCapsule(p + vec3(1,1.75,0.0), 0.5, 0.5, 0.0),0.05);
  return dist;  
}

float sd2020(vec3 p)
{
  float dist;
  
  dist = sdZero(p-vec3(5.0, 0.5, 0.));
  dist = min(dist, sdZero(p-vec3(-1.55, 0.5, 0.)));
  dist = min(dist, sdTwo(p-vec3(1.55, 0., 0.)));
  dist = min(dist, sdTwo(p-vec3(-5.0, 0., 0.)));
  
  return dist;
}

// Thanks to Antoine Zanuttini for this : https://www.youtube.com/channel/UCdiiD1ukw39XTRj9h6LKCeQ/videos
float sdKIFF(vec3 pos)
{
  vec3 oPos = pos;
  
  float dist = 100000.;

  pos.xz = pos.xz * rot(iTime*0.2);
  pos.xy = pos.xy * rot(iTime*0.3);

  mat3x3 rMat = mat3x3(1,0,0, 0,1,0, 0,0,1);
  
 
  float scale = 2.0;
  float rScale = 5.0;
  for(int i=0;i<8;i++)
  {
    pos = abs(pos);
    pos -= vec3(1.5,1.5,1.5)*scale;
    pos.xz = pos.xz * rot(1.0+iTime*0.1*rScale);
    pos.zy = pos.zy * rot(2.0+iTime*0.15*rScale);
    scale *= 0.5;
    rScale -= 2.5;
  }
  
  dist = min(dist, sdSphere(pos, 2.5 * scale));
  return dist; 
}

// From http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm
float elastic(float t)
{
  float ts= t*t;
  float tc = ts*t;
	return (56.*tc*ts + -175.*ts*ts + 200.*tc + -100.*ts + 20.*t);
}

float getDist2020(vec3 pos)
{ 
  float dist = 0.0; 
  
  float angle = atan(pos.x, pos.y);
  vec3 oPos = pos;
  
  pos.xy = rot(sin(iTime*.021)*0.1) * pos.xy;
  pos.xz = rot(sin(iTime*0.121)*0.25) * pos.xz;
  
  float delta = elastic(min(fract(iTime*0.1)*2., 1.))*10.;
  
  float tDist = sd2020(pos-vec3(0.0, 0.0, 11.-delta));
  dist = tDist;
  dist = opSmoothSubtraction(tDist-.5, sdKIFF(pos-vec3(0.0, 0.0, 8.)), .25);
  dist = min(dist, tDist);


  return dist;
}

vec3 calcNormal2020(vec3 pos)
{
  vec2 delta = vec2(-1, 1) * 0.01f;

  return normalize(
    delta.xyy * getDist2020(pos + delta.xyy) +
    delta.yyx * getDist2020(pos + delta.yyx) +
    delta.yxy * getDist2020(pos + delta.yxy) +
    delta.xxx * getDist2020(pos + delta.xxx)); 
}

vec4 getColor2020(vec3 ro, vec3 rd, out vec3 emissive)
{
  float d0 = 2.0f;
  vec3 p = vec3(0.0);
  float dS = 0.0f;
  float acc = 0.0f;
  float glow = 0.0f;
  
  for(int i=0;i<MAX_STEPS;i++)
  {
    p = ro + rd * d0;
    dS = abs(getDist2020(p));
    d0 += dS*0.75;
    if (dS<1000.)
      glow += 0.001/(0.01+dS*0.1);
    
    if (dS<SURF_DIST) break;   
  }

  vec4 rm = vec4(p, dS); 
  
  vec4 color;
  

  if (dS < SURF_DIST)
  {
    // Object hit
    color = vec4(1.0);
    
    vec3 nrm = calcNormal2020(rm.xyz);
    vec3 light = vec3(0, 3, -5.);
    vec3 dirLight = light - rm.xyz;
    
    float intensity = clamp(dot(nrm, normalize(dirLight)), 0., 1.);
    intensity *= 8./dot(dirLight, dirLight);
    intensity += 0.005;
  
    glow *= 0.1;
    
    color.rgb *= intensity;  
  }
  else 
  {
    color = vec4(0);
  }
  
  emissive = glow*vec3(1.0, 0.35, 0.1);
    
  return color;
  
}

vec3 radial(vec3 p, float rep, float off)
{
  vec2 rp = vec2(atan(p.y,p.x)/(2.0*PI), length(p.xy));
  rp.x=(fract(rp.x*rep-0.5+off)-0.5)/rep;
  rp.x *= 2.0*PI;
  return vec3(cos(rp.x)*rp.y,sin(rp.x)*rp.y,p.z);
}

float getDistTunnel(vec3 pos)
{ 
  float dist = 0.0; 
  pos.xy *= rot(pos.z*0.3 + iTime + sin(pos.z*1.3 +iTime*0.3));
  pos = radial(pos, 3., 0.);
  dist = sdLine(pos.xy + vec2(-2.+sin(pos.z*10. - iTime*5.)*0.25,0.), 0.1);
  
  return dist;
}

vec3 calcNormalTunnel(vec3 pos)
{
  vec2 delta = vec2(-1, 1) * 0.01f;

  return normalize(
    delta.xyy * getDistTunnel(pos + delta.xyy) +
    delta.yyx * getDistTunnel(pos + delta.yyx) +
    delta.yxy * getDistTunnel(pos + delta.yxy) +
    delta.xxx * getDistTunnel(pos + delta.xxx)); 
}

vec4 getColorTunnel(vec3 ro, vec3 rd, out vec3 Emissive)
{
  float d0 = 2.0f;
  vec3 p = vec3(0.0);
  float dS = 0.0f;
  float acc = 0.0f;
  float glow = 0.0f;
  Emissive =vec3(0.);
  
  for(int i=0;i<MAX_STEPS;i++)
  {
    p = ro + rd * d0;
    dS = abs(getDistTunnel(p));
    d0 += dS*0.1;
    if (dS<1000.)
      glow += 0.005/(0.1+dS);
    
    if (dS<SURF_DIST) break;   
  }

  vec4 rm = vec4(p, dS); 
  
  vec4 color;
  

  if (dS < SURF_DIST)
  {
    color = vec4(1.0);
   
    vec3 nrm = calcNormalTunnel(rm.xyz);
    vec3 light = vec3(-3, 2, -4);
    vec3 dirLight = light - rm.xyz;
    
    float intensity = clamp(dot(nrm, normalize(dirLight)), 0., 1.);
    intensity *= 30./dot(dirLight, dirLight);
    intensity += 0.005;
  
    color.rgb *= intensity;
    color.a = 1.0;
    Emissive += vec3(0.1, 0.35, 1.0);
  }
  else 
  {
    color = vec4(0);
  }

  glow*=glow;
  Emissive += glow*vec3(0.1, 0.35, 1.0);

  return color;  
}

// From http://filmicworlds.com/blog/filmic-tonemapping-operators/
vec3 tonemapFilmic(const vec3 color) 
{
	vec3 x = max(vec3(0.0), color - 0.004);
	return (x * (6.2 * x + 0.5)) / (x * (6.2 * x + 1.7) + 0.06);
}

// void main( out vec4 fragColor, in vec2 fragCoord )
void main()
{
  vec2 uv = vec2(gl_FragCoord.x / iResolution.x, gl_FragCoord.y / iResolution.y);
  uv -= 0.5;
  uv /= vec2(iResolution.y / iResolution.x, 1);
  vec3 ro = vec3(0.0, 0.0, -15);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  vec4 color = vec4(0.0); 
  vec3 colorEmissive2020;
  vec4 color2020 = getColor2020(ro, rd, colorEmissive2020);
  vec3 colorEmissiveTunnel;
  vec4 colorTunnel = getColorTunnel(ro, rd, colorEmissiveTunnel);
  color = colorTunnel; 
  color = mix(color, color2020, color2020.a); 
  color.rgb += colorEmissive2020+colorEmissiveTunnel*(1.0-color2020.a);

  color.rgb = tonemapFilmic(color.rgb);
  gl_FragColor = color;    
}
