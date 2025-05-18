#version 300 es
precision mediump float;

uniform sampler2D u_state;
uniform vec2 u_resolution;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 color = texture(u_state, uv);
    fragColor = color;
} 