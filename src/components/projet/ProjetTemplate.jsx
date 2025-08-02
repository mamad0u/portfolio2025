'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import styles from './ProjetTemplate.module.css';
import { ImageScrollAnimation } from '@/components/animprojetscroll';
import { useLenis } from '@/components/hooks/useLenis';
import Footer from '@/components/footer/Footer';
import Contact from '@/components/contact/Contact';
// Enregistrer le plugin
gsap.registerPlugin(ScrollTrigger);

const ProjetTemplate = ({ projet }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const techRef = useRef(null);
  const linksRef = useRef(null);
  const contentContainerRef = useRef(null);
  const fullDescriptionRef = useRef(null);

  // Initialiser Lenis pour le scroll smooth
  const { isReady } = useLenis();

  useEffect(() => {
    // Animation d'entrée du container (opacité 0 à 1 en 1s)
    gsap.to(containerRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2"
    });

    // Animation overflowHiddenSlideUp pour le h1 avec les adjectifs
    const animateTitle = () => {
      const adjetiveSpans = titleRef.current?.querySelectorAll(`.${styles.adjetive} span`);
      
      if (adjetiveSpans && adjetiveSpans.length > 0) {
        console.log('Adjectifs trouvés:', adjetiveSpans.length); // Debug
        
        // Position initiale : cachés en bas
        gsap.set(adjetiveSpans, {
          y: "100%",
          opacity: 0
        });

        // Animation d'apparition avec délai
        gsap.to(adjetiveSpans, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1 // Délai entre chaque adjectif
        });
      } else {
        console.log('Aucun adjectif trouvé'); // Debug
      }
    };

    // Animation overflowHiddenSlideUp pour le contentContainer
    const animateContent = () => {
      const contentElements = contentContainerRef.current?.querySelectorAll('p, button');
      
      if (contentElements && contentElements.length > 0) {
        console.log('Éléments de contenu trouvés:', contentElements.length); // Debug
        
        // Position initiale : cachés en bas
        gsap.set(contentElements, {
          y: "100%",
          opacity: 0
        });

        // Animation d'apparition avec délai
        gsap.to(contentElements, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.05 // Délai entre chaque élément
        });
      } else {
        console.log('Aucun élément de contenu trouvé'); // Debug
      }
    };

    // Animation overflowHiddenSlideUp pour le fullDescription au scroll
    const animateFullDescription = () => {
      if (fullDescriptionRef.current) {
        console.log('Animation fullDescription démarrée'); // Debug
        
        // Position initiale : caché en bas
        gsap.set(fullDescriptionRef.current, {
          y: "100%",
          opacity: 0
        });

        // Animation directe avec délai au lieu du ScrollTrigger
        gsap.to(fullDescriptionRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 2, // Délai de 2 secondes pour s'assurer que l'élément est visible
          onComplete: () => console.log('Animation fullDescription terminée') // Debug
        });
      } else {
        console.log('fullDescriptionRef.current est null'); // Debug
      }
    };

    // Délai pour l'animation du titre
    const timer1 = setTimeout(animateTitle, 1500);
    // Délai pour l'animation du contenu (après le titre)
    const timer2 = setTimeout(animateContent, 1600);
    // Animation du fullDescription au scroll
    animateFullDescription();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [projet]);

  return (
    <>
    <div ref={containerRef} className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
        <div className={styles.imageContainer}>
        <img src={projet.imagecard} alt={projet.name} className={styles.image} />
        </div>
        </div>
        <div className={styles.right}>
        <div className={styles.titleContainer}>
        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.adjetive}>{projet.adjetive.map((adjetive, index) => (
            <span key={index}>{adjetive}</span>
          ))}</span>
        </h1>
        </div>
        <div ref={contentContainerRef} className={styles.contentContainer}>
        <div className={styles.projetContainer}>
          <div className={styles.projetLeft}>
          <p className={styles.projetTitle}> CLIENT  </p>
          <p className={styles.projetService}> {projet.client}</p>
          </div>
          <div className={styles.projetRight}>
          <p className={styles.projetTitle}> SERVICES  </p>
          <p className={styles.projetService}> {projet.service}</p>
          </div>
        </div>
          <div className={styles.fullDescriptionContainer}>
            <p className={styles.projetTitlehiden}> <button>VOIR <img src="/images/arrow.png" alt="" /></button>  </p>
          <p className={styles.Description}>{projet.descriptiontech}</p>
          </div>
        </div>
      </div>
      </div>



<section>
  <div className={styles.texteprojetcontaineur}>
  <p ref={fullDescriptionRef} className={styles.fullDescription}>{projet.fullDescription}</p>
  </div>
</section>

<ImageScrollAnimation 
  imageSrc="/images/blurry/blurry1.webp"
  alt="Image animée"
/>
          <section className={styles.monrole}>
            <div className={styles.monroleContainer}>
              <p className={styles.monroleTitle}> MON RÔLE </p>
              <p className={styles.monroleDescription}> {projet.monrole} </p>
            </div> 
          </section>
      </div>
      
        {/* <Contact /> */}
        <div className="contact" id="contact"></div>
      <Footer />
    </>
  );
};

export default ProjetTemplate;