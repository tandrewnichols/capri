import React from 'react'
import HamburgerButton from './hamburger-button'

class Drawer extends React.Component {
  render() {
    return <HamburgerButton onClick={() => this.props.onDrawerToggle()}></HamburgerButton>
  }
}

export default Drawer
