import React from 'react';


class EditPlaylistDetails extends React.Component {
  nameRef = React.createRef();

  componentDidMount() {
    this.nameRef.current.focus();
  }


  handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      this.props.updateDraftPlaylist(e.target.id, e.target.checked);
    } else {
      this.props.updateDraftPlaylist(e.target.id, e.target.value);
    }
  }


  handleSubmit = (e) => {
    const { draftPlaylist, updateCurrentPlaylist, toggleEditPlaylist } = this.props;
    e.preventDefault();
    updateCurrentPlaylist(draftPlaylist);
    toggleEditPlaylist();
  }

  handleCancel = (e) => {
    this.props.resetDraftPlaylist();
    this.props.toggleEditPlaylist();
  }

  render() {
    const {
      name, collaborative, public: isPublic,
    } = this.props.draftPlaylist;
    return (
      <form className="edit-playlist-form" action="submit" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="name">
          <input className="current-playlist-title" id="name" type="text" ref={this.nameRef} onFocus={e => e.target.select()} value={name} onChange={e => this.handleChange(e)} />
        </label>
        <div className="options">
          <label htmlFor="collaborative">
            <input id="collaborative" type="checkbox" checked={collaborative} onChange={e => this.handleChange(e)} />
              Collaborative
          </label>
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
