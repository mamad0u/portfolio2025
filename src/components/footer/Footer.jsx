'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import styles from './Footer.module.css';
// Enregistrer ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    // Créer le déclencheur pour détecter quand la section contact est en bas
    const contactSection = document.querySelector('.contact');
    
    if (contactSection && footerRef.current) {
      ScrollTrigger.create({
        trigger: contactSection,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 1, // Lie l'animation au scroll
        onUpdate: (self) => {
          // Calculer la progression (0 à 1)
          const progress = self.progress;
          
          // Animer le bottom de -30vh à 0 en fonction du scroll
          const newBottom = -30 + (progress * 30 * 1.4); // De -30vh à 0vh
          
          gsap.set(footerRef.current, {
            bottom: `${newBottom}vh`
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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