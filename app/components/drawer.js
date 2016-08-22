import React from 'react'
import HamburgerButton from './hamburger-button'

class Drawer extends React.Component {
  render() {
    return (
      <div>
        <nav className="bg-gray-darker">

        </nav>
        <HamburgerButton btnType="default" onClick={this.props.onDrawerToggle}></HamburgerButton>
      </div>
    )
  }
}

export default Drawer
