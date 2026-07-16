"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Loader() {
  const { progress } = useProgress();
  return <Html center><div className="model-loader"><span>{Math.round(progress)}%</span><small>Loading vehicle</small></div></Html>;
}

function Porsche({ progress, pointer }: { progress: React.MutableRefObject<number>; pointer: React.MutableRefObject<{x:number;y:number}> }) {
  const { scene } = useGLTF("/models/porsche/scene-optimized.glb");
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();

  useEffect(() => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = false;
      object.receiveShadow = false;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (material && "envMapIntensity" in material) {
          (material as THREE.MeshStandardMaterial).envMapIntensity = 1.45;
          material.needsUpdate = true;
        }
      });
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = progress.current;

    // Keep the car upright and centered. The model is already Y-up, so rotating
    // it 90° on X was what caused the roof/underbody camera angles.
    const targetRotY = -0.5 + p * Math.PI * 0.9 + pointer.current.x * 0.045;
    const targetRotX = pointer.current.y * -0.018;
    const targetY = -0.16 + Math.sin(p * Math.PI) * 0.025;
    const targetX = (p - 0.5) * 0.04;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 4.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, 4.2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 4, delta);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, delta);

    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.65) * 0.004;
    const baseScale = size.width <= 900 ? 0.54 : 0.72;
    group.current.scale.setScalar(baseScale * breathe);
  });

  return <group ref={group} rotation={[0, -0.5, 0]} scale={0.72} position={[0, -0.16, 0]}>
    <primitive object={scene} />
  </group>;

}


function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const mobile = size.width <= 900;
    camera.position.set(mobile ? 3.35 : 3.8, mobile ? 0.68 : 0.78, mobile ? 5.35 : 5.05);
    camera.lookAt(0, -0.08, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

export function PorscheExperience() {
  const section = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 85, damping: 24, mass: .5 });
  const chapter = useTransform(smooth, [0, .28, .62, 1], [0, 1, 2, 3]);
  const lineScale = useTransform(smooth, [0, 1], [0, 1]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    setMobile(isMobile);
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: "80px 0px" });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearViewport || enabled) return;
    const id = window.setTimeout(() => setEnabled(true), mobile ? 650 : 250);
    return () => window.clearTimeout(id);
  }, [nearViewport, mobile, enabled]);

  useEffect(() => smooth.on("change", value => { progressRef.current = value; }), [smooth]);

  const chapters = [
    ["01", "LIGHT, PERFECTED.", "Paint correction restores the clarity that lets every body line, curve and reflection speak."],
    ["02", "CLARITY, RESTORED.", "Swirls, haze and surface defects are refined panel by panel for deeper color and sharper definition."],
    ["03", "PROTECTION, ENGINEERED.", "Ceramic coating locks in gloss with a slick, hydrophobic barrier built for easier maintenance."],
    ["04", "THE FINISH, REVEALED.", "A showroom-level result delivered to your driveway—precise, protected and unmistakably yours."]
  ];

  return <section ref={section} className="porsche-experience" aria-label="Interactive Porsche detailing experience" onPointerMove={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: ((event.clientX - rect.left) / rect.width - .5) * 2, y: ((event.clientY - rect.top) / rect.height - .5) * 2 };
  }}>
    <div className="porsche-sticky">
      <div className="porsche-fallback" aria-hidden="true" />
      {enabled ? <div className="porsche-canvas">
        <Canvas dpr={mobile ? 0.72 : [0.85, 1]} frameloop={nearViewport ? "always" : "demand"} camera={{ position: [3.8, 0.78, 5.05], fov: 22, near: 0.05, far: 40 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }} performance={{ min: 0.55, max: 1 }}>
          <CameraRig />
          <fog attach="fog" args={["#050607", 4.8, 8.5]} />
          <ambientLight intensity={.35} />
          <spotLight position={[-4, 5, 4]} intensity={48} angle={.44} penumbra={.95} color="#eafaff" />
          <spotLight position={[5, 1, -2]} intensity={32} angle={.58} penumbra={1} color="#54f0cf" />
          <directionalLight position={[0, 3, -4]} intensity={1.7} color="#ffffff" />
          <Suspense fallback={<Loader />}><Porsche progress={progressRef} pointer={pointer} /></Suspense>
        </Canvas>
      </div> : <div className="load-3d" aria-live="polite"><span>Preparing 3D finish study</span><small>Optimized vehicle experience loading automatically</small></div>}
      <div className="porsche-vignette" /><div className="porsche-grid" />
      <div className="porsche-topline"><span>COLE&apos;S / PAINT CORRECTION + CERAMIC</span><span>911 / IMMERSIVE FINISH STUDY</span></div>
      <div className="porsche-wordmark">911</div>
      <div className="porsche-copy-stack">
        {chapters.map(([number, title, copy], index) => <motion.article key={title} style={{ opacity: useTransform(chapter, value => Math.max(0, 1 - Math.abs(value-index)*1.45)), y: useTransform(chapter, value => (value-index)*-38) }}>
          <span>{number}</span><h2>{title}</h2><p>{copy}</p>
        </motion.article>)}
      </div>
      <div className="porsche-progress"><motion.i style={{ scaleY: lineScale }} /><span>SCROLL TO EXPLORE</span></div>
      <div className="model-credit">3D model by Karol Miklas / Lionsharp Studios · CC BY-SA 4.0</div>
    </div>
  </section>;
}


