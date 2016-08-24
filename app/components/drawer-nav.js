import React from 'react'
import NavCategory from './nav-category'

class DrawerNav extends React.Component {
  render() {
    return (
      <div className="list-group">
        {this.props.categories.map((category) => {
          return <NavCategory key={category}>{category}</NavCategory>
        })}
      </div>
    )
  }
}

export default DrawerNav
