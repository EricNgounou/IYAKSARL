// import { Route, Routes } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Article } from '../Dynamic';
import { articlesData } from '../../data';

let artRef = null;

let barInfo = {
  isBarHidden: false,
  isMenuOpened: false,
  size: 0,
};

export const setBarInfo = (infos) => {
  barInfo = infos;
};

export const setArtRef = (string) => {
  artRef = string.trim().toLowerCase();
};

let fullDisplay = true;
export const setFullDisplay = (val) => {
  fullDisplay = val;
};

export default function Shop({ updatesOb }) {
  const [active, setActive] = useState(artRef ? artRef : 'clothes');
  const [openSideBar, setOpenSideBar] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [headSticky, setHeadSticky] = useState(false);

  const hStickyStyle = {
    transform: `translateY(${barInfo.size}px)`,
    transition: `transform 0.5s`,
  };
  const sideBarStylizer = {
    transform: `translateY(${headSticky && fullDisplay ? barInfo.size : 0}px)`,
    position: `${headSticky ? 'sticky' : ''}`,
    top: `${headSticky ? '110px' : ''}`,
  };

  artRef = null;
  const updateNavBar = (event) => {
    setActive(event.target.innerText.toLowerCase());
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const updadeSideBar = () => {
    setOpenSideBar(!openSideBar);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setHeadSticky(scrollY > 95 ? true : false);
  }, [scrollY]);

  return (
    <section className="articles_page">
      <div
        className={`art_head ${headSticky && fullDisplay ? 'sticky' : ''}`}
        style={headSticky && fullDisplay ? hStickyStyle : {}}
      >
        <span className="sb_btn" onClick={updadeSideBar}>
          <img src="shopping-bag.png" alt="shopping-bag icon" />
          <span className={openSideBar ? 'close' : ''}>&#8250;</span>
        </span>
        <h2 className="art_index">{active}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e);
          }}
          className="search_field"
          action=""
        >
          <input
            className="search_box
        "
            type="text"
            placeholder="Search Articles ..."
          />
          <button className="btn_search" type="submit">
            <img src="loupe.png" alt="Search icon" />
          </button>
        </form>
        <button className="btn_upload">
          <img src="upload.png" alt="Upload icon" />
          <span>upload</span>
        </button>
      </div>

      <div className="container">
        <ul
          className={`side_bar ${openSideBar ? 'opened' : 'closed'}`}
          style={openSideBar ? sideBarStylizer : {}}
        >
          <p className="sb_head">All articles</p>
          {articlesData.map((a, i) => (
            <li
              className={`nav_bar--link ${
                a.name.toLowerCase() === active ? 'active' : ''
              }`}
              onClick={updateNavBar}
            >
              <a>{a.name}</a>
              <span></span>
            </li>
          ))}
        </ul>

        <div className={`art_display ${openSideBar ? '' : 'extend'}`}>
          <Article
            article={articlesData.find((a) => a.name.toLowerCase() === active)}
            isPreview={false}
            updatesOb={updatesOb}
          />
        </div>
      </div>
    </section>
  );
}
