import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setArtRef } from './pages/Shop';

export function Article({ article, isPreview = true, updatesOb }) {
  const [cardLimit, setCardLimit] = useState(5);
  if (isPreview) {
    const [innerWidth, setInnerWidth] = useState(0);
    useEffect(() => {
      const handleResize = () => {
        setInnerWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      setInnerWidth(window.innerWidth);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const limit =
        innerWidth < 1500
          ? innerWidth < 1000
            ? innerWidth < 750
              ? innerWidth < 520
                ? 1
                : 2
              : 3
            : 4
          : 5;

      setCardLimit(limit);
    }, [innerWidth]);
  }

  return (
    <div className={`art ${isPreview ? 'art_prev' : 'art_view'}`}>
      {isPreview && <h2>{article.name}</h2>}
      <div className="articles">
        {article.cards.map((c, i) => {
          if (isPreview && cardLimit < i + 1) return null;
          return <Card card={c} key={c.id} updatesOb={updatesOb} />;
        })}
      </div>
      {isPreview && (
        <Link
          to="/shop"
          className="see_more"
          onClick={(e) => setArtRef(article.name)}
        >
          See more ...
        </Link>
      )}
    </div>
  );
}

export function Card({ card, updatesOb, isOverlay = false }) {
  const [isLiked, setLikes] = useState(card.isLiked);
  const [isAdded, setAdd] = useState(card.isAdded);

  const updateLikes = () => {
    card.isLiked = !isLiked;
    setLikes(!isLiked);
  };

  const updateAddProduct = () => {
    card.isAdded = !isAdded;
    setAdd(!isAdded);
  };

  const showProduct = () => {
    updatesOb ? updatesOb.updateOverlay(card) : null;
  };
  return (
    <div className="card">
      <div className="product">
        <img src={card.img_url}></img>
        {!isOverlay && (
          <div className="overlay" onClick={showProduct}>
            <span>View</span>
          </div>
        )}
      </div>
      <div className="prod_control">
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
            <span>100k</span>
          </span>
        </div>
        <button
          className={`btn_add ${card.isAdded ? 'added' : ''}`}
          onClick={updateAddProduct}
        >
          {`Add${card.isAdded ? 'ed' : ' to Cart'}`}
        </button>
      </div>
    </div>
  );
}
