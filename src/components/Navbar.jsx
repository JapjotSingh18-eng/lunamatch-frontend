import { Sparkles } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">
        <div className="logo-icon">
          <Sparkles size={20} />
        </div>

        <span>
          Image<span>Match AI</span>
        </span>
      </a>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#upload">Analyze</a>
        <a href="#results">Results</a>
      </div>

      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="github-button"
      >
        <span style={{ fontSize: "18px" }}>⌘</span>
        <span>GitHub</span>
      </a>
    </nav>
  );
}

export default Navbar;