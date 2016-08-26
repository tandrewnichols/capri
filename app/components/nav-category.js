import React from 'react'
import NavCategoryToggle from '../containers/nav-category-toggle'

class NavCategory extends React.Component {
  constructor(props) {
    super(props)
    this.state = { expand: false }
  }

  onExpandCategory() {
    this.setState({ expand: !this.state.expand })
  }

  render() {
    let keys = typeof this.props.manifest === 'object' ? Object.keys(this.props.manifest) : null
    let detailsClass = !keys ? 'hide' : 'category-details' + (this.state.expand ? ' open' : '')
    return (
      <div className="drawer-item">
        <div className="drawer-heading" onClick={() => this.onExpandCategory()}>
          {this.props.children}
          <span className="pull-right badge">{this.props.manifest.__count}</span>
        </div>
        <div className={detailsClass}>
          {keys && keys.map((key) => {
            return key !== '__count' && <NavCategoryToggle manifest={this.props.manifest} name={key} key={this.props.fullKey + '.' + key} fullKey={this.props.fullKey + '.' + key}>{key}</NavCategoryToggle>
          })}
        </div>
      </div>
    )
  }
}

export default NavCategory
