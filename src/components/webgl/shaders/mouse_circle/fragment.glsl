uniform float uTime;
varying vec2 vUv;


void main() {
  float dist = distance(vUv, vec2(0.5));
  float wave = fract(dist - uTime * 0.5) *5.  -1.;
  wave *= 1. - smoothstep(1., 2., dist);
  wave *= 1. - step(uTime* 0.5, dist);
  gl_FragColor = vec4(vec3(-wave), 1.0);
}