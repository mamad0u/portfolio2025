'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Animation d'entrée pour la nouvelle page
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // S'assurer que le main est visible pour la nouvelle page
      gsap.set(mainElement, { opacity: 1 });
    }
  }, [pathname]);

  // Fonction pour déclencher la transition de sortie
  const triggerPageTransition = (targetPath) => {
    setIsTransitioning(true);
    
    const mainElement = document.querySelector('main');
    if (mainElement) {
      gsap.to(mainElement, {
        opacity: 0,
        duration: 0.2, // Réduire la durée
        ease: "power2.inOut",
        onComplete: () => {
          // Utiliser le router Next.js au lieu de window.location.href
          if (typeof window !== 'undefined' && window.router) {
            window.router.push(targetPath);
          } else {
            // Fallback si le router n'est pas disponible
            window.location.href = targetPath;
          }
        }
      });
    }
  };

  // Exposer la fonction globalement pour l'utiliser dans d'autres composants
  useEffect(() => {
    window.triggerPageTransition = triggerPageTransition;
    
    return () => {
      delete window.triggerPageTransition;
    };
  }, []);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition; 