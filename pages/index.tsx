import { useEffect, useRef } from "react";
import fragmentShaderSrc from '../shaders/urban-passthrough.frag';
import vertexShaderSrc from '../shaders/urban-passthrough.vert';

const Home = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      alert('WebGL2 not supported');
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    const glNonNull = gl;  // TypeScript now knows this is non-null

    function createShader(type: number, source: string): WebGLShader {
      const shader = glNonNull.createShader(type)!;
      glNonNull.shaderSource(shader, source);
      glNonNull.compileShader(shader);
      if (!glNonNull.getShaderParameter(shader, glNonNull.COMPILE_STATUS)) {
        throw new Error(glNonNull.getShaderInfoLog(shader) || 'Shader compile error');
      }
      return shader;
    }

    function createProgram(vs: string, fs: string): WebGLProgram {
      const vertexShader = createShader(glNonNull.VERTEX_SHADER, vs);
      const fragmentShader = createShader(glNonNull.FRAGMENT_SHADER, fs);
      const program = glNonNull.createProgram()!;
      glNonNull.attachShader(program, vertexShader);
      glNonNull.attachShader(program, fragmentShader);
      glNonNull.linkProgram(program);
      if (!glNonNull.getProgramParameter(program, glNonNull.LINK_STATUS)) {
        throw new Error(glNonNull.getProgramInfoLog(program) || 'Program link error');
      }
      return program;
    }

    const program = createProgram(vertexShaderSrc, fragmentShaderSrc);
    glNonNull.useProgram(program);

    const positionBuffer = glNonNull.createBuffer();
    glNonNull.bindBuffer(glNonNull.ARRAY_BUFFER, positionBuffer);
    glNonNull.bufferData(glNonNull.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]), glNonNull.STATIC_DRAW);

    const posLoc = glNonNull.getAttribLocation(program, 'a_position');
    glNonNull.enableVertexAttribArray(posLoc);
    glNonNull.vertexAttribPointer(posLoc, 2, glNonNull.FLOAT, false, 0, 0);

    const resLoc = glNonNull.getUniformLocation(program, 'u_resolution');
    glNonNull.uniform2f(resLoc, width, height);

    const texture = glNonNull.createTexture();
    const texture2 = glNonNull.createTexture();
    glNonNull.bindTexture(glNonNull.TEXTURE_2D, texture);
    const size = width * height;
    const initialData = new Uint8Array(size * 4);
    for (let i = 0; i < size; i++) {
      initialData[i * 4] = Math.random() > 0.9 ? 255 : 0;
      initialData[i * 4 + 3] = 255;
    }
    glNonNull.texImage2D(glNonNull.TEXTURE_2D, 0, glNonNull.RGBA, width, height, 0,
                  glNonNull.RGBA, glNonNull.UNSIGNED_BYTE, initialData);
    glNonNull.texParameteri(glNonNull.TEXTURE_2D, glNonNull.TEXTURE_MIN_FILTER, glNonNull.NEAREST);
    glNonNull.texParameteri(glNonNull.TEXTURE_2D, glNonNull.TEXTURE_MAG_FILTER, glNonNull.NEAREST);

    // Set up second texture
    glNonNull.bindTexture(glNonNull.TEXTURE_2D, texture2);
    glNonNull.texImage2D(glNonNull.TEXTURE_2D, 0, glNonNull.RGBA, width, height, 0,
                  glNonNull.RGBA, glNonNull.UNSIGNED_BYTE, initialData);
    glNonNull.texParameteri(glNonNull.TEXTURE_2D, glNonNull.TEXTURE_MIN_FILTER, glNonNull.NEAREST);
    glNonNull.texParameteri(glNonNull.TEXTURE_2D, glNonNull.TEXTURE_MAG_FILTER, glNonNull.NEAREST);

    // Create framebuffer for ping-pong rendering
    const framebuffer = glNonNull.createFramebuffer();
    glNonNull.bindFramebuffer(glNonNull.FRAMEBUFFER, framebuffer);

    const stateLoc = glNonNull.getUniformLocation(program, 'u_state');
    glNonNull.uniform1i(stateLoc, 0);

    let currentTexture = texture;
    let nextTexture = texture2;

    function render() {
      // Update simulation
      glNonNull.bindFramebuffer(glNonNull.FRAMEBUFFER, framebuffer);
      glNonNull.framebufferTexture2D(glNonNull.FRAMEBUFFER, glNonNull.COLOR_ATTACHMENT0, glNonNull.TEXTURE_2D, nextTexture, 0);
      glNonNull.viewport(0, 0, width, height);
      glNonNull.bindTexture(glNonNull.TEXTURE_2D, currentTexture);
      glNonNull.drawArrays(glNonNull.TRIANGLES, 0, 6);

      // Render to screen
      glNonNull.bindFramebuffer(glNonNull.FRAMEBUFFER, null);
      glNonNull.viewport(0, 0, width, height);
      glNonNull.clear(glNonNull.COLOR_BUFFER_BIT);
      glNonNull.bindTexture(glNonNull.TEXTURE_2D, nextTexture);
      glNonNull.drawArrays(glNonNull.TRIANGLES, 0, 6);

      // Swap textures
      [currentTexture, nextTexture] = [nextTexture, currentTexture];

      requestAnimationFrame(render);
    }

    render();
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