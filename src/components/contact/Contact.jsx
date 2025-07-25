'use client';

import styles from './Contact.module.css';
import Image from 'next/image';

const Contact = () => {


  return (
    <section id="contact" className={`${styles.contact} contact`}>
        <div className={styles.contactContent}>
            <div className={styles.contactText}>
                <p>Crée un sites web dont les gens se souviendront.</p>
                <div className={styles.contactInfo}>
            <div className={styles.infoSection}>
                <h3>CONTACT</h3>
                <p>HELLO@MAMADOU.STUDIO</p>
            </div>
            <div className={styles.infoSection}>
                <h3>LOCALISATION</h3>
                <p>BORDEAUX - FRANCE</p>
            </div>
        </div>
            </div>
            <div className={styles.contactForm}>
                <form className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input type="text" placeholder='Nom' className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="email" placeholder='Email' className={styles.input} />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <input type="text" placeholder='Sujet' className={styles.input} />
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="text" placeholder='Téléphone' className={styles.input} />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <textarea placeholder='Message' className={styles.textarea} rows="5"></textarea>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        <span>ENVOYER</span>
                       <Image src="/images/arrow-contact.svg" alt="arrow" width={20} height={20} className={styles.arrow} />
                    </button>
                </form>
            </div>
        </div>
    
    </section>
  );
};

export default Contact; 