## Urban Pulse

| Layer | Tool |
| --- | --- |
| Frontend Framework | **React** or **Vanilla JS** |
| GPU Compute | **WebGL2** (for compatibility) |
| Shader Language | **GLSL (Fragment Shaders)** |
| Visualization | **Canvas/WebGL 2D Grid**, colored per cell state |
| Optional UI | **Tailwind CSS**, **Sliders**, **Chart.js**, etc. |

---

## 🧩 Core Architecture

### 📦 1. **Grid Buffer**

- A 2D array (e.g. 256×256 cells) stored as a texture.
- Each pixel encodes a cell state (0–255) using color channels (e.g., RED = cell type).

### 🧠 2. **Fragment Shader = Your Rule Engine**

- You write a **GLSL shader** that reads from the grid texture.
- For each pixel (cell), it:
    - Samples the 8 neighbors
    - Applies your **urban growth rules**
    - Outputs the new state

### 🎨 3. **Rendering**

- Render the grid back to the canvas using a colormap:
    - 0 = empty → gray
    - 1 = residential → green
    - 2 = commercial → blue
    - etc.

### 🧭 4. **Controls / UI**

- Add sliders for:
    - Growth aggressiveness
    - Initial seed population
    - Cell type toggles
    - Speed of simulation

---

## ⚙️ Minimal Tech Stack

1. **HTML** + `<canvas>`
2. **JavaScript** (or React)
3. **WebGL2 API**
4. **GLSL fragment shader** for CA update logic
5. [Optional] **dat.GUI or React sliders** for UI control

---

## 📦 Tools to Help

- [`regl`](https://github.com/regl-project/regl): High-level wrapper over WebGL.
- [`twgl.js`](https://twgljs.org/): Simplifies texture/framebuffer setup.
- [`glslify`](https://github.com/glslify/glslify): Lets you modularize your GLSL code.
- [`vite` or `parcel`]: To serve and bundle your project.
- [`canvas-sketch`](https://github.com/mattdesl/canvas-sketch): Optional dev environment for generative graphics.

---

## 🚀 Your Next Steps

1. ✅ Set up a basic webpage with a `<canvas>` element.
2. ✅ Use WebGL to render a 2D grid (e.g., 256x256).
3. ✅ Write a fragment shader to encode urban growth rules.
4. ✅ Render the simulation output to the canvas each frame.
5. 🔁 Add interactivity and visualization polish.
