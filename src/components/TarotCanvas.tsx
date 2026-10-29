import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DrawnCard, SpreadData } from '../types/tarot';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { Camera, RefreshCw, ZoomIn, ZoomOut, Layers, Sparkles } from 'lucide-react';

interface TarotCanvasProps {
  drawnCards: DrawnCard[];
  spread: SpreadData;
  onCardClick: (cardIndex: number) => void;
  onDrawNextCard: () => void;
  isReadingFinished: boolean;
  deckRemainingCount: number;
  isCuttingDeck?: boolean;
  cutPreviewCards?: DrawnCard[];
  onCutDeckComplete?: (stackIndex: number, undercurrentCard?: DrawnCard) => void;
}

interface CardMeshRecord {
  mesh: THREE.Group;
  cardIndex: number;
  targetPosition: THREE.Vector3;
  targetRotation: THREE.Euler;
  currentFlipped: boolean;
  hovered: boolean;
}

interface CutStackRecord {
  group: THREE.Group;
  topMesh: THREE.Mesh;
  stackIndex: number;
  targetPosition: THREE.Vector3;
  targetRotation: THREE.Euler;
  hovered: boolean;
  isClicked: boolean;
  glowMesh: THREE.Mesh;
}

// Function to calculate exact 3D world coordinates for each spread
function getSpread3DPosition(
  spreadId: string,
  index: number,
  totalCount: number,
  isMobile: boolean = false
): { x: number; y: number; z: number; rotZ: number } {
  const scale = isMobile ? 0.70 : 1.0;
  const zOffset = isMobile ? -1.4 : 0;

  // 1. Single Card
  if (totalCount === 1 || spreadId.includes('single')) {
    return { x: 0, y: 0.05, z: isMobile ? -0.8 : 0, rotZ: 0 };
  }

  // 2. 3-Card spreads (Past-Present-Future, Mind-Body-Spirit, Situation-Action-Outcome)
  if (totalCount === 3 || spreadId.includes('past-present-future') || spreadId.includes('mind-body-spirit') || spreadId.includes('situation-action-outcome')) {
    const spacing = isMobile ? 2.3 : 3.2;
    const x = (index - 1) * spacing;
    return { x, y: 0.05, z: isMobile ? -0.8 : 0, rotZ: 0 };
  }

  // 3. 4-Card Decision
  if (spreadId.includes('decision') || totalCount === 4) {
    const coords = [
      { x: -3.2 * scale, y: 0.05, z: -1.6 + zOffset, rotZ: 0 }, // Option A
      { x: 3.2 * scale, y: 0.05, z: -1.6 + zOffset, rotZ: 0 },  // Option B
      { x: -1.6 * scale, y: 0.05, z: 2.0 + zOffset, rotZ: 0 },  // What Helps
      { x: 1.6 * scale, y: 0.05, z: 2.0 + zOffset, rotZ: 0 },   // What Hinders
    ];
    return coords[index] || { x: (index - 1.5) * 2.2 * scale, y: 0.05, z: zOffset, rotZ: 0 };
  }

  // 4. 5-Card Cross
  if (spreadId.includes('cross') && totalCount === 5) {
    const coords = [
      { x: 0, y: 0.05, z: zOffset, rotZ: 0 },                  // Center
      { x: 0, y: 0.05, z: -3.0 * scale + zOffset, rotZ: 0 },   // Top (Challenge)
      { x: -3.0 * scale, y: 0.05, z: zOffset, rotZ: 0 },       // Left (Past)
      { x: 3.0 * scale, y: 0.05, z: zOffset, rotZ: 0 },        // Right (Future)
      { x: 0, y: 0.05, z: 3.0 * scale + zOffset, rotZ: 0 },    // Bottom (Advice)
    ];
    return coords[index] || { x: 0, y: 0.05, z: zOffset, rotZ: 0 };
  }

  // 5. 6-Card Relationship
  if (spreadId.includes('relationship') || totalCount === 6) {
    const coords = [
      { x: -3.2 * scale, y: 0.05, z: -1.8 + zOffset, rotZ: 0 }, // You
      { x: 3.2 * scale, y: 0.05, z: -1.8 + zOffset, rotZ: 0 },  // Them
      { x: 0, y: 0.05, z: -1.8 + zOffset, rotZ: 0 },            // Connection
      { x: -3.2 * scale, y: 0.05, z: 1.8 + zOffset, rotZ: 0 },  // Past Foundation
      { x: 0, y: 0.05, z: 1.8 + zOffset, rotZ: 0 },             // Present State
      { x: 3.2 * scale, y: 0.05, z: 1.8 + zOffset, rotZ: 0 },   // Future Potential
    ];
    return coords[index] || { x: (index - 2.5) * 2.0 * scale, y: 0.05, z: zOffset, rotZ: 0 };
  }

  // 6. 7-Card Horseshoe (Parabolic U-curve)
  if (spreadId.includes('horseshoe') || totalCount === 7) {
    const angles = [160, 135, 110, 90, 70, 45, 20]; // Degrees
    const rad = (angles[index] * Math.PI) / 180;
    const R = isMobile ? 3.8 : 5.2;
    const x = -R * Math.cos(rad);
    const z = -R * Math.sin(rad) + (isMobile ? 0.6 : 1.8);
    const rotZ = (angles[index] - 90) * 0.008;
    return { x, y: 0.05, z, rotZ };
  }

  // 7. 10-Card Celtic Cross (The classic Arthur Edward Waite Layout)
  if (spreadId.includes('celtic') || totalCount === 10) {
    const cScale = isMobile ? 0.62 : 1.0;
    const coords = [
      { x: -2.6 * cScale, y: 0.05, z: zOffset, rotZ: 0 },              // 1. Present
      { x: -2.6 * cScale, y: 0.14, z: zOffset, rotZ: Math.PI / 2 },    // 2. Challenge (Crossed Horizontally!)
      { x: -2.6 * cScale, y: 0.05, z: 2.8 * scale + zOffset, rotZ: 0 },// 3. Foundation / Below
      { x: -5.4 * cScale, y: 0.05, z: zOffset, rotZ: 0 },              // 4. Past / Behind
      { x: -2.6 * cScale, y: 0.05, z: -2.8 * scale + zOffset, rotZ: 0 },// 5. Crown / Above
      { x: 0.2 * cScale, y: 0.05, z: zOffset, rotZ: 0 },               // 6. Future / Ahead
      { x: 4.2 * cScale, y: 0.05, z: 3.6 * scale + zOffset, rotZ: 0 }, // 7. Yourself
      { x: 4.2 * cScale, y: 0.05, z: 1.2 * scale + zOffset, rotZ: 0 }, // 8. Environment
      { x: 4.2 * cScale, y: 0.05, z: -1.2 * scale + zOffset, rotZ: 0 },// 9. Hopes & Fears
      { x: 4.2 * cScale, y: 0.05, z: -3.6 * scale + zOffset, rotZ: 0 },// 10. Final Outcome
    ];
    return coords[index] || { x: 0, y: 0.05, z: zOffset, rotZ: 0 };
  }

  // 8. 12-Card Year Ahead (Astrological Zodiac Wheel)
  if (spreadId.includes('year') || totalCount === 12) {
    const angle = ((index - 3) * (360 / 12) * Math.PI) / 180;
    const R = isMobile ? 3.8 : 5.8;
    const x = R * Math.cos(angle);
    const z = R * Math.sin(angle) + zOffset;
    return { x, y: 0.05, z, rotZ: -angle + Math.PI / 2 };
  }

  // Fallback linear
  const spacing = isMobile ? 2.0 : 2.8;
  const x = (index - (totalCount - 1) / 2) * spacing;
  return { x, y: 0.05, z: zOffset, rotZ: 0 };
}

