import React, { Component } from "react";
import { Route } from "react-router-dom";
import Album from "../Album/Album";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import { client } from "../../Client";
import PropTypes from "prop-types";

const ALBUM_IDS = [
  "4ebl4DkNgSpTZENGHJiLjr",
  "2VmQGpWKaY67unFwQD7pWq",
  "0WmjbbIMR4E6513iQwSSZ6",
  "7ovdjtmV0Bkm4Xb4pqtrZt",
  "0JiHJJGVSHzQMdTJ2fp9dh",
  "1eFiIv1SqrUJHOFf54U27W",
  "2DfCUL2TD3yIMNUErFErWb",
  "6fsntTpyamqiTKpFUYo99b",
  "4Tzesw6GpwrIDYPLMi6CiE",
  "141dWZuGtAMbX1iFFui7vC",
];
class AlbumsContainer extends Component {
  state = {
    fetched: false,
    albums: [],
  };

  componentDidMount() {
    this.getAlbums();
  }

  getAlbums = () => {
    client.getAlbums(ALBUM_IDS).then((albums) =>
      this.setState({
        fetched: true,
        albums: albums,
      })
    );
  };

  render() {
    console.log(this.state);
    const { fetched, albums } = this.state;
    const matchPath = this.props.match.path;
    if (!fetched) {
      return <div className="ui active centered inline loader" />;
    } else {
      return (
        <div className="ui three column divided grid" style={{ marginLeft: 3 }}>
          <div className="ui eight wide column" style={{ maxWidth: 250 }}>
            <VerticalMenu albums={albums} albumsPathname={matchPath} />
          </div>
          <div className="ui fourteen wide mobile ten wide computer column">
            <Route
              path={`${matchPath}/:albumId`}
              render={({ match }) => {
                const album = albums.find((a) => a.id === match.params.albumId);
                return <Album album={album} albumsPathname={matchPath} />;
              }}
            />
          </div>
        </div>
      );
    }
  }
}

AlbumsContainer.propTypes = {
  match: PropTypes.object,
  path: PropTypes.string,
};

export default AlbumsContainer;
