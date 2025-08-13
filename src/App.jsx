import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Insurance from "./pages/Insurance";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insurance" element={<Insurance />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
