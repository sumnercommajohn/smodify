import React from 'react';


class EditCurrentPlaylistDetails extends React.Component {
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

  handleFocus = (e) => {
    console.log(e);
    console.log('selecting:');
    console.log(e.target);
    e.target.select();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.updateCurrentPlaylist(this.props.draftPlaylist);
    this.props.toggleEdit();
  }

  handleCancel = (e) => {
    this.props.resetDraftDetails();
    this.props.toggleEdit();
  }

  render() {
    const {
      name, collaborative, public: isPublic,
    } = this.props.draftPlaylist;
    const {
      toggleEdit,
    } = this.props;
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
          <button className="cancel" type="button" onClick={e => toggleEdit(e)}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default EditCurrentPlaylistDetails;
