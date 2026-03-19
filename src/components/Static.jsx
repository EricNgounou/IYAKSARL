import React, { use } from 'react';
import { useRef, useEffect, useState } from 'react';

import { useLocation, Link, NavLink } from 'react-router-dom';
import { setBarInfo } from './pages/Shop';
import { setFullDisplay } from './pages/Shop';
import { sectionRef } from './pages/Home';

export function NavBar({ navBarOb }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState({
    cur: 0,
    last: 0,
  });
  const [barHidden, setBarHidden] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY((prevState) => {
        return { cur: window.scrollY, last: prevState.cur };
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setBarHidden(
      scrollY.cur > scrollY.last ? (window.scrollY > 90 ? true : false) : false,
    );
  }, [scrollY]);

  if (barHidden && menuOpen) {
    setMenuOpen(false);
  }

  setBarInfo({
    isBarHidden: barHidden,
    isMenuOpened: menuOpen,
    size: window.scrollY !== 0 && !barHidden ? 90 : 0,
  });

  return (
    <>
      <div className={`bar ${barHidden ? 'hidden' : ''}`}>
        <Link
          className="shop_label"
          to={`/${
            navBarOb.currentUser && navBarOb.currentUser.role === 'admin'
              ? 'data-control/products'
              : ''
          }`}
        >
          <img src="/woman-avatar.png" alt="Avatr woman" />
          <div>
            <span className="shop_name">IYAKSARL</span>
            <span className="sub_label"> Online shopping</span>
          </div>
        </Link>
        <ul className={`nav_links ${menuOpen && !barHidden ? 'open' : ''}`}>
          <NavLink className={`nav_item`} to="/">
            Home
          </NavLink>
          <NavLink className={`nav_item`} to="/shop">
            Shop
          </NavLink>
          <NavLink className={`nav_item`} to="/blog">
            Blog
          </NavLink>
          <NavLink className={`nav_item`} to="/about">
            About
          </NavLink>
        </ul>

        <NavLink to="/cart" className="shopping-cart">
          <img src="/shopping-cart.png" alt="Shopping cart" />
          <span className="count_label">{navBarOb.itemCount}</span>
          <span className="cart_label">Cart</span>
        </NavLink>

        {navBarOb.currentUser ? (
          <Link to="/users" id="user-index">
            <strong>
              {navBarOb.currentUser.username.slice(0, 1).toUpperCase()}
            </strong>
            <span id="user-label">Account</span>
          </Link>
        ) : (
          <Link to="/login" id="sign-label">
            Sign in
          </Link>
        )}

        <div
          className="menu"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div
        className={`menu_space ${
          menuOpen && window.scrollY === 0 ? 'active' : ''
        }`}
      ></div>
    </>
  );
}

export function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFullDisplay(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const viewOnScroll = (el) => {
    el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef}>
      <div className="site_pages">
        <h3>View in this site</h3>
        <ul>
          <li>
            <Link to="/"> Home</Link>
          </li>

          <p>
            <Link
              to="/"
              onClick={() => {
                window.scrollTo(0, 0);
                setTimeout(() => {
                  viewOnScroll(sectionRef.section1.current);
                }, 500);
              }}
            >
              Our Products
            </Link>
          </p>
          <p>
            <Link
              onClick={() => {
                window.scrollTo(0, 0);
                setTimeout(() => {
                  viewOnScroll(sectionRef.section2.current);
                }, 500);
              }}
              to="/"
            >
              Wy buy from us?
            </Link>
          </p>
          <li>
            <Link to="/shop"> Shop</Link>
          </li>
          <li>
            <Link to="/blog"> Blog</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>

      <div className="support">
        <h3>Help & Support</h3>
        <ul>
          <li>FQA</li>
          <li>Delevery</li>
          <div className="payment">
            <h4>Accepted Payment methods</h4>
            <img src="/MTN&ORANGE.jpeg" alt="MTN&ORANGE" />
          </div>
          <div className="cust_support">
            <h4>Customer support</h4>
            <p>Phone & Whatsapp :</p>
            <p> (+237) 652 22 24 78 / 657 35 74 30 </p>
            <p>Email : ilarysangang@gmail.com </p>
          </div>
        </ul>
      </div>

      <div className="social">
        <h3>Follow us: </h3>
        <ul>
          <li>
            <a
              href="https://www.facebook.com/profile.php?id=100077409074151"
              target="blank"
            >
              <img src="/facebook.png" alt="Facebook" />
            </a>
          </li>
          <li>
            <img src="/tiktok.png" alt="Tiktok" />
          </li>
          <li>
            <img src="/instagram.png" alt="Instagram" />
          </li>
        </ul>
      </div>
      <p className="copyright">
        &copy; 2025 Copyright by IYAKSARL.org <br />
        <em>Developed by YTECH</em>
      </p>
    </footer>
  );
}

export function Overlay({ content, setOverlay, digitInput }) {
  return (
    <div
      className="overlay"
      onClick={(e) => {
        setOverlay && setOverlay(false);
        digitInput && digitInput.focus();
      }}
    >
      {content}
    </div>
  );
}
