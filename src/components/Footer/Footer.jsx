import { Link } from 'react-router-dom';

export const Footer = ({ copyrightText, socialLinks }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>{copyrightText}</p>
        <div className="footer-navigation">
          <Link to="/catalog">Fleet catalog</Link>
          <Link to="/about">About DriveSelect</Link>
        </div>
        <div className="social-links">
          {socialLinks.map((item) => (
            <a key={item.platform} href={item.url} target="_blank" rel="noreferrer">
              {item.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};