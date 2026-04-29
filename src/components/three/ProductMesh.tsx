import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Category } from "@/data/products";

interface Props {
  category: Category;
  colors: string[];
  image: string;
  spin?: boolean;
  scale?: number;
}

/**
 * Renders the actual product photo as an animated 3D plane.
 * - Continuous Y rotation (like a slow turntable)
 * - Subtle X tilt oscillation
 * - Floating bob from <Float>
 * - A soft backing disc to ground the photo in 3D space
 */
export const ProductMesh = ({ category, colors, image, spin = true, scale = 1 }: Props) => {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const t = loader.load(image);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [image]);

  // Aspect-aware plane sizing so images don't squish
  const { w, h } = useMemo(() => {
    const img = tex.image as HTMLImageElement | undefined;
    const ar = img && img.width && img.height ? img.width / img.height : 1;
    const base = 2.4;
    return ar >= 1 ? { w: base, h: base / ar } : { w: base * ar, h: base };
  }, [tex]);

  useFrame(() => {
    if (!group.current) return;
    const t = performance.now() * 0.001;
    if (spin) {
      // Gentle oscillating tilt — never edge-on, photo always readable
      group.current.rotation.y = Math.sin(t * 0.8) * 0.35;
    }
    group.current.rotation.x = Math.sin(t * 0.6) * 0.12;
  });

  // Subtle accent halo color from product palette
  const halo = colors[1] || colors[0] || "#c9a0dc";

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
      <group ref={group} scale={scale}>
        {/* Soft backing disc for 3D depth */}
        <mesh position={[0, 0, -0.08]}>
          <circleGeometry args={[Math.max(w, h) * 0.62, 64]} />
          <meshStandardMaterial color={halo} roughness={0.6} metalness={0.1} transparent opacity={0.18} />
        </mesh>

        {/* Product photo — visible from BOTH sides so back never looks blank */}
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            map={tex}
            roughness={0.45}
            metalness={0.15}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
};
