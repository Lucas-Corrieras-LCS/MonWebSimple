"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  MeshTransmissionMaterial,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { Overlay } from "./Overlay";
import { useStore } from "./store";
import { Menu } from "./menu";
import { Button } from "./media";

function MyModel({ cursor, ...props }) {
  const ref = useRef();
  const { scene } = useGLTF("/model.gltf");
  const store = useStore();
  useFrame((state, delta) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      const baseX = Math.cos(t / 4) / 8;
      const baseY = Math.sin(t / 3) / 4;
      const baseZ = 0.15 + Math.sin(t / 2) / 8;
      let rotX = baseX;
      let rotY = baseY;
      let rotZ = baseZ;
      let posY = (0.5 + Math.cos(t / 2)) / 7;
      if (!store.open && cursor) {
        rotY += cursor.x * 0.8;
        posY = (0.5 + Math.cos(t / 2)) / 7;
      }
      ref.current.rotation.set(rotX, rotY, rotZ);
      ref.current.position.y = posY;
    }
  });
  return (
    <primitive
      ref={ref}
      object={scene}
      scale={[0.015, 0.015, 0.015]}
      position={[0, 0, 0]}
      {...props}
    />
  );
}

function Selector({ children }) {
  const ref = useRef();
  const store = useStore();
  useFrame(({ viewport, camera, pointer }, delta) => {
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3]);
    easing.damp3(
      ref.current.position,
      [(pointer.x * width) / 2, (pointer.y * height) / 2, 3],
      store.open ? 0 : 0.1,
      delta
    );
    easing.damp3(
      ref.current.scale,
      store.open ? 4 : 0.01,
      store.open ? 0.5 : 0.2,
      delta
    );
    easing.dampC(
      ref.current.material.color,
      store.open ? "#f0f0f0" : "#ccc",
      0.1,
      delta
    );
  });
  return (
    <>
      <mesh ref={ref}>
        <circleGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          samples={16}
          resolution={512}
          anisotropicBlur={0.1}
          thickness={0.1}
          roughness={0.4}
          toneMapped={true}
        />
      </mesh>
      <group
        onPointerOver={() => (store.open = true)}
        onPointerOut={() => (store.open = false)}
        onPointerDown={() => (store.open = true)}
        onPointerUp={() => (store.open = false)}
      >
        {children}
      </group>
    </>
  );
}

useGLTF.preload("/model.gltf");

export default function Page() {
  const containerRef = useRef();
  const [eventSource, setEventSource] = useState();
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      setEventSource(containerRef.current);
      const handleMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        setCursor({ x, y });
      };
      const handleLeave = () => setCursor(null);
      containerRef.current.addEventListener("pointermove", handleMove);
      containerRef.current.addEventListener("pointerleave", handleLeave);
      return () => {
        containerRef.current.removeEventListener("pointermove", handleMove);
        containerRef.current.removeEventListener("pointerleave", handleLeave);
      };
    }
  }, []);

  return (
    <div
      id="root"
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Menu />
      <Canvas
        eventSource={eventSource}
        eventPrefix="client"
        camera={{ position: [0, 0, 4], fov: 40 }}
        style={{
          width: "100vw",
          height: "100vh",
          background: "#222",
        }}
      >
        <ambientLight intensity={0.7} />
        <spotLight
          intensity={0.5}
          angle={0.1}
          penumbra={1}
          position={[10, 15, -5]}
          castShadow
        />
        <Environment preset="city" background blur={1} />
        <ContactShadows
          resolution={512}
          position={[0, -0.8, 0]}
          opacity={1}
          scale={10}
          blur={2}
          far={0.8}
        />
        <Selector>
          <MyModel rotation={[0.3, Math.PI / 1.6, 0]} cursor={cursor} />
        </Selector>
      </Canvas>
      <Overlay />
      <div
        style={{
          position: "fixed",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000, 
          pointerEvents: "auto", 
          width: "auto"
        }}
      >
        <Button />
      </div>
    </div>
  );
}
