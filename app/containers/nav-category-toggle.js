import { connect } from 'react-redux'
import NavCategory from '../components/nav-category'

const mapStateToProps = (state, ownProps) => {
  let manifest = ownProps.manifest || state.navCategory.manifest
  return {
    manifest: manifest[ ownProps.name ]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const NavCategoryToggle = connect(mapStateToProps, mapDispatchToProps)(NavCategory)

export default NavCategoryToggle
