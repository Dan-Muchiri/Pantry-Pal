import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeaderStyles.module.css';
import sun from "../../assets/sun.svg"
import moon from "../../assets/moon.svg"
import { useTheme } from "../../common/ThemeContext"

function Header() {
    const {theme, toggleTheme} = useTheme();

    const themeIcon = theme === "light" ? sun : moon;

  return (
    <>
    <header className={styles.header}>
      <div className={styles.logo}>PantryPal</div>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/pantry">Pantry</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <div onClick={toggleTheme}>
        <img className={styles.themeIcon} src={themeIcon} alt="theme icon"/>
      </div>
    </header>
    </>
    
    
  );
}

export default Header;
