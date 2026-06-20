import { Leaf, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon-wrapper">
                <Leaf size={20} />
              </div>
              <span className="logo-text">EcoTrack</span>
            </Link>
            <p className="footer-desc">
              Track, reduce, and offset your carbon footprint. Join the movement
              towards a sustainable future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-link-list">
              <li><Link to="/calculator" className="footer-link">Calculator</Link></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              <li><Link to="/actions" className="footer-link">Actions</Link></li>
              <li><Link to="/insights" className="footer-link">AI Insights</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-link-list">
              <li><Link to="/learn" className="footer-link">Learn</Link></li>
              <li>
                <a href="https://www.un.org/climatechange" target="_blank" rel="noopener noreferrer" className="footer-link">
                  UN Climate
                </a>
              </li>
              <li>
                <a href="https://climate.nasa.gov" target="_blank" rel="noopener noreferrer" className="footer-link">
                  NASA Climate
                </a>
              </li>
              <li>
                <a href="https://www.ipcc.ch" target="_blank" rel="noopener noreferrer" className="footer-link">
                  IPCC Reports
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} EcoTrack. Built with{' '}
            <Heart size={14} className="inline-icon heart-icon" aria-hidden="true" /> for the planet.
          </p>
          
          <div className="flex items-center gap-1.5 justify-center py-1.5 px-3 bg-zinc-900/60 rounded-full border border-zinc-800 text-[11px] text-zinc-400 font-semibold shadow-sm select-none">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Guest Mode — Your data stays on this device</span>
          </div>

          <div className="footer-social">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <Globe size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
