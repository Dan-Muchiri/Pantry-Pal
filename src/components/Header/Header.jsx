import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeaderStyles.module.css';
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import { useTheme } from "../../common/ThemeContext";
import useAuthStore from '../../common/AuthStore';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const themeIcon = theme === "light" ? sun : moon;
  const { isLoggedIn } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>PantryPal</div>
      <nav className={styles.nav}>
        <ul>
          {isLoggedIn ? (
            <>
              <li><Link to="/pantry">Pantry</Link></li>
              <li><Link to="/recipes">Recipes</Link></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
        <div onClick={toggleTheme}>
          <img className={styles.themeIcon} src={themeIcon} alt="theme icon" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
