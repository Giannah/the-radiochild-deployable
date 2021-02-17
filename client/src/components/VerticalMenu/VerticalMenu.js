import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const VerticalMenu = ({ albums, albumsPathname }) => (
  <div className="ui secondary vertical pointing menu">
    <div className="header item">Albums</div>
    {albums &&
      albums.map((album) => (
        <NavLink
          to={`${albumsPathname}/${album.id}`}
          activeClassName="active"
          className="item"
          key={album.id}
        >
          {album.name}
        </NavLink>
      ))}
  </div>
);

VerticalMenu.propTypes = {
  albums: PropTypes.array,
  albumsPathname: PropTypes.string,
  map: PropTypes.func,
};

export default VerticalMenu;
