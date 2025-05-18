varying vec3 vColour;
varying vec4 vGrassData;

void main() {
  float grassX = vGrassData.x;

  vec3 baseColour = mix(vColour * 2., vColour , smoothstep(0.125, 0.0, abs(grassX)));

  gl_FragColor = vec4(baseColour, 1.0);
}