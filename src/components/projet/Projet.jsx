'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { getAllProjets } from '../../data/projets';
import styles from './Projet.module.css';
import { useTransitionRouter } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// Enregistrer les plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Projet = ({ bgColor }) => {

  const transitionRouter = useTransitionRouter();
  const fallbackRouter = useRouter();
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
        duration: 1250,
        easing: "cubic-bezier(0.9, 0, 0.1, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  const handleNavigation = (path) => (e) => {
    e.preventDefault();
    
    if (path === pathname) {
      return;
    }

    // Vérifier que le router est prêt
    if (!isRouterReady) {
      console.warn('Router non prêt, tentative de navigation différée...');
      // Réessayer après un court délai
      setTimeout(() => {
        if (isRouterReady) {
          // Utiliser une fonction anonyme pour éviter la récursion
          const navigate = (targetPath) => {
            try {
              if (transitionRouter && typeof transitionRouter.push === 'function') {
                transitionRouter.push(targetPath, {
                  onTransitionReady: triggerPageTransition,
                });
              } else {
                fallbackRouter.push(targetPath);
              }
            } catch (error) {
              console.error('Erreur lors de la navigation:', error);
              fallbackRouter.push(targetPath);
            }
          };
          navigate(path);
        } else {
          console.error('Router toujours non prêt après délai');
        }
      }, 100);
      return;
    }

    try {
      // Essayer d'abord avec le transition router
      if (transitionRouter && typeof transitionRouter.push === 'function') {
        transitionRouter.push(path, {
          onTransitionReady: triggerPageTransition,
        });
      } else {
        // Fallback vers le router standard
        console.warn('Transition router non disponible, utilisation du router standard');
        fallbackRouter.push(path);
      }
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      // Fallback vers le router standard en cas d'erreur
      fallbackRouter.push(path);
    }
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
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  const scrollTriggersRef = useRef([]);

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
      }, i * 0.3); // Délai plus rapide pour une animation plus dynamique
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
    // Vérifier que les animations sont initialisées
    if (!animationsInitialized) {
      return;
    }
    
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
          // Pas de flou sur la carte en hover
          gsap.to(ref.current, {
            filter: 'blur(0px)',
            duration: 0.08,
            ease: "linear"
          });
        } else {
          // Flou sur les autres cartes
          gsap.to(ref.current, {
            filter: 'blur(4px)',
            duration: 0.08,
            ease: "linear"
          });
        }
      }
    });
  };

  const handleCardLeave = (cardIndex) => {
    // Vérifier que les animations sont initialisées
    if (!animationsInitialized) {
      return;
    }
    
    // Masquer le tooltip immédiatement
    setTooltipVisible(false);
    setIsHovering(false);
    
    // Arrêter immédiatement l'animation de défilement des images
    if (imageAnimationTimeline) {
      imageAnimationTimeline.kill();
      setImageAnimationTimeline(null);
    }
    
    // Animation de retour à l'image de base pour la carte quittée seulement
    if (cardRefs[cardIndex] && cardRefs[cardIndex].current) {
      const cardElement = cardRefs[cardIndex].current;
      const mainImg = cardElement.querySelector(`.${styles.projectImage}`);
      
      if (mainImg && projets[cardIndex].imagecard) {
        // Créer une image temporaire pour l'animation de retour
        const tempImg = document.createElement('img');
        tempImg.src = projets[cardIndex].imagecard;
        tempImg.alt = projets[cardIndex].name;
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
              mainImg.src = projets[cardIndex].imagecard;
              
              // Supprimer l'image temporaire
              setTimeout(() => {
                if (tempImg && tempImg.parentNode) {
                  tempImg.remove();
                }
              }, 100);
            }
          });
        };
      }
    }
    
    // Reprendre l'animation de lévitation de la carte quittée seulement
    if (levitationAnimations[cardIndex]) {
      levitationAnimations[cardIndex].resume();
    }
    
    // Retirer le flou de toutes les cartes
    cardRefs.forEach((ref) => {
      if (ref.current) {
        gsap.to(ref.current, {
          filter: 'blur(0px)',
          duration: 0.08,
          ease: "linear"
        });
      }
    });
  };

  // Vérifier que le router est prêt
  useEffect(() => {
    const checkRouterReady = () => {
      const isReady = (transitionRouter && typeof transitionRouter.push === 'function') || 
                     (fallbackRouter && typeof fallbackRouter.push === 'function');
      setIsRouterReady(isReady);
    };

    // Vérifier immédiatement
    checkRouterReady();

    // Vérifier à nouveau après un court délai pour s'assurer que le router est initialisé
    const timer = setTimeout(checkRouterReady, 100);
    
    // Vérifier une troisième fois après un délai plus long pour s'assurer que tout est bien initialisé
    const longTimer = setTimeout(checkRouterReady, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(longTimer);
    };
  }, [transitionRouter, fallbackRouter]);

  useEffect(() => {
    // Attendre que les éléments DOM soient prêts
    const initializeAnimations = () => {
      // Animation de lévitation pour les 4 cartes de projets
      cardRefs.forEach((ref, i) => {
        if (ref.current) {
          // Nettoyer les animations existantes
          if (levitationAnimations[i]) {
            levitationAnimations[i].kill();
          }
          
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
      
      // Marquer les animations comme initialisées
      setAnimationsInitialized(true);
    };

    // Attendre un court délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(initializeAnimations, 50);

    return () => {
      clearTimeout(timer);
      // Nettoyer les animations existantes
      levitationAnimations.forEach(animation => {
        if (animation) {
          animation.kill();
        }
      });
      // Nettoyer seulement les ScrollTrigger créés par ce composant
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger) {
          trigger.kill();
        }
      });
    };
  }, [bgColor, levitationAnimations]);

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
          onMouseLeave={() => handleCardLeave(index)}
          onClick={(e) => {
            // Vérifier que les animations sont initialisées
            if (!animationsInitialized) {
              return;
            }
            
            // Arrêter l'animation de défilement avant la navigation
            if (imageAnimationTimeline) {
              imageAnimationTimeline.kill();
              setImageAnimationTimeline(null);
            }
            handleNavigation(`/projet/${projets[index].slug}`)(e);
          }}
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