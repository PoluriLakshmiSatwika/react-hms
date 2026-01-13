import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mini-footer">

      <p>© {year} HMS Hospital — All Rights Reserved.</p>

      <p>📞 +1 (555) 123-4567 | 📧 info@hms.com</p>

      <div className="mini-social">
        <FaFacebookF />
        <FaInstagram />
        <FaLinkedinIn />
      </div>

    </footer>
  );
};

export default Footer;
