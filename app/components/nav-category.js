import React from 'react'

class NavCategory extends React.Component {
  render() {
    return (
      <div>
        <div className={'drawer-item' + (this.props.last ? ' last' : '')} onClick={() => this.props.onExpandCategory(this.props.children)}>
          {this.props.children}
          <span className="pull-right badge">4</span>
          <div className={'category-details' + (this.props.expand === this.props.children ? ' open' : '')}>
            Foo
          </div>
        </div>
      </div>
    )
  }
}

export default NavCategory
