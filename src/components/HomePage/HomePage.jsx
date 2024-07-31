import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePageStyles.module.css';
import pantry from "../../assets/pantry.avif"

function HomePage() {
  return (
    <div className={styles.homepage}>
        <section className={styles.imgContainer}>
        <img className={styles.imgPantry}src={pantry} alt="pantry image"/>
        </section>
        <main className={styles.mainPart}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                <h1>Welcome to PantryPal</h1>
                <p>Organize your pantry, plan meals, and reduce food waste with ease.</p>
                <Link to="/register" className={styles.ctaButton}>Get Started</Link>
                </div>
            </section>
            <section className={styles.features}>
                <div className={styles.feature}>
                    <h2>Track Your Pantry</h2>
                    <p>Keep an inventory of your pantry items, so you always know what you have.</p>
                </div>
                <div className={styles.feature}>
                    <h2>Generate Recipes</h2>
                    <p>Get recipe suggestions based on the ingredients you have in your pantry.</p>
                </div>
                <div className={styles.feature}>
                    <h2>Reduce Food Waste</h2>
                    <p>Plan your meals efficiently and reduce food waste by using up ingredients.</p>
                </div>
            </section>
        </main>
    </div>
  );
}

export default HomePage;
