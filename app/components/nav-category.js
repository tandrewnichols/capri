import React from 'react'

class NavCategory extends React.Component {
  constructor(props) {
    super(props)
    this.state = { expand: false }
  }

  onExpandCategory() {
    this.setState({ expand: !this.state.expand })
  }

  render() {
    return (
      <div className={'drawer-item' + (this.props.last ? ' last' : '')}>
        <div className="drawer-heading" onClick={() => this.onExpandCategory()}>
          {this.props.children}
          <span className="pull-right badge">4</span>
        </div>
        <div className={'category-details' + (this.state.expand ? ' open' : '')}>
          Foo
        </div>
      </div>
    )
  }
}

export default NavCategory
