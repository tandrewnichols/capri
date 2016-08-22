import React from 'react'

class HamburgerButton extends React.Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick}>
        <span className="glyphicon glyphicon-menu-hamburger"></span>
      </button>
    )
  }
}

export default HamburgerButton
