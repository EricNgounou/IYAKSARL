import { useState } from 'react';
import { Link } from 'react-router-dom';
import { setArtRef } from './pages/Articles';

export function Article({ article, isPreview = true }) {
  return (
    <div className={`art ${isPreview ? 'art_prev' : 'art_view'}`}>
      <h2>{article.name}</h2>
      {!isPreview && (
        <p className="pag_label">
          <span>1</span> / <span>5</span>
        </p>
      )}
      <div className="articles">
        {article.cards.map((c, i) => {
          return <Card card={c} key={c.id} />;
        })}
      </div>
      {isPreview && (
        <Link
          to="/articles"
          className="see_more"
          onClick={(e) => setArtRef(article.name)}
        >
          See more ...
        </Link>
      )}
    </div>
  );
}

export function Card({ card }) {
  const [isLiked, setLikes] = useState(false);
  const [isAdded, setAdd] = useState(false);

  const updateLikes = () => {
    card.isLiked = !isLiked;
    setLikes(!isLiked);
  };

  const updateAddProduct = () => {
    card.isAdded = !isAdded;
    setAdd(!isAdded);
  };

  return (
    <div className="card">
      <img className="product_img" src={card.img_url}></img>
      <div>
        <div className="product_infos">
          <div>
            <p className="product_name">Name</p>
            <p className="product_price">$10.99</p>
          </div>
          <span className="btn_like">
            <img
              src={`heart_${!card.isLiked ? 'un' : ''}liked.png`}
              onClick={updateLikes}
            ></img>
          </span>
        </div>
        <button
          className={`btn_add ${card.isAdded ? 'added' : ''}`}
          onClick={updateAddProduct}
        >
          {`ADD${card.isAdded ? 'ED' : ''}`}
        </button>
      </div>
    </div>
  );
}
