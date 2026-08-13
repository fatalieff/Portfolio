"use client";

import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const COUNT = 900;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ParticleField({ progressRef }: { progressRef: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(20260813);
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (rand() - 0.5) * 14;
      arr[i * 3 + 1] = (rand() - 0.5) * 9;
      arr[i * 3 + 2] = (rand() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const progress = progressRef.current ?? 0;
    group.current.rotation.y = progress * Math.PI * 2;
    group.current.rotation.x = progress * Math.PI * 0.4;
    if (material.current) {
      material.current.opacity = 0.55 + Math.sin(progress * Math.PI * 2) * 0.15;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          color="#6d5cff"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#22d3ee"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
      <Sparkles
        count={60}
        scale={9}
        size={2}
        speed={0.3}
        color="#c7bffc"
        opacity={0.5}
      />
    </group>
  );
}

export default function SceneParticles({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <group>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.8}>
        <ParticleField progressRef={progressRef} />
      </Float>
      <ambientLight intensity={1} />
    </group>
  );
}
