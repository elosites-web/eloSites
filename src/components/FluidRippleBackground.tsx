import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getMotionTier, shouldReduceMedia, webglSupported } from '../mediaPrefs';

interface FluidRippleBackgroundProps {
  className?: string;
  variant?: 'fullscreen' | 'contained';
}

export const FluidRippleBackground: React.FC<FluidRippleBackgroundProps> = ({
  className = '',
  variant = 'fullscreen',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCssFallback, setUseCssFallback] = useState<boolean>(() => {
    return shouldReduceMedia() || !webglSupported() || getMotionTier() === 'none';
  });

  useEffect(() => {
    if (useCssFallback) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number | null = null;
    let isPaused = false;
    let resizeObserver: ResizeObserver | null = null;

    try {
      const isContained = variant === 'contained';
      const initialWidth = isContained ? (container.clientWidth || 300) : window.innerWidth;
      const initialHeight = isContained ? (container.clientHeight || 300) : window.innerHeight;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(initialWidth, initialHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);
      camera.position.z = 22;

      // 1. Grade Azul de Espaço-Tempo ortogonal (exclusivamente linhas horizontais e verticais, sem diagonais)
      // Dimensões base superdimensionadas para cobrir 100% de desktop widescreen, ultrawide e mobile horizontal sem bordas pretas
      const gridSegmentsX = isContained ? 54 : 64;
      const gridSegmentsY = isContained ? 38 : 46;
      const baseGridWidth = isContained ? 96 : 112;
      const baseGridHeight = isContained ? 64 : 76;

      const numVertsX = gridSegmentsX + 1;
      const numVertsY = gridSegmentsY + 1;
      const totalVertices = numVertsX * numVertsY;

      const positions = new Float32Array(totalVertices * 3);
      const initialPositions = new Float32Array(totalVertices * 3);

      let vIdx = 0;
      for (let j = 0; j < numVertsY; j++) {
        const y = (j / gridSegmentsY - 0.5) * baseGridHeight;
        for (let i = 0; i < numVertsX; i++) {
          const x = (i / gridSegmentsX - 0.5) * baseGridWidth;
          positions[vIdx * 3] = x;
          positions[vIdx * 3 + 1] = y;
          positions[vIdx * 3 + 2] = 0;
          initialPositions[vIdx * 3] = x;
          initialPositions[vIdx * 3 + 1] = y;
          initialPositions[vIdx * 3 + 2] = 0;
          vIdx++;
        }
      }

      // Conexões estritamente horizontais e verticais (sem traços diagonais)
      const indices: number[] = [];

      // Segmentos horizontais
      for (let j = 0; j < numVertsY; j++) {
        for (let i = 0; i < gridSegmentsX; i++) {
          const a = j * numVertsX + i;
          const b = a + 1;
          indices.push(a, b);
        }
      }

      // Segmentos verticais
      for (let i = 0; i < numVertsX; i++) {
        for (let j = 0; j < gridSegmentsY; j++) {
          const a = j * numVertsX + i;
          const b = (j + 1) * numVertsX + i;
          indices.push(a, b);
        }
      }

      const gridGeometry = new THREE.BufferGeometry();
      gridGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      gridGeometry.setIndex(indices);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: isContained ? 0.32 : 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const gridMesh = new THREE.LineSegments(gridGeometry, lineMaterial);
      gridMesh.position.z = 0;
      scene.add(gridMesh);

      // 2. Poeira estelar sutil de profundidade
      const particleCount = isContained ? 36 : 50;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePos[i] = (Math.random() - 0.5) * baseGridWidth;
        particlePos[i + 1] = (Math.random() - 0.5) * baseGridHeight;
        particlePos[i + 2] = (Math.random() - 0.5) * 16 - 2;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x60a5fa,
        size: 0.12,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Interação suave de mouse/toque
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;

      const handlePointer = (e: MouseEvent | TouchEvent) => {
        let clientX = 0;
        let clientY = 0;
        if ('touches' in e && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
        }
        targetMouseX = (clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = -(clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', handlePointer, { passive: true });
      window.addEventListener('touchmove', handlePointer, { passive: true });

      // Atualizador de tamanho responsivo com overscan garantido
      const updateSize = (w: number, h: number) => {
        if (!renderer || !camera) return;
        const width = Math.max(w, 100);
        const height = Math.max(h, 100);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        // Calcular frustum real visível na profundidade z = 0
        const vFovRad = ((camera.fov || 45) * Math.PI) / 180;
        const visibleH = 2 * Math.tan(vFovRad / 2) * camera.position.z;
        const visibleW = visibleH * camera.aspect;

        // Escala adaptativa para cobrir 100% da tela em desktop widescreen e mobile horizontal
        // com folga de 65% nas bordas para absorver as deformações harmônicas e da bolha
        const scaleX = (visibleW * 1.65) / baseGridWidth;
        const scaleY = (visibleH * 1.65) / baseGridHeight;
        const targetScale = Math.max(1.35, scaleX, scaleY);

        gridMesh.scale.set(targetScale, targetScale, 1);
        particleSystem.scale.set(targetScale, targetScale, 1);
      };

      // Aplica dimensionamento inicial imediato
      updateSize(initialWidth, initialHeight);

      // Timers para garantir sincronização de tamanho em modais animados ou virada de tela
      const timerA = setTimeout(() => {
        const curW = isContained ? (container.clientWidth || window.innerWidth) : window.innerWidth;
        const curH = isContained ? (container.clientHeight || window.innerHeight) : window.innerHeight;
        updateSize(curW, curH);
      }, 50);

      const timerB = setTimeout(() => {
        const curW = isContained ? (container.clientWidth || window.innerWidth) : window.innerWidth;
        const curH = isContained ? (container.clientHeight || window.innerHeight) : window.innerHeight;
        updateSize(curW, curH);
      }, 180);

      const handleWindowResize = () => {
        const curW = isContained ? (container.clientWidth || window.innerWidth) : window.innerWidth;
        const curH = isContained ? (container.clientHeight || window.innerHeight) : window.innerHeight;
        updateSize(curW, curH);
      };
      window.addEventListener('resize', handleWindowResize, { passive: true });
      window.addEventListener('orientationchange', handleWindowResize, { passive: true });

      if (isContained && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              updateSize(width, height);
            }
          }
        });
        resizeObserver.observe(container);
      }

      // Visibility change para pausar quando minimizado
      const handleVisibilityChange = () => {
        isPaused = document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Loop de animação contínua e aleatória
      let clock = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (isPaused || !renderer || !scene || !camera) return;

        clock += 0.016;

        // Cursor suavizado
        currentMouseX += (targetMouseX - currentMouseX) * 0.035;
        currentMouseY += (targetMouseY - currentMouseY) * 0.035;

        // Trajetória multi-harmônica orgânica e constante da bolha de espaço-tempo
        const t = clock * 0.55;
        const bubbleX =
          Math.sin(t * 0.72) * 8.5 +
          Math.cos(t * 0.38 + 1.2) * 5.0 +
          Math.sin(t * 1.15 + 2.5) * 2.8 +
          currentMouseX * 3.5;

        const bubbleY =
          Math.cos(t * 0.65) * 5.8 +
          Math.sin(t * 0.44 + 0.8) * 3.8 +
          Math.cos(t * 0.98 + 1.8) * 2.2 +
          currentMouseY * 3.0;

        // Deformação da Grade Azul pura (curvatura de espaço-tempo por onde o centro de distorção passa)
        const pos = gridGeometry.attributes.position;
        const arr = pos.array as Float32Array;
        const sigmaSq = 28; // Raio de influência da distorção

        for (let i = 0; i < arr.length; i += 3) {
          const vx = initialPositions[i];
          const vy = initialPositions[i + 1];
          const vz = initialPositions[i + 2];

          const dx = vx - bubbleX;
          const dy = vy - bubbleY;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          // Gaussiana da curvatura espacial
          const gauss = Math.exp(-distSq / sigmaSq);

          // Efeito de curvatura 3D + ondas gravitacionais
          const zCurvature = 3.6 * gauss * Math.cos(dist * 0.85 - clock * 2.2);

          // Ondulação harmônica suave no tecido de fundo
          const harmonic = 0.25 * Math.sin(vx * 0.3 + clock * 0.8) * Math.cos(vy * 0.3 + clock * 0.8);

          // Deformação lateral/radial das linhas da grade ao redor da distorção
          const lateralWarp = (2.0 * gauss) / (1 + dist * 0.4);

          arr[i] = vx + dx * lateralWarp * 0.35;
          arr[i + 1] = vy + dy * lateralWarp * 0.35;
          arr[i + 2] = vz + zCurvature + harmonic;
        }
        pos.needsUpdate = true;

        // Rotação suave da poeira estelar
        particleSystem.rotation.y = clock * 0.015;
        particleSystem.rotation.x = clock * 0.008;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        clearTimeout(timerA);
        clearTimeout(timerB);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handlePointer);
        window.removeEventListener('touchmove', handlePointer);
        window.removeEventListener('resize', handleWindowResize);
        window.removeEventListener('orientationchange', handleWindowResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (resizeObserver) resizeObserver.disconnect();

        gridGeometry.dispose();
        lineMaterial.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        renderer?.dispose();
      };
    } catch {
      setUseCssFallback(true);
    }
  }, [useCssFallback, variant]);

  if (useCssFallback) {
    const isContained = variant === 'contained';
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none ${
          isContained ? 'absolute inset-0' : 'fixed inset-0 -z-20'
        } overflow-hidden ${className}`}
      >
        <div className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-blue-600/10 blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[140px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-blue-500/[0.08] blur-[150px]" />
      </div>
    );
  }

  const isContained = variant === 'contained';
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none ${
        isContained ? 'absolute inset-0 z-0' : 'fixed inset-0 -z-20'
      } overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
