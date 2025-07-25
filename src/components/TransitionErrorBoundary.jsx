'use client';

import { useEffect, useState } from 'react';

const TransitionErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Écouter les erreurs de transition
    const handleTransitionError = (event) => {
      if (event.message && event.message.includes('Transition was aborted')) {
        console.warn('Transition timeout détecté, réinitialisation...');
        setHasError(true);
        
        // Réinitialiser après un court délai
        setTimeout(() => {
          setHasError(false);
        }, 100);
      }
    };

    // Écouter les erreurs globales
    window.addEventListener('error', handleTransitionError);
    
    // Écouter les rejets de promesses
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && event.reason.message.includes('Transition')) {
        handleTransitionError(event.reason);
      }
    });

    return () => {
      window.removeEventListener('error', handleTransitionError);
    };
  }, []);

  // Si une erreur de transition est détectée, afficher un fallback
  if (hasError) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#223307',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px'
      }}>
        Chargement...
      </div>
    );
  }

  return children;
};

export default TransitionErrorBoundary; 