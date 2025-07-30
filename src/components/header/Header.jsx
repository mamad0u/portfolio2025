'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Header.module.css';
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLenis } from '@/components/hooks/useLenis';

const Header = ({ shouldAnimate = false }) => {
  
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { lenis, isReady } = useLenis();

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
    if (path === pathname) {
      e.preventDefault();
      return;
    }

    router.push(path, {
      onTransitionReady: triggerPageTransition,
    });
  };

  const handleScrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    
    // Si on est déjà sur la page d'accueil, faire un scroll direct
    if (pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element && lenis && isReady) {
        lenis.scrollTo(element, {
          offset: -100,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    } else {
      // Sinon, utiliser la transition de page pour naviguer vers la section
      router.push(`/#${sectionId}`, {
        onTransitionReady: triggerPageTransition,
      });
    }
  };

  const headerRef = useRef(null);
  const nameContainerRef = useRef(null);
  const nameRef = useRef(null);
  const projectsContainerRef = useRef(null);
  const projectsRef = useRef(null);
  const contactContainerRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // S'assurer que les éléments sont cachés au début
    if (nameRef.current) nameRef.current.style.transform = 'translateY(100%)';
    if (projectsRef.current) projectsRef.current.style.transform = 'translateY(100%)';
    if (contactRef.current) contactRef.current.style.transform = 'translateY(100%)';

    if (shouldAnimate) {
      // Animation des éléments du header en même temps que les textes du hero
      const tl = gsap.timeline();
      
      tl.to([nameRef.current, projectsRef.current, contactRef.current], {
        y: 0,
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
  }, [shouldAnimate]);

  // Gérer le scroll vers les sections quand on arrive avec une ancre dans l'URL
  useEffect(() => {
    if (pathname === '/' && isReady && lenis) {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Enlever le #
        const element = document.getElementById(sectionId);
        if (element) {
          // Attendre un peu que la page soit chargée
          setTimeout(() => {
            lenis.scrollTo(element, {
              offset: -100,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }, 500);
        }
      }
    }
  }, [pathname, isReady, lenis]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.container}>
        <div ref={nameContainerRef} className={styles.nameContainer}>
          <div ref={nameRef} className={styles.name}>
            <Link onClick={handleNavigation('/')} href="/" className={styles.navLink}>
            Mamadou Sylla
            </Link>
          </div>
        </div>
        <div className={styles.nav}>
          <div ref={projectsContainerRef} className={styles.linkContainer}>
            <Link ref={projectsRef} onClick={handleScrollToSection('projects')} href="/#projects" className={styles.navLink}>Projets</Link>
          </div>
          <div ref={contactContainerRef} className={styles.linkContainer}>
            <Link ref={contactRef} onClick={handleScrollToSection('contact')} href="/#contact" className={styles.navLink}>Contact</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 