// For each pixel (cell), this shader decides the next state
precision highp float;

uniform sampler2D u_state;   // The input grid
uniform vec2 u_resolution;   // Grid size (e.g., 256x256)

vec4 sample(vec2 coord) {
  return texture2D(u_state, coord / u_resolution);
}

void main() {
  vec2 coord = gl_FragCoord.xy;

  // Sample self and neighbors
  float self = sample(coord).r;
  float neighbors = 0.0;
  neighbors += sample(coord + vec2(-1,  0)).r;
  neighbors += sample(coord + vec2( 1,  0)).r;
  neighbors += sample(coord + vec2( 0, -1)).r;
  neighbors += sample(coord + vec2( 0,  1)).r;

  // Growth rule: if 2+ neighbors are "urbanized", convert this empty cell to urban
  float next = self;
  if (self < 0.5 && neighbors >= 2.0) {
    next = 1.0;
  }

  gl_FragColor = vec4(next, 0.0, 0.0, 1.0); // Store state in red channel
}
