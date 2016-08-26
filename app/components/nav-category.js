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
    let keys = Object.keys(this.props.manifest)
    return (
      <div className="drawer-item">
        <div className="drawer-heading" onClick={() => this.onExpandCategory()}>
          {this.props.children}
          <span className="pull-right badge">{this.props.manifest.__count}</span>
        </div>
        <div className={'category-details' + (this.state.expand ? ' open' : '')}>
          Foo
        </div>
      </div>
    )
  }
}

export default NavCategory
