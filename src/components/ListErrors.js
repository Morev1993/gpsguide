import React from 'react';

class ListErrors extends React.Component {
  render() {
    const errors = this.props.errors;
    if (errors) {
      return (
        <p className='danger'>{errors}</p>
      );
    } else {
      return null;
    }
  }
}

export default ListErrors;
