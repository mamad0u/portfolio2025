'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import styles from './Footer.module.css';
import { useLenis } from '@/components/hooks/useLenis';

// Enregistrer ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const initialViewportHeightRef = useRef(null); // Stocker la hauteur initiale
  
  // État pour détecter si on est sur mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Utiliser Lenis pour s'assurer qu'il est prêt
  const { isReady } = useLenis();

  // Fonction pour détecter la taille d'écran
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Détecter la taille d'écran au montage et lors du redimensionnement
  useEffect(() => {
    checkIsMobile();
    // Stocker la hauteur initiale de l'écran
    initialViewportHeightRef.current = window.innerHeight;
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // Attendre que Lenis soit initialisé
    if (!isReady) return;
    
    const timer = setTimeout(() => {
    // Créer le déclencheur pour détecter quand la section contact est en bas
    const contactSection = document.querySelector('.contact');
    
    if (contactSection && footerRef.current) {
        scrollTriggerRef.current = ScrollTrigger.create({
        trigger: contactSection,
        start: isMobile ? "bottom 95%" : "bottom bottom", // Ajuster le trigger pour mobile
        end: "bottom top",
        scrub: 1, // Lie l'animation au scroll
        onUpdate: (self) => {
          // Calculer la progression (0 à 1)
          const progress = self.progress;
          
          // Utiliser la hauteur initiale stockée pour éviter les changements
          const viewportHeight = initialViewportHeightRef.current || window.innerHeight;
          const initialBottom = -(viewportHeight * 0.3); // -30% de la hauteur de l'écran
          
          // Animer le bottom de initialBottom à 0 en fonction du scroll
          const newBottom = initialBottom + (progress * Math.abs(initialBottom) * 1.4);
          
          gsap.set(footerRef.current, {
            bottom: `${newBottom}px`
          });
        },
        onEnter: () => {
          console.log('Section contact en bas de l\'écran - Animation commencée');
        },
        onLeave: () => {
          console.log('Section contact sort du bas de l\'écran - Animation terminée');
        },
        onEnterBack: () => {
          console.log('Section contact revient en bas de l\'écran');
        },
        onLeaveBack: () => {
          console.log('Section contact sort du haut de l\'écran');
        }
      });
    }
    }, 150); // Délai légèrement plus long pour le footer

    return () => {
      clearTimeout(timer);
      // Nettoyer seulement le ScrollTrigger créé par ce composant
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [isReady, isMobile]); // Ajouter isMobile comme dépendance

  return (
    <div 
      className={styles.footerContainer}
      style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
      <div 
        ref={footerRef}
        className={styles.fixedFooter}
      >
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.topfooter}>
              <div className={styles.topfootercontent}>
                <div className={styles.city}>BORDEAUX,FRANCE UTC+1 -  </div>
                <div className={styles.citations}>LE FUTURE EST ENTRE VOS MAINS</div>
              </div>
              <div className={styles.textanimation}>
                <div className={styles.textanimationcontent}>
                <div className={styles.textanimationitem}>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p> 
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
            <p>MAMADOU SYLLA</p>
            <p>-</p>
          </div>
                </div>
              </div>
            </div>
            <div className={styles.bottomfooter}></div>
            <div className={styles.legal}>
              <p>© 2025 Mamadou Sylla. Tous droits réservés.</p>
              <p>Mentions légales</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer; 