export const TarotCanvas: React.FC<TarotCanvasProps> = ({
  drawnCards,
  spread,
  onCardClick,
  onDrawNextCard,
  isReadingFinished,
  deckRemainingCount,
  isCuttingDeck = false,
  cutPreviewCards = [],
  onCutDeckComplete,
}) => {
  const { language, t } = useLanguage();
  const [revealedUndercurrent, setRevealedUndercurrent] = useState<DrawnCard | null>(null);
  const [isIntroRunning, setIsIntroRunning] = useState<boolean>(true);
  const introRunningRef = useRef<boolean>(true);
  const introStartTimeRef = useRef<number | null>(null);
  const introCardsGroupRef = useRef<THREE.Group | null>(null);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cardMeshesRef = useRef<CardMeshRecord[]>([]);
  const cutStacksRef = useRef<CutStackRecord[]>([]);
  const isCuttingAnimatingRef = useRef<boolean>(false);
  const deckMeshRef = useRef<THREE.Group | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Helper to load texture with cache and full sRGB color space + anisotropy
  const getTexture = (url: string): THREE.Texture => {
    if (textureCacheRef.current.has(url)) {
      return textureCacheRef.current.get(url)!;
    }
    const tex = textureLoaderRef.current.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textureCacheRef.current.set(url, tex);
    return tex;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x07050f, 0.02);

    // 2. Camera setup - starts high in the cosmic vortex for intro
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;
    camera.position.set(0, 24, 28);
    camera.lookAt(0, 4.5, 0);

    // Initialize Intro
    introStartTimeRef.current = performance.now();
    introRunningRef.current = true;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (Bounded for comfortable Tarot examination)
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.15; // Don't look below table
    controls.minDistance = 6;
    controls.maxDistance = 25;
    controls.target.set(0, 0, -0.5);

    // 5. High-Clarity Mystic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const overheadSun = new THREE.DirectionalLight(0xfffaed, 2.4);
    overheadSun.position.set(0, 20, 5);
    scene.add(overheadSun);

    const mainSpotLight = new THREE.SpotLight(0xfff6dc, 3.4);
    mainSpotLight.position.set(0, 24, 6);
    mainSpotLight.angle = Math.PI / 3.2;
    mainSpotLight.penumbra = 0.6;
    mainSpotLight.castShadow = true;
    scene.add(mainSpotLight);

    const violetLight = new THREE.PointLight(0xa855f7, 2.5, 35);
    violetLight.position.set(-12, 12, -4);
    scene.add(violetLight);

    const goldLight = new THREE.PointLight(0xfbbf24, 2.2, 35);
    goldLight.position.set(12, 12, -4);
    scene.add(goldLight);

    // 6. Mystic Velvet Table Surface
    const tableGeo = new THREE.CylinderGeometry(20, 20, 0.4, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0e0922,
      roughness: 0.85,
      metalness: 0.12,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.2;
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // Golden Sacred Geometry Outer Rings
    const ringGeo1 = new THREE.RingGeometry(9.2, 9.35, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xdfb76c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.01;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(13.8, 13.9, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x7352f2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.01;
    scene.add(ring2);

    // 7. Floating Celestial Nebula Glowing Star Particles (Crisp & Micro-sized)
    const createStarTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Sharp bright core with soft celestial aura
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 56);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.15, 'rgba(255, 245, 200, 0.95)');
      gradient.addColorStop(0.4, 'rgba(216, 180, 254, 0.45)');
      gradient.addColorStop(0.8, 'rgba(147, 51, 234, 0.12)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      // Diamond pinpoint cross sparkle flare
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(64, 16);
      ctx.lineTo(64, 112);
      ctx.moveTo(16, 64);
      ctx.lineTo(112, 64);
      ctx.stroke();

      // Diagonal minor rays
      ctx.strokeStyle = 'rgba(250, 232, 255, 0.5)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(32, 32);
      ctx.lineTo(96, 96);
      ctx.moveTo(96, 32);
      ctx.lineTo(32, 96);
      ctx.stroke();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createStarTexture();
    const particleCount = 650;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;
      particlePositions[i + 1] = Math.random() * 24;
      particlePositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      map: starTexture,
      color: 0xffffff,
      size: 0.22,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. 3D Deck Stack (Placed at Center-Lower on Mobile well below spread cards, Bottom-Right on Desktop)
    const isMobileInitial = container.clientWidth < 768;
    const deckGroup = new THREE.Group();
    deckMeshRef.current = deckGroup;
    deckGroup.position.set(isMobileInitial ? 0 : 8.5, 0.35, isMobileInitial ? 4.5 : 6.5);
    deckGroup.rotation.y = isMobileInitial ? 0 : -Math.PI / 7;

    const cardBackTex = getTexture('/cards/card-back.png');
    const standardCardGeo = new THREE.BoxGeometry(2.5, 0.035, 4.3);
    const standardEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xdfb76c,
      metalness: 0.85,
      roughness: 0.25,
    });
    const standardBackMat = new THREE.MeshStandardMaterial({
      map: cardBackTex,
      roughness: 0.35,
      metalness: 0.1,
    });
    const standardCardMaterials = [
      standardEdgeMat,
      standardEdgeMat,
      standardBackMat,
      standardBackMat,
      standardEdgeMat,
      standardEdgeMat,
    ];

    for (let i = 0; i < 14; i++) {
      const layer = new THREE.Mesh(standardCardGeo, standardCardMaterials);
      layer.position.y = i * 0.035;
      layer.rotation.y = (Math.random() - 0.5) * 0.03;
      layer.castShadow = true;
      deckGroup.add(layer);
    }
    deckGroup.visible = false; // Hidden initially during intro until cards assemble
    scene.add(deckGroup);

    // 8.5 Intro Swirling Vortex Cards (28 floating cards in cosmic helix stream - identical material & color to deck)
    const introCardsGroup = new THREE.Group();
    introCardsGroupRef.current = introCardsGroup;
    scene.add(introCardsGroup);

    const vortexCardCount = 28;
    for (let i = 0; i < vortexCardCount; i++) {
      const cardMesh = new THREE.Mesh(standardCardGeo, standardCardMaterials);
      cardMesh.castShadow = true;
      introCardsGroup.add(cardMesh);
    }

    // 9. Render & Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Controls update
      controls.update();

      // Slow galaxy rotation
      particles.rotation.y = elapsedTime * 0.015;

      // Smooth interpolation for drawn cards
      cardMeshesRef.current.forEach((item) => {
        // Position lerp
        const hoverLift = item.hovered ? 0.35 : 0;
        const targetWithHover = new THREE.Vector3(
          item.targetPosition.x,
          item.targetPosition.y + hoverLift,
          item.targetPosition.z
        );
        item.mesh.position.lerp(targetWithHover, 0.1);

        // Quaternion slerp for ultra-smooth 3D flips
        item.mesh.quaternion.slerp(
          new THREE.Quaternion().setFromEuler(item.targetRotation),
          0.1
        );
      });

      // Smooth interpolation & hover effects for 3D Cut Stacks
      cutStacksRef.current.forEach((item) => {
        const lift = item.isClicked ? 0.6 : item.hovered ? 0.4 : 0;
        const targetWithHover = new THREE.Vector3(
          item.targetPosition.x,
          item.targetPosition.y + lift,
          item.targetPosition.z
        );
        item.group.position.lerp(targetWithHover, 0.12);

        // Keep stack stable and aligned so the card artwork is clearly visible
        item.group.rotation.y = THREE.MathUtils.lerp(item.group.rotation.y, 0, 0.1);
        item.group.rotation.x = THREE.MathUtils.lerp(item.group.rotation.x, 0, 0.1);

        // Pulse glow halo
        if (item.glowMesh && item.glowMesh.material) {
          const mat = item.glowMesh.material as THREE.MeshBasicMaterial;
          mat.opacity = item.isClicked ? 0.9 : item.hovered ? 0.75 : 0.35 + Math.sin(elapsedTime * 2.5) * 0.1;
        }
      });

      // Subtle float animation on deck
      if (deckMeshRef.current) {
        deckMeshRef.current.position.y = 0.35 + Math.sin(elapsedTime * 2.2) * 0.04;
      }

      // 3D Intro Cinematic Camera & Flying Vortex Cards Animation
      if (introRunningRef.current && introStartTimeRef.current !== null && introCardsGroupRef.current) {
        const introElapsed = (performance.now() - introStartTimeRef.current) / 1000;
        const INTRO_DURATION = 3.6;
        const t = Math.min(1, introElapsed / INTRO_DURATION);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const isMobile = container.clientWidth < 768;
        const startCamPos = new THREE.Vector3(0, 24, 28);
        const endCamPos = new THREE.Vector3(0, isMobile ? 22 : 16, isMobile ? 16.5 : 14);
        camera.position.lerpVectors(startCamPos, endCamPos, ease);

        const lookAtY = THREE.MathUtils.lerp(4.5, isMobile ? 0.8 : -0.5, ease);
        controls.target.set(0, 0, isMobile ? 0.8 : -0.5);

        // Swirl vortex cards
        introCardsGroup.children.forEach((obj, i) => {
          const cardMesh = obj as THREE.Mesh;
          const theta = elapsedTime * 1.8 + (i * Math.PI * 2) / vortexCardCount;
          const height = Math.sin(elapsedTime * 2.2 + i * 0.4) * 2.5 + 4.5;
          const currentRadius = THREE.MathUtils.lerp(12 - (i % 4) * 1.2, 0.4, ease);

          const vortexPos = new THREE.Vector3(
            Math.cos(theta) * currentRadius,
            height * (1 - ease) + 0.35,
            Math.sin(theta) * currentRadius
          );
          const vortexRot = new THREE.Euler(
            Math.sin(elapsedTime + i) * 0.4,
            -theta + Math.PI / 2,
            Math.cos(elapsedTime * 1.5 + i) * 0.3
          );

          // Converge to actual deck position
          const deckTargetPos = new THREE.Vector3(
            isMobile ? 0 : 8.5,
            0.35 + (i % 14) * 0.035,
            isMobile ? 4.5 : 6.5
          );
          const deckTargetRot = new THREE.Euler(0, isMobile ? 0 : -Math.PI / 7, 0);

          // Converge to deck during the second half of intro
          const convergeStart = 0.32;
          const convergeProgress = Math.max(0, (t - convergeStart) / (1 - convergeStart));
          const cardEase = convergeProgress < 0.5
            ? 2 * convergeProgress * convergeProgress
            : 1 - Math.pow(-2 * convergeProgress + 2, 2) / 2;

          cardMesh.position.lerpVectors(vortexPos, deckTargetPos, cardEase);
          cardMesh.rotation.x = THREE.MathUtils.lerp(vortexRot.x, deckTargetRot.x, cardEase);
          cardMesh.rotation.y = THREE.MathUtils.lerp(vortexRot.y, deckTargetRot.y, cardEase);
          cardMesh.rotation.z = THREE.MathUtils.lerp(vortexRot.z, deckTargetRot.z, cardEase);
        });

        // Only reveal the solid deck stack as the swirling cards converge if not in cut deck step
        if (deckMeshRef.current) {
          deckMeshRef.current.visible = t >= 0.88 && !isCuttingDeck;
        }

        if (t >= 1) {
          introRunningRef.current = false;
          setIsIntroRunning(false);
          if (introCardsGroupRef.current) {
            introCardsGroupRef.current.visible = false;
          }
          if (deckMeshRef.current) {
            deckMeshRef.current.visible = !isCuttingDeck;
          }
          sound.playTibetanBowl();
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;

      const isMobile = width < 768;
      if (isMobile) {
        // Dedicated mobile camera lifted up to give maximum space for multi-card spreads
        camera.position.set(0, 24.5, 15.5);
        camera.fov = 60;
        if (controlsRef.current) controlsRef.current.target.set(0, 0, 0.3);
        if (deckMeshRef.current) {
          deckMeshRef.current.position.set(0, 0.35, 4.5);
          deckMeshRef.current.rotation.y = 0;
        }
      } else {
        camera.position.set(0, 16, 14);
        camera.fov = 45;
        if (controlsRef.current) controlsRef.current.target.set(0, 0, -0.5);
        if (deckMeshRef.current) {
          deckMeshRef.current.position.set(8.5, 0.35, 6.5);
          deckMeshRef.current.rotation.y = -Math.PI / 7;
        }
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update cards in 3D scene whenever drawnCards or spread layout changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const backTex = getTexture('/cards/card-back.png');

    const cardWidth = 2.5;
    const cardHeight = 4.3;
    const cardThickness = 0.04;

    // Remove old card meshes if total count decreased
    while (cardMeshesRef.current.length > drawnCards.length) {
      const removed = cardMeshesRef.current.pop();
      if (removed) {
        scene.remove(removed.mesh);
      }
    }

    const isMobile = mountRef.current ? mountRef.current.clientWidth < 768 : false;
    drawnCards.forEach((card, idx) => {
      let cardRecord = cardMeshesRef.current[idx];

      // Calculate exact 3D coordinates based on spread layout
      const pos3D = getSpread3DPosition(
        spread.layout_id || spread.name.toLowerCase(),
        idx,
        spread.card_count || drawnCards.length,
        isMobile
      );

      const targetPos = new THREE.Vector3(pos3D.x, pos3D.y + idx * 0.012, pos3D.z);

      // Target Rotation (Flat on the table, matching Step 3):
      // When face down (isFlipped = false): rotX = Math.PI (back face visible from above)
      // When face up (isFlipped = true): rotX = 0 (front artwork clearly visible from above)
      // In-plane rotation (rotY) handles spread layout angle & reversals
      const isFlipped = card.isFlipped;
      const rotX = isFlipped ? 0 : Math.PI;
      const rotY = pos3D.rotZ + (card.orientation === 'reversed' ? Math.PI : 0);
      const targetRot = new THREE.Euler(rotX, rotY, 0, 'YXZ');

      if (!cardRecord) {
        // Create new 3D Card Mesh Group
        const group = new THREE.Group();
        // Fly from deck position flat with a smooth dealing trajectory
        group.position.set(isMobile ? 0 : 8.5, 1.5, isMobile ? 4.5 : 6.5);
        group.rotation.set(Math.PI, 0, (Math.random() - 0.5) * 0.1);

        // Front Face (Vibrant Tarot Artwork with Self-Illuminating Clarity)
        const frontTex = getTexture(card.cardData.image || '/cards/card-back.png');
        const frontMat = new THREE.MeshStandardMaterial({
          map: frontTex,
          roughness: 0.15,
          metalness: 0.05,
          emissive: new THREE.Color(0xffffff),
          emissiveMap: frontTex,
          emissiveIntensity: 0.35,
        });

        // Back Face
        const backMat = new THREE.MeshStandardMaterial({
          map: backTex,
          roughness: 0.25,
          metalness: 0.08,
          emissive: new THREE.Color(0xffffff),
          emissiveMap: backTex,
          emissiveIntensity: 0.15,
        });

        // Golden Beveled Edge
        const edgeMat = new THREE.MeshStandardMaterial({
          color: 0xdfb76c,
          metalness: 0.9,
          roughness: 0.2,
        });

        // 6 box materials: [right, left, top (front), bottom (back), front, back]
        const cardGeo = new THREE.BoxGeometry(cardWidth, cardThickness, cardHeight);
        const materials = [edgeMat, edgeMat, frontMat, backMat, edgeMat, edgeMat];

        const mesh = new THREE.Mesh(cardGeo, materials);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        (mesh as any).cardIndex = idx;

        group.add(mesh);
        scene.add(group);

        cardRecord = {
          mesh: group,
          cardIndex: idx,
          targetPosition: targetPos,
          targetRotation: targetRot,
          currentFlipped: isFlipped,
          hovered: false,
        };
        cardMeshesRef.current.push(cardRecord);

        sound.playCardDraw();
      } else {
        // Update existing mesh coordinates & flip state
        cardRecord.targetPosition.copy(targetPos);
        cardRecord.targetRotation.copy(targetRot);

        if (cardRecord.currentFlipped !== isFlipped) {
          cardRecord.currentFlipped = isFlipped;
          sound.playCardFlip();
        }
      }
    });
  }, [drawnCards, spread]);

  // Handle 3D Cut Deck Stacks in Three.js Scene
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const backTex = getTexture('/cards/card-back.png');
    const isMobile = mountRef.current ? mountRef.current.clientWidth < 768 : false;
    const cardWidth = isMobile ? 1.9 : 2.5;
    const cardHeight = isMobile ? 3.3 : 4.3;
    const cardThickness = 0.035;

    // Clean up existing cut stacks
    cutStacksRef.current.forEach((item) => {
      scene.remove(item.group);
    });
    cutStacksRef.current = [];

    if (isCuttingDeck) {
      setRevealedUndercurrent(null);
      // Hide main deck while presenting the 3 cut stacks
      if (deckMeshRef.current) {
        deckMeshRef.current.visible = false;
      }
      const stackConfigs = isMobile
        ? [
            { idx: 0, x: -2.7, z: 0.0, nameVi: 'Tụ 1: Tiềm Thức', nameEn: 'Stack 1: Subconscious' },
            { idx: 1, x: 0.0, z: 0.0, nameVi: 'Tụ 2: Hiện Thực', nameEn: 'Stack 2: Reality' },
            { idx: 2, x: 2.7, z: 0.0, nameVi: 'Tụ 3: Tương Lai', nameEn: 'Stack 3: Future' },
          ]
        : [
            { idx: 0, x: -4.0, z: 0.0, nameVi: 'Tụ 1: Tiềm Thức', nameEn: 'Stack 1: Subconscious' },
            { idx: 1, x: 0.0, z: 0.0, nameVi: 'Tụ 2: Hiện Thực', nameEn: 'Stack 2: Reality' },
            { idx: 2, x: 4.0, z: 0.0, nameVi: 'Tụ 3: Tương Lai', nameEn: 'Stack 3: Future' },
          ];

      stackConfigs.forEach((cfg) => {
        const group = new THREE.Group();
        group.position.set(isMobile ? 0 : 8.5, 0.35, isMobile ? 4.5 : 6.5);

        const edgeMat = new THREE.MeshStandardMaterial({
          color: 0xdfb76c,
          metalness: 0.9,
          roughness: 0.2,
        });
        const backMat = new THREE.MeshStandardMaterial({
          map: backTex,
          roughness: 0.35,
          metalness: 0.1,
        });
        const cardGeo = new THREE.BoxGeometry(cardWidth, cardThickness, cardHeight);
        const defaultMaterials = [edgeMat, edgeMat, backMat, backMat, edgeMat, edgeMat];

        let topMeshRef: THREE.Mesh | null = null;

        // Layer 7 physical cards in each stack
        for (let i = 0; i < 7; i++) {
          let materials = defaultMaterials;
          const isTop = i === 6;

          if (isTop && cutPreviewCards[cfg.idx]) {
            const frontTex = getTexture(cutPreviewCards[cfg.idx].cardData.image || '/cards/card-back.png');
            const frontMat = new THREE.MeshStandardMaterial({
              map: frontTex,
              roughness: 0.15,
              metalness: 0.05,
              emissive: new THREE.Color(0xffffff),
              emissiveMap: frontTex,
              emissiveIntensity: 0.35,
            });
            // Face-down initially: top is back, bottom is front
            materials = [edgeMat, edgeMat, backMat, frontMat, edgeMat, edgeMat];
          }

          const mesh = new THREE.Mesh(cardGeo, materials);
          mesh.position.y = i * cardThickness;
          mesh.rotation.y = (Math.random() - 0.5) * 0.04;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          (mesh as any).cutStackIndex = cfg.idx;
          group.add(mesh);

          if (isTop) {
            topMeshRef = mesh;
          }
        }

        // Golden luminous circular base glow
        const glowGeo = new THREE.RingGeometry(isMobile ? 1.2 : 1.6, isMobile ? 1.45 : 1.9, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: cfg.idx === 0 ? 0xc084fc : cfg.idx === 1 ? 0xdfb76c : 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        glowMesh.rotation.x = -Math.PI / 2;
        glowMesh.position.y = 0.02;
        group.add(glowMesh);

        scene.add(group);

        cutStacksRef.current.push({
          group,
          topMesh: topMeshRef!,
          stackIndex: cfg.idx,
          targetPosition: new THREE.Vector3(cfg.x, 0.35, cfg.z),
          targetRotation: new THREE.Euler(0, 0, 0),
          hovered: false,
          isClicked: false,
          glowMesh,
        });
      });
    }
  }, [isCuttingDeck, cutPreviewCards]);

  // Click handler for 3D Cut Stack with Card Flip Reveal
  const handleSelectCutStack = (stackIdx: number) => {
    if (isCuttingAnimatingRef.current) return;
    isCuttingAnimatingRef.current = true;
    sound.playCutDeck();

    const chosenStack = cutStacksRef.current[stackIdx];
    const chosenCard = cutPreviewCards[stackIdx];

    if (chosenStack) {
      chosenStack.isClicked = true;
      // Flip top card in 3D (rotate on X to reveal front artwork)
      if (chosenStack.topMesh) {
        chosenStack.topMesh.rotation.x = Math.PI;
        chosenStack.topMesh.position.y += 0.15;
      }
    }

    if (chosenCard) {
      setRevealedUndercurrent(chosenCard);
      setTimeout(() => sound.playWisdomChime(), 350);
    }
  };

  // Proceed from revealed undercurrent card into drawing phase
  const handleProceedFromUndercurrent = () => {
    sound.playShuffle();
    const isMobile = mountRef.current ? mountRef.current.clientWidth < 768 : false;
    // Merge all stacks to main deck
    cutStacksRef.current.forEach((item) => {
      item.targetPosition.set(isMobile ? 0 : 8.5, 0.35, isMobile ? 4.5 : 6.5);
    });

    setTimeout(() => {
      // Reveal the unified main deck stack after cut stacks have merged
      if (deckMeshRef.current) {
        deckMeshRef.current.visible = true;
      }
      isCuttingAnimatingRef.current = false;
      onCutDeckComplete?.(revealedUndercurrent ? cutPreviewCards.indexOf(revealedUndercurrent) : 1, revealedUndercurrent || undefined);
      setRevealedUndercurrent(null);
    }, 700);
  };

  // Click & Touch Raycasting handler
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      for (const hit of intersects) {
        let obj: any = hit.object;
        while (obj) {
          if (obj.cutStackIndex !== undefined && isCuttingDeck) {
            handleSelectCutStack(obj.cutStackIndex);
            return;
          }
          if (obj.cardIndex !== undefined) {
            onCardClick(obj.cardIndex);
            return;
          }
          if (obj === deckMeshRef.current || obj.parent === deckMeshRef.current) {
            if (drawnCards.length < spread.card_count) {
              onDrawNextCard();
              return;
            }
          }
          obj = obj.parent;
        }
      }
    }
  };

  // Hover detection for 3D cards & 3D Cut Stacks
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    let hoveredIndex = -1;
    let hoveredCutIndex = -1;

    if (intersects.length > 0) {
      for (const hit of intersects) {
        let obj: any = hit.object;
        while (obj) {
          if (obj.cutStackIndex !== undefined && isCuttingDeck) {
            hoveredCutIndex = obj.cutStackIndex;
            break;
          }
          if (obj.cardIndex !== undefined) {
            hoveredIndex = obj.cardIndex;
            break;
          }
          obj = obj.parent;
        }
        if (hoveredIndex !== -1 || hoveredCutIndex !== -1) break;
      }
    }

    cardMeshesRef.current.forEach((item, idx) => {
      item.hovered = idx === hoveredIndex;
    });

    cutStacksRef.current.forEach((item) => {
      item.hovered = item.stackIndex === hoveredCutIndex;
    });
  };

  // Camera presets
  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const isMobile = mountRef.current ? mountRef.current.clientWidth < 768 : false;
    if (isMobile) {
      cameraRef.current.position.set(0, 24.5, 15.5);
      controlsRef.current.target.set(0, 0, 0.3);
    } else {
      cameraRef.current.position.set(0, 16, 14);
      controlsRef.current.target.set(0, 0, -0.5);
    }
    controlsRef.current.update();
  };

  const topDownView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const isMobile = mountRef.current ? mountRef.current.clientWidth < 768 : false;
    if (isMobile) {
      cameraRef.current.position.set(0, 26, 0.1);
      controlsRef.current.target.set(0, 0, 1.0);
    } else {
      cameraRef.current.position.set(0, 22, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  const handleReplayIntro = () => {
    if (!introCardsGroupRef.current || !cameraRef.current || !controlsRef.current) return;
    introCardsGroupRef.current.visible = true;
    if (deckMeshRef.current) {
      deckMeshRef.current.visible = false;
    }
    introStartTimeRef.current = performance.now();
    introRunningRef.current = true;
    setIsIntroRunning(true);
    cameraRef.current.position.set(0, 24, 28);
    controlsRef.current.target.set(0, 4.5, 0);
    controlsRef.current.update();
    sound.playTibetanBowl();
  };

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Cinematic 3D Intro Splash Overlay */}
      {isIntroRunning && (
        <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center p-8 md:p-12 animate-fade-in">
          {/* Center Brand Splash */}
          <div className="text-center flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full glass-panel-gold flex items-center justify-center border border-mystic-gold/60 shadow-mystic-glow animate-pulse">
              <Sparkles className="w-8 h-8 text-mystic-gold animate-spin-slow" />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-widest text-gold-gradient drop-shadow-2xl">
              MYSTIC TAROT
            </h1>
            <p className="text-xs md:text-sm font-semibold tracking-widest text-mystic-accent uppercase">
              {language === 'vi' ? '✨ VŨ TRỤ KHỞI NGUYÊN & TRỰC GIÁC VŨ TRỤ ✨' : '✨ COSMIC VORTEX & DIVINE INTUITION ✨'}
            </p>
          </div>
        </div>
      )}

      {/* Camera View Controls Badge (Top Left Floating) */}
      <div className="absolute top-16 sm:top-20 left-2.5 sm:left-4 md:left-8 z-20 flex flex-col space-y-1 sm:space-y-1.5 pointer-events-auto">
        <button
          onClick={resetCamera}
          className="p-1.5 sm:p-2 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/50 text-slate-300 hover:text-white transition flex items-center space-x-1 text-[10px] sm:text-[11px]"
          title="Góc nhìn chuẩn / Reset View"
        >
          <Camera className="w-3.5 h-3.5 text-mystic-gold flex-shrink-0" />
          <span className="hidden md:inline">Góc nhìn chuẩn</span>
        </button>
        <button
          onClick={topDownView}
          className="p-1.5 sm:p-2 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/50 text-slate-300 hover:text-white transition flex items-center space-x-1 text-[10px] sm:text-[11px]"
          title="Nhìn từ trên xuống / Top-down View"
        >
          <RefreshCw className="w-3.5 h-3.5 text-mystic-accent flex-shrink-0" />
          <span className="hidden md:inline">Từ trên xuống</span>
        </button>
        <button
          onClick={handleReplayIntro}
          className="p-1.5 sm:p-2 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/50 text-slate-300 hover:text-white transition flex items-center space-x-1 text-[10px] sm:text-[11px]"
          title="Xem lại hiệu ứng khởi đầu / Replay Intro"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
          <span className="hidden md:inline">Xem lại Intro</span>
        </button>
      </div>

      {/* Cut Deck Interactive Floating HUD Banner */}
      {isCuttingDeck && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-3 pointer-events-auto animate-fade-in">
          {!revealedUndercurrent ? (
            <div className="glass-panel-gold rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 border border-mystic-gold/60 shadow-2xl text-center flex flex-col items-center">
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-mystic-gold mb-1">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce flex-shrink-0" />
                <h3 className="font-serif text-sm sm:text-base md:text-xl font-bold text-gold-gradient leading-tight">
                  {language === 'vi' ? 'Bước 3: Nghi Thức Cắt Bài' : 'Step 3: Sacred Cut Deck Ritual'}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mb-2 sm:mb-3 leading-relaxed">
                {language === 'vi'
                  ? 'Hãy chạm trực tiếp vào 1 trong 3 tụ bài đang tỏa sáng trên bàn để truyền trực giác.'
                  : 'Tap directly on one of the 3 glowing stacks on the table to infuse your intuition.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full">
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full bg-mystic-900/80 border border-purple-500/30 text-purple-300 shadow-sm">
                  {language === 'vi' ? '🔮 Tụ 1: Tiềm Thức' : '🔮 Stack 1: Subconscious'}
                </span>
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full bg-mystic-900/80 border border-mystic-gold/40 text-mystic-goldLight shadow-sm">
                  {language === 'vi' ? '✨ Tụ 2: Hiện Thực' : '✨ Stack 2: Reality'}
                </span>
                <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:py-1 rounded-full bg-mystic-900/80 border border-cyan-500/30 text-cyan-300 shadow-sm">
                  {language === 'vi' ? '🌟 Tụ 3: Tương Lai' : '🌟 Stack 3: Future'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (deckMeshRef.current) deckMeshRef.current.visible = true;
                  onCutDeckComplete?.(1);
                }}
                className="mt-2.5 text-[10px] sm:text-[11px] text-slate-400 hover:text-slate-200 underline transition"
              >
                {language === 'vi' ? 'Bỏ qua bước chẻ bài' : 'Skip cutting ritual'}
              </button>
            </div>
          ) : (
            <div className="glass-panel-gold rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 border border-mystic-gold/70 shadow-2xl text-center flex flex-col items-center animate-fade-in ring-1 ring-mystic-gold/50">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-mystic-900 border border-mystic-gold/50 text-mystic-goldLight text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-mystic-gold animate-spin-slow" />
                <span>{language === 'vi' ? 'Lá Năng Lượng Dẫn Đường' : 'Undercurrent Theme Card'}</span>
              </div>

              <div className="flex items-center space-x-3 my-2 text-left bg-mystic-950/60 p-2.5 sm:p-3 rounded-2xl border border-white/10 w-full">
                <div className="w-12 h-18 sm:w-14 sm:h-22 rounded-lg sm:rounded-xl overflow-hidden border border-mystic-gold/60 shadow-lg flex-shrink-0">
                  <img
                    src={revealedUndercurrent.cardData.image}
                    alt={revealedUndercurrent.card_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-gold-gradient truncate">
                    {revealedUndercurrent.card_name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                    "{revealedUndercurrent.cardData.core_meanings[revealedUndercurrent.orientation]?.essence || revealedUndercurrent.cardData.core_meanings.upright.essence}"
                  </p>
                </div>
              </div>

              <button
                onClick={handleProceedFromUndercurrent}
                className="mt-2.5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-gradient-to-r from-mystic-goldDark via-mystic-gold to-mystic-goldLight text-mystic-950 font-bold text-xs sm:text-sm shadow-mystic-glow hover:brightness-110 active:scale-98 transition flex items-center space-x-2"
              >
                <span>{language === 'vi' ? '✨ Bắt Đầu Rút Bài' : '✨ Proceed to Draw'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Deck Draw Helper Floating Badge */}
      {!isCuttingDeck && drawnCards.length < spread.card_count && (
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 flex flex-col items-center pointer-events-none animate-bounce z-20">
          <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel-gold text-mystic-goldLight text-[11px] sm:text-xs md:text-sm font-medium border border-mystic-gold/60 shadow-mystic-glow flex items-center space-x-1.5 whitespace-nowrap">
            <span>✨ {t.actions.tapDeckHelper} ({drawnCards.length}/{spread.card_count})</span>
          </div>
        </div>
      )}
    </div>
  );
};
