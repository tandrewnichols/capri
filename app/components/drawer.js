import React from 'react'
import HamburgerButton from './hamburger-button'
import DrawerNav from './drawer-nav'

class Drawer extends React.Component {
  render() {
    let styles = {position: 'absolute', top: 10, left: 10}
    return (
      <div className={'drawer' + (this.props.open ? ' open' : '')}>
        <DrawerNav/>
        <div className="drawer-toggle">
          <HamburgerButton btnType="default" onClick={this.props.onToggleDrawer}></HamburgerButton>
        </div>
      </div>
    )
  }
}

export default Drawer
