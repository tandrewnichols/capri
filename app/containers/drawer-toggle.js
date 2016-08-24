import { connect } from 'react-redux'
import Drawer from '../components/drawer'

const mapStateToProps = (state) => {
  return {
    open: state.drawer.open  
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleDrawer: () => {
      dispatch({ type: 'TOGGLE_DRAWER' })
    }
  }
}

const DrawerToggle = connect(mapStateToProps, mapDispatchToProps)(Drawer)

export default DrawerToggle
