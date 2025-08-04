"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fluidShader, displayShader } from "./shaders.js";
import "./InteractiveGradient.css";

const InteractiveGradient = ({
  brushSize = 25.0,
  brushStrength = 0.5,
  distortionAmount = 2.5,
  fluidDecay = 0.98,
  trailLength = 0.8,
  stopDecay = 0.85,
  color1 = "#2d5010",
  color2 = "#4d780a",
  color3 = "#6b9a1a",
  color4 = "#8fbc2a",
  colorIntensity = 1.0,
  softness = 1.0,
}) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const sceneDataRef = useRef(null);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  // Fonction pour obtenir la hauteur réelle du viewport
  const getViewportHeight = () => {
    // Utilise visual viewport si disponible (plus précis pour mobile)
    if (window.visualViewport) {
      return window.visualViewport.height;
    }
    // Fallback vers innerHeight
    return window.innerHeight;
  };

  // Fonction pour obtenir la hauteur maximale (avec barre de navigation)
  const getMaxViewportHeight = () => {
    // Détecte si on est sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile && window.visualViewport) {
      // Sur mobile, utilise la hauteur maximale possible
      // Ajoute un petit buffer pour s'assurer qu'il n'y a pas d'écart
      const maxHeight = Math.max(window.visualViewport.height, window.innerHeight);
      return maxHeight + 20; // Buffer de 20px
    }
    
    // Sur desktop ou si visualViewport n'est pas disponible
    return window.innerHeight;
  };

  // Fonction pour obtenir la largeur réelle du viewport
  const getViewportWidth = () => {
    if (window.visualViewport) {
      return window.visualViewport.width;
    }
    return window.innerWidth;
  };

  // Fonction pour obtenir la hauteur fixe (toujours la même)
  const getFixedHeight = () => {
    // Détecte si on est sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Sur mobile, utilise la hauteur maximale possible
      // Cela inclut l'espace pour la barre de navigation
      return Math.max(window.innerHeight, window.screen.height);
    }
    
    // Sur desktop, utilise innerHeight
    return window.innerHeight;
  };

  // Debounce function pour optimiser les redimensionnements
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    while (canvasRef.current.firstChild) {
      canvasRef.current.removeChild(canvasRef.current.firstChild);
    }

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;

    const initialWidth = getViewportWidth();
    const initialHeight = getFixedHeight(); // Utilise la hauteur fixe
    
    renderer.setSize(initialWidth, initialHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const fluidTarget1 = new THREE.WebGLRenderTarget(
      initialWidth,
      initialHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    const fluidTarget2 = new THREE.WebGLRenderTarget(
      initialWidth,
      initialHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(initialWidth, initialHeight),
        },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: brushSize },
        uBrushStrength: { value: brushStrength },
        uFluidDecay: { value: fluidDecay },
        uTrailLength: { value: trailLength },
        uStopDecay: { value: stopDecay },
      },
      vertexShader: vertexShader,
      fragmentShader: fluidShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(initialWidth, initialHeight),
        },
        iFluid: { value: null },
        uDistortionAmount: { value: distortionAmount },
        uColor1: { value: new THREE.Vector3(...hexToRgb(color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgb(color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgb(color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgb(color4)) },
        uColorIntensity: { value: colorIntensity },
        uSoftness: { value: softness },
      },
      vertexShader: vertexShader,
      fragmentShader: displayShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
    const displayPlane = new THREE.Mesh(geometry, displayMaterial);

    let mouseX = 0,
      mouseY = 0;
    let prevMouseX = 0,
      prevMouseY = 0;
    let lastMoveTime = 0;

    const handleMouseMove = (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX - rect.left;
      mouseY = rect.height - (e.clientY - rect.top);
      lastMoveTime = performance.now();
      fluidMaterial.uniforms.iMouse.value.set(
        mouseX,
        mouseY,
        prevMouseX,
        prevMouseY
      );
    };

    const handleMouseLeave = () => {
      fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    };

    const handleResize = () => {
      const width = getViewportWidth();
      const height = getFixedHeight(); // Garde la hauteur fixe

      // Mise à jour immédiate du renderer
      renderer.setSize(width, height);
      
      // Mise à jour des uniforms de résolution
      fluidMaterial.uniforms.iResolution.value.set(width, height);
      displayMaterial.uniforms.iResolution.value.set(width, height);

      // Redimensionnement des textures de fluide
      fluidTarget1.setSize(width, height);
      fluidTarget2.setSize(width, height);
      
      // Reset du frame count pour éviter les artefacts
      frameCount = 0;
      
      // Force un rendu immédiat pour éviter le délai
      if (renderer && displayPlane && camera) {
        displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
        renderer.setRenderTarget(null);
        renderer.render(displayPlane, camera);
      }
    };

    // Version debounced pour les changements fréquents (comme le scroll mobile)
    const debouncedResize = debounce(handleResize, 50);

    // Listener pour les changements de visual viewport (mobile)
    const handleVisualViewportChange = () => {
      // Ajuste la position du canvas en fonction du visual viewport
      if (canvasRef.current && window.visualViewport) {
        const canvas = canvasRef.current;
        canvas.style.transform = `translateY(${window.visualViewport.offsetTop}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    
    // Ajouter le listener pour visual viewport si disponible
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVisualViewportChange);
      window.visualViewport.addEventListener("scroll", handleVisualViewportChange);
    }

    const animate = () => {
      const time = performance.now() * 0.001;
      fluidMaterial.uniforms.iTime.value = time;
      displayMaterial.uniforms.iTime.value = time;
      fluidMaterial.uniforms.iFrame.value = frameCount;

      if (performance.now() - lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
      }

      fluidMaterial.uniforms.uBrushSize.value = brushSize;
      fluidMaterial.uniforms.uBrushStrength.value = brushStrength;
      fluidMaterial.uniforms.uFluidDecay.value = fluidDecay;
      fluidMaterial.uniforms.uTrailLength.value = trailLength;
      fluidMaterial.uniforms.uStopDecay.value = stopDecay;

      displayMaterial.uniforms.uDistortionAmount.value = distortionAmount;
      displayMaterial.uniforms.uColorIntensity.value = colorIntensity;
      displayMaterial.uniforms.uSoftness.value = softness;
      displayMaterial.uniforms.uColor1.value.set(...hexToRgb(color1));
      displayMaterial.uniforms.uColor2.value.set(...hexToRgb(color2));
      displayMaterial.uniforms.uColor3.value.set(...hexToRgb(color3));
      displayMaterial.uniforms.uColor4.value.set(...hexToRgb(color4));

      fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
      renderer.setRenderTarget(currentFluidTarget);
      renderer.render(fluidPlane, camera);

      displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayPlane, camera);

      const temp = currentFluidTarget;
      currentFluidTarget = previousFluidTarget;
      previousFluidTarget = temp;

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    sceneDataRef.current = {
      fluidTarget1,
      fluidTarget2,
      fluidMaterial,
      displayMaterial,
      geometry,
      handleMouseMove,
      handleMouseLeave,
      handleResize,
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      
      // Supprimer le listener du visual viewport
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVisualViewportChange);
        window.visualViewport.removeEventListener("scroll", handleVisualViewportChange);
      }
      
      // Nettoyer le debounce
      if (debouncedResize && debouncedResize.cancel) {
        debouncedResize.cancel();
      }

      if (renderer.domElement && canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }

      fluidTarget1.dispose();
      fluidTarget2.dispose();
      fluidMaterial.dispose();
      displayMaterial.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, [
    brushSize,
    brushStrength,
    distortionAmount,
    fluidDecay,
    trailLength,
    stopDecay,
    color1,
    color2,
    color3,
    color4,
    colorIntensity,
    softness,
  ]);

  return <div ref={canvasRef} className="gradient-canvas" />;
};

export default InteractiveGradient;
