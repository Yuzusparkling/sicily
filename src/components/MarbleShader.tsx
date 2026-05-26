import { useEffect, useRef, useState } from "react";

// ── Vertex shader (shared) ──────────────────────────────────────────────────
const VERT_SRC = `
attribute vec2 aPosition;
varying vec2 vTextureCoord;
void main() {
  vTextureCoord = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// ── Fragment shaders (extracted verbatim from Figma Shader Reminder) ─────────
// Uniforms stripped of reminder/circular-mask logic; era tint added via uEraColor

const FRAG_FLOWING_WAVES = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 uEraColor;
varying vec2 vTextureCoord;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
  for(float i = 1.0; i < 10.0; i++){
    uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
    uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
  }
  vec3 base = vec3(0.1) / abs(sin(iTime - uv.y - uv.x));
  // Blend with era color subtly
  fragColor = vec4(mix(base, base * uEraColor * 2.0, 0.18), 1.0);
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;
  vec4 color;
  mainImage(color, fragCoord);
  gl_FragColor = color;
}
`;

const FRAG_ETHER = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 uEraColor;
varying vec2 vTextureCoord;

#define t iTime
mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){
    p.xz*= m(t*0.4);p.xy*= m(t*0.3);
    vec3 q = p*2.+t;
    return length(p+vec3(sin(t*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = fragCoord.xy/min(iResolution.x, iResolution.y) - vec2(.9, .5);
    p.x += 0.4;
    vec3 cl = vec3(0.);
    float d = 2.5;
    for(int i=0; i<=5; i++) {
        vec3 p3d = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
        float rz = map(p3d);
        float f = clamp((rz - map(p3d+.1))*0.5, -.1, 1.);
        vec3 baseColor = mix(vec3(0.1, 0.3, 0.4), uEraColor * 0.6, 0.2) + vec3(5.0, 2.5, 3.0)*f;
        cl = cl*baseColor + smoothstep(2.5, .0, rz)*.7*baseColor;
        d += min(rz, 1.);
    }
    fragColor = vec4(cl, 1.0);
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;
  vec4 color;
  mainImage(color, fragCoord);
  gl_FragColor = color;
}
`;

const FRAG_SHOOTING_STARS = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 uEraColor;
varying vec2 vTextureCoord;

void mainImage(out vec4 O, in vec2 fragCoord) {
  O = vec4(0.0, 0.0, 0.0, 1.0);
  vec2 b = vec2(0.0, 0.2);
  vec2 p;
  mat2 R = mat2(1.0, 0.0, 0.0, 1.0);
  for(int i = 0; i < 20; i++) {
    float fi = float(i) + 1.0;
    float angle = fi;
    float c = cos(angle); float s = sin(angle);
    R = mat2(c, -s, s, c);
    float angle2 = fi + 33.0;
    float c2 = cos(angle2); float s2 = sin(angle2);
    mat2 R2 = mat2(c2, -s2, s2, c2);
    vec2 coord = fragCoord / iResolution.y * fi * 0.1 + iTime * b;
    vec2 frac_coord = fract(coord * R2) - 0.5;
    p = R * frac_coord;
    vec2 clamped_p = clamp(p, -b, b);
    float len = length(clamped_p - p);
    if (len > 0.0) {
      vec4 star = 1e-3 / len * (cos(p.y / 0.1 + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0);
      O += star;
    }
  }
  O.rgb = mix(O.rgb, O.rgb * uEraColor * 1.5, 0.2);
}

void main() {
  vec2 fragCoord = vTextureCoord * iResolution;
  vec4 color;
  mainImage(color, fragCoord);
  gl_FragColor = color;
}
`;

const FRAG_WAVY_LINES = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 uEraColor;
varying vec2 vTextureCoord;

#define PI 3.14159265359
float hash(float n) { return fract(sin(n) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i.x + i.y * 57.0);
    float b = hash(i.x + 1.0 + i.y * 57.0);
    float c = hash(i.x + i.y * 57.0 + 1.0);
    float d = hash(i.x + 1.0 + i.y * 57.0 + 1.0);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
    float sum = 0.0; float amp = 0.5; float freq = 1.0;
    for(int i = 0; i < 6; i++) { sum += amp * noise(p * freq); amp *= 0.5; freq *= 2.0; }
    return sum;
}
float lines(vec2 uv, float thickness, float distortion) {
    float y = uv.y;
    float distortionAmount = distortion * fbm(vec2(uv.x * 2.0, y * 0.5 + iTime * 0.1));
    y += distortionAmount;
    float linePattern = fract(y * 20.0);
    return smoothstep(0.5 - thickness, 0.5, linePattern) - smoothstep(0.5, 0.5 + thickness, linePattern);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float aspect = iResolution.x / iResolution.y;
    vec2 uv = fragCoord / iResolution.xy - 0.5;
    uv.x *= aspect;
    vec2 mousePos = iMouse.xy; mousePos.x *= aspect;
    float mouseDist = length(uv - mousePos);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);
    float thickness = mix(0.05, 0.075, mouseInfluence);
    float distortion = mix(0.2, 0.4, mouseInfluence);
    float line = lines(uv, thickness, distortion);
    float timeOffset = sin(iTime * 0.2) * 0.1;
    float animatedLine = lines(uv + vec2(timeOffset, 0.0), thickness, distortion);
    line = mix(line, animatedLine, 0.3);
    vec3 lineColor = uEraColor;
    vec3 finalColor = mix(vec3(0.0), lineColor, line);
    finalColor += vec3(0.1) * mouseInfluence * line;
    fragColor = vec4(finalColor, 1.0);
}
void main() {
  vec2 fragCoord = vTextureCoord * iResolution;
  vec4 color;
  mainImage(color, fragCoord);
  gl_FragColor = color;
}
`;

const FRAG_ACCRETION = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 uEraColor;
varying vec2 vTextureCoord;

vec4 tanh_approx(vec4 x) {
    vec4 x2 = x * x;
    vec4 x4 = x2 * x2;
    return x * (27.0 + x2) / (27.0 + 9.0 * x2 + x4);
}
void mainImage(out vec4 O, vec2 I) {
    O = vec4(0.0);
    float z = 0.0; float d = 0.0;
    for(float i = 0.0; i < 20.0; i += 1.0) {
        vec3 p = z * normalize(vec3(I + I, 0.0) - iResolution.xyx) + 0.1;
        p = vec3(atan(p.y / 0.2, p.x) * 2.0, p.z / 3.0, length(p.xy) - 5.0 - z * 0.2);
        for(float j = 1.0; j <= 7.0; j += 1.0) { p += sin(p.yzx * j + iTime + 0.3 * i) / j; }
        d = length(vec4(0.4 * cos(p) - 0.4, p.z));
        z += d;
        vec4 colorBase = (1.0 + cos(p.x + i * 0.4 + z + vec4(6.0, 1.0, 2.0, 0.0))) / d;
        colorBase = mix(colorBase, vec4(uEraColor, 1.0) * colorBase, 0.15);
        O += colorBase;
    }
    O = tanh_approx(O * O / 400.0);
}
void main() {
  vec2 fragCoord = vTextureCoord * iResolution;
  vec4 color;
  mainImage(color, fragCoord);
  gl_FragColor = color;
}
`;

export type ShaderName = "flowing" | "ether" | "stars" | "wavy" | "accretion";

const SHADERS: Record<ShaderName, { label: string; frag: string }> = {
  flowing:   { label: "Waves",     frag: FRAG_FLOWING_WAVES },
  ether:     { label: "Ether",     frag: FRAG_ETHER },
  stars:     { label: "Stars",     frag: FRAG_SHOOTING_STARS },
  wavy:      { label: "Lines",     frag: FRAG_WAVY_LINES },
  accretion: { label: "Accretion", frag: FRAG_ACCRETION },
};

interface Props {
  eraColor?: [number, number, number]; // RGB 0-1
  defaultShader?: ShaderName;
  shader?: ShaderName; // controlled from outside — overrides internal state
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildProgram(gl: WebGLRenderingContext, fragSrc: string): WebGLProgram | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

export default function MarbleShader({ eraColor = [1, 0.8, 0.3], defaultShader = "flowing", shader }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalShader, setInternalShader] = useState<ShaderName>(defaultShader);
  const activeShader = shader ?? internalShader;
  const setActiveShader = (s: ShaderName) => setInternalShader(s);
  const activeShaderRef = useRef<ShaderName>(activeShader);
  const eraColorRef = useRef(eraColor);
  const mouseRef = useRef<[number, number]>([0, 0]);
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programsRef = useRef<Partial<Record<ShaderName, WebGLProgram>>>({});
  const startTimeRef = useRef<number>(Date.now());

  // Keep refs in sync
  useEffect(() => { activeShaderRef.current = activeShader; }, [activeShader]);
  useEffect(() => { eraColorRef.current = eraColor; }, [eraColor]);

  // Init WebGL once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    // Build all programs upfront
    (Object.keys(SHADERS) as ShaderName[]).forEach((name) => {
      const prog = buildProgram(gl, SHADERS[name].frag);
      if (prog) programsRef.current[name] = prog;
    });

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    };
    window.addEventListener("mousemove", onMouseMove);

    const render = () => {
      const prog = programsRef.current[activeShaderRef.current];
      if (!prog) { rafRef.current = requestAnimationFrame(render); return; }

      gl.useProgram(prog);

      const posLoc = gl.getAttribLocation(prog, "aPosition");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // 0.35 speed multiplier — slows all shaders to ~35% of original speed
      const t = (Date.now() - startTimeRef.current) / 1000 * 0.35;
      const setU = (name: string, ...v: number[]) => {
        const loc = gl.getUniformLocation(prog, name);
        if (!loc) return;
        if (v.length === 1) gl.uniform1f(loc, v[0]);
        else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
        else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
      };

      setU("iTime", t);
      setU("iResolution", canvas.width, canvas.height);
      setU("iMouse", mouseRef.current[0], mouseRef.current[1]);
      setU("uEraColor", eraColorRef.current[0], eraColorRef.current[1], eraColorRef.current[2]);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0, display: "block" }}
      />
      {/* Shader selector — only shown when not controlled externally */}
      {!shader && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-50"
          style={{ pointerEvents: "auto" }}
        >
          {(Object.keys(SHADERS) as ShaderName[]).map((name) => (
            <button
              key={name}
              onClick={() => setActiveShader(name)}
              className="px-3 py-1 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: "'Cinzel', serif",
                color: activeShader === name ? "#d4a84b" : "rgba(255,255,255,0.3)",
                borderBottom: activeShader === name ? "1px solid #d4a84b" : "1px solid transparent",
                background: "transparent",
                cursor: "pointer",
                letterSpacing: "0.12em",
              }}
            >
              {SHADERS[name].label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
