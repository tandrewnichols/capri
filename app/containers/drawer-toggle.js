import { connect } from 'react-redux'
import Drawer from '../components/drawer'

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleDrawer: () => {
      dispatch()
    }
  }
}

const DrawerToggle = connect(mapStateToProps, mapDispatchToProps)(Drawer)

export default DrawerToggle
