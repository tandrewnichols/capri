import React from 'react'

class NavCategory extends React.Component {
  render() {
    return (
      <button type="button" className="list-group-item">{this.props.children}</button>
    )
  }
}

export default NavCategory
