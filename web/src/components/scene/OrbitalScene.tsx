"use client";
import { useMemo, useRef, useState } from "react";

// Layer 1 of 3: Three.js owns geometry, materials and the frame loop.
// Nothing here reads React state per frame and nothing here animates DOM.
// GSAP writes into the refs exposed through `useOrbitalDriver` (camera rig + group),
// Framer Motion never touches this tree.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

// Concrete strings mirrored from tokens.css. WebGL cannot read CSS vars, and a
// getComputedStyle read per frame would allocate.
const ACCENT = "#ff8a3d";
const ACCENT_LIGHT = "#ffb887";
const PANEL = "#1d1613";
const RULE = "#7a6350";

export type SceneDriver = {
  /** scroll progress 0..1 over the pinned hero, written by GSAP scrub */
  progress: React.RefObject<number>;
  /** pointer offset -1..1, lerped in the frame loop */
  pointer: React.RefObject<{ x: number; y: number }>;
  /** true once the driver is mounted, so the loop can stop idling */
  armed: React.RefObject<boolean>;
};

/** Parent creates the driver refs; scene reads them. */
export function useOrbitalDriver(): SceneDriver {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const armed = useRef(false);
  return useMemo(() => ({ progress, pointer, armed }), []);
}

// --- field: 3 hollow rings of points, one instanced draw -------------------
function Field({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i += 1) {
      const band = i % 3;
      const r = 1.5 + band * 0.72 + ((i * 37) % 100) / 110;
      const a = (i / 320) * Math.PI * 2 * 3 + (i % 11) * 0.19;
      const y = (((i * 53) % 100) / 100 - 0.5) * 9.2;
      const z = (((i * 29) % 100) / 100 - 0.5) * 2.4;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  return (
    <points frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={RULE}
        size={0.075}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

// --- rig: camera + group transforms are written by GSAP, read here ---------
function Rig({ driver }: { driver: SceneDriver }) {
  const rig = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { clock, camera, size, invalidate } = useThree();
  const look = useRef(new THREE.Vector3(0, 1.15, 0));

  // tall panels need a wider fov or the cage clips; the camera also sits further
  // back so the core stays centred instead of top-heavy
  if (!(camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
    /* noop — the Canvas always builds a perspective camera here */
  }

  useFrame(() => {
    const t = clock.elapsedTime;
    const p = driver.progress.current ?? 0;
    const ptr = driver.pointer.current ?? { x: 0, y: 0 };

    // idle life: slow tumble, independent of scroll
    if (core.current) {
      core.current.rotation.y = t * 0.22;
      core.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    }
    if (shell.current) {
      shell.current.rotation.y = -t * 0.1;
      shell.current.rotation.z = t * 0.05;
    }

    // scroll: the rig dollies in and rolls, driven by the GSAP scrub value
    if (rig.current) {
      // lift the subject into the band above the copy, then dolly on scroll
      // the headline sits at the fold's lower third; the subject must clear it
      // the scan rails cross the band's midline: the subject rides them, not the masthead
      // clear of the masthead and centred in the band, so the cage never clips
      // the cage's lower vertices must clear the plate's top edge, or the subject
      // reads sliced rather than floating
      rig.current.position.y = THREE.MathUtils.lerp(rig.current.position.y, 3.15 + p * 0.5, 0.1);
      rig.current.position.z = THREE.MathUtils.lerp(rig.current.position.z, -p * 2.6, 0.12);
      rig.current.rotation.z = THREE.MathUtils.lerp(rig.current.rotation.z, p * 0.45, 0.1);
      rig.current.rotation.x = THREE.MathUtils.lerp(
        rig.current.rotation.x,
        -ptr.y * 0.18 + p * 0.2,
        0.08,
      );
      rig.current.rotation.y = THREE.MathUtils.lerp(rig.current.rotation.y, ptr.x * 0.28, 0.08);
    }
  });

  // camera placement reacts to aspect only, so a resize never strands the subject
  useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const tall = size.height > size.width;
    cam.fov = tall ? 70 : 46;
    cam.position.z = tall ? 6.2 : 6.8;
    cam.updateProjectionMatrix();
    look.current.set(0, 1.15, 0);
    cam.lookAt(look.current);
    invalidate();
  }, [camera, size.height, size.width, invalidate]);

  return (
    <group ref={rig}>
      <mesh ref={core} scale={0.52}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#e8853f"
          emissive={ACCENT}
          emissiveIntensity={0.12}
          metalness={0.1}
          roughness={0.78}
          flatShading
        />
      </mesh>
      <mesh ref={shell} scale={0.7}>
        <icosahedronGeometry args={[1.34, 0]} />
        <meshBasicMaterial color={ACCENT_LIGHT} wireframe transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Scene({ driver }: { driver: SceneDriver }) {
  const [tier, setTier] = useStateTier();
  return (
    <>
      <PerformanceMonitor onDecline={() => setTier("low")} onIncline={() => setTier("high")} />
      <color attach="background" args={[PANEL]} />
      {/* key from high-right, cold fill from the back-left: without the falloff the
         5.5 key flattened the facets into one bright blob */}
      {/* a true rake: the key sits well off the camera axis in Z as well as X, so it
         grazes the silhouette. Any key with Z near the camera front-lights the whole
         face and the 20-face icosahedron renders as one flat slab. */}
      <ambientLight intensity={0.05} />
      <directionalLight position={[-6, 3, -1.5]} intensity={2.6} color={ACCENT_LIGHT} />
      <directionalLight position={[5, -2.5, 1.5]} intensity={0.5} color={ACCENT} />
      <Rig driver={driver} />
      <Field count={tier === "low" ? 160 : tier === "mid" ? 240 : 320} />
    </>
  );
}


function useStateTier() {
  return useState<"low" | "mid" | "high">("mid");
}

export function OrbitalCanvas({ driver }: { driver: SceneDriver }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={() => {
        driver.armed.current = true;
      }}
    >
      <Scene driver={driver} />
    </Canvas>
  );
}
