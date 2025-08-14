export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <div className="footer-links">
          <button className="footer-btn">Special Offers</button>
          <button className="footer-btn">Book a Test Drive</button>
          <button className="footer-btn">Service & Repairs</button>
          <button className="footer-btn">About Us</button>
          <button className="footer-btn">Careers</button>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} Shield Auto Group
        </div>
      </div>
    </footer>
  );
}
