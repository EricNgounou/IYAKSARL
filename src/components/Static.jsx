import React from "react";
import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <div className="bar">
      <div className="shop_label">
        <img src="var-img.jpg" alt="Bag-img" />
        <div>
          <span className="shop_name">IYAKSARL</span>
          <span className="sub_label"> Online shopping</span>
        </div>
      </div>
      <ul className="nav_links">
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
    </div>
  );
}
