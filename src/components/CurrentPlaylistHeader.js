import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';

class CurrentPlaylistHeader extends React.Component {
  nameRef = React.createRef();

  componentDidMount() {
    this.nameRef.current.focus();
  }


  handleChange = (e) => {
    this.props.updateCurrentPlaylist(e.target.id, e.target.value);
  }

  render() {
    const {
      duplicateCurrentPlaylist,
      playlist: {
        name, images, owner: { display_name: ownerName }, tracks: { total },
      },
    } = this.props;
    const imageSrc = images.length ? images[0].url : macaroon;
    return (
      <section className="current-playlist-header">
        <div className="playlist-header">
          <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
          <div className="current-playlist-details">
            <div className="current-playlist-buttons">
              <button type="button" className="action" onClick={duplicateCurrentPlaylist}>
                Clone Playlist
              </button>
              <button type="button" className="action">
                Edit Playlist
              </button>
            </div>
            <h3 className="current-playlist-title"> {name} </h3>
            <h4>By {ownerName}</h4>
            <span>{total} tracks</span>
          </div>
        </div>
        <div className="playlist-header">
          <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
          <div className="current-playlist-details">
            <div className="current-playlist-buttons">
              <button type="button" className="action" disabled onClick={duplicateCurrentPlaylist}>
                Clone Playlist
              </button>
              <button type="button" disabled className="action">
                Edit Playlist
              </button>
            </div>

            <form className="edit-playlist-form" action="submit">
              <label htmlFor="name">
                <input className="current-playlist-title" id="name" type="text" ref={this.nameRef} onFocus={e => e.target.select()} value={name} onChange={e => this.handleChange(e)} />
              </label>
              <div className="options">
                <label htmlFor="collaborative">
                  <input id="collaborative" type="checkbox" onChange={e => this.handleChange(e)} />
              Collaborative
                </label>
                <label htmlFor="public">
                  <input id="public" type="checkbox" onChange={e => this.handleChange(e)} />
              Public
                </label>

                <button className="action" type="button">Save</button>
                <button className="cancel" type="button">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </section>

    );
  }
}

export default CurrentPlaylistHeader;
