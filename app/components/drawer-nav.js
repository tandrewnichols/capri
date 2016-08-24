import React from 'react'

class DrawerNav extends React.Component {
  render() {
    return (
      <nav>
        <ul className="nav nav-pills nav-stacked">
          <li className="active">
            <a data-toggle="collapse" href="#routes">Routes</a>
          </li>
          <li>
            <a href="#">Bar</a>
          </li>
        </ul>
        <div id="routes" className="collapse">
          Foo
        </div>
      </nav>
    )
  }
}

export default DrawerNav
