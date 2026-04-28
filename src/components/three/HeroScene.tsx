import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { ProductMesh } from "./ProductMesh";
import { products } from "@/data/products";

const heroBracelet = products.find(p => p.category === "bracelets")!;
const heroPen = products.find(p => p.category === "pens")!;
const heroKeychain = products.find(p => p.category === "keychains")!;

export const HeroScene = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.5, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 3]} intensity={1.2} color="#fde6f0" />
        <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#c9a0dc" />
        <Suspense fallback={null}>
          <group position={[-2.2, 0.4, 0]} scale={0.85}>
            <ProductMesh category="bracelets" colors={heroBracelet.colors} image={heroBracelet.image} />
          </group>
          <group position={[0, -0.2, 0.4]} scale={1}>
            <ProductMesh category="pens" colors={heroPen.colors} image={heroPen.image} />
          </group>
          <group position={[2.3, 0.5, -0.2]} scale={0.9}>
            <ProductMesh category="keychains" colors={heroKeychain.colors} image={heroKeychain.image} />
          </group>
          <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
            <mesh position={[-3.4, 1.6, -1]}>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshPhysicalMaterial color="#fde6f0" clearcoat={1} roughness={0.2} />
            </mesh>
          </Float>
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
            <mesh position={[3.2, -1.3, -1]}>
              <sphereGeometry args={[0.12, 32, 32]} />
              <meshPhysicalMaterial color="#c9a0dc" clearcoat={1} roughness={0.2} />
            </mesh>
          </Float>
          <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={10} blur={3} far={3} color="#9b72cf" />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};
