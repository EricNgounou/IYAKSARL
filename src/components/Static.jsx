import { use, useEffect, useState } from 'react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrollY, setScrollY] = useState({
    cur: 0,
    last: 0,
  });

  const [barHidden, setBarHidden] = useState(false);

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
    setBarHidden(scrollY.cur > scrollY.last ? true : false);
  }, [scrollY]);

  return (
    <>
      <div className={`bar ${barHidden ? 'hidden' : ''}`}>
        <div className="shop_label">
          <img src="var-img.jpg" alt="Bag-img" />
          <div>
            <span className="shop_name">IYAKSARL</span>
            <span className="sub_label"> Online shopping</span>
          </div>
        </div>

        <ul className={`nav_links ${menuOpen && !barHidden ? 'open' : ''}`}>
          <NavLink className={`nav_item`} to="/">
            Home
          </NavLink>
          <NavLink className={`nav_item`} to="/articles">
            Articles
          </NavLink>
          <NavLink className={`nav_item`} to="/blog">
            Blog
          </NavLink>
          <NavLink className={`nav_item`} to="/about">
            About
          </NavLink>
        </ul>
        <span className="shopping-cart">
          <img src="shopping-cart.png" alt="" />
          <span>0</span>
        </span>

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
      <div className={`menu_space ${menuOpen ? 'active' : ''}`}></div>
    </>
  );
}
