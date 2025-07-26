'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Header.module.css';
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = ({ shouldAnimate = false }) => {
  
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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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
            <a ref={projectsRef} onClick={handleScrollToSection('projects')} href="#projects" className={styles.navLink}>Projets</a>
          </div>
          <div ref={contactContainerRef} className={styles.linkContainer}>
            <a ref={contactRef} onClick={handleScrollToSection('contact')} href="#contact" className={styles.navLink}>Contact</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 