import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Category } from "@/data/products";

interface Props {
  category: Category;
  colors: string[];
  spin?: boolean;
  scale?: number;
}

/** A bracelet — a torus of small pearl spheres orbiting a thin band */
const Bracelet = ({ colors, spin = true }: { colors: string[]; spin?: boolean }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin && group.current) group.current.rotation.y += dt * 0.5;
    if (group.current) group.current.rotation.x = Math.sin(performance.now() * 0.0005) * 0.15;
  });
  const beads = 28;
  const radius = 1.15;
  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.04, 16, 80]} />
        <meshStandardMaterial color={colors[1] || "#c9a0dc"} metalness={0.85} roughness={0.2} />
      </mesh>
      {Array.from({ length: beads }).map((_, i) => {
        const a = (i / beads) * Math.PI * 2;
        const c = colors[i % colors.length];
        return (
          <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshPhysicalMaterial
              color={c}
              metalness={0.2}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.05}
              sheen={1}
              sheenColor={colors[2] || "#ffffff"}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/** A pen — long capped cylinder spinning on its own axis */
const Pen = ({ colors, spin = true }: { colors: string[]; spin?: boolean }) => {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin && group.current) {
      group.current.rotation.z += dt * 0.8;
      group.current.rotation.y = Math.sin(performance.now() * 0.0006) * 0.4;
    }
  });
  const body = colors[0] || "#c9a0dc";
  const accent = colors[1] || "#9b72cf";
  const ring = colors[2] || "#f8e8ee";
  return (
    <group ref={group} rotation={[0, 0, Math.PI / 6]}>
      {/* Barrel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 48]} />
        <meshPhysicalMaterial color={body} metalness={0.3} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.55, 48]} />
        <meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Clip */}
      <mesh position={[0.13, 1.0, 0]}>
        <boxGeometry args={[0.04, 0.4, 0.06]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Decorative ring */}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.13, 0.025, 16, 48]} />
        <meshStandardMaterial color={ring} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Tip cone */}
      <mesh position={[0, -1.0, 0]}>
        <coneGeometry args={[0.12, 0.35, 32]} />
        <meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Nib */}
      <mesh position={[0, -1.22, 0]}>
        <coneGeometry args={[0.025, 0.12, 16]} />
        <meshStandardMaterial color="#3a2a3a" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
};

/** A keychain — ring + dangling charm with pendulum swing */
const Keychain = ({ colors, spin = true }: { colors: string[]; spin?: boolean }) => {
  const swing = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = performance.now() * 0.002;
    if (swing.current) swing.current.rotation.z = Math.sin(t) * 0.5;
    if (ring.current && spin) ring.current.rotation.x = Math.sin(t * 0.7) * 0.4;
  });
  return (
    <group position={[0, 0.6, 0]}>
      {/* Top ring */}
      <mesh ref={ring} position={[0, 0.2, 0]}>
        <torusGeometry args={[0.32, 0.06, 16, 48]} />
        <meshStandardMaterial color={colors[1] || "#9b72cf"} metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Chain links */}
      <group ref={swing} position={[0, -0.1, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, -i * 0.18, 0]} rotation={[i % 2 ? 0 : Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.022, 12, 24]} />
            <meshStandardMaterial color={colors[2] || "#e8c5d0"} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Charm — flower-ish */}
        <group position={[0, -1.0, 0]}>
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshPhysicalMaterial color={colors[0] || "#c9a0dc"} metalness={0.1} roughness={0.25} clearcoat={1} sheen={1} sheenColor={colors[2] || "#ffffff"} />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0]}>
                <sphereGeometry args={[0.14, 24, 24]} />
                <meshPhysicalMaterial color={colors[i % colors.length]} clearcoat={1} roughness={0.3} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
};

export const ProductMesh = ({ category, colors, spin = true, scale = 1 }: Props) => {
  const inner =
    category === "bracelets" ? <Bracelet colors={colors} spin={spin} /> :
    category === "pens" ? <Pen colors={colors} spin={spin} /> :
    <Keychain colors={colors} spin={spin} />;

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group scale={scale}>{inner}</group>
    </Float>
  );
};
