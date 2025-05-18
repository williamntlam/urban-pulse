#version 300 es
precision mediump float;

uniform sampler2D u_state;
uniform vec2 u_resolution;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 pixel = 1.0 / u_resolution;
    
    // Sample neighboring cells
    vec4 current = texture(u_state, uv);
    vec4 up = texture(u_state, uv + vec2(0.0, pixel.y));
    vec4 down = texture(u_state, uv - vec2(0.0, pixel.y));
    vec4 left = texture(u_state, uv - vec2(pixel.x, 0.0));
    vec4 right = texture(u_state, uv + vec2(pixel.x, 0.0));
    
    // Simple cellular automata rule
    float sum = up.r + down.r + left.r + right.r;
    float newState = current.r;
    
    if (current.r > 0.5) {
        // Cell is alive
        if (sum < 1.0 || sum > 2.0) {
            newState = 0.0; // Die from under/overpopulation
        }
    } else {
        // Cell is dead
        if (sum == 2.0) {
            newState = 1.0; // Birth
        }
    }
    
    fragColor = vec4(newState, 0.0, 0.0, 1.0);
} 