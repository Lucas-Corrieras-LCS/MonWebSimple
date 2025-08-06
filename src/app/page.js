"use client";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Model(props) {
  const gltf = useGLTF("/model.gltf");
  const ref = useRef();
  const baseY = -Math.PI / 2;
  const lastMouse = useRef(0);
  const idleTime = useRef(0);
  const mouseX = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = baseY;
    }
    if (gltf?.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 1,
            roughness: 0.05,
            envMapIntensity: 2,
          });
        }
      });
    }
  }, [baseY, gltf]);

  useFrame((_, delta) => {
    if (ref.current) {
      if (mouseX.current !== lastMouse.current) {
        idleTime.current = 0;
        lastMouse.current = mouseX.current;
        ref.current.rotation.y = baseY + mouseX.current * Math.PI * 0.3;
      } else {
        idleTime.current += delta;
        if (idleTime.current > 1) {
          ref.current.rotation.y += 0.003;
        }
      }
    }
  });

  if (!gltf?.scene) return null;
  return <primitive ref={ref} object={gltf.scene} {...props} />;
}

useGLTF.preload("/model.gltf");

export default function App() {
  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#222",
      }}
    >
      <ambientLight intensity={1} />
      <directionalLight
        position={[2, 4, 2]}
        intensity={1.2}
        color={"#ff6a00"}
      />
      <Environment preset="studio" />
      <Model scale={[0.03, 0.03, 0.03]} />
    </Canvas>
  );
}
