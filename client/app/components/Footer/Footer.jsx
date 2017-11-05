import React from 'react';
import styles from './Footer.css'
const Footer = () => {
  return (
    <div className={ styles.footerContainer } >
      <div className = { styles.footer } >
          Built using React by <a href="https://tmattlee.github.io"
          style = { { textDecoration:'none',color: 'orange' } } 
          target="_blank"> Matt Lee </a> 
        </div>
        <div className = { styles.footer } > 
          <a href="https://openlibrary.org/developers/api"
            style = { { textDecoration:'none' } } 
            target="_blank"
          >
            Openlibrary.org API
          </a>  
          { ' - ' }
          <a href="https://github.com/TMattLee/bookclub-app" target="_blank"
          style = { { textDecoration:'none',color: 'orange' } } >
            View Source 
          </a>
        </div>
    </div>
  );
}

export default Footer;