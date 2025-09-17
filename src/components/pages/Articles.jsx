import { Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Article } from "../Dynamic";
import articlesData from "../../data";

let artRef = null;

export const setArtRef = (string) => {
  artRef = string.trim().toLowerCase();
};

export default function Articles() {
  const [active, setActive] = useState(artRef ? artRef : "clothes");
  artRef = null;
  const updateNavBar = (e) => {
    setActive(e.target.innerText.toLowerCase());
  };

  return (
    <section className="articles_page">
      <div className="art_head">
        <h2>Categories</h2>
        <form className="search_field" action="">
          <input
            className="search_box
        "
            type="text"
            placeholder="Search Articles ..."
          />
        </form>
        <button className="btn_upload">
          <img src="upload.png" alt="" />
          <span>upload</span>
        </button>

        <ul className="nav_bar">
          {articlesData.map((a) => (
            <li
              className={`nar_bar--link ${
                a.name.toLowerCase() === active ? "active" : ""
              }`}
              onClick={updateNavBar}
            >
              <a>{a.name}</a>
              <span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="art_display">
        <Article
          article={articlesData.find((a) => a.name.toLowerCase() === active)}
          isPreview={false}
        />

        <div className="pagination">
          <button className="pag">Previous</button>
          <div className="pag">
            <span>
              <a>1</a>
            </span>
            <span>
              <a>2</a>
            </span>
            <span>
              <a>3</a>
            </span>
            <span>
              <a>4</a>
            </span>
            <span>
              <a>5</a>
            </span>
          </div>
          <button className="pag">Next</button>
        </div>
      </div>
    </section>
  );
}
