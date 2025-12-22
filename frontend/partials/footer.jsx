import React, { useState } from "react";
import "../src/styles/footer.css";

function Footer() {
  return (
    <footer>
    <div className="cfooter">
      <img className="logo" src="/logo.png" alt="logo" />
      <div className="fcentrenav">
        <p>Copyright PktStore {new Date().getFullYear()}</p>
      </div>
      <div className="frightnav">
        <h4>contact</h4>
        <h6>tel:+124 567 890</h6>
        <h6>email: pktstorehelp@gmail.com</h6>
      </div>
      </div>
      </footer>
  );
}

export default Footer;
