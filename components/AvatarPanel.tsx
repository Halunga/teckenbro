"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type AvatarPanelProps = {
  activeAnimationKeys: string[];
};

export function AvatarPanel({ activeAnimationKeys }: AvatarPanelProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / 280, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: "#b95f49" });
    const headMaterial = new THREE.MeshStandardMaterial({ color: "#f1c7ad" });
    const armMaterial = new THREE.MeshStandardMaterial({ color: "#445f53" });

    renderer.setSize(mount.clientWidth, 280);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    camera.position.set(0, 1.4, 5);
    scene.add(new THREE.AmbientLight("#ffffff", 1.8));

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.25, 8, 16), bodyMaterial);
    body.position.y = 0.25;
    scene.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 32), headMaterial);
    head.position.y = 1.35;
    scene.add(head);

    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 1.1, 8, 16), armMaterial);
    leftArm.position.set(-0.72, 0.45, 0);
    leftArm.rotation.z = -0.6;
    scene.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 1.1, 8, 16), armMaterial);
    rightArm.position.set(0.72, 0.45, 0);
    rightArm.rotation.z = 0.6;
    scene.add(rightArm);

    let frameId = 0;
    const animate = () => {
      const hasSequence = activeAnimationKeys.length > 0;
      const pulse = Math.sin(Date.now() * 0.004) * (hasSequence ? 0.2 : 0.06);

      leftArm.rotation.z = -0.6 - pulse;
      rightArm.rotation.z = 0.6 + pulse;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / 280;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, 280);
    });

    resizeObserver.observe(mount);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [activeAnimationKeys]);

  return (
    <section className="rounded-lg border border-ink/10 bg-white/75 p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Avatar preview</h2>
          <p className="text-sm text-ink/65">Three.js placeholder ready for future 3D signing animations.</p>
        </div>
        <span className="rounded-md bg-mist px-3 py-1 text-xs font-medium text-moss">
          {activeAnimationKeys.length} motions
        </span>
      </div>
      <div ref={mountRef} className="h-[280px] overflow-hidden rounded-lg bg-mist" />
    </section>
  );
}
