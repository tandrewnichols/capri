import React from 'react'
import DrawerToggle from '../containers/drawer-toggle'

class App extends React.Component {
  render() {
    return (
      <div className="height100">
        <DrawerToggle/>
        <div className="height100 bg-gray-lighter page-content">
          <h2 className="text-center">Capri</h2>
        </div>
      </div>
    )
  }
}

export default App
