import { Link } from "react-router-dom";
import articlesData from "../../data";
import { Article } from "../Dynamic";

export default function Home() {
  return (
    <section className="home_page">
      <header>
        <div className="darker">
          <div className="shop_label">
            <img src="var-img.jpg" alt="Bag-img" />
            <div>
              <span className="shop_name">IYAKSARL</span>
              <span className="sub_label"> Online shopping</span>
            </div>
          </div>

          <h1>Your online shop</h1>
          <p>Our priority is customer satisfaction</p>
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
      </section>
    </section>
  );
}
