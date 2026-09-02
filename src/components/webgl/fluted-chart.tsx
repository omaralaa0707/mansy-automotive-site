"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useWebglHealth } from "@/lib/use-webgl-health";

/**
 * Mansy Automotive's signature piece: the fluted chart.
 *
 * They publish specifications and nothing else — power, torque, top speed,
 * 0–100 — so the page is a comparison instrument rather than a brochure. And
 * the one architectural feature in every showroom photograph they post is a
 * gold *fluted* column standing behind the car, so the chart is built out of
 * that: one fluted column per car, its height driven by the figure they
 * published.
 *
 * Each column is a real lathed profile. A `LatheGeometry` sweeps a radius
 * that oscillates around the circumference, which is what fluting is, and the
 * flutes catch a rim light down one side so the section reads as round rather
 * than as a flat bar. Heights ease between metrics rather than cutting, so
 * switching from power to 0–100 is legible as the same four cars changing
 * order.
 *
 * A column whose figure the dealership never published is drawn as a low,
 * dim plinth — the page does not invent a value to keep the chart tidy.
 */

// Fluting is a ring of vertical reeds. Modulating a lathe's radius around
// the sweep cannot be done with LatheGeometry, and a ring of thin boxes is
// closer to how the real column in their showroom is built anyway.
const FLUTES = 16;

function Column({
  value,
  target,
  color,
  x,
  dim,
}: {
  value: number;
  target: number;
  color: string;
  x: number;
  dim: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const shown = useRef(value);

  const reeds = useMemo(
    () =>
      Array.from({ length: FLUTES }, (_, i) => {
        const a = (i / FLUTES) * Math.PI * 2;
        return { a, x: Math.cos(a) * 0.32, z: Math.sin(a) * 0.32 };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const k = 1 - Math.pow(0.004, Math.min(delta, 0.05));
    shown.current += (target - shown.current) * k;
    group.current.scale.y = Math.max(0.02, shown.current);
  });

  return (
    <group position={[x, 0, 0]}>
      <group ref={group} position={[0, 0, 0]}>
        {reeds.map((r, i) => (
          <mesh key={i} position={[r.x, 1, r.z]} rotation={[0, -r.a, 0]}>
            <boxGeometry args={[0.105, 2, 0.105]} />
            {/* Flat material with a per-reed tint: the reeds facing the key
                side sit brighter, which is what makes the column read round
                without a light rig. */}
            <meshBasicMaterial
              color={new THREE.Color(color)
                .clone()
                .multiplyScalar(dim ? 0.35 : 0.55 + 0.45 * Math.max(0, Math.cos(r.a - 0.9)))}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      {/* The plinth every column stands on, so a missing figure still has a
          place on the floor. */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 28]} />
        <meshBasicMaterial color="#2a2c30" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene({
  values,
  colors,
  dims,
}: {
  values: number[];
  colors: string[];
  dims: boolean[];
}) {
  const spread = 1.25;
  const offset = ((values.length - 1) * spread) / 2;

  return (
    <>
      {/* The floor line the columns stand on. */}
      <mesh position={[0, -0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial color="#1b1d21" toneMapped={false} />
      </mesh>
      {values.map((v, i) => (
        <Column
          key={i}
          value={v}
          target={v}
          color={colors[i]}
          x={i * spread - offset}
          dim={dims[i]}
        />
      ))}
    </>
  );
}

/**
 * A context the browser refuses outright makes r3f throw on mount, which
 * use-webgl-health cannot see — it only reports a context created and then
 * lost. Probe before rendering the Canvas at all.
 */
function canRenderWebgl() {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") ?? c.getContext("webgl") ?? c.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function FlutedChart({
  /** Normalised 0–1 heights, one per car. */
  values,
  colors,
  /** True where the dealership published no figure for this car. */
  dims,
  alt,
  className,
}: {
  values: number[];
  colors: string[];
  dims: boolean[];
  alt: string;
  className?: string;
}) {
  const { lost, bind } = useWebglHealth();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // A browser-only capability answer cannot be known before an effect runs,
    // and a lazy initialiser reading `window` would desync hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(canRenderWebgl());
  }, []);

  // Without WebGL the same comparison is plain bars, which is what the
  // columns are a picture of.
  if (lost || supported !== true) {
    return (
      <div className={`flex items-end justify-center gap-4 ${className ?? ""}`} role="img" aria-label={alt}>
        {values.map((v, i) => (
          <span
            key={i}
            className="w-10 rounded-t-sm"
            style={{
              height: `${Math.max(4, v * 100)}%`,
              background: colors[i],
              opacity: dims[i] ? 0.35 : 1,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className} role="img" aria-label={alt}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 1.15, 4.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, camera }) => {
          bind(gl.domElement);
          camera.lookAt(0, 0.95, 0);
        }}
      >
        <Scene values={values} colors={colors} dims={dims} />
      </Canvas>
    </div>
  );
}
