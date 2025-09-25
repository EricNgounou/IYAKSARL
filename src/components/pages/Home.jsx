import { Link } from 'react-router-dom';
import articlesData from '../../data';
import { Article } from '../Dynamic';

export default function Home() {
  return (
    <section className="home_page">
      <header>
        <img src="woman-avatar.png" alt="Avatar woman" />
        <div className="head_side">
          <div>
            <h1>Your online shop</h1>
            <p>Our priority is customer satisfaction</p>
          </div>
          <Link to="/articles" className="btn_order">
            Order
          </Link>
        </div>
      </header>

      <section className="services">
        <h1>Our articles</h1>
        <div className="articles_preview">
          {articlesData.map((a) => (
            <Article article={a} />
          ))}
          <Link to="/articles" className="show_all">
            Show all articles
          </Link>
        </div>
      </section>

      <section className="advantages">
        <h1>Wy buy from us ?</h1>
        <div>
          <h2>Free Delevery</h2>
        </div>
        <div>
          <h2>Welcome discount</h2>
        </div>
        <div>
          <h2>Loyalty program</h2>
        </div>
        <div>
          <h2>Flash sale</h2>
        </div>
        <div>
          <h2>Discount sponsorship</h2>
        </div>
      </section>
    </section>
  );
}
