"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import * as THREE from "three";
import SceneParticles from "@/components/three/scenes/SceneParticles";

type SceneProps = { progressRef: RefObject<number> };

function CameraRig({ progressRef }: SceneProps) {
  useFrame((state) => {
    const progress = progressRef.current ?? 0;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      progress * 0.6,
      0.04
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SceneCanvas({ progressRef }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ pointerEvents: "none" }}
    >
      <CameraRig progressRef={progressRef} />
      <SceneParticles progressRef={progressRef} />
    </Canvas>
  );
}
