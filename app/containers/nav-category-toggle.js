import { connect } from 'react-redux'
import NavCategory from '../components/nav-category'

const mapStateToProps = (state) => {
  state.navCategory = state.navCategory || {}
  return {
    expand: state.navCategory.expand
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onExpandCategory: (category) => {
      dispatch({ type: 'EXPAND_CATEGORY', expand: category })
    }
  }
}

const NavCategoryToggle = connect(mapStateToProps, mapDispatchToProps)(NavCategory)

export default NavCategoryToggle
