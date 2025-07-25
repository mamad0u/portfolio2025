'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { getAllProjets } from '../../data/projets';
import styles from './Projet.module.css';
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Enregistrer les plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Projet = ({ bgColor }) => {

  const router = useTransitionRouter();
  const pathname = usePathname();

  function triggerPageTransition() {
    document.documentElement.animate(
      [
        {
          clipPath: "polygon(25% 75%, 75% 75%, 75% 75%, 25% 75%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 2000,
        easing: "cubic-bezier(0.9, 0, 0.1, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  const handleNavigation = (path) => (e) => {
    if (path === pathname) {
      e.preventDefault();
      return;
    }

    router.push(path, {
      onTransitionReady: triggerPageTransition,
    });
  };

  const projetRef = useRef(null);
  const tooltipRef = useRef(null);
  const cardRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // État pour les animations de lévitation et le tooltip
  const [levitationAnimations, setLevitationAnimations] = useState([]);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageAnimationTimeline, setImageAnimationTimeline] = useState(null);

  // Données des projets
  const projets = getAllProjets();

  // Fonction pour gérer le mouvement de la souris
  const handleMouseMove = (e) => {
    if (isHovering && tooltipRef.current) {
      console.log('Mouse move - Position:', e.clientX, e.clientY);
      gsap.set(tooltipRef.current, {
        x: e.clientX + 15,
        y: e.clientY - 15
      });
    }
  };

  // Fonction pour démarrer l'animation de défilement des images
  const startImageAnimation = (cardIndex) => {
    const projet = projets[cardIndex];
    if (!projet.images || projet.images.length <= 1) return;

    // Arrêter l'animation précédente si elle existe
    if (imageAnimationTimeline) {
      imageAnimationTimeline.kill();
    }

    // Créer une nouvelle timeline (pas de répétition)
    const timeline = gsap.timeline({ repeat: 0 });
    
    // Pour chaque image (incluant la première pour faire une boucle complète)
    for (let i = 0; i < projet.images.length; i++) {
      const imageIndex = i;

      
      timeline.add(() => {
        // Créer un élément image temporaire pour l'animation
        const tempImg = document.createElement('img');
        tempImg.src = projet.images[imageIndex];
        tempImg.alt = projet.name;
        tempImg.className = styles.projectImage;
        tempImg.style.position = 'absolute';
        tempImg.style.top = '0';
        tempImg.style.left = '0';
        tempImg.style.width = '100%';
        tempImg.style.height = '100%';
        tempImg.style.objectFit = 'cover';
        tempImg.style.zIndex = '1';
        tempImg.style.transform = 'translateY(100%)';
        tempImg.style.opacity = '0';
        
        // Ajouter l'image temporaire à la carte
        const cardElement = cardRefs[cardIndex].current;
        if (cardElement) {
          cardElement.appendChild(tempImg);
          
          // Attendre que l'image soit chargée avant de l'animer
          tempImg.onload = () => {
            // Animation de l'image qui monte du bas
            gsap.to(tempImg, {
              y: '0%',
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                // Remplacer l'image principale
                const mainImg = cardElement.querySelector(`.${styles.projectImage}`);
                if (mainImg) {
                  mainImg.src = projet.images[imageIndex];
                }
                
                // Supprimer l'image temporaire après un petit délai
                setTimeout(() => {
                  tempImg.remove();
                }, 100);
              }
            });
          };
          
          // Gestion d'erreur si l'image ne se charge pas
          tempImg.onerror = () => {
            console.warn(`Image non trouvée: ${projet.images[imageIndex]}`);
            tempImg.remove();
          };
        }
      }, i * 0.4); // Délai plus rapide pour une animation plus dynamique
    }

    setImageAnimationTimeline(timeline);
  };

  // Fonction pour arrêter l'animation de défilement
  const stopImageAnimation = () => {
    if (imageAnimationTimeline) {
      imageAnimationTimeline.kill();
      setImageAnimationTimeline(null);
    }
  };

  // Fonction pour gérer le hover sur les cartes
  const handleCardHover = (cardIndex, e) => {
    // Afficher le tooltip
    setTooltipText(projets[cardIndex].name);
    setTooltipVisible(true);
    setIsHovering(true);
    
    // Positionner le tooltip à côté du curseur
    if (tooltipRef.current) {
      gsap.set(tooltipRef.current, {
        x: e.clientX + 15,
        y: e.clientY - 15
      });
    }
    
    // Arrêter l'animation de lévitation de la carte survolée
    if (levitationAnimations[cardIndex]) {
      levitationAnimations[cardIndex].pause();
    }
    
    // Démarrer l'animation de défilement des images seulement si elle n'est pas déjà en cours
    if (!imageAnimationTimeline) {
      startImageAnimation(cardIndex);
    }
    
    // Appliquer le flou sur toutes les cartes sauf celle en hover
    cardRefs.forEach((ref, index) => {
      if (ref.current) {
        if (index === cardIndex) {
          // Pas de flou sur la carte en hover + scale
          gsap.to(ref.current, {
            filter: 'blur(0px)',
            scale: 1.05,
            duration: 0.08,
            ease: "linear"
          });
        } else {
          // Flou sur les autres cartes + scale normal
          gsap.to(ref.current, {
            filter: 'blur(4px)',
            scale: 1,
            duration: 0.08,
            ease: "linear"
          });
        }
      }
    });
  };

  const handleCardLeave = () => {
    // Masquer le tooltip
    setTooltipVisible(false);
    setIsHovering(false);
    
    // Arrêter l'animation de défilement des images
    stopImageAnimation();
    
    // Animation de retour à l'image de base pour toutes les cartes
    cardRefs.forEach((ref, index) => {
      if (ref.current) {
        const cardElement = ref.current;
        const mainImg = cardElement.querySelector(`.${styles.projectImage}`);
        
        if (mainImg && projets[index].imagecard) {
          // Créer une image temporaire pour l'animation de retour
          const tempImg = document.createElement('img');
          tempImg.src = projets[index].imagecard;
          tempImg.alt = projets[index].name;
          tempImg.className = styles.projectImage;
          tempImg.style.position = 'absolute';
          tempImg.style.top = '0';
          tempImg.style.left = '0';
          tempImg.style.width = '100%';
          tempImg.style.height = '100%';
          tempImg.style.objectFit = 'cover';
          tempImg.style.zIndex = '1';
          tempImg.style.transform = 'translateY(100%)';
          tempImg.style.opacity = '0';
          
          cardElement.appendChild(tempImg);
          
          // Animation de retour à l'image de base
          tempImg.onload = () => {
            gsap.to(tempImg, {
              y: '0%',
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                // Remplacer l'image principale par l'image de base
                mainImg.src = projets[index].imagecard;
                
                // Supprimer l'image temporaire
                setTimeout(() => {
                  tempImg.remove();
                }, 100);
              }
            });
          };
        }
      }
    });
    
    // Reprendre toutes les animations de lévitation
    levitationAnimations.forEach((animation, index) => {
      if (animation) {
        animation.resume();
      }
    });
    
    // Retirer le flou de toutes les cartes et remettre le scale normal
    cardRefs.forEach((ref) => {
      if (ref.current) {
        gsap.to(ref.current, {
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.08,
          ease: "linear"
        });
      }
    });
  };

  useEffect(() => {
    // Animation des 4 cartes de projets (apparition + translation X)
    cardRefs.forEach((ref, i) => {
      if (ref.current) {
        // Animation séquentielle : opacité et flou seulement
      gsap.fromTo(
          ref.current,
          { 
            opacity: 0,
            filter: 'blur(10px)'
          },
        {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
          ease: "power3",
            delay: 0.3 + (i * 0.2), // Animation séquentielle avec plus d'espacement
          scrollTrigger: {
            trigger: projetRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
      
      // Animation de lévitation avec variations pour chaque carte
      const variations = [
        {
          path: "M 0 -2.5 A 2.5 2.5 0 1 1 0 2.5 A 2.5 2.5 0 1 1 0 -2.5", // Cercle très petit, sens horaire
          duration: 5,
          delay: 0
        },
        {
          path: "M 0 -2.7 A 2.7 2.7 0 0 0 0 2.7 A 2.7 2.7 0 0 0 0 -2.7", // Cercle minuscule, sens anti-horaire
          duration: 4.5,
          delay: 0.4
        },
        {
          path: "M 0 -3 A 3 3 0 1 1 0 3 A 3 3 0 1 1 0 -3", // Cercle petit, sens horaire
          duration: 4,
          delay: 0.8
        },
        {
          path: "M 0 -2 A 2 2 0 0 0 0 2 A 2 2 0 0 0 0 -2", // Cercle très petit, sens anti-horaire
          duration: 4.3,
          delay: 1.2
        }
      ];

      const levitationTween = gsap.to(ref.current, {
        motionPath: {
          path: variations[i].path,
          autoRotate: false,
          alignOrigin: [0.5, 0.5]
        },
        duration: variations[i].duration,
        ease: "none",
        repeat: -1,
        delay: variations[i].delay
      });

      // Stocker l'animation pour pouvoir l'arrêter/reprendre
      setLevitationAnimations(prev => {
        const newAnimations = [...prev];
        newAnimations[i] = levitationTween;
        return newAnimations;
      });
    }
    });

    // Nettoyer ScrollTrigger quand le composant se démonte
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [bgColor]);

  return (
    <section ref={projetRef} id="projects" className={styles.projet}>
      {/* Tooltip - toujours présent dans le DOM */}
      <div 
        ref={tooltipRef} 
        className={styles.tooltip}
        style={{
          position: 'fixed',
          zIndex: 1000,
          pointerEvents: 'none',
          opacity: tooltipVisible ? 1 : 0,
          visibility: tooltipVisible ? 'visible' : 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          left: '0px',
          top: '0px'
        }}
      >
        {tooltipText}
      </div>

      {/* 4 cartes de projets avec animation de transition */}
      {cardRefs.map((ref, index) => (
        <div 
          key={index} 
          ref={ref} 
          className={`${styles.projectCard} ${styles[`card${index + 1}`]}`}
          onMouseEnter={(e) => handleCardHover(index, e)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleCardLeave}
          onClick={handleNavigation(`/projet/${projets[index].slug}`)}
          style={{ cursor: 'pointer' }}
        >
          {/* Image du projet */}
          {projets[index].imagecard && (
            <img 
              src={projets[index].imagecard} 
              alt={projets[index].name}
              className={styles.projectImage}
            />
          )}
        </div>
      ))}
    </section>
  );
};

export default Projet; 