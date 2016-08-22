import React from 'react'

class HamburgerButton extends React.Component {
  render() {
    return (
      <button type="button" className={"btn btn-sm btn-" + this.props.btnType} onClick={this.props.onClick}>
        <span className="glyphicon glyphicon-menu-hamburger"></span>
      </button>
    )
  }
}

HamburgerButton.defaultProps = { btnType: 'primary' }

export default HamburgerButton
