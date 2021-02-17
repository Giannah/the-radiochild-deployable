import React, { Component } from "react";
import "./Header.scss";
import Logo from "../../assets/radio.svg";
import { client } from "../../Client";

import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="identity">
          <h1>
            The <img id="logo" src={Logo} alt="app-logo" /> Child
          </h1>
        </div>
        <div className="header-end">
          <div className="end-item">
            {client.isLoggedIn ? (
              <Link className="ui item" to="/logout">
                Logout
              </Link>
            ) : (
              <Link className="ui item" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
