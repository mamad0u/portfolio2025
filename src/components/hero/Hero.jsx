'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import Header from '../header/Header';

// Enregistrer ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const containerRef = useRef(null);
  const subtitleContainerRef = useRef(null);
  const subtitle1Ref = useRef(null);
  const subtitle2Ref = useRef(null);
  const subtitle3Ref = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollTextRef = useRef(null);
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const name = "Mamadou Sylla";
    const letters = name.split('');
    
    // Créer les spans pour chaque lettre
    const letterElements = letters.map((letter, index) => {
      const span = document.createElement('span');
      span.className = styles.letter;
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(100%)';
      return span;
    });

    // Vider le contenu et ajouter les lettres
    if (nameRef.current) {
      nameRef.current.innerHTML = '';
      letterElements.forEach(letter => {
        nameRef.current.appendChild(letter);
      });
    }

    // S'assurer que les textes sont cachés au début (en bas)
    if (text1Ref.current) text1Ref.current.style.transform = 'translateY(100%)';
    if (text2Ref.current) text2Ref.current.style.transform = 'translateY(100%)';
    if (text3Ref.current) text3Ref.current.style.transform = 'translateY(100%)';
    if (scrollTextRef.current) scrollTextRef.current.style.transform = 'translateY(100%)';

    // Calculer l'ordre d'animation (du milieu vers les extrémités)
    const centerIndex = Math.floor(letters.length / 2);
    const animationOrder = [];
    
    // Ajouter l'index du milieu
    animationOrder.push(centerIndex);
    
    // Ajouter les indices alternés autour du centre
    for (let i = 1; i <= centerIndex; i++) {
      if (centerIndex - i >= 0) {
        animationOrder.push(centerIndex - i);
      }
      if (centerIndex + i < letters.length) {
        animationOrder.push(centerIndex + i);
      }
    }

    // Animation lettre par lettre avec délai
    const tl = gsap.timeline();
    
    animationOrder.forEach((letterIndex, orderIndex) => {
      tl.to(letterElements[letterIndex], {
        y: 0,
        duration: 0.7,
        ease: "power3.out"
      }, orderIndex * 0.04);
    });

    // Calculer la durée totale de l'animation des lettres
    const totalLetterDuration = (animationOrder.length - 1) * 0.04 + 0.7;
    
    // Animation de remplacement parfait : h1 disparaît pendant que les lignes apparaissent
    tl.to(nameRef.current, {
      y: -200,
      duration: 1.2,
      ease: "power2.inOut"
    }, totalLetterDuration + 0.5)
    .to([text1Ref.current, text2Ref.current, text3Ref.current, scrollTextRef.current], {
      y: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=1.2")
    .call(() => {
      // Activer l'animation du header en même temps
      setShowHeader(true);
    }, [], "-=1.2");

    // Animation pour remettre la couleur d'origine quand on revient sur le Hero
    gsap.to('body', {
      backgroundColor: '#223307',
      duration: .5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 60%",
        end: "top 30%",
        toggleActions: "play reverse play reverse"
      }
    });

    // Nettoyer ScrollTrigger quand le composant se démonte
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <Header shouldAnimate={showHeader} />
      
      <div className={styles.nameContainer}>
        <div ref={containerRef} className={styles.textContainer}>
          <h1 ref={nameRef} className={styles.name}>
            Mamadou Sylla
          </h1>
        </div>
      </div>
      
      <div ref={subtitleContainerRef} className={styles.subtitleContainer}>
        <div ref={subtitle1Ref} className={styles.subtitleLineContainer}>
          <p ref={text1Ref} className={styles.subtitleText}>
            Un développeur web qui allie
          </p>
        </div>
        <div ref={subtitle2Ref} className={styles.subtitleLineContainer}>
          <p ref={text2Ref} className={styles.subtitleText}>
            code propre, souci du détail
          </p>
        </div>
        <div ref={subtitle3Ref} className={styles.subtitleLineContainer}>
          <p ref={text3Ref} className={styles.subtitleText}>
            et expérience utilisateur.
          </p>
        </div>
      </div>

      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <p ref={scrollTextRef} className={styles.scrollText}>
          SCROLL
        </p>
      </div>
    </section>
  );
};

export default Hero; 