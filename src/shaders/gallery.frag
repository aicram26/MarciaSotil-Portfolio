precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform vec2 uResolution;

varying vec2 vUv;

float rand(vec2 co){ return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  float intensity = uHover * 0.15;
  uv.y += sin(uv.x * 10.0 + uTime * 5.0) * intensity;
  uv.x += cos(uv.y * 10.0 + uTime * 5.0) * intensity;
  vec4 color = texture2D(uTexture, uv);
  color.r += intensity * 0.2;
  color.g -= intensity * 0.1;
  gl_FragColor = color;
}
