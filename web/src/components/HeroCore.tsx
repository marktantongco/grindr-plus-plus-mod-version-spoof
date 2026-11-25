"use client";

// Procedural core. No GLB, no textures. One lit icosahedron + one instanced ring field.
// Budget: <100 draw calls, single instanced draw for the field (D-08, A36).
// The wrapper handles WebGL probe, poster fallback and reduced motion (D-09/D-10).

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Mark } from "./Mark";

// Three.js needs concrete color strings; mirrored from tokens.css so no token drifts.
const ACCENT = "#ff8a3d"; // --color-accent
const ACCENT_LIGHT = "#ffb887"; // --color-accent-light
const PANEL = "#1d1613"; // --color-panel
const RULE = "#7a6350"; // --color-rule-strong: --color-rule is 1.27:1 on panel and reads as sludge for the field

function probeWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") || c.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

// Points, not instanced spheres. A 5x4 sphere at these pixel sizes renders as a lopsided
// ellipse and read as spilled sand. Points give round dots, real size attenuation and a
// single draw call, and the ring structure keeps the core's centre clear.
function Field({ count }: { count: number }) {
  const attr = useRef<THREE.BufferAttribute>(null);

  // Three concentric rings (hollow shell), each particle on its own y and depth so the
  // shell never reads as a flat band. Only the outer ring is sparse.
  const positions = useRef(
    (() => {
      const arr = new Float32Array(320 * 3);
      for (let i = 0; i < 320; i += 1) {
        const band = i % 3; /* 0 inner, 1 mid, 2 outer */
        const r = 1.5 + band * 0.72 + ((i * 37) % 100) / 110;
        const a = (i / 320) * Math.PI * 2 * 3 + (i % 11) * 0.19;
        const y = (((i * 53) % 100) / 100 - 0.5) * 9.2;
        const z = (((i * 29) % 100) / 100 - 0.5) * 2.4;
        arr[i * 3] = Math.cos(a) * r;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
      }
      return arr;
    })(),
  );

  useEffect(() => {
    if (attr.current) attr.current.needsUpdate = true;
  }, [count]);

  return (
    <points frustumCulled>
      <bufferGeometry>
        <bufferAttribute
          ref={attr}
          attach="attributes-position"
          args={[positions.current, 3]}
          count={count}
        />
      </bufferGeometry>
      {/* sizeAttenuation is what sells depth: near dots grow, far dots become dust */}
      <pointsMaterial
        color={RULE}
        size={0.038}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { clock, invalidate, camera, size } = useThree();
  const [tier, setTier] = useState<"low" | "mid" | "high">("mid");
  const fieldCount = tier === "low" ? 160 : tier === "mid" ? 240 : 320;

  // Tall, narrow panel: widen the fov so the shell and field are not clipped, and
  // push the camera back so the core still reads centred instead of top-heavy.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!cam.isPerspectiveCamera) return;
    const tall = size.height > size.width;
    cam.fov = tall ? 88 : 52;
    cam.position.z = tall ? 5.4 : 6.2; /* fov widens the field; z keeps the cage off the edges */
    cam.updateProjectionMatrix();
    invalidate();
  }, [camera, size.height, size.width, invalidate]);

  useEffect(() => {
    if (!reduced) return;
    clock.start();
    invalidate();
  }, [reduced, clock, invalidate]);

  useFrame(() => {
    const t = clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y = t * 0.22;
      core.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    }
    if (shell.current) {
      shell.current.rotation.y = -t * 0.1;
      shell.current.rotation.z = t * 0.05;
    }
  });

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setTier("low")}
        onIncline={() => setTier("high")}
      />
      {/* low ambient + hard key: ambient alone flattens the solid into a sticker */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color={ACCENT_LIGHT} />
      <directionalLight position={[-5, -3, -4]} intensity={0.45} color={ACCENT} />

      {/* dark faceted solid: lit faces read as planes against the near-black panel */}
      <mesh ref={core} scale={1.1}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#d97428"
          emissive={ACCENT}
          emissiveIntensity={0.18}
          metalness={0.25}
          roughness={0.42}
          flatShading
        />
      </mesh>

      {/* cage must sit QUIETER than the solid, or the eye reads the wireframe as the object */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.34, 0]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.3} />
      </mesh>

      <Field count={fieldCount} />
    </>
  );
}

class CanvasBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  componentDidCatch() {
    // A renderer that passes the probe but dies on construction must land on the
    // poster, not on a React error overlay (A39). The poster is already painted
    // underneath, so the swap is just a state flip.
    this.props.onError();
  }
  render() {
    return this.state.crashed ? null : this.props.children;
  }
}

export function HeroCore() {
  const [mode, setMode] = useState<"poster" | "live" | "failed">("poster");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    if (!probeWebGL()) {
      setMode("failed");
      return () => mq.removeEventListener("change", onChange);
    }
    setMode("live");
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const fail = useCallback(() => setMode("failed"), []);

  return (
    <div className="hero__figure" data-canvas={mode}>
      <div className="hero__poster" aria-hidden="true">
        <PosterSvg />
      </div>
      {mode === "live" && (
        <div className="hero__canvas">
          <CanvasBoundary onError={fail}>
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              frameloop={reduced ? "demand" : "always"}
              onCreated={({ gl }) => gl.setClearAlpha(0)}
            >
              <Core reduced={reduced} />
            </Canvas>
          </CanvasBoundary>
        </div>
      )}
    </div>
  );
}

// Static poster: the same composition in SVG, so the swap cannot shift (A33).
function PosterSvg() {
  // Tall frame (400x560): the panel is a tall column at >=900px, so the artwork is
  // composed tall and centred rather than cropped out of a wide 400x250 box.
  const seeds = Array.from({ length: 120 }, (_, i) => ({
    r: 78 + ((i * 37) % 100) / 3,
    a: (i / 120) * Math.PI * 2 + (i % 7) * 0.31,
    y: 280 + (((i * 53) % 100) / 100 - 0.5) * 250,
    s: 0.9 + ((i * 13) % 10) / 10,
  }));
  return (
    <svg
      viewBox="0 0 400 560"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="An abstract lit wireframe core inside a field of particles"
    >
      <rect width="400" height="560" fill={PANEL} />
      <g stroke={RULE} strokeWidth="1">
        {seeds.map((p, i) => (
          <circle
            key={i}
            cx={200 + Math.cos(p.a) * p.r}
            cy={p.y}
            r={p.s}
            fill={RULE}
            stroke="none"
          />
        ))}
      </g>
      <g transform="translate(200 280)">
        <path
          d="M0 -58 L52 -29 L52 29 L0 58 L-52 29 L-52 -29 Z"
          fill={PANEL}
          stroke={ACCENT}
          strokeWidth="1.2"
          opacity="0.6"
        />
        <path
          d="M0 -86 L77 -43 L77 43 L0 86 L-77 43 L-77 -43 Z"
          fill="none"
          stroke={ACCENT}
          strokeWidth="0.6"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}
