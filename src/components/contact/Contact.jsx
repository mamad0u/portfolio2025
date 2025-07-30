'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForm } from 'react-hook-form';
import styles from './Contact.module.css';
import Image from 'next/image';
import { useLenis } from '@/components/hooks/useLenis';
import { sendEmail } from '@/utils/send-email';

// Enregistrer ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const contactRef = useRef(null);
  const contactInfoRef = useRef(null);
  const contactFormRef = useRef(null);
  const formRef = useRef(null);
  const rowsRef = useRef([]);
  const inputGroupsRef = useRef([]);
  const infoSectionsRef = useRef([]);
  const submitButtonRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  
  // États pour la gestion du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Utiliser Lenis pour s'assurer qu'il est prêt
  const { isReady } = useLenis();
  
  // Configuration de react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    // Attendre que Lenis soit initialisé
    if (!isReady) return;
    
    const timer = setTimeout(() => {
    // Animation des éléments de contact (sauf contactText)
    const elementsToAnimate = [
      contactFormRef.current,
      formRef.current,
      ...rowsRef.current,
      ...inputGroupsRef.current,
      submitButtonRef.current,
      ...infoSectionsRef.current
    ].filter(Boolean);

    // Position initiale : cachés en bas
    gsap.set(elementsToAnimate, {
      y: "100%"
    });

    // Animation d'apparition au scroll - chaque élément avec la même durée
    elementsToAnimate.forEach((element, index) => {
        const trigger = gsap.to(element, {
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
        
        // Stocker la référence du ScrollTrigger
        if (trigger.scrollTrigger) {
          scrollTriggersRef.current.push(trigger.scrollTrigger);
        }
    });
    }, 100); // Délai pour s'assurer que Lenis est prêt

    return () => {
      clearTimeout(timer);
      // Nettoyer seulement les ScrollTrigger créés par ce composant
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger) {
          trigger.kill();
        }
      });
    };
  }, [isReady]);

  const addToRowsRef = (el) => {
    if (el && !rowsRef.current.includes(el)) {
      rowsRef.current.push(el);
    }
  };

  const addToInputGroupsRef = (el) => {
    if (el && !inputGroupsRef.current.includes(el)) {
      inputGroupsRef.current.push(el);
    }
  };

  const addToInfoSectionsRef = (el) => {
    if (el && !infoSectionsRef.current.includes(el)) {
      infoSectionsRef.current.push(el);
    }
  };

  // Fonction de soumission du formulaire
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const result = await sendEmail(data);
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        reset(); // Réinitialiser le formulaire
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Erreur lors de l\'envoi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={contactRef} id="contact" className={`${styles.contact} contact`}>
        <div className={styles.contactContent}>
            <div className={styles.contactText}>
                <p>Crée un sites web dont les gens se souviendront.</p>
                <div ref={contactInfoRef} className={styles.contactInfo}>
            <div ref={addToInfoSectionsRef} className={styles.infoSection}>
                <h3>CONTACT</h3>
                <p>HELLO@MAMADOU.STUDIO</p>
            </div>
            <div ref={addToInfoSectionsRef} className={styles.infoSection}>
                <h3>LOCALISATION</h3>
                <p>BORDEAUX - FRANCE</p>
            </div>
        </div>
            </div>
            <div ref={contactFormRef} className={styles.contactForm}>
                <form ref={formRef} className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div ref={addToRowsRef} className={styles.row}>
                        <div ref={addToInputGroupsRef} className={styles.inputGroup}>
                            <input 
                                type="text" 
                                placeholder='Nom' 
                                className={styles.input}
                                {...register('name', { required: 'Le nom est requis' })}
                            />
                            {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                        </div>
                        <div ref={addToInputGroupsRef} className={styles.inputGroup}>
                            <input 
                                type="email" 
                                placeholder='Email' 
                                className={styles.input}
                                {...register('email', { 
                                    required: 'L\'email est requis',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Email invalide'
                                    }
                                })}
                            />
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                        </div>
                    </div>
                    <div ref={addToRowsRef} className={styles.row}>
                        <div ref={addToInputGroupsRef} className={styles.inputGroup}>
                            <input 
                                type="text" 
                                placeholder='Sujet' 
                                className={styles.input}
                                {...register('subject', { required: 'Le sujet est requis' })}
                            />
                            {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
                        </div>
                        <div ref={addToInputGroupsRef} className={styles.inputGroup}>
                            <input 
                                type="text" 
                                placeholder='Téléphone' 
                                className={styles.input}
                                {...register('phone')}
                            />
                        </div>
                    </div>
                    <div ref={addToInputGroupsRef} className={styles.inputGroup}>
                        <textarea 
                            placeholder='Message' 
                            className={styles.textarea} 
                            rows="5"
                            {...register('message', { required: 'Le message est requis' })}
                        ></textarea>
                        {errors.message && <span className={styles.error}>{errors.message.message}</span>}
                    </div>
                    
                    {/* Message de statut */}
                    {submitStatus && (
                        <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
                            {submitStatus.message}
                        </div>
                    )}
                    
                    <button 
                        ref={submitButtonRef} 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        <span>{isSubmitting ? 'ENVOI...' : 'ENVOYER'}</span>
                        <Image src="/images/arrow-contact.svg" alt="arrow" width={20} height={20} className={styles.arrow} />
                    </button>
                </form>
            </div>
        </div>
    
    </section>
  );
};

export default Contact; 