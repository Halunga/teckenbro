"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { SignEntry } from "@/lib/types";

type AvatarPanelProps = {
  signs: SignEntry[];
};

function createHand(material: THREE.Material, mirrored = false) {
  const hand = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.9, 0.22), material);
  palm.position.y = -0.15;
  hand.add(palm);

  const fingerX = [-0.27, -0.09, 0.09, 0.27];
  fingerX.forEach((x, index) => {
    const length = index === 0 || index === 3 ? 0.62 : 0.76;
    const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, length, 6, 12), material);
    finger.position.set(x, 0.55 + length * 0.12, 0);
    hand.add(finger);
  });

  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.52, 6, 12), material);
  thumb.position.set(mirrored ? 0.48 : -0.48, -0.02, 0);
  thumb.rotation.z = mirrored ? -0.85 : 0.85;
  hand.add(thumb);

  return hand;
}

export function AvatarPanel({ signs }: AvatarPanelProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const activeSign = signs[currentStep];

  useEffect(() => {
    setCurrentStep(0);

    if (signs.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentStep((step) => (step + 1) % signs.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [signs]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / 360, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const handMaterial = new THREE.MeshStandardMaterial({
      color: "#e9ad8d",
      roughness: 0.58,
      metalness: 0.02
    });

    renderer.setSize(mount.clientWidth, 360);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    camera.position.set(0, 0.25, 5.7);
    scene.add(new THREE.HemisphereLight("#ffffff", "#445f53", 2.2));

    const keyLight = new THREE.DirectionalLight("#fff2e8", 2.8);
    keyLight.position.set(2, 4, 5);
    scene.add(keyLight);

    const leftHand = createHand(handMaterial);
    const rightHand = createHand(handMaterial, true);
    leftHand.position.x = -1.05;
    rightHand.position.x = 1.05;
    scene.add(leftHand, rightHand);

    let frameId = 0;
    const startedAt = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const pulse = Math.sin(elapsed * 4.5);
      const sequenceIndex = signs.length > 0 ? Math.floor(elapsed / 2.2) % signs.length : 0;
      const animationKey = signs[sequenceIndex]?.animationKey ?? "";

      leftHand.position.set(-1.05, 0, 0);
      rightHand.position.set(1.05, 0, 0);
      leftHand.rotation.set(0, 0, 0);
      rightHand.rotation.set(0, 0, 0);

      if (animationKey.includes("jag") || animationKey.includes("vilja")) {
        leftHand.position.x += pulse * 0.18;
        rightHand.position.x -= pulse * 0.18;
      } else if (animationKey.includes("du") || animationKey.includes("tack")) {
        leftHand.position.z = pulse * 0.35;
        rightHand.position.z = pulse * 0.35;
      } else if (animationKey.includes("skola") || animationKey.includes("arbete")) {
        leftHand.position.x += pulse * 0.3;
        rightHand.position.x -= pulse * 0.3;
        leftHand.rotation.z = 0.25;
        rightHand.rotation.z = -0.25;
      } else if (animationKey.includes("imorgon")) {
        rightHand.position.y = Math.sin(elapsed * 3) * 0.35;
        rightHand.position.x = 0.7 + Math.cos(elapsed * 3) * 0.35;
      } else {
        leftHand.position.y = pulse * 0.22;
        rightHand.position.y = -pulse * 0.22;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / 360;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, 360);
    });

    resizeObserver.observe(mount);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [signs]);

  return (
    <section className="overflow-hidden rounded-lg border border-ink/10 bg-ink shadow-soft">
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Hand movement</p>
          <h2 className="mt-1 text-xl font-semibold">{activeSign?.gloss ?? "READY"}</h2>
        </div>
        <div className="text-right">
          <p className="max-w-40 truncate text-sm font-semibold">{activeSign?.transcription ?? "READY"}</p>
          <p className="text-xs text-white/55">STS transcription</p>
        </div>
      </div>
      <div ref={mountRef} className="h-[360px] overflow-hidden bg-mist" />
      <div className="flex gap-1.5 px-4 py-3">
        {signs.map((sign, index) => (
          <span
            key={sign.id}
            className={`h-1.5 flex-1 rounded-full ${index === currentStep ? "bg-clay" : "bg-white/20"}`}
          />
        ))}
      </div>
    </section>
  );
}
