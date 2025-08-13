import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Insurance, made simple.</h1>
      <p>
        Upload a car photo. We’ll identify the vehicle type and guide coverage.
      </p>
      <Link className="btn" to="/insurance">
        Get a quote
      </Link>
    </section>
  );
}
