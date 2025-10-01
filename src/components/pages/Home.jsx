import { Link } from 'react-router-dom';
import { advantagesInfos, articlesData } from '../../data';
import { Article } from '../Dynamic';
import { useRef } from 'react';

export const sectionRef = {
  section1: null,
  section2: null,
};

export default function Home({ updatesOb }) {
  sectionRef.section1 = useRef(null);
  sectionRef.section2 = useRef(null);

  return (
    <section className="home_page">
      <header>
        <img src="woman-avatar.png" alt="Avatar woman" />
        <div className="head_side">
          <div>
            <h1>Your online shop</h1>
            <p>Our priority is customer satisfaction</p>
          </div>
          <Link to="/shop" className="btn_order">
            Order
          </Link>
        </div>
      </header>

      <section ref={sectionRef.section1} id="section--1">
        <h1>Our articles</h1>
        <div className="articles_preview">
          {articlesData.map((a) => (
            <Article article={a} updatesOb={updatesOb} />
          ))}
          <Link to="/shop" className="show_all">
            Show all articles
          </Link>
        </div>
      </section>

      <section ref={sectionRef.section2} id="section--2">
        <h1>Wy buy from us ?</h1>
        <div className="advantages">
          {advantagesInfos.map((ad) => (
            <Advantage infos={ad} />
          ))}
        </div>
      </section>
    </section>
  );
}

function Advantage({ infos }) {
  return (
    <div className="advantage_desc">
      <h2>{infos.title}</h2>
      <img src={infos.imgUrl} alt="Illustrative icon" />
      <p>{infos.text}</p>
    </div>
  );
}
