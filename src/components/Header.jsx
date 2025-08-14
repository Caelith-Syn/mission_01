import { Link, NavLink } from "react-router-dom";
import logo from "../assets/shield_auto_group_logo.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="container row">
        <Link to="/" className="brand-wrap" aria-label="Shield Auto Group Home">
          <img src={logo} alt="" className="brand-logo" />
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <button className="nav-btn">Inventory</button>
          <button className="nav-btn">Sell Your Car</button>
          <button className="nav-btn">Financing</button>
          <NavLink to="/insurance">Insurance</NavLink>

          <button className="nav-btn">Contact Us</button>
        </nav>
      </div>
    </header>
  );
}
