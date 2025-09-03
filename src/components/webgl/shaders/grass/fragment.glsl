varying vec3 vColour;
varying vec4 vGrassData;
varying vec3 vNormal;


void main() {
  float grassX = vGrassData.x;

  vec3 baseColour = mix(vColour * 2., vColour , smoothstep(0.125, 0.0, abs(grassX)));

  // Simple directional light
  vec3 lightDir = normalize(vec3(1.5, 1.0, 0.5));
  float diff = max(dot(normalize(vNormal), lightDir), 0.2); // 0.2 = ambient

  vec3 litColour = baseColour * diff;

  gl_FragColor = vec4(litColour, 1.0);
}