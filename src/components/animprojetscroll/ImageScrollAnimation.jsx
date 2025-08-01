'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ImageScrollAnimation.module.css';

// Enregistrer ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const ImageScrollAnimation = ({ 
  imageSrc1 = "/images/blurry/blurry1.webp",
  imageSrc2 = "/images/blurry/blurry2.webp",
  alt1 = "Image animée 1",
  alt2 = "Image animée 2"
}) => {
  const containerRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  let scrollTriggerInstance = null;

  // Fonction pour détecter la taille d'écran
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Détecter la taille d'écran au montage et lors du redimensionnement
  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const initAnimations = () => {
      // Nettoyer l'instance précédente si elle existe
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      // Ajuster les positions selon mobile/desktop
      const yOffset1 = isMobile ? -110 : -125; // Moins haut sur mobile
      const yOffset2 = isMobile ? -70 : -70; // Moins haut sur mobile

      // Créer la nouvelle instance ScrollTrigger avec animation fluide
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 95%", // Se lance 20% plus tard (quand le haut du container atteint 80% du viewport)
        end: "top top",
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Utiliser des easing pour une animation plus fluide
          const easeProgress = gsap.utils.clamp(0, 1, progress);
          const scale = gsap.utils.interpolate(0.20, 1, easeProgress);
          const y1 = gsap.utils.interpolate(yOffset1, 0, easeProgress); // Image 1
          const y2 = gsap.utils.interpolate(yOffset2, 0, easeProgress); // Image 2 (décalée)
          const rotation1 = gsap.utils.interpolate(-15, 0, easeProgress); // Image 1
          const rotation2 = gsap.utils.interpolate(15, 0, easeProgress); // Image 2 (rotation opposée)
          const x1 = gsap.utils.interpolate(-70, -50, easeProgress); // Image 1 va à -25%
          const x2 = gsap.utils.interpolate(50, 50, easeProgress); // Image 2 va à 25%
    
          // Animation de l'image 1 (gauche)
          gsap.set(image1Ref.current, {
            scale,
            y: `${y1}%`,
            rotation: rotation1,
            x: `${x1}%`
          });

          // Animation de l'image 2 (droite)
          gsap.set(image2Ref.current, {
            scale,
            y: `${y2}%`,
            rotation: rotation2,
            x: `${x2}%`
          });
        },
      });
    
      // ⚠️ Appliquer manuellement les styles initiaux avec interpolation
      const initialProgress = 0;
      const initialScale = gsap.utils.interpolate(0.20, 1, initialProgress);
      const initialY1 = gsap.utils.interpolate(yOffset1, 0, initialProgress);
      const initialY2 = gsap.utils.interpolate(yOffset2, 0, initialProgress);
      const initialRotation1 = gsap.utils.interpolate(-15, 0, initialProgress);
      const initialRotation2 = gsap.utils.interpolate(15, 0, initialProgress);
      const initialX1 = gsap.utils.interpolate(-70, -50, initialProgress);
      const initialX2 = gsap.utils.interpolate(50, 50, initialProgress);
    
      gsap.set(image1Ref.current, {
        scale: initialScale,
        y: `${initialY1}%`,
        rotation: initialRotation1,
        x: `${initialX1}%`
      });

      gsap.set(image2Ref.current, {
        scale: initialScale,
        y: `${initialY2}%`,
        rotation: initialRotation2,
        x: `${initialX2}%`
      });
    
      scrollTriggerInstance.refresh(); // utile si le layout a changé
    };

    // Animation d'apparition séparée des images au scroll
    const animateImageAppearance = () => {
      // Position initiale des images pour l'apparition
      gsap.set(image1Ref.current, {
        x: "-100%", // Image 1 commence à gauche
        opacity: 0
      });
      
      gsap.set(image2Ref.current, {
        x: "100%", // Image 2 commence à droite
        opacity: 0
      });

      // Animation d'apparition de l'image 1 (gauche vers droite)
      gsap.to(image1Ref.current, {
        x: "-70%", // Position finale correspondant au début de la 2ème animation
        opacity: 1,
        duration: .6,
        ease: "power2",
        scrollTrigger: image1Ref.current // Se lance dès que l'image entre dans le viewport
      });

      // Animation d'apparition de l'image 2 (droite vers gauche) avec délai
      gsap.to(image2Ref.current, {
        x: "50%", // Position finale correspondant au début de la 2ème animation
        opacity: 1,
        duration: .6,
        ease: "power2",
        scrollTrigger: image2Ref.current // Se lance dès que l'image entre dans le viewport
      });
    };

    // Initialiser les animations
    initAnimations();
    animateImageAppearance();

    // Gestion du resize window
    const handleResize = () => {
      initAnimations();
      animateImageAppearance();
    };

    window.addEventListener('resize', handleResize);

    // Nettoyer les event listeners et ScrollTrigger
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, [imageSrc1, imageSrc2, isMobile]); // Ajouter isMobile comme dépendance

  return (
    <section ref={containerRef} className={styles.heroImgHolder}>
      <div ref={image1Ref} className={styles.heroImg}>
        <img src={imageSrc1} alt={alt1} className={styles.image} />
      </div>
      <div ref={image2Ref} className={styles.heroImg}>
        <img src={imageSrc2} alt={alt2} className={styles.image} />
      </div>
    </section>
  );
};

export default ImageScrollAnimation; 