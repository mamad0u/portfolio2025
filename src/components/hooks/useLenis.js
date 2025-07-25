import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrer ScrollTrigger avec GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useLenis = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Vérifier si Lenis est déjà initialisé
    if (lenisRef.current) {
      return;
    }

    // Initialiser Lenis avec une configuration optimisée
    const lenis = new Lenis({
      duration: 1.0, // Réduire légèrement
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      autoResize: true,
      autoRaf: false, // On va gérer manuellement le RAF pour une meilleure intégration avec GSAP
    });

    // Synchroniser Lenis avec GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Intégrer Lenis dans le ticker GSAP pour une synchronisation parfaite
    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(raf);

    // Désactiver le lag smoothing de GSAP pour éviter les délais
    gsap.ticker.lagSmoothing(0);

    // Stocker l'instance Lenis dans la ref
    lenisRef.current = lenis;

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      gsap.ticker.remove(raf);
    };
  }, []);

  return lenisRef.current;
}; 