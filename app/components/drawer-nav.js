import React from 'react'
import NavCategoryToggle from '../containers/nav-category-toggle'

class DrawerNav extends React.Component {
  render() {
    return (
      <div>
        {this.props.categories.map((category, index, arr) => {
          return <NavCategoryToggle name={category} fullKey={category} key={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</NavCategoryToggle>
        })}
      </div>
    )
  }
}

export default DrawerNav
