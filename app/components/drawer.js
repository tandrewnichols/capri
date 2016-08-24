import React from 'react'
import HamburgerButton from './hamburger-button'
import DrawerNav from './drawer-nav'
import DrawerTitle from './drawer-title'

class Drawer extends React.Component {
  render() {
    let styles = {position: 'absolute', top: 10, left: 10}
    return (
      <div className={'bg-gray-darker drawer' + (this.props.open ? ' open' : '')}>
        <DrawerTitle>Capri</DrawerTitle>
        <DrawerNav categories={[ 'Routes', 'Middleware' ]}/>
        <div className="drawer-toggle">
          <HamburgerButton btnType="default" onClick={this.props.onToggleDrawer}></HamburgerButton>
        </div>
      </div>
    )
  }
}

export default Drawer
