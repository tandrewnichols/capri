import React from 'react'
import NavCategoryToggle from '../containers/nav-category-toggle'

class DrawerNav extends React.Component {
  render() {
    return (
      <div>
        {this.props.categories.map((category, index, arr) => {
          return <NavCategoryToggle key={category} last={index === arr.length - 1}>{category}</NavCategoryToggle>
        })}
      </div>
    )
  }
}

export default DrawerNav
