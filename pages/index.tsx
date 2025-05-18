import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const Home = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("webgl");

      if (context) {
        const gl = context;
        
        // Create a buffer for the square's positions
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Set the positions for a square
        const positions = [
          -0.5, -0.5,
           0.5, -0.5,
           0.5,  0.5,
          -0.5,  0.5,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Create and compile shaders
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) {
          console.error('Failed to create shaders');
          return;
        }

        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.shaderSource(fragmentShader, fragmentShaderSource);

        gl.compileShader(vertexShader);
        gl.compileShader(fragmentShader);

        // Create and link program
        const program = gl.createProgram();
        if (!program) {
          console.error('Failed to create program');
          return;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // Use the program
        gl.useProgram(program);

        // Set up position attribute
        const positionAttributeLocation = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // Clear the canvas and draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      } else {
        alert("WebGL2 is not supported in this browser");
        return;
      }
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <canvas
        ref={canvasRef}
        height={256}
        width={256}
      >

      </canvas>
    </main>
  )

}

export default Home;