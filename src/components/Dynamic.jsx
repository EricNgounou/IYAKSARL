import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setArtRef } from './pages/Articles';

export function Article({ article, isPreview = true }) {
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
          {`Add${card.isAdded ? 'ed' : ' to Cart'}`}
        </button>
      </div>
    </div>
  );
}
