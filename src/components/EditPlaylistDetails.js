import React from 'react';
import { changePlaylistDetails } from '../helpers/spotifyHelpers';


class EditPlaylistDetails extends React.Component {
  nameRef = React.createRef();

  componentDidMount() {
    this.nameRef.current.focus();
  }

  handleChange = (e) => {
    const targetValue = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    const updates = { [e.target.id]: targetValue };
    this.props.updateDraftPlaylist(updates);
  }

  handleWorse = (e) => {
    if (e.target.type === 'checkbox') {
      const updates = ({ [e.target.id]: e.target.checked });
      this.props.updateDraftPlaylist(updates);
    } else {
      const updates = ({ [e.target.id]: e.target.value });
      this.props.updateDraftPlaylist(e.target.id, e.target.value);
    }
  }


  handleSubmit = async (e) => {
    const {
      draftPlaylist, token, updateUserPlaylists, toggleEditPlaylist,
    } = this.props;
    e.preventDefault();
    try {
      await changePlaylistDetails(token, draftPlaylist);
      updateUserPlaylists(draftPlaylist);
      toggleEditPlaylist();
    } catch (error) {
      this.setError(error);
    }
  }

  handleCancel = (e) => {
    this.props.resetDraftPlaylist();
    this.props.toggleEditPlaylist();
  }

  render() {
    const {
      name, public: isPublic,
    } = this.props.draftPlaylist;
    return (
      <form className="edit-playlist-form" action="submit" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="name">
          <input className="current-playlist-title" id="name" type="text" ref={this.nameRef} onFocus={e => e.target.select()} value={name} onChange={e => this.handleChange(e)} />
        </label>
        <div className="options">
          <label htmlFor="public">
            <input id="public" type="checkbox" checked={isPublic} onChange={e => this.handleChange(e)} />
              Public
          </label>

          <button className="action" type="submit">Save</button>
          <button className="cancel" type="button" onClick={e => this.handleCancel(e)}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default EditPlaylistDetails;
