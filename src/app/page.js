'use client';
import Hero from '../components/hero/Hero';
import Projet from '../components/projet/Projet';
import Footer from '../components/footer/Footer';
import styles from "./page.module.css";
import InteractiveGradient from '../components/fond/InteractiveGradient';
import { useRevealer } from '@/components/hooks/useRevealer';
import { useLenis } from '@/components/hooks/useLenis';
import Contact from '../components/contact/Contact';

export default function Home() {
  useRevealer();
  useLenis(); // Initialiser Lenis pour le scroll smooth

  return (
    <>
      <div className="revealer">
      </div>

      {/* Vidéo d'arrière-plan */}
      <video 
        className="videoBackground" 
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/video/graintest.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      
      {/* Overlay pour améliorer la lisibilité */}
      <InteractiveGradient />
      
      
      <main className={styles.main}>
        <Hero />
        <Projet />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
