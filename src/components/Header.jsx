import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="container row">
        <Link to="/" className="brand">
          Shield Auto Group
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/insurance">Insurance</NavLink>
        </nav>
      </div>
    </header>
  );
}
