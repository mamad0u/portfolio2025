'use client';
import { notFound } from 'next/navigation';
import ProjetTemplate from '../../../components/projet/ProjetTemplate';
import { getProjetBySlug } from '../../../data/projets';
import styles from './page.module.css';
import { useRevealer } from '@/components/hooks/useRevealer';
import { use } from 'react';
import Header from '@/components/header/Header';
import InteractiveGradient from '@/components/fond/InteractiveGradient';
export default function ProjetPage({ params }) {
   useRevealer();
  const { slug } = use(params);
  const projet = getProjetBySlug(slug);

  if (!projet) {
    notFound();
  }

  return (
    <>
      <div className="revealer"></div>
      <InteractiveGradient />

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
      
      <main className={styles.main}>
      <Header shouldAnimate={true} />
        <ProjetTemplate projet={projet} />
      </main>
    </>
  );
} 