import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [reservaOpen, setReservaOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleToggle = () => setOpen(!open);
  const handleClose = () => {
    setOpen(false);
    setReservaOpen(false);
  };
  

  const handleReservaToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReservaOpen((prev) => !prev);
  };

  const handleDropdownLinkClick = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    // Forzar navegación con window.location para asegurar que funcione
    window.location.href = href;
  };

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open && reservaOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setReservaOpen(false);
      }
    };

    // Agregar un pequeño delay para evitar conflicto con el toggle
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reservaOpen, open]);

  // Detecta si es mobile (menu hamburguesa abierto)
  const isMobile = open;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <span className={styles.logoText}>Olivia</span>
        <span className={styles.logoSubtext}>PASTELERÍA Y CAFÉ</span>
      </div>
      <button className={styles.hamburger} onClick={handleToggle} aria-label="Abrir menú">
        <span className={open ? styles.barOpen : styles.bar}></span>
        <span className={open ? styles.barOpen : styles.bar}></span>
        <span className={open ? styles.barOpen : styles.bar}></span>
      </button>
      <ul className={`${styles.menu} ${open ? styles.menuOpen : ''}`}>
          {isMobile && (
            <li className={styles.menuCloseRow}>
              <button className={styles.menuCloseBtn} onClick={handleClose} aria-label="Cerrar menú">
                ×
              </button>
            </li>
          )}
          {isMobile ? (
            <>
              <li onClick={handleClose} className={styles.menuIconItem}>
                <img src="/icons/inicio.svg" alt="Inicio" className={styles.menuIconImg} />
                <Link href="/">Inicio</Link>
              </li>
              <li onClick={handleClose} className={styles.menuIconItem}>
                <img src="/icons/carta.svg" alt="Carta" className={styles.menuIconImg} />
                <a href="https://oliviacafeteria-production.up.railway.app/menu-pdf/download" target="_blank" rel="noopener noreferrer">Carta</a>
              </li>
              <li onClick={handleReservaToggle} className={reservaOpen ? styles.menuIconItemOpen : styles.menuIconItem} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <img 
                  src={reservaOpen ? "/icons/reservas-open.svg" : "/icons/reservas.svg"}
                  alt="Reservas" 
                  className={styles.menuIconImg}
                />
                Reservas
              </li>
              {reservaOpen && (
                <div className={styles.accordionContent}>
                  <li onClick={handleClose} className={styles.menuAccordionItem}>
                    <img src="/icons/carta.svg" alt="A la Carta" className={styles.menuIconImg} />
                    <Link href="/a-la-carta">A la Carta</Link>
                  </li>
                  <li onClick={handleClose} className={styles.menuAccordionItem}>
                    <img src="/icons/merienda.svg" alt="Meriendas Libres" className={styles.menuIconImg} />
                    <Link href="/meriendas-libres">Meriendas Libres</Link>
                  </li>
                  <li onClick={handleClose} className={styles.menuAccordionItem}>
                    <img src="/icons/te.svg" alt="Tardes de Té" className={styles.menuIconImg} />
                    <Link href="/tardes-de-te">Tardes de Té</Link>
                  </li>
                </div>
              )}
              <li onClick={handleClose} className={styles.menuIconItem}>
                <img src="/icons/gift.svg" alt="Gift Cards" className={styles.menuIconImg} />
                <Link href="/giftcard">Gift Card</Link>
              </li>
              <li onClick={handleClose} className={styles.menuIconItem}>
                <img src="/icons/nosotros.svg" alt="Nosotros" className={styles.menuIconImgLarge} />
                <Link href="/nosotros">Nosotros</Link>
              </li>
            </>
          ) : (
            <>
              <li onClick={handleClose}>
                <Link href="/">Inicio</Link>
              </li>
              <li onClick={handleClose}>
                <a href="https://oliviacafeteria-production.up.railway.app/menu-pdf/download" target="_blank" rel="noopener noreferrer">Carta</a>
              </li>
              <li ref={dropdownRef} className={`${styles.dropdown} ${reservaOpen ? styles.dropdownOpen : ''}`} tabIndex={0}>
                <span onClick={handleReservaToggle}>Reservas</span>
                <div className={`${styles.dropdownContent} ${reservaOpen ? styles.dropdownContentOpen : ''}`}>
                  <a href="/a-la-carta" onClick={(e) => handleDropdownLinkClick(e, '/a-la-carta')}>A la Carta</a>
                  <a href="/meriendas-libres" onClick={(e) => handleDropdownLinkClick(e, '/meriendas-libres')}>Meriendas Libres</a>
                  <a href="/tardes-de-te" onClick={(e) => handleDropdownLinkClick(e, '/tardes-de-te')}>Tardes de Té</a>
                </div>
              </li>
              <li onClick={handleClose}>
                <Link href="/giftcard">Gift Card</Link>
              </li>
              <li onClick={handleClose}>
                <Link href="/nosotros">Nosotros</Link>
              </li>
            </>
          )}
        </ul>
        {open && <div className={styles.menuOverlay} onClick={handleClose}></div>}
    </nav>
  );
};

export default Navbar; 