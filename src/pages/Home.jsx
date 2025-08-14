import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-inner container">
        <div className="hero-media">
          <img
            className="hero-img"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
            alt="Sleek car under moody lighting"
          />
        </div>{" "}
        <div className="hero-copy">
          <h1>Insurance, made simple.</h1>
          <p>
            Upload a car photo. We’ll identify the vehicle type and guide
            coverage.
          </p>
          <Link className="btn hero-cta" to="/insurance">
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
