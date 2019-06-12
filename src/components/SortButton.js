import React from 'react';

class SortButton extends React.Component {
  state = {
    sortDescending: false,
  }

  toggleSort = () => {
    const { sortDescending } = this.state;
    const { sortBy, sortFunction } = this.props;
    sortFunction(sortBy, sortDescending);
    this.setState({
      sortDescending: !sortDescending,
    });
  }

  render() {
    return (<button type="button" onClick={this.toggleSort}>{this.props.children}</button>);
  }
}

export default SortButton;
