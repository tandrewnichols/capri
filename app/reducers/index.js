import { combineReducers } from 'redux'
import drawer from './drawer'
import navCategory from './nav-category'

const reducer = combineReducers({
  drawer,
  navCategory
});

export default reducer;
