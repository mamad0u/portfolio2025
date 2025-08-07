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
    // Si on est sur mobile, animation d'apparition simple
    if (isMobile) {
      // Attendre que les éléments soient prêts
      const initMobileAnimation = () => {
        console.log('Tentative d\'animation mobile, éléments prêts:', !!image1Ref.current, !!image2Ref.current);
        if (image1Ref.current && image2Ref.current) {
          // Position initiale pour mobile - images hors écran
          gsap.set(image1Ref.current, {
            scale: 1,
            y: 0,
            rotation: 0,
            x: "-100%", // Image 1 commence à gauche hors écran
            opacity: 0
          });

          gsap.set(image2Ref.current, {
            scale: 1,
            y: 0,
            rotation: 0,
            x: "100%", // Image 2 commence à droite hors écran
            opacity: 0
          });

          // Animation d'apparition au scroll pour mobile
          gsap.to(image1Ref.current, {
            x: "-50%", // Position finale actuelle
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%", // Se lance quand le haut du container atteint 80% du viewport
              end: "top 20%",
              toggleActions: "play none none "
            }
          });

          gsap.to(image2Ref.current, {
            x: "50%", // Position finale actuelle
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2, // Délai légèrement plus long pour un effet en cascade
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%", // Se lance quand le haut du container atteint 80% du viewport
              end: "top 20%",
              toggleActions: "play none none "
            }
          });
        } else {
          // Réessayer après un court délai si les éléments ne sont pas prêts
          setTimeout(initMobileAnimation, 100);
        }
      };

      // Démarrer l'animation après un délai pour s'assurer que tout est chargé
      setTimeout(initMobileAnimation, 200);

      return;
    }

    const initAnimations = () => {
      // Nettoyer l'instance précédente si elle existe
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      // Positions pour desktop uniquement
      const yOffset1 = -125;
      const yOffset2 = -70;

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

    // Animation d'apparition séparée des images au scroll (desktop uniquement)
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

    // Initialiser les animations (desktop uniquement)
    initAnimations();
    animateImageAppearance();

    // Gestion du resize window
    const handleResize = () => {
      // Nettoyer toutes les animations existantes
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Vérifier si on est maintenant sur mobile
      const currentIsMobile = window.innerWidth <= 768;
      
      if (currentIsMobile) {
        // Animation d'apparition au scroll pour mobile lors du resize
        gsap.set(image1Ref.current, {
          scale: 1,
          y: 0,
          rotation: 0,
          x: "-100%",
          opacity: 0
        });

        gsap.set(image2Ref.current, {
          scale: 1,
          y: 0,
          rotation: 0,
          x: "100%",
          opacity: 0
        });

        gsap.to(image1Ref.current, {
          x: "-50%",
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        });

        gsap.to(image2Ref.current, {
          x: "50%",
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        });
      } else {
        // Réinitialiser les animations pour desktop
        initAnimations();
        animateImageAppearance();
      }
